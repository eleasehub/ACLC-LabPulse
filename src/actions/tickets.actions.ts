import {
  CreateTicketSchema,
  CreateTicketInput,
  AssignTechnicianSchema,
  ResolveTicketSchema,
  ResolveTicketInput,
} from '../schemas/ticket.schema';
import { dispatchAlert } from '../lib/webhooks/dispatcher';
import { ActionResult } from './assets.actions';

/**
 * Server Action: Create Maintenance Ticket & Dispatch Emergency Alert if Critical/High
 */
export async function createTicketAction(
  rawInput: unknown
): Promise<ActionResult<{ ticketId: string; ticketNumber: string; alertDispatched: boolean }>> {
  try {
    const parseResult = CreateTicketSchema.safeParse(rawInput);
    if (!parseResult.success) {
      return {
        success: false,
        error: 'Validation failed on Maintenance Ticket input',
        validationErrors: parseResult.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const input: CreateTicketInput = parseResult.data;
    const ticketSeq = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `TKT-2026-${ticketSeq}`;
    const ticketId = `ticket-${Date.now().toString(36)}`;

    let alertDispatched = false;

    // Trigger Discord & Telegram Webhook for CRITICAL or HIGH severity
    if (input.priority === 'CRITICAL' || input.priority === 'HIGH') {
      await dispatchAlert({
        eventType: 'CRITICAL_INCIDENT',
        severity: input.priority === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
        title: `Incident Filed: ${input.title}`,
        summary: input.description,
        ticketNumber: ticketNumber,
        laboratory: 'Lab 1 - Multimedia Lab',
        fields: [
          { name: 'Issue Category', value: input.issueCategory, inline: true },
          { name: 'Priority Level', value: input.priority, inline: true },
          { name: 'Status', value: 'OPEN (Needs Triage)', inline: true },
        ],
        actionUrl: `https://aclc-manila.edu.ph/labpulse/tickets/${ticketNumber}`,
      });
      alertDispatched = true;
    }

    return {
      success: true,
      data: {
        ticketId,
        ticketNumber,
        alertDispatched,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Error creating maintenance ticket',
    };
  }
}

/**
 * Server Action: Assign Technician to Ticket
 */
export async function assignTechnicianAction(
  rawInput: unknown
): Promise<ActionResult<{ ticketId: string; technicianId: string }>> {
  try {
    const parseResult = AssignTechnicianSchema.safeParse(rawInput);
    if (!parseResult.success) {
      return {
        success: false,
        error: 'Invalid assignment parameters',
        validationErrors: parseResult.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { ticketId, assignedTechnicianId } = parseResult.data;

    return {
      success: true,
      data: {
        ticketId,
        technicianId: assignedTechnicianId,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Error assigning technician',
    };
  }
}

/**
 * Server Action: Resolve Ticket with Downtime & Corrective Log
 */
export async function resolveTicketAction(
  rawInput: unknown
): Promise<ActionResult<{ ticketId: string; downtimeMinutes: number; resolved: boolean }>> {
  try {
    const parseResult = ResolveTicketSchema.safeParse(rawInput);
    if (!parseResult.success) {
      return {
        success: false,
        error: 'Invalid resolution submission',
        validationErrors: parseResult.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const data: ResolveTicketInput = parseResult.data;

    return {
      success: true,
      data: {
        ticketId: data.ticketId,
        downtimeMinutes: data.downtimeMinutes,
        resolved: true,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Error resolving maintenance ticket',
    };
  }
}
