import {
  DiscoveryAgentPayloadSchema,
  DiscoveryAgentPayload,
} from '../schemas/discovery.schema';
import { dispatchAlert } from '../lib/webhooks/dispatcher';
import { ActionResult } from './assets.actions';

export interface DiscoveryAuditResponse {
  status: 'MATCHED_SYNCED' | 'NEW_UNREGISTERED' | 'HARDWARE_ALTERED' | 'IP_CONFLICT';
  assetTag?: string;
  matchedAssetId?: string;
  detectedDiscrepancies: string[];
  alertDispatched: boolean;
  message: string;
}

/**
 * Validates PowerShell Hardware Discovery Agent Heartbeat
 * Invoked by /api/discovery/heartbeat endpoint
 */
export async function processDiscoveryAgentHeartbeat(
  rawPayload: unknown,
  authHeader: string | null | undefined
): Promise<ActionResult<DiscoveryAuditResponse>> {
  try {
    // 1. Verify Agent Security Token
    const expectedSecret =
      typeof process !== 'undefined'
        ? process.env.DISCOVERY_AGENT_API_SECRET || 'aclc-sec-audit-token-9b37a1e0c4'
        : 'aclc-sec-audit-token-9b37a1e0c4';

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        success: false,
        error: 'Unauthorized: Missing or invalid Bearer token in Authorization header',
      };
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (token !== expectedSecret) {
      return {
        success: false,
        error: 'Unauthorized: Invalid Discovery Agent API secret key',
      };
    }

    // 2. Validate payload structure using Zod
    const parseResult = DiscoveryAgentPayloadSchema.safeParse(rawPayload);
    if (!parseResult.success) {
      return {
        success: false,
        error: 'Invalid discovery telemetry payload format',
        validationErrors: parseResult.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const payload: DiscoveryAgentPayload = parseResult.data;
    const detectedDiscrepancies: string[] = [];

    // 3. Simulated Asset Database Cross-Reference
    // Registered profile for ACLC-MNL-LAB1-WS01:
    const registeredProfile = {
      assetTag: 'ACLC-MNL-LAB1-WS01',
      hostname: 'LAB1-WS01',
      macAddress: '00:1A:2B:3C:4D:5E',
      registeredRamGb: 16,
      registeredCpu: 'Intel(R) Core(TM) i7-12700',
      registeredIp: '192.168.10.15',
    };

    let scanStatus: 'MATCHED_SYNCED' | 'NEW_UNREGISTERED' | 'HARDWARE_ALTERED' | 'IP_CONFLICT' =
      'MATCHED_SYNCED';

    const isTargetMachine =
      payload.network.primaryMac.toUpperCase() === registeredProfile.macAddress.toUpperCase() ||
      payload.hostname.toUpperCase() === registeredProfile.hostname.toUpperCase();

    if (isTargetMachine) {
      // Check RAM discrepancy (RAM swap or module failure)
      if (payload.memory.totalPhysicalGb < registeredProfile.registeredRamGb) {
        detectedDiscrepancies.push(
          `RAM mismatch: System reports ${payload.memory.totalPhysicalGb}GB, expected ${registeredProfile.registeredRamGb}GB (Possible module removal or defect)`
        );
      }

      // Check IP conflict / altered subnet
      if (payload.network.primaryIp !== registeredProfile.registeredIp) {
        detectedDiscrepancies.push(
          `IP change: Machine reports ${payload.network.primaryIp}, registered as ${registeredProfile.registeredIp}`
        );
      }

      if (detectedDiscrepancies.length > 0) {
        scanStatus = 'HARDWARE_ALTERED';
      }
    } else {
      scanStatus = 'NEW_UNREGISTERED';
      detectedDiscrepancies.push(
        `MAC [${payload.network.primaryMac}] and Hostname [${payload.hostname}] not yet provisioned in Asset Registry`
      );
    }

    let alertDispatched = false;

    // 4. Trigger Webhook if hardware alteration or unauthorized swap detected
    if (scanStatus === 'HARDWARE_ALTERED') {
      await dispatchAlert({
        eventType: 'DISCOVERY_TAMPER_ALERT',
        severity: 'CRITICAL',
        title: `Security Alert: Hardware Alteration Detected on ${payload.hostname}`,
        summary: `Automated hardware audit detected hardware discrepancy against institutional baseline records.`,
        assetTag: registeredProfile.assetTag,
        laboratory: 'Lab 1 - Multimedia Lab',
        fields: [
          { name: 'Hostname', value: payload.hostname, inline: true },
          { name: 'Primary MAC', value: `\`${payload.network.primaryMac}\``, inline: true },
          { name: 'Detected Discrepancies', value: detectedDiscrepancies.join('\n'), inline: false },
        ],
        actionUrl: `https://aclc-manila.edu.ph/labpulse/assets/${registeredProfile.assetTag}`,
      });
      alertDispatched = true;
    }

    return {
      success: true,
      data: {
        status: scanStatus,
        assetTag: isTargetMachine ? registeredProfile.assetTag : undefined,
        matchedAssetId: isTargetMachine ? 'asset-lab1-ws01' : undefined,
        detectedDiscrepancies,
        alertDispatched,
        message:
          scanStatus === 'MATCHED_SYNCED'
            ? 'Hardware telemetry verified and synchronized with institutional database.'
            : scanStatus === 'HARDWARE_ALTERED'
            ? 'WARNING: Hardware alteration detected. Security alert dispatched.'
            : 'Unregistered asset telemetry logged for provisioning.',
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Error processing discovery telemetry',
    };
  }
}
