export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'WARNING' | 'INFO';

export type AlertEventType =
  | 'CRITICAL_INCIDENT'
  | 'LOW_STOCK_THRESHOLD'
  | 'EQUIPMENT_OVERDUE'
  | 'DISCOVERY_TAMPER_ALERT'
  | 'GATE_PASS_SECURITY'
  | 'PREVENTIVE_MAINTENANCE_DUE';

export interface AlertField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface AlertNotificationRequest {
  eventType: AlertEventType;
  severity: AlertSeverity;
  title: string;
  summary: string;
  laboratory?: string;
  assetTag?: string;
  ticketNumber?: string;
  fields: AlertField[];
  actionUrl?: string;
  triggeredBy?: string;
  timestamp?: string;
}

export interface DispatchResult {
  discordSuccess: boolean;
  discordStatusCode?: number;
  telegramSuccess: boolean;
  telegramStatusCode?: number;
  errors: string[];
  simulated?: boolean;
}
