import { z } from 'zod';

export const TicketPriorityEnum = z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);

export const TicketStatusEnum = z.enum([
  'OPEN',
  'TRIAGED',
  'ASSIGNED',
  'IN_PROGRESS',
  'WAITING_FOR_PARTS',
  'RESOLVED',
  'CLOSED',
  'CANCELLED',
]);

export const TicketCategoryEnum = z.enum([
  'HARDWARE_FAILURE',
  'SOFTWARE_OS',
  'NETWORK_OFFLINE',
  'POWER_ELECTRICAL',
  'PERIPHERAL_DEFECT',
  'ROUTINE_PREVENTIVE',
  'PHYSICAL_DAMAGE',
]);

export const CreateTicketSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(150),
  description: z.string().min(10, 'Please provide a detailed description of the incident/defect'),
  labId: z.string().uuid('Laboratory ID is required'),
  assetId: z.string().uuid('Asset ID is optional if general facility issue').optional(),
  priority: TicketPriorityEnum.default('MEDIUM'),
  issueCategory: TicketCategoryEnum.default('HARDWARE_FAILURE'),
  reportedById: z.string().uuid('Reported By User ID is required'),
  assignedToId: z.string().uuid().optional(),
});

export const UpdateTicketStatusSchema = z.object({
  ticketId: z.string().uuid('Ticket ID is required'),
  status: TicketStatusEnum,
  comment: z.string().min(3, 'Status change comment is required'),
  loggedById: z.string().uuid('User ID is required'),
  isInternalOnly: z.boolean().default(false),
});

export const AssignTechnicianSchema = z.object({
  ticketId: z.string().uuid('Ticket ID is required'),
  assignedTechnicianId: z.string().uuid('Technician ID is required'),
  assignedById: z.string().uuid('Assigning user ID is required'),
  notes: z.string().optional(),
});

export const ResolveTicketSchema = z.object({
  ticketId: z.string().uuid('Ticket ID is required'),
  resolvedById: z.string().uuid('Resolving technician ID is required'),
  rootCause: z.string().min(5, 'Root cause description is required'),
  correctiveAction: z.string().min(5, 'Corrective action taken is required'),
  downtimeMinutes: z.number().int().nonnegative('Downtime minutes must be 0 or positive').default(0),
  replacedConsumableId: z.string().uuid().optional(),
  replacedQuantity: z.number().int().positive().optional(),
  closeImmediately: z.boolean().default(false),
});

export type CreateTicketInput = z.infer<typeof CreateTicketSchema>;
export type UpdateTicketStatusInput = z.infer<typeof UpdateTicketStatusSchema>;
export type AssignTechnicianInput = z.infer<typeof AssignTechnicianSchema>;
export type ResolveTicketInput = z.infer<typeof ResolveTicketSchema>;
