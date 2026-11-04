import {
  CreateBorrowingRequestSchema,
  CreateBorrowingRequestInput,
  TransitionBorrowingStatusSchema,
  TransitionBorrowingStatusInput,
  CreateGatePassSchema,
  CreateGatePassInput,
  ApproveGatePassSchema,
  ApproveGatePassInput,
  GatePassStatusEnum,
} from '../schemas/borrowing.schema';
import { dispatchAlert } from '../lib/webhooks/dispatcher';
import { ActionResult } from './assets.actions';

/**
 * Server Action: Submit Equipment Borrowing Request
 */
export async function createBorrowingRequestAction(
  rawInput: unknown
): Promise<ActionResult<{ requestId: string; requestNumber: string }>> {
  try {
    const parseResult = CreateBorrowingRequestSchema.safeParse(rawInput);
    if (!parseResult.success) {
      return {
        success: false,
        error: 'Validation failed on Borrowing Request',
        validationErrors: parseResult.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const input: CreateBorrowingRequestInput = parseResult.data;
    const seq = Math.floor(1000 + Math.random() * 9000);
    const requestNumber = `BRW-2026-${seq}`;
    const requestId = `brw-${Date.now().toString(36)}`;

    return {
      success: true,
      data: {
        requestId,
        requestNumber,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Error submitting borrowing request',
    };
  }
}

/**
 * Server Action: Transition Borrowing Status (Checkout, Return, Overdue)
 */
export async function transitionBorrowingStatusAction(
  rawInput: unknown
): Promise<
  ActionResult<{
    requestId: string;
    newStatus: string;
    alertDispatched: boolean;
    penaltyApplied?: boolean;
  }>
> {
  try {
    const parseResult = TransitionBorrowingStatusSchema.safeParse(rawInput);
    if (!parseResult.success) {
      return {
        success: false,
        error: 'Invalid status transition parameters',
        validationErrors: parseResult.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const data: TransitionBorrowingStatusInput = parseResult.data;
    let alertDispatched = false;

    // Automated Alert if equipment is marked OVERDUE
    if (data.targetStatus === 'OVERDUE') {
      await dispatchAlert({
        eventType: 'EQUIPMENT_OVERDUE',
        severity: 'HIGH',
        title: 'Borrowing Alert: Equipment Past Return Deadline',
        summary: `Institutional equipment has exceeded its approved return window and is marked OVERDUE.`,
        fields: [
          { name: 'Borrowing ID', value: `\`${data.borrowingRequestId}\``, inline: true },
          { name: 'Status', value: '⚠️ OVERDUE', inline: true },
          { name: 'Action Required', value: 'Custodian contact borrower and initiate retrieval protocol', inline: false },
        ],
        actionUrl: `https://aclc-manila.edu.ph/labpulse/borrowing/${data.borrowingRequestId}`,
      });
      alertDispatched = true;
    }

    return {
      success: true,
      data: {
        requestId: data.borrowingRequestId,
        newStatus: data.targetStatus,
        alertDispatched,
        penaltyApplied: data.targetStatus === 'RETURNED_DAMAGED',
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Error transitioning borrowing status',
    };
  }
}

/**
 * Server Action: Create Official Gate Pass / Property Pull-Out
 */
export async function createGatePassAction(
  rawInput: unknown
): Promise<ActionResult<{ gatePassId: string; gatePassNumber: string }>> {
  try {
    const parseResult = CreateGatePassSchema.safeParse(rawInput);
    if (!parseResult.success) {
      return {
        success: false,
        error: 'Validation failed on Gate Pass creation',
        validationErrors: parseResult.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const input: CreateGatePassInput = parseResult.data;
    const seq = Math.floor(100 + Math.random() * 900);
    const gatePassNumber = `GP-2026-${seq}`;
    const gatePassId = `gp-${Date.now().toString(36)}`;

    return {
      success: true,
      data: {
        gatePassId,
        gatePassNumber,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Error creating Gate Pass',
    };
  }
}

/**
 * Server Action: Multi-step Approval State Machine for Gate Pass
 * Steps:
 * 1. HEAD_RECOMMEND: DRAFT -> HEAD_RECOMMENDED
 * 2. DEAN_APPROVE: HEAD_RECOMMENDED -> DEAN_APPROVED
 * 3. SECURITY_CHECKOUT: DEAN_APPROVED -> SECURITY_CHECKED_OUT (Triggers Campus Security Webhook)
 * 4. SECURITY_CHECKIN: SECURITY_CHECKED_OUT -> COMPLETED
 */
export async function approveGatePassAction(
  rawInput: unknown
): Promise<
  ActionResult<{
    gatePassId: string;
    actionApplied: string;
    newStatus: string;
    securityTimestamp?: string;
    securityAlertDispatched: boolean;
  }>
> {
  try {
    const parseResult = ApproveGatePassSchema.safeParse(rawInput);
    if (!parseResult.success) {
      return {
        success: false,
        error: 'Invalid Gate Pass approval action',
        validationErrors: parseResult.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { gatePassId, action, securityGuardName } = parseResult.data;
    let newStatus = 'DRAFT';
    let securityAlertDispatched = false;
    const nowIso = new Date().toISOString();

    switch (action) {
      case 'HEAD_RECOMMEND':
        newStatus = 'HEAD_RECOMMENDED';
        break;
      case 'DEAN_APPROVE':
        newStatus = 'DEAN_APPROVED';
        break;
      case 'SECURITY_CHECKOUT':
        newStatus = 'SECURITY_CHECKED_OUT';
        // Broadcast security notification when property leaves university gates
        await dispatchAlert({
          eventType: 'GATE_PASS_SECURITY',
          severity: 'HIGH',
          title: 'Campus Security Alert: Property Logged Out at Guardhouse',
          summary: `Official property pull-out has passed inspection and exited campus gates.`,
          fields: [
            { name: 'Gate Pass Number', value: 'GP-2026-042', inline: true },
            { name: 'Security Guard on Duty', value: securityGuardName || 'SG R. Mendoza', inline: true },
            { name: 'Exit Timestamp', value: nowIso, inline: true },
            { name: 'Destination', value: 'Octagon Service Center - SM Manila', inline: false },
          ],
          actionUrl: `https://aclc-manila.edu.ph/labpulse/gate-pass/GP-2026-042`,
        });
        securityAlertDispatched = true;
        break;
      case 'SECURITY_CHECKIN':
        newStatus = 'COMPLETED';
        break;
      case 'REJECT':
        newStatus = 'CANCELLED';
        break;
    }

    return {
      success: true,
      data: {
        gatePassId,
        actionApplied: action,
        newStatus,
        securityTimestamp: nowIso,
        securityAlertDispatched,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Error processing Gate Pass approval',
    };
  }
}
