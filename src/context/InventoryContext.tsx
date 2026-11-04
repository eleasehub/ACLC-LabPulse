import React, { createContext, useContext, useState, useEffect } from 'react';
import { TableAssetItem, INSTITUTIONAL_CATEGORIES } from '../components/datatables/AssetDataTable';
import { WorkstationData } from '../components/floor-plan/WorkstationNode';

export interface InventoryContextType {
  assets: TableAssetItem[];
  labWorkstationsMap: Record<string, WorkstationData[]>;
  rackEquipmentMap: Record<string, WorkstationData[]>;
  updateAsset: (updated: TableAssetItem) => void;
  addAsset: (newItem: TableAssetItem) => void;
  deleteAsset: (id: string) => void;
  updateWorkstation: (labCode: string, updatedWs: WorkstationData) => void;
  updateRackEquipment: (labCode: string, updatedEq: WorkstationData) => void;
}

// Helper to build synchronized assets for the Asset Directory from all floor plans and facilities
function buildInitialSynchronizedAssets(
  wsMap: Record<string, WorkstationData[]>,
  rackMap: Record<string, WorkstationData[]>
): TableAssetItem[] {
  const result: TableAssetItem[] = [];

  // 1. All Lab Workstations from Floor Grids
  Object.entries(wsMap).forEach(([labCode, wsList]) => {
    const roomName =
      labCode === 'LAB-1'
        ? 'Lab 1 (Rm 201)'
        : labCode === 'LAB-2'
        ? 'Lab 2 (Rm 302)'
        : 'Lab 3 (Rm 304)';

    const defaultBrand =
      labCode === 'LAB-1'
        ? 'Dell OptiPlex 7090 Tower'
        : labCode === 'LAB-2'
        ? 'HP ProDesk 400 G9 SFF'
        : 'Custom Dual-NIC Lab Tower';

    const defaultCost = labCode === 'LAB-1' ? 62000 : labCode === 'LAB-2' ? 55000 : 58000;

    wsList.forEach((ws) => {
      if (ws.status === 'VACANT_SLOT' || !ws.assetTag) return;

      const specString = `${ws.cpu || 'Intel Core i5/i7'} / ${ws.ramGb || 16}GB RAM / ${
        ws.storage || '512GB NVMe SSD'
      }${ws.gpu ? ` / ${ws.gpu}` : ''}`;

      result.push({
        id: ws.id,
        assetTag: ws.assetTag,
        name: `${roomName.split(' ')[0]} Workstation ${ws.seatNumber.replace('WS-', '')}`,
        category: 'WORKSTATION',
        brandModel: defaultBrand,
        labRoom: roomName,
        seatCoord: `Row ${ws.row}, Col ${ws.col}`,
        status: ws.status as any,
        condition: ws.condition as any,
        cpuRam: specString,
        ipAddress: ws.ipAddress,
        serialNumber: `SN-${labCode}-${ws.seatNumber.replace('WS-', '')}X9`,
        purchaseCost: defaultCost,
      });
    });
  });

  // 2. All Rack Equipment from Floor Grids (Servers, Switches, Routers, UPS)
  Object.entries(rackMap).forEach(([labCode, eqList]) => {
    const roomName =
      labCode === 'LAB-1'
        ? 'Lab 1 (Rm 201)'
        : labCode === 'LAB-2'
        ? 'Lab 2 (Rm 302)'
        : 'Lab 3 (Rm 304)';

    eqList.forEach((eq) => {
      let cost = 75000;
      if (eq.category === 'SERVER') cost = 285000;
      else if (eq.category === 'ROUTER') cost = 115000;
      else if (eq.category === 'NETWORKING_SWITCH') cost = 82000;
      else if (eq.category === 'UPS') cost = 38000;

      result.push({
        id: eq.id,
        assetTag: eq.assetTag,
        name: eq.hostname,
        category: eq.category || 'SERVER',
        brandModel: eq.brandModel || 'Enterprise Hardware',
        labRoom: roomName,
        seatCoord: eq.seatNumber,
        status: eq.status as any,
        condition: eq.condition as any,
        cpuRam: eq.cpu || 'Enterprise Grade Unit',
        ipAddress: eq.ipAddress,
        serialNumber: `${eq.assetTag}-SER`,
        purchaseCost: cost,
      });
    });
  });

  // 3. Central Server Room Equipment (Rm 305)
  result.push(
    {
      id: 'asset-srv-01',
      assetTag: 'ACLC-MNL-SRV-01',
      name: 'Central Active Directory & Domain Controller',
      category: 'SERVER',
      brandModel: 'Dell PowerEdge R640 1U Server',
      labRoom: 'Server Room (Rm 305)',
      seatCoord: 'Main Server Rack, RU 18-19',
      status: 'OPERATIONAL',
      condition: 'EXCELLENT',
      cpuRam: 'Dual Intel Xeon Silver 4210R / 64GB ECC / 4x 1TB SAS RAID10',
      ipAddress: '192.168.1.10',
      serialNumber: '7K91902-DC01',
      purchaseCost: 285000,
    },
    {
      id: 'asset-srv-02',
      assetTag: 'ACLC-MNL-SRV-02',
      name: 'VMware ESXi Virtualization Cluster Host',
      category: 'SERVER',
      brandModel: 'Dell PowerEdge R740 2U Server',
      labRoom: 'Server Room (Rm 305)',
      seatCoord: 'Main Server Rack, RU 20-21',
      status: 'OPERATIONAL',
      condition: 'EXCELLENT',
      cpuRam: 'Dual Intel Xeon Gold 5218R / 128GB ECC / 8x 1.2TB SAS 10K',
      ipAddress: '192.168.1.11',
      serialNumber: '8H92011-VM01',
      purchaseCost: 360000,
    },
    {
      id: 'asset-core-sw01',
      assetTag: 'ACLC-MNL-CORE-SW01',
      name: 'Institutional Core Backbone Switch',
      category: 'NETWORKING_SWITCH',
      brandModel: 'Cisco Catalyst 3850 48P-E 10G',
      labRoom: 'Server Room (Rm 305)',
      seatCoord: 'Network Rack, RU 24',
      status: 'OPERATIONAL',
      condition: 'EXCELLENT',
      cpuRam: '48 Gigabit PoE+ / 4x 10G SFP+ Uplinks / IP Services / 176 Gbps',
      ipAddress: '192.168.1.1',
      serialNumber: 'FCW2348B012',
      purchaseCost: 185000,
    },
    {
      id: 'asset-edge-fw01',
      assetTag: 'ACLC-MNL-EDGE-FW01',
      name: 'Perimeter Security Firewall & Edge Gateway',
      category: 'ROUTER',
      brandModel: 'Fortinet FortiGate 100F NGFW',
      labRoom: 'Server Room (Rm 305)',
      seatCoord: 'Network Rack, RU 26',
      status: 'OPERATIONAL',
      condition: 'EXCELLENT',
      cpuRam: '16x GE RJ45, 4x SFP, 2x 10GE SFP+ / 1 Gbps Threat Protection / HA Pair',
      ipAddress: '192.168.1.254',
      serialNumber: 'FGT100FT2026019',
      purchaseCost: 195000,
    },
    {
      id: 'asset-srv-ups01',
      assetTag: 'ACLC-MNL-SRV-UPS01',
      name: 'Server Room Online Double-Conversion UPS',
      category: 'UPS',
      brandModel: 'APC Smart-UPS On-Line 3000VA 230V',
      labRoom: 'Server Room (Rm 305)',
      seatCoord: 'Power Rack Base, RU 01-04',
      status: 'OPERATIONAL',
      condition: 'EXCELLENT',
      cpuRam: '3000VA / 2700W Pure Sine / Hardwired + 8x C13 + 2x C19 / Extended Run Pack',
      ipAddress: '192.168.1.5',
      serialNumber: 'AS202688192',
      purchaseCost: 110000,
    }
  );

  // 4. Ceiling Projectors & Presentation Displays
  result.push(
    {
      id: 'asset-prj-1',
      assetTag: 'ACLC-MNL-LAB1-PRJ01',
      name: 'Ceiling Presentation Projector Lab 1',
      category: 'PROJECTOR',
      brandModel: 'Epson EB-FH52 Full HD 3LCD',
      labRoom: 'Lab 1 (Rm 201)',
      seatCoord: 'Ceiling Center Mount',
      status: 'OPERATIONAL',
      condition: 'EXCELLENT',
      cpuRam: '4,000 ANSI Lumens / 1080p FHD / 12,000 hrs ECO / HDMIx2, VGA',
      ipAddress: '192.168.10.5',
      serialNumber: 'EP-99420-FH52',
      purchaseCost: 48500,
    },
    {
      id: 'asset-prj-2',
      assetTag: 'ACLC-MNL-LAB2-PRJ01',
      name: 'High-Brightness Projector Lab 2',
      category: 'PROJECTOR',
      brandModel: 'BenQ MH733 DLP Presentation Projector',
      labRoom: 'Lab 2 (Rm 302)',
      seatCoord: 'Ceiling Center Mount',
      status: 'OPERATIONAL',
      condition: 'GOOD',
      cpuRam: '4,000 ANSI Lumens / 1080p FHD / 15,000 hrs Lamp / USB Reader & HDMI',
      ipAddress: '192.168.20.5',
      serialNumber: 'PDL20239012',
      purchaseCost: 46000,
    },
    {
      id: 'asset-prj-3',
      assetTag: 'ACLC-MNL-LAB3-PRJ01',
      name: 'Interactive Network Projector Lab 3',
      category: 'PROJECTOR',
      brandModel: 'ViewSonic PG707W WXGA Projector',
      labRoom: 'Lab 3 (Rm 304)',
      seatCoord: 'Ceiling Center Mount',
      status: 'OPERATIONAL',
      condition: 'EXCELLENT',
      cpuRam: '4,000 ANSI Lumens / 1280x800 WXGA / Crestron & PJ-Link Certified / Dual HDMI',
      ipAddress: '192.168.30.5',
      serialNumber: 'VS-707W-88310',
      purchaseCost: 42000,
    }
  );

  // 5. High-Density Enterprise Wireless Access Points
  result.push(
    {
      id: 'asset-ap-1',
      assetTag: 'ACLC-MNL-LAB1-AP01',
      name: 'Lab 1 High-Density Wi-Fi 6 Access Point',
      category: 'ACCESS_POINT',
      brandModel: 'Ubiquiti UniFi 6 Pro (U6-Pro)',
      labRoom: 'Lab 1 (Rm 201)',
      seatCoord: 'Ceiling Center Mount',
      status: 'OPERATIONAL',
      condition: 'EXCELLENT',
      cpuRam: 'Wi-Fi 6 AX3000 Dual-Band / 5.3 Gbps Throughput / 300+ Clients / 802.3at PoE+',
      ipAddress: '192.168.10.9',
      serialNumber: 'U6-PRO-LAB1-981',
      purchaseCost: 14500,
    },
    {
      id: 'asset-ap-2',
      assetTag: 'ACLC-MNL-LAB2-AP01',
      name: 'Lab 2 Wi-Fi 6 Access Point',
      category: 'ACCESS_POINT',
      brandModel: 'Ubiquiti UniFi 6 Pro (U6-Pro)',
      labRoom: 'Lab 2 (Rm 302)',
      seatCoord: 'Ceiling Center Mount',
      status: 'OPERATIONAL',
      condition: 'EXCELLENT',
      cpuRam: 'Wi-Fi 6 AX3000 Dual-Band / 5.3 Gbps Throughput / 802.3at PoE+',
      ipAddress: '192.168.20.9',
      serialNumber: 'U6-PRO-LAB2-982',
      purchaseCost: 14500,
    },
    {
      id: 'asset-ap-3',
      assetTag: 'ACLC-MNL-LAB3-AP01',
      name: 'Lab 3 Cisco Testing Wireless AP',
      category: 'ACCESS_POINT',
      brandModel: 'Cisco Catalyst 9115AX Series Wi-Fi 6 AP',
      labRoom: 'Lab 3 (Rm 304)',
      seatCoord: 'Ceiling Center Mount',
      status: 'OPERATIONAL',
      condition: 'EXCELLENT',
      cpuRam: 'Wi-Fi 6 (802.11ax) / 4x4 MU-MIMO / mGig 2.5GbE Uplink / Cisco DNA Ready',
      ipAddress: '192.168.30.9',
      serialNumber: 'FOC2401AX01',
      purchaseCost: 28000,
    },
    {
      id: 'asset-ap-hallway',
      assetTag: 'ACLC-MNL-HALL-AP01',
      name: '2nd & 3rd Floor Hallway Access Point',
      category: 'ACCESS_POINT',
      brandModel: 'Ubiquiti UniFi 6 Long-Range (U6-LR)',
      labRoom: 'Server Room (Rm 305)',
      seatCoord: 'Corridor Entrance Mount',
      status: 'OPERATIONAL',
      condition: 'EXCELLENT',
      cpuRam: 'Wi-Fi 6 4x4 Long-Range / 3.0 Gbps / High-Gain Antenna Array / PoE+',
      ipAddress: '192.168.1.9',
      serialNumber: 'U6-LR-HALL-01',
      purchaseCost: 18000,
    }
  );

  // 6. Institutional Network Printers & Peripherals
  result.push(
    {
      id: 'asset-prn-1',
      assetTag: 'ACLC-MNL-LAB1-PRN01',
      name: 'Lab 1 Instructor Network All-in-One Printer',
      category: 'PRINTER_SCANNER',
      brandModel: 'Epson EcoTank L3210 All-in-One Ink Tank',
      labRoom: 'Lab 1 (Rm 201)',
      seatCoord: 'Instructor Station / Lab Office',
      status: 'OPERATIONAL',
      condition: 'EXCELLENT',
      cpuRam: 'Continuous Ink Tank / 33 ppm Print / 5760x1440 dpi / USB & Wi-Fi Direct',
      ipAddress: '192.168.10.6',
      serialNumber: 'EP-L3210-LAB1',
      purchaseCost: 11500,
    },
    {
      id: 'asset-prn-2',
      assetTag: 'ACLC-MNL-LAB2-PRN01',
      name: 'Lab 2 Duplex Workgroup Laser Printer',
      category: 'PRINTER_SCANNER',
      brandModel: 'HP LaserJet Pro MFP 4103fdw',
      labRoom: 'Lab 2 (Rm 302)',
      seatCoord: 'Faculty Corner Desk',
      status: 'OPERATIONAL',
      condition: 'GOOD',
      cpuRam: 'Monochrome Laser / 42 ppm / Auto-Duplex / Gigabit Ethernet & Dual-Band Wi-Fi',
      ipAddress: '192.168.20.6',
      serialNumber: 'HP-MFP4103-LAB2',
      purchaseCost: 26500,
    },
    {
      id: 'asset-prn-3',
      assetTag: 'ACLC-MNL-LAB3-PRN01',
      name: 'Lab 3 Network Document Scanner & Printer',
      category: 'PRINTER_SCANNER',
      brandModel: 'Canon imageCLASS MF445dw Laser MFP',
      labRoom: 'Lab 3 (Rm 304)',
      seatCoord: 'Lab Assistant Desk',
      status: 'OPERATIONAL',
      condition: 'EXCELLENT',
      cpuRam: 'Multi-Function Laser / 40 ppm / 50-sheet DADF Scanner / Wi-Fi & Ethernet',
      ipAddress: '192.168.30.6',
      serialNumber: 'CN-MF445-LAB3',
      purchaseCost: 24000,
    },
    {
      id: 'asset-prn-zebra',
      assetTag: 'ACLC-MNL-IT-BCR01',
      name: 'ACLC Institutional Asset Tag & Barcode Thermal Printer',
      category: 'PRINTER_SCANNER',
      brandModel: 'Zebra ZD220 Direct Thermal Barcode Printer',
      labRoom: 'Server Room (Rm 305)',
      seatCoord: 'IT Custodian Workstation',
      status: 'OPERATIONAL',
      condition: 'EXCELLENT',
      cpuRam: '203 dpi / 4-inch Print Width / 102 mm/s / Thermal Transfer & Direct Thermal / USB',
      ipAddress: '192.168.1.7',
      serialNumber: 'ZBR-ZD220-MNL',
      purchaseCost: 16500,
    }
  );

  return result;
}

// Helper to generate initial lab workstations
function createInitialWorkstations(labCode: string, rows: number, cols: number): WorkstationData[] {
  const list: WorkstationData[] = [];
  let seq = 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Leftmost column (Col 0) is the AISLE
      if (c === 0) {
        list.push({
          id: `${labCode}-R${r}-C${c}`,
          assetTag: '',
          hostname: '',
          row: r,
          col: c,
          seatNumber: 'AISLE',
          status: 'VACANT_SLOT',
          condition: 'GOOD',
          ipAddress: '',
          macAddress: '',
          cpu: '',
          ramGb: 0,
          storage: '',
          lastAuditedDate: '',
        });
        continue;
      }

      const pad = String(seq).padStart(2, '0');
      const tag = `ACLC-MNL-${labCode}-WS${pad}`;
      const isFaulty = (r === 1 && c === 2 && labCode === 'LAB-1') || (r === 3 && c === 6 && labCode === 'LAB-2');
      const isDegraded = (r === 0 && c === 2 && labCode === 'LAB-1');
      const isBorrowed = (r === 4 && c === 6 && labCode === 'LAB-3');

      const status: WorkstationData['status'] = isFaulty
        ? 'UNDER_MAINTENANCE'
        : isDegraded
        ? 'DEGRADED'
        : isBorrowed
        ? 'BORROWED'
        : 'OPERATIONAL';

      const condition: WorkstationData['condition'] = isFaulty
        ? 'DAMAGED'
        : isDegraded
        ? 'FAIR'
        : 'EXCELLENT';

      list.push({
        id: `${labCode}-WS${pad}`,
        assetTag: tag,
        hostname: `${labCode}-WS${pad}`,
        row: r,
        col: c,
        seatNumber: `WS-${pad}`,
        status,
        condition,
        ipAddress: `192.168.${labCode === 'LAB-1' ? '10' : labCode === 'LAB-2' ? '20' : '30'}.${10 + seq}`,
        macAddress: `00:1A:2B:${pad}:4D:5E`,
        cpu: labCode === 'LAB-1' ? 'Intel Core i7-12700 (12 Cores)' : 'Intel Core i5-12400 (6 Cores)',
        ramGb: labCode === 'LAB-1' ? 16 : 8,
        storage: '512GB NVMe M.2 SSD',
        gpu: labCode === 'LAB-1' ? 'NVIDIA GeForce GTX 1660 Super 6GB' : undefined,
        activeTicketId: isFaulty ? `TKT-2026-4081` : undefined,
        lastAuditedDate: '2026-11-03 by Agent v1.0',
        category: 'WORKSTATION',
      });
      seq++;
    }
  }
  return list;
}

// Initial Right-Bottom Rack Telecommunications Equipment for Labs
function createInitialRackEquipment(labCode: string): WorkstationData[] {
  const subnetOctet = labCode === 'LAB-1' ? '10' : labCode === 'LAB-2' ? '20' : '30';
  return [
    {
      id: `${labCode}-SRV01`,
      assetTag: `ACLC-MNL-${labCode}-SRV01`,
      hostname: `${labCode} Host Server`,
      row: 99,
      col: 99,
      seatNumber: 'RACK RU 18-19',
      status: 'OPERATIONAL',
      condition: 'EXCELLENT',
      ipAddress: `192.168.${subnetOctet}.20`,
      macAddress: `00:1A:2B:SR:V0:01`,
      cpu: 'Dual Xeon Silver 4210R (20 Cores) / 64GB ECC',
      ramGb: 64,
      storage: '4x 1TB SAS 12G RAID10',
      lastAuditedDate: '2026-11-03 SNMP Telemetry',
      category: 'SERVER',
      brandModel: 'Dell PowerEdge R640 1U',
      rackUnits: 'Rack A, RU 18-19',
    },
    {
      id: `${labCode}-SW01`,
      assetTag: `ACLC-MNL-${labCode}-SW01`,
      hostname: `${labCode} Core Switch`,
      row: 99,
      col: 98,
      seatNumber: 'RACK RU 12',
      status: 'OPERATIONAL',
      condition: 'EXCELLENT',
      ipAddress: `192.168.${subnetOctet}.2`,
      macAddress: `00:1A:2B:SW:01:00`,
      cpu: '24-Port 1GbE PoE+ / 4x 10G SFP+ / IOS 15.2(7)E',
      ramGb: 0,
      storage: '128 Gbps Switching Fabric',
      lastAuditedDate: '2026-11-03 Cisco Discovery Protocol',
      category: 'NETWORKING_SWITCH',
      brandModel: 'Cisco Catalyst 2960-X 24PS-L',
      portCount: '24 Gigabit PoE+ & 4 SFP+',
      firmwareVersion: 'Cisco IOS 15.2(7)E',
      rackUnits: 'Rack A, RU 12',
    },
    {
      id: `${labCode}-RTR01`,
      assetTag: `ACLC-MNL-${labCode}-RTR01`,
      hostname: `${labCode} Gateway Router`,
      row: 99,
      col: 97,
      seatNumber: 'RACK RU 14',
      status: 'OPERATIONAL',
      condition: 'EXCELLENT',
      ipAddress: `192.168.${subnetOctet}.1`,
      macAddress: `00:1A:2B:RT:01:00`,
      cpu: '3x GbE WAN/LAN / 2x NIM / IOS-XE 17.3.4',
      ramGb: 4,
      storage: '100-300 Mbps Aggregate',
      lastAuditedDate: '2026-11-03 SNMP v3',
      category: 'ROUTER',
      brandModel: 'Cisco ISR 4331/K9 Gateway',
      portCount: '3x GE, 2x NIM, 1x SM',
      firmwareVersion: 'Cisco IOS-XE 17.3.4',
      rackUnits: 'Rack A, RU 14',
    },
    {
      id: `${labCode}-UPS01`,
      assetTag: `ACLC-MNL-${labCode}-UPS01`,
      hostname: `${labCode} Smart-UPS`,
      row: 99,
      col: 96,
      seatNumber: 'RACK RU 01-02',
      status: 'OPERATIONAL',
      condition: 'GOOD',
      ipAddress: `192.168.${subnetOctet}.4`,
      macAddress: `00:1A:2B:UP:01:00`,
      cpu: '1500VA / 900W Pure Sine / 8x IEC C13',
      ramGb: 0,
      storage: 'Lead-Acid Sealed RBC7',
      lastAuditedDate: '2026-11-03 Self-Test Passed',
      category: 'UPS',
      brandModel: 'APC Smart-UPS 1500VA LCD',
      rackUnits: 'Rack A, RU 01-02',
    },
  ];
}

const INITIAL_WS_MAP: Record<string, WorkstationData[]> = {
  'LAB-1': createInitialWorkstations('LAB-1', 5, 8),
  'LAB-2': createInitialWorkstations('LAB-2', 5, 8),
  'LAB-3': createInitialWorkstations('LAB-3', 5, 7),
};

const INITIAL_RACK_MAP: Record<string, WorkstationData[]> = {
  'LAB-1': createInitialRackEquipment('LAB-1'),
  'LAB-2': createInitialRackEquipment('LAB-2'),
  'LAB-3': createInitialRackEquipment('LAB-3'),
};

const INITIAL_SYNCHRONIZED_ASSETS: TableAssetItem[] = buildInitialSynchronizedAssets(
  INITIAL_WS_MAP,
  INITIAL_RACK_MAP
);

const InventoryContext = createContext<InventoryContextType | null>(null);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [labWorkstationsMap, setLabWorkstationsMap] = useState<Record<string, WorkstationData[]>>(INITIAL_WS_MAP);
  const [rackEquipmentMap, setRackEquipmentMap] = useState<Record<string, WorkstationData[]>>(INITIAL_RACK_MAP);
  const [assets, setAssets] = useState<TableAssetItem[]>(INITIAL_SYNCHRONIZED_ASSETS);

  // Update Asset in Asset Directory AND sync with Floor Grid / Rack
  const updateAsset = (updated: TableAssetItem) => {
    setAssets((prev) => prev.map((a) => (a.id === updated.id ? { ...updated } : a)));

    // Sync to Workstation Grid (if matched by tag or name)
    setLabWorkstationsMap((prev) => {
      const nextMap = { ...prev };
      Object.keys(nextMap).forEach((roomCode) => {
        nextMap[roomCode] = nextMap[roomCode].map((ws) => {
          if (ws.assetTag === updated.assetTag || ws.id === updated.id) {
            return {
              ...ws,
              status: updated.status,
              condition: updated.condition,
              ipAddress: updated.ipAddress,
              cpu: updated.cpuRam,
              hostname: updated.name,
            };
          }
          return ws;
        });
      });
      return nextMap;
    });

    // Sync to Rack Equipment (Server, Switch, Router, UPS)
    setRackEquipmentMap((prev) => {
      const nextMap = { ...prev };
      Object.keys(nextMap).forEach((roomCode) => {
        nextMap[roomCode] = nextMap[roomCode].map((eq) => {
          if (eq.assetTag === updated.assetTag || eq.id === updated.id) {
            return {
              ...eq,
              status: updated.status,
              condition: updated.condition,
              ipAddress: updated.ipAddress,
              cpu: updated.cpuRam,
              hostname: updated.name,
            };
          }
          return eq;
        });
      });
      return nextMap;
    });
  };

  // Add Asset from Directory and sync with Grid/Rack
  const addAsset = (newItem: TableAssetItem) => {
    setAssets((prev) => [newItem, ...prev]);

    // Check if new asset maps to a workstation
    const isLab1 = newItem.labRoom.includes('Lab 1');
    const isLab2 = newItem.labRoom.includes('Lab 2');
    const isLab3 = newItem.labRoom.includes('Lab 3');
    const targetRoom = isLab1 ? 'LAB-1' : isLab2 ? 'LAB-2' : isLab3 ? 'LAB-3' : null;

    if (targetRoom) {
      if (newItem.category === 'WORKSTATION') {
        // If coordinate like "Row 1, Col 3"
        const coordMatch = newItem.seatCoord.match(/Row\s*(\d+),\s*Col\s*(\d+)/i);
        if (coordMatch) {
          const r = parseInt(coordMatch[1], 10);
          const c = parseInt(coordMatch[2], 10);

          setLabWorkstationsMap((prev) => ({
            ...prev,
            [targetRoom]: (prev[targetRoom] || []).map((ws) => {
              if (ws.row === r && ws.col === c) {
                return {
                  ...ws,
                  assetTag: newItem.assetTag,
                  hostname: newItem.name,
                  status: newItem.status,
                  condition: newItem.condition,
                  ipAddress: newItem.ipAddress,
                  cpu: newItem.cpuRam,
                };
              }
              return ws;
            }),
          }));
        }
      } else if (
        newItem.category === 'SERVER' ||
        newItem.category === 'NETWORKING_SWITCH' ||
        newItem.category === 'ROUTER' ||
        newItem.category === 'UPS'
      ) {
        // Add or update to right-bottom rack equipment
        setRackEquipmentMap((prev) => {
          const currentList = prev[targetRoom] || [];
          const exists = currentList.some((e) => e.assetTag === newItem.assetTag);
          if (exists) {
            return {
              ...prev,
              [targetRoom]: currentList.map((e) =>
                e.assetTag === newItem.assetTag
                  ? {
                      ...e,
                      hostname: newItem.name,
                      status: newItem.status,
                      condition: newItem.condition,
                      ipAddress: newItem.ipAddress,
                      cpu: newItem.cpuRam,
                    }
                  : e
              ),
            };
          } else {
            const newRackNode: WorkstationData = {
              id: newItem.id,
              assetTag: newItem.assetTag,
              hostname: newItem.name,
              row: 99,
              col: 99,
              seatNumber: newItem.seatCoord || 'RACK RU',
              status: newItem.status,
              condition: newItem.condition,
              ipAddress: newItem.ipAddress,
              macAddress: '00:1A:2B:NEW:00',
              cpu: newItem.cpuRam,
              ramGb: 0,
              storage: '',
              lastAuditedDate: '2026-11-03 Registered via Inventory',
              category: newItem.category,
              brandModel: newItem.brandModel,
              rackUnits: newItem.seatCoord,
            };
            return {
              ...prev,
              [targetRoom]: [...currentList, newRackNode],
            };
          }
        });
      }
    }
  };

  const deleteAsset = (id: string) => {
    const target = assets.find((a) => a.id === id);
    if (!target) return;

    // 1. Remove from master assets inventory
    setAssets((prev) => prev.filter((a) => a.id !== id));

    // 2. Clear assigned workstation seat on Floor Grid if mapped
    setLabWorkstationsMap((prev) => {
      const nextMap = { ...prev };
      Object.keys(nextMap).forEach((roomCode) => {
        nextMap[roomCode] = nextMap[roomCode].map((ws) => {
          if (ws.assetTag === target.assetTag || ws.id === target.id) {
            return {
              ...ws,
              assetTag: '',
              hostname: 'Unassigned Seat',
              status: 'VACANT_SLOT' as const,
              condition: 'GOOD' as const,
              ipAddress: '',
              cpu: '',
              ramGb: 0,
              storage: '',
              gpu: undefined,
              activeTicketId: undefined,
            };
          }
          return ws;
        });
      });
      return nextMap;
    });

    // 3. Remove from rack equipment if it was rack mounted
    setRackEquipmentMap((prev) => {
      const nextMap = { ...prev };
      Object.keys(nextMap).forEach((roomCode) => {
        nextMap[roomCode] = nextMap[roomCode].filter(
          (eq) => eq.assetTag !== target.assetTag && eq.id !== target.id
        );
      });
      return nextMap;
    });
  };

  // Update Workstation from Floor Grid AND sync back to Asset Directory
  const updateWorkstation = (labCode: string, updatedWs: WorkstationData) => {
    setLabWorkstationsMap((prev) => ({
      ...prev,
      [labCode]: (prev[labCode] || []).map((ws) => (ws.id === updatedWs.id ? updatedWs : ws)),
    }));

    // Two-way sync to assets
    setAssets((prev) =>
      prev.map((asset) => {
        if (asset.assetTag === updatedWs.assetTag || asset.id === updatedWs.id) {
          return {
            ...asset,
            status: updatedWs.status as any,
            condition: updatedWs.condition as any,
            ipAddress: updatedWs.ipAddress,
            name: updatedWs.hostname,
            cpuRam: updatedWs.cpu || `${updatedWs.cpu} / ${updatedWs.ramGb}GB`,
          };
        }
        return asset;
      })
    );
  };

  // Update Rack Equipment (Server, Switch, Router) from Floor Grid AND sync back to Asset Directory
  const updateRackEquipment = (labCode: string, updatedEq: WorkstationData) => {
    setRackEquipmentMap((prev) => ({
      ...prev,
      [labCode]: (prev[labCode] || []).map((eq) => (eq.id === updatedEq.id ? updatedEq : eq)),
    }));

    // Two-way sync to assets
    setAssets((prev) =>
      prev.map((asset) => {
        if (asset.assetTag === updatedEq.assetTag || asset.id === updatedEq.id) {
          return {
            ...asset,
            status: updatedEq.status as any,
            condition: updatedEq.condition as any,
            ipAddress: updatedEq.ipAddress,
            name: updatedEq.hostname,
            cpuRam: updatedEq.cpu,
          };
        }
        return asset;
      })
    );
  };

  return (
    <InventoryContext.Provider
      value={{
        assets,
        labWorkstationsMap,
        rackEquipmentMap,
        updateAsset,
        addAsset,
        deleteAsset,
        updateWorkstation,
        updateRackEquipment,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return ctx;
}
