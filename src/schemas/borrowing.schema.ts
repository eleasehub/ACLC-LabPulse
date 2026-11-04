import { z } from 'zod';

export const BorrowerTypeEnum = z.enum([
  'FACULTY',
  'STUDENT_ORG',
  'ADMIN_STAFF',
  'ACCREDITED_GUEST',
]);

export const BorrowingStatusEnum = z.enum([
  'PENDING_APPROVAL',
  'APPROVED',
  'RELEASED',
  'RETURNED_GOOD',
  'RETURNED_DAMAGED',
  'OVERDUE',
  'REJECTED',
  'CANCELLED',
]);

export const AssetConditionEnum = z.enum([
  'EXCELLENT',
  'GOOD',
  'FAIR',
  'POOR',
  'DAMAGED',
]);

export const GatePassTypeEnum = z.enum([
  'REPAIR_OUTSIDE',
  'CAMPUS_TRANSFER',
  'DISPOSAL_HAUL',
  'OFF_CAMPUS_EVENT',
  'SUPPLIER_RETURN',
]);

export const GatePassStatusEnum = z.enum([
  'DRAFT',
  'HEAD_RECOMMENDED',
  'DEAN_APPROVED',
  'SECURITY_CHECKED_OUT',
  'SECURITY_CHECKED_IN',
  'COMPLETED',
  'CANCELLED',
]);

export const BorrowingItemInputSchema = z.object({
  assetId: z.string().uuid().optional(),
  consumableId: z.string().uuid().optional(),
  itemDescription: z.string().min(2, 'Description is required'),
  quantity: z.number().int().positive().default(1),
  conditionOnCheckout: AssetConditionEnum.default('GOOD'),
  serialOrTag: z.string().optional(),
  remarks: z.string().optional(),
});

export const CreateBorrowingRequestSchema = z.object({
  borrowerType: BorrowerTypeEnum.default('FACULTY'),
  borrowerName: z.string().min(3, 'Borrower full name is required'),
  borrowerIdNumber: z
    .string()
    .min(3, 'Institutional ID Number is required (e.g. ACLC-FAC-2020-105)'),
  borrowerEmail: z.string().email('Valid institutional email required'),
  borrowerPhone: z.string().min(7, 'Contact number is required'),
  department: z.string().default('College of Computer Studies'),
  purpose: z.string().min(10, 'Specific instructional or academic purpose is required'),
  intendedRoom: z.string().min(2, 'Intended room/venue of use is required (e.g. Rm 302, AVR)'),
  expectedBorrowDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)),
  expectedReturnDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)),
  items: z.array(BorrowingItemInputSchema).min(1, 'At least one equipment item is required'),
  remarks: z.string().optional(),
});

export const TransitionBorrowingStatusSchema = z.object({
  borrowingRequestId: z.string().uuid('Borrowing Request ID is required'),
  targetStatus: BorrowingStatusEnum,
  performedById: z.string().uuid('Authorized User ID is required'),
  returnCondition: AssetConditionEnum.optional(),
  returnConditionNotes: z.string().optional(),
  actualReturnDate: z.string().datetime().optional(),
});

export const GatePassItemInputSchema = z.object({
  assetId: z.string().uuid().optional(),
  itemDescription: z.string().min(2, 'Item description is required'),
  serialNumber: z.string().optional(),
  quantity: z.number().int().positive().default(1),
  remarks: z.string().optional(),
});

export const CreateGatePassSchema = z.object({
  passType: GatePassTypeEnum.default('REPAIR_OUTSIDE'),
  reason: z.string().min(10, 'Detailed official justification is required'),
  destinationAddress: z.string().min(5, 'Specific outside facility/service center address is required'),
  carrierName: z.string().min(3, 'Driver or courier name is required'),
  carrierContact: z.string().optional(),
  vehiclePlateNumber: z.string().min(3, 'Vehicle plate number or transport mode is required'),
  requestedById: z.string().uuid('Requester User ID is required'),
  items: z.array(GatePassItemInputSchema).min(1, 'At least one serialized item must be declared'),
  remarks: z.string().optional(),
});

export const ApproveGatePassSchema = z.object({
  gatePassId: z.string().uuid('Gate Pass ID is required'),
  action: z.enum([
    'HEAD_RECOMMEND',
    'DEAN_APPROVE',
    'SECURITY_CHECKOUT',
    'SECURITY_CHECKIN',
    'REJECT',
  ]),
  signatoryUserId: z.string().uuid('Signatory User ID is required'),
  securityGuardName: z.string().optional(),
  remarks: z.string().optional(),
});

export type CreateBorrowingRequestInput = z.infer<typeof CreateBorrowingRequestSchema>;
export type TransitionBorrowingStatusInput = z.infer<typeof TransitionBorrowingStatusSchema>;
export type CreateGatePassInput = z.infer<typeof CreateGatePassSchema>;
export type ApproveGatePassInput = z.infer<typeof ApproveGatePassSchema>;
