import { z } from 'zod';

export const MemoryStickSchema = z.object({
  bankLabel: z.string().optional(),
  capacityBytes: z.number().int().positive(),
  speedMhz: z.number().int().optional(),
  manufacturer: z.string().optional(),
  partNumber: z.string().optional(),
});

export const StorageDriveSchema = z.object({
  model: z.string(),
  interfaceType: z.string().optional(), // NVMe, SATA, USB
  sizeBytes: z.number().positive(),
  serialNumber: z.string().optional(),
});

export const NetworkAdapterTelemetrySchema = z.object({
  adapterName: z.string(),
  macAddress: z
    .string()
    .regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, 'Invalid MAC format'),
  ipAddress: z
    .string()
    .regex(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      'Invalid IPv4 address'
    )
    .optional(),
  gateway: z.string().optional(),
  dhcpEnabled: z.boolean().optional(),
});

export const DiscoveryAgentPayloadSchema = z.object({
  agentVersion: z.string().default('1.0.0'),
  scanTimestamp: z.string().datetime(),
  hostname: z.string().min(1, 'Hostname is required'),
  osName: z.string().min(1, 'OS name is required'),
  osVersion: z.string().optional(),
  osBuild: z.string().optional(),
  uptimeSeconds: z.number().nonnegative().optional(),
  cpu: z.object({
    name: z.string(),
    cores: z.number().int().positive(),
    logicalProcessors: z.number().int().positive(),
    maxClockSpeedMhz: z.number().optional(),
  }),
  memory: z.object({
    totalPhysicalBytes: z.number().positive(),
    totalPhysicalGb: z.number().positive(),
    modules: z.array(MemoryStickSchema).optional(),
  }),
  storageDrives: z.array(StorageDriveSchema).min(1, 'At least one storage drive must be reported'),
  gpu: z.object({
    name: z.string().optional(),
    driverVersion: z.string().optional(),
    adapterRamBytes: z.number().nonnegative().optional(),
  }).optional(),
  motherboard: z.object({
    manufacturer: z.string().optional(),
    product: z.string().optional(),
    serialNumber: z.string().optional(),
  }).optional(),
  bios: z.object({
    version: z.string().optional(),
    releaseDate: z.string().optional(),
  }).optional(),
  network: z.object({
    primaryMac: z
      .string()
      .regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, 'Primary MAC is required'),
    primaryIp: z
      .string()
      .regex(
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        'Valid IPv4 required'
      ),
    adapters: z.array(NetworkAdapterTelemetrySchema).optional(),
  }),
  chassisAssetTag: z.string().optional(), // BIOS asset tag if programmed
});

export const DiscoveryHeaderAuthSchema = z.object({
  authorization: z.string().regex(/^Bearer\s.+$/, 'Bearer token required'),
});

export type DiscoveryAgentPayload = z.infer<typeof DiscoveryAgentPayloadSchema>;
