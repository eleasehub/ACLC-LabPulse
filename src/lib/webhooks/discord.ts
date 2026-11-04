import { AlertNotificationRequest, AlertSeverity } from './types';

// Institutional Discord embed color hex values
const SEVERITY_COLORS: Record<AlertSeverity, number> = {
  CRITICAL: 0xef4444, // Red
  HIGH: 0xf97316,     // Orange
  WARNING: 0xeab308,  // Amber
  INFO: 0x06b6d4,     // Cyan / Blue
};

export function buildDiscordEmbedPayload(alert: AlertNotificationRequest) {
  const color = SEVERITY_COLORS[alert.severity] || 0x06b6d4;
  const isoTime = alert.timestamp || new Date().toISOString();

  return {
    username: 'ACLC LabPulse Sentinel',
    avatar_url: 'https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield-alert.png',
    embeds: [
      {
        title: `🚨 [${alert.severity}] ${alert.title}`,
        description: alert.summary,
        color: color,
        fields: [
          ...(alert.laboratory
            ? [{ name: '🏫 Laboratory', value: alert.laboratory, inline: true }]
            : []),
          ...(alert.assetTag
            ? [{ name: '💻 Asset Tag', value: `\`${alert.assetTag}\``, inline: true }]
            : []),
          ...(alert.ticketNumber
            ? [{ name: '🎫 Ticket ID', value: `\`${alert.ticketNumber}\``, inline: true }]
            : []),
          ...alert.fields.map((f) => ({
            name: f.name,
            value: f.value,
            inline: f.inline ?? true,
          })),
        ],
        footer: {
          text: 'ACLC College of Manila • IT Department Laboratory Monitoring',
          icon_url: 'https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/cpu.png',
        },
        timestamp: isoTime,
        url: alert.actionUrl || undefined,
      },
    ],
  };
}

export async function sendDiscordWebhook(
  webhookUrl: string,
  alert: AlertNotificationRequest
): Promise<{ success: boolean; statusCode?: number; error?: string }> {
  try {
    const payload = buildDiscordEmbedPayload(alert);
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        success: false,
        statusCode: response.status,
        error: `Discord webhook rejected (${response.status}): ${errText}`,
      };
    }

    return { success: true, statusCode: response.status };
  } catch (err: any) {
    return {
      success: false,
      error: `Discord network transport failure: ${err?.message || String(err)}`,
    };
  }
}
