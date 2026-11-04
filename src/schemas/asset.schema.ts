import { z } from 'zod';

export const AssetCategoryEnum = z.enum([
  'WORKSTATION',
  'SERVER',
  'MONITOR',
  'NETWORKING_SWITCH',
  'ROUTER',
  'ACCESS_POINT',
  'UPS',
  'PROJECTOR',
  'PRINTER_SCANNER',
  'PERIPHERAL',
]);

export const AssetStatusEnum = z.enum([
  'OPERATIONAL',
  'DEGRADED',
  'UNDER_MAINTENANCE',
  'BORROWED',
  'PULLED_OUT',
  'FOR_DISPOSAL',
  'DECOMMISSIONED',
  'LOST',
]);

export const AssetConditionEnum = z.enum([
  'EXCELLENT',
  'GOOD',
  'FAIR',
  'POOR',
  'DAMAGED',
]);

export const HardwareSpecInputSchema = z.object({
  cpuProcessor: z.string().optional(),
  cpuCores: z.number().int().min(1).optional().default(8),
  ramCapacityGb: z.number().int().optional().default(8),
  ramType: z.string().optional().default('DDR4'),
  storageType: z.string().optional().default('NVMe SSD'),
  storageCapacityGb: z.number().int().optional().default(256),
  secondaryStorage: z.string().optional(),
  gpuModel: z.string().optional(),
  gpuVramGb: z.number().int().nonnegative().optional().default(0),
  motherboard: z.string().optional(),
  psuWattage: z.number().int().positive().optional().default(500),
  formFactor: z.string().optional().default('Tower'),
  biosVersion: z.string().optional(),
  // Networking equipment specs (Switches, Routers)
  portCount: z.string().optional(),
  networkSpeed: z.string().optional(),
  firmwareVersion: z.string().optional(),
  rackUnits: z.string().optional(),
  // Projector & Display specs
  lumens: z.string().optional(),
  resolution: z.string().optional(),
  lampHours: z.string().optional(),
  displayTechnology: z.string().optional(),
  videoInputs: z.string().optional(),
  // Power / UPS specs
  vaRating: z.string().optional(),
  wattageRating: z.string().optional(),
  batteryType: z.string().optional(),
  outletCount: z.string().optional(),
  // General custom specs
  customSpecs: z.string().optional(),
});

export const CreateAssetSchema = z.object({
  assetTag: z
    .string()
    .min(3, 'Asset tag must be at least 3 characters')
    .regex(/^ACLC-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+$/, {
      message: 'Asset tag must follow institutional format: ACLC-[CAMPUS]-[ROOM]-[ID] (e.g., ACLC-MNL-LAB1-WS01)',
    }),
  serialNumber: z.string().min(3, 'Serial number is required'),
  barcode: z.string().optional(),
  category: AssetCategoryEnum.default('WORKSTATION'),
  name: z.string().min(2, 'Asset name is required'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().optional(),
  labId: z.string().uuid('Invalid Laboratory ID').optional(),
  gridRow: z.number().int().nonnegative('Grid row must be non-negative').optional(),
  gridCol: z.number().int().nonnegative('Grid column must be non-negative').optional(),
  status: AssetStatusEnum.default('OPERATIONAL'),
  condition: AssetConditionEnum.default('GOOD'),
  ipAddress: z
    .string()
    .regex(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      'Invalid IPv4 address'
    )
    .optional()
    .or(z.literal('')),
  macAddress: z
    .string()
    .regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, 'Invalid MAC address format (e.g. 00:1A:2B:3C:4D:5E)')
    .optional()
    .or(z.literal('')),
  hostname: z.string().min(2).optional().or(z.literal('')),
  osVersion: z.string().optional(),
  purchaseDate: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  purchaseCost: z.number().nonnegative().optional(),
  warrantyExpiry: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  supplierId: z.string().uuid().optional(),
  notes: z.string().max(1000).optional(),
  specs: HardwareSpecInputSchema.optional(),
});

export const UpdateAssetSchema = CreateAssetSchema.partial().extend({
  id: z.string().uuid('Asset ID is required'),
});

export const RelocateAssetSchema = z.object({
  assetId: z.string().uuid('Asset ID is required'),
  targetLabId: z.string().uuid('Target Laboratory ID is required'),
  targetGridRow: z.number().int().nonnegative(),
  targetGridCol: z.number().int().nonnegative(),
  performedById: z.string().uuid('User ID of technician performing relocation is required'),
  transferReason: z.string().min(5, 'Reason for workstation relocation is required'),
});

export const QRLookupSchema = z.object({
  scannedTagOrBarcode: z.string().min(1, 'QR code or barcode content is required'),
});

export type CreateAssetInput = z.infer<typeof CreateAssetSchema>;
export type UpdateAssetInput = z.infer<typeof UpdateAssetSchema>;
export type RelocateAssetInput = z.infer<typeof RelocateAssetSchema>;
