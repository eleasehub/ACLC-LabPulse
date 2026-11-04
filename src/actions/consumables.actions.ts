import {
  RecordConsumableTransactionSchema,
  RecordConsumableTransactionInput,
  ConsumableRestockSchema,
  ConsumableRestockInput,
} from '../schemas/consumable.schema';
import { dispatchAlert } from '../lib/webhooks/dispatcher';
import { ActionResult } from './assets.actions';

/**
 * Server Action: Record Consumable Issuance or Transaction
 * Automatically dispatches LOW_STOCK_THRESHOLD alert if balance drops <= threshold
 */
export async function recordConsumableTransactionAction(
  rawInput: unknown
): Promise<
  ActionResult<{
    transactionId: string;
    newBalance: number;
    thresholdAlertTriggered: boolean;
  }>
> {
  try {
    const parseResult = RecordConsumableTransactionSchema.safeParse(rawInput);
    if (!parseResult.success) {
      return {
        success: false,
        error: 'Invalid consumable transaction payload',
        validationErrors: parseResult.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const data: RecordConsumableTransactionInput = parseResult.data;

    // Simulation balance logic (in production: Prisma transaction decrement)
    const simulatedCurrentStock = 12; // Example current balance
    const minThreshold = 10;
    const newBalance = Math.max(0, simulatedCurrentStock - data.quantity);
    const thresholdAlertTriggered = newBalance <= minThreshold;

    if (thresholdAlertTriggered) {
      await dispatchAlert({
        eventType: 'LOW_STOCK_THRESHOLD',
        severity: 'WARNING',
        title: 'Inventory Alert: Consumable Stock Below Threshold',
        summary: `Item inventory has depleted below minimum safety stock of ${minThreshold} units. Restock order recommended.`,
        fields: [
          { name: 'Consumable ID', value: `\`${data.consumableId}\``, inline: true },
          { name: 'Quantity Issued', value: `${data.quantity}`, inline: true },
          { name: 'Current Balance', value: `⚠️ **${newBalance} units remaining**`, inline: true },
          { name: 'Reorder Level', value: `${minThreshold} units`, inline: true },
        ],
        actionUrl: 'https://aclc-manila.edu.ph/labpulse/inventory',
      });
    }

    return {
      success: true,
      data: {
        transactionId: `txn-${Date.now().toString(36)}`,
        newBalance,
        thresholdAlertTriggered,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Error recording consumable transaction',
    };
  }
}

/**
 * Server Action: Restock Consumable Inventory
 */
export async function restockConsumableAction(
  rawInput: unknown
): Promise<ActionResult<{ consumableId: string; addedQuantity: number; success: boolean }>> {
  try {
    const parseResult = ConsumableRestockSchema.safeParse(rawInput);
    if (!parseResult.success) {
      return {
        success: false,
        error: 'Invalid restock parameters',
        validationErrors: parseResult.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const data: ConsumableRestockInput = parseResult.data;

    return {
      success: true,
      data: {
        consumableId: data.consumableId,
        addedQuantity: data.quantity,
        success: true,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Error restocking consumable',
    };
  }
}
