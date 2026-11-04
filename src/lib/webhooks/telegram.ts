import { AlertNotificationRequest, AlertSeverity } from './types';

function escapeMarkdownV2(text: string): string {
  // Telegram MarkdownV2 requires escaping: _ * [ ] ( ) ~ ` > # + - = | { } . !
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
}

const SEVERITY_EMOJIS: Record<AlertSeverity, string> = {
  CRITICAL: '🔴',
  HIGH: '🟠',
  WARNING: '🟡',
  INFO: '🔵',
};

export function buildTelegramMessagePayload(
  chatId: string,
  alert: AlertNotificationRequest
) {
  const emoji = SEVERITY_EMOJIS[alert.severity] || '📢';
  const header = `*${emoji} ACLC LabPulse Alert: ${escapeMarkdownV2(alert.title)}*`;
  const severityTag = `Severity: \`${alert.severity}\``;
  const summary = escapeMarkdownV2(alert.summary);

  const metaLines: string[] = [];
  if (alert.laboratory) {
    metaLines.push(`📍 *Laboratory:* ${escapeMarkdownV2(alert.laboratory)}`);
  }
  if (alert.assetTag) {
    metaLines.push(`💻 *Asset Tag:* \`${escapeMarkdownV2(alert.assetTag)}\``);
  }
  if (alert.ticketNumber) {
    metaLines.push(`🎫 *Ticket:* \`${escapeMarkdownV2(alert.ticketNumber)}\``);
  }

  const customFieldLines = alert.fields.map(
    (f) => `▫️ *${escapeMarkdownV2(f.name)}:* ${escapeMarkdownV2(f.value)}`
  );

  const footer = `\n_ACLC College of Manila • IT Custodian & Tech Sentinel_`;

  const text = [
    header,
    severityTag,
    '',
    summary,
    '',
    ...metaLines,
    ...customFieldLines,
    footer,
  ].join('\n');

  return {
    chat_id: chatId,
    text: text,
    parse_mode: 'MarkdownV2',
    disable_web_page_preview: false,
  };
}

export async function sendTelegramAlert(
  botToken: string,
  chatId: string,
  alert: AlertNotificationRequest
): Promise<{ success: boolean; statusCode?: number; error?: string }> {
  try {
    const payload = buildTelegramMessagePayload(chatId, alert);
    const endpoint = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.ok) {
      return {
        success: false,
        statusCode: response.status,
        error: `Telegram error (${response.status}): ${data?.description || 'Unknown error'}`,
      };
    }

    return { success: true, statusCode: 200 };
  } catch (err: any) {
    return {
      success: false,
      error: `Telegram network error: ${err?.message || String(err)}`,
    };
  }
}
