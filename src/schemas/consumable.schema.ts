import { z } from 'zod';

export const ConsumableCategoryEnum = z.enum([
  'CABLE_UTP_CAT6',
  'RJ45_CONNECTORS',
  'KEYBOARD_MEMBRANE',
  'KEYBOARD_MECHANICAL',
  'OPTICAL_MOUSE',
  'THERMAL_PASTE',
  'CMOS_CR2032',
  'PATCH_CORDS',
  'HDMI_VGA_ADAPTERS',
  'POWER_CORDS',
  'RAM_MODULE',
  'SSD_STORAGE',
  'CLEANING_CHEMICALS',
  'TOOLKIT_SUPPLIES',
]);

export const UnitOfMeasureEnum = z.enum([
  'PIECES',
  'BOXES',
  'METERS',
  'ROLLS',
  'TUBES',
  'PACKS',
  'SETS',
]);

export const TransactionTypeEnum = z.enum([
  'RESTOCK',
  'ISSUANCE_MAINTENANCE',
  'ISSUANCE_FACULTY',
  'DEFECTIVE_WRITE_OFF',
  'INVENTORY_AUDIT_ADJUSTMENT',
]);

export const CreateConsumableSchema = z.object({
  sku: z
    .string()
    .min(3)
    .regex(/^CON-[A-Z0-9]+-[A-Z0-9]+$/, {
      message: 'SKU must follow format CON-[CAT]-[CODE] (e.g., CON-RJ45-CAT6)',
    }),
  name: z.string().min(3, 'Item name is required'),
  category: ConsumableCategoryEnum,
  description: z.string().optional(),
  unit: UnitOfMeasureEnum.default('PIECES'),
  stockQuantity: z.number().int().nonnegative().default(0),
  minThreshold: z.number().int().positive().default(20),
  reorderQuantity: z.number().int().positive().default(100),
  unitCost: z.number().positive().optional(),
  storageLocation: z.string().min(2, 'Storage location (cabinet/shelf/bin) is required'),
  supplierId: z.string().uuid().optional(),
});

export const RecordConsumableTransactionSchema = z.object({
  consumableId: z.string().uuid('Consumable ID is required'),
  transactionType: TransactionTypeEnum,
  quantity: z.number().int().positive('Quantity must be greater than zero'),
  referenceTicketId: z.string().uuid().optional(),
  issuedToFacultyId: z.string().uuid().optional(),
  recordedById: z.string().uuid('Recorded by User ID is required'),
  notes: z.string().optional(),
});

export const ConsumableRestockSchema = z.object({
  consumableId: z.string().uuid('Consumable ID is required'),
  quantity: z.number().int().positive('Restock quantity must be positive'),
  supplierId: z.string().uuid().optional(),
  invoiceNumber: z.string().optional(),
  unitCostPaid: z.number().positive().optional(),
  recordedById: z.string().uuid('Staff ID is required'),
  notes: z.string().optional(),
});

export type CreateConsumableInput = z.infer<typeof CreateConsumableSchema>;
export type RecordConsumableTransactionInput = z.infer<typeof RecordConsumableTransactionSchema>;
export type ConsumableRestockInput = z.infer<typeof ConsumableRestockSchema>;
