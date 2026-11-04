<#
.SYNOPSIS
    ACLC LabPulse - Automated Workstation Hardware Discovery & Audit Agent
    Target Institution: ACLC College of Manila - College of Computer Studies / IT Department

.DESCRIPTION
    Queries local WMI/CIM subsystems to capture hardware inventory telemetry:
    - CPU specifications, physical cores, logical threads
    - Memory capacity, bank module layout, clock speed, part numbers (detects RAM theft/swap)
    - Physical storage devices (NVMe SSD, SATA SSD, HDD, serial numbers)
    - Active network adapter MAC address and IPv4 configuration
    - GPU dedicated graphics adapter
    - Motherboard model, serial, and BIOS release version
    
    Serializes payload into ACLC LabPulse Discovery Schema format and posts
    via HTTPS to the central LabPulse endpoint with Bearer Secret authentication.

.NOTES
    File Name  : audit-agent.ps1
    Version    : 1.0.0
    Author     : ACLC College of Manila MIS & IT Support Division
    Requires   : PowerShell 5.1+ or PowerShell 7+ (Runs with standard Administrator privileges)
    Deployment : Deploy via Active Directory GPO Startup Script or Windows Task Scheduler

.EXAMPLE
    .\audit-agent.ps1 -ApiEndpoint "https://aclc-manila.edu.ph" -SecretToken "aclc-sec-audit-token-9b37a1e0c4"
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [string]$ApiEndpoint = $env:LABPULSE_ENDPOINT,

    [Parameter(Mandatory = $false)]
    [string]$SecretToken = $env:LABPULSE_SECRET
)

# Fallback default configuration if parameters not passed
if ([string]::IsNullOrWhiteSpace($ApiEndpoint)) {
    $ApiEndpoint = "https://aclc-manila.edu.ph"
}
if ([string]::IsNullOrWhiteSpace($SecretToken)) {
    $SecretToken = "aclc-sec-audit-token-9b37a1e0c4"
}

$ErrorActionPreference = "Stop"
$VerbosePreference = "Continue"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " ACLC LabPulse - Workstation Hardware Discovery Agent v1.0 " -ForegroundColor White
Write-Host " ACLC College of Manila • College of Computer Studies / IT   " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

try {
    Write-Host "[1/6] Querying Processor (CPU) subsystem..." -ForegroundColor Yellow
    $cpuObj = Get-CimInstance -ClassName Win32_Processor | Select-Object -First 1
    $cpuTelemetry = @{
        name               = ($cpuObj.Name -replace '\s+', ' ').Trim()
        cores              = [int]$cpuObj.NumberOfCores
        logicalProcessors  = [int]$cpuObj.NumberOfLogicalProcessors
        maxClockSpeedMhz   = [int]$cpuObj.MaxClockSpeed
    }

    Write-Host "[2/6] Auditing Physical RAM Modules (Tamper Baseline)..." -ForegroundColor Yellow
    $memModules = Get-CimInstance -ClassName Win32_PhysicalMemory
    $totalMemoryBytes = 0
    $moduleList = @()

    foreach ($mod in $memModules) {
        $totalMemoryBytes += [int64]$mod.Capacity
        $moduleList += @{
            bankLabel     = $mod.BankLabel
            capacityBytes = [int64]$mod.Capacity
            speedMhz      = [int]$mod.Speed
            manufacturer  = $mod.Manufacturer.Trim()
            partNumber    = $mod.PartNumber.Trim()
        }
    }
    $totalMemoryGb = [math]::Round($totalMemoryBytes / 1GB, 2)
    $memoryTelemetry = @{
        totalPhysicalBytes = $totalMemoryBytes
        totalPhysicalGb    = $totalMemoryGb
        modules            = $moduleList
    }

    Write-Host "[3/6] Inspecting Storage Disks & NVMe Controllers..." -ForegroundColor Yellow
    $diskDrives = Get-CimInstance -ClassName Win32_DiskDrive
    $storageList = @()
    foreach ($d in $diskDrives) {
        $storageList += @{
            model         = $d.Model.Trim()
            interfaceType = $d.InterfaceType
            sizeBytes     = [int64]$d.Size
            serialNumber  = if ($d.SerialNumber) { $d.SerialNumber.Trim() } else { "UNKNOWN" }
        }
    }

    Write-Host "[4/6] Querying Motherboard, BIOS & Dedicated GPU..." -ForegroundColor Yellow
    $mobo = Get-CimInstance -ClassName Win32_BaseBoard | Select-Object -First 1
    $bios = Get-CimInstance -ClassName Win32_BIOS | Select-Object -First 1
    $gpu  = Get-CimInstance -ClassName Win32_VideoController | Select-Object -First 1

    $motherboardTelemetry = @{
        manufacturer = $mobo.Manufacturer.Trim()
        product      = $mobo.Product.Trim()
        serialNumber = $mobo.SerialNumber.Trim()
    }

    $biosTelemetry = @{
        version     = $bios.SMBIOSBIOSVersion
        releaseDate = if ($bios.ReleaseDate) { $bios.ReleaseDate.ToString("yyyy-MM-dd") } else { "N/A" }
    }

    $gpuTelemetry = @{
        name            = if ($gpu) { $gpu.Name } else { "Integrated Display" }
        driverVersion   = if ($gpu) { $gpu.DriverVersion } else { "N/A" }
        adapterRamBytes = if ($gpu) { [int64]$gpu.AdapterRAM } else { 0 }
    }

    Write-Host "[5/6] Resolving Active Network Adapter & Primary MAC..." -ForegroundColor Yellow
    $netAdapters = Get-CimInstance -ClassName Win32_NetworkAdapterConfiguration -Filter "IPEnabled = TRUE"
    $primaryAdapter = $netAdapters | Select-Object -First 1

    if (-not $primaryAdapter) {
        throw "No active network interface with IPv4 detected on this workstation."
    }

    $primaryIp = ($primaryAdapter.IPAddress | Where-Object { $_ -match '^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$' } | Select-Object -First 1)
    $primaryMac = $primaryAdapter.MACAddress

    $networkTelemetry = @{
        primaryMac = $primaryMac
        primaryIp  = $primaryIp
    }

    $osObj = Get-CimInstance -ClassName Win32_OperatingSystem | Select-Object -First 1

    # Assemble complete schema payload
    $payload = @{
        agentVersion   = "1.0.0"
        scanTimestamp  = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
        hostname       = $env:COMPUTERNAME
        osName         = $osObj.Caption.Trim()
        osVersion      = $osObj.Version
        osBuild        = $osObj.BuildNumber
        cpu            = $cpuTelemetry
        memory         = $memoryTelemetry
        storageDrives  = $storageList
        gpu            = $gpuTelemetry
        motherboard    = $motherboardTelemetry
        bios           = $biosTelemetry
        network        = $networkTelemetry
    }

    $jsonBody = $payload | ConvertTo-Json -Depth 6 -Compress

    Write-Host "[6/6] Transmitting Telemetry to LabPulse API: $ApiEndpoint..." -ForegroundColor Cyan
    $headers = @{
        "Authorization" = "Bearer $SecretToken"
        "Content-Type"  = "application/json"
        "User-Agent"    = "ACLC-LabPulse-Agent/1.0 ($($env:COMPUTERNAME))"
    }

    $targetUrl = "$ApiEndpoint/api/discovery/heartbeat"
    
    # Send HTTP Request
    $response = Invoke-RestMethod -Uri $targetUrl -Method Post -Headers $headers -Body $jsonBody -TimeoutSec 15

    Write-Host "`n>>> AUDIT SCAN SUCCESSFUL <<<" -ForegroundColor Green
    Write-Host "Status      : $($response.data.status)" -ForegroundColor White
    Write-Host "Asset Tag   : $($response.data.assetTag)" -ForegroundColor White
    Write-Host "Message     : $($response.data.message)" -ForegroundColor Gray

    if ($response.data.detectedDiscrepancies.Count -gt 0) {
        Write-Host "`n[SECURITY WARNING] Discrepancies Flagged by Central Sentinel:" -ForegroundColor Red
        foreach ($d in $response.data.detectedDiscrepancies) {
            Write-Host " - $d" -ForegroundColor Red
        }
    }

    exit 0

} catch {
    Write-Error "`n[ERROR] Audit agent failed to complete scan: $($_.Exception.Message)"
    exit 1
}
