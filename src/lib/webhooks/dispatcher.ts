import { AlertNotificationRequest, DispatchResult } from './types';
import { sendDiscordWebhook, buildDiscordEmbedPayload } from './discord';
import { sendTelegramAlert, buildTelegramMessagePayload } from './telegram';

export async function dispatchAlert(
  alert: AlertNotificationRequest
): Promise<DispatchResult> {
  const result: DispatchResult = {
    discordSuccess: false,
    telegramSuccess: false,
    errors: [],
  };

  const discordUrl =
    typeof process !== 'undefined'
      ? process.env.DISCORD_MAINTENANCE_WEBHOOK_URL ||
        process.env.DISCORD_SECURITY_WEBHOOK_URL
      : undefined;

  const telegramToken =
    typeof process !== 'undefined' ? process.env.TELEGRAM_BOT_TOKEN : undefined;
  const telegramChatId =
    typeof process !== 'undefined' ? process.env.TELEGRAM_CHAT_ID : undefined;

  // 1. Dispatch to Discord if configured
  if (discordUrl && !discordUrl.includes('abcdefghijklmnopqrstuvwxyz')) {
    const discordRes = await sendDiscordWebhook(discordUrl, alert);
    result.discordSuccess = discordRes.success;
    result.discordStatusCode = discordRes.statusCode;
    if (discordRes.error) {
      result.errors.push(discordRes.error);
    }
  } else {
    // Development fallback simulation mode
    result.discordSuccess = true;
    result.discordStatusCode = 204;
    result.simulated = true;
  }

  // 2. Dispatch to Telegram if configured
  if (
    telegramToken &&
    telegramChatId &&
    !telegramToken.includes('example_token')
  ) {
    const telegramRes = await sendTelegramAlert(
      telegramToken,
      telegramChatId,
      alert
    );
    result.telegramSuccess = telegramRes.success;
    result.telegramStatusCode = telegramRes.statusCode;
    if (telegramRes.error) {
      result.errors.push(telegramRes.error);
    }
  } else {
    // Development fallback simulation mode
    result.telegramSuccess = true;
    result.telegramStatusCode = 200;
    result.simulated = true;
  }

  return result;
}

export { buildDiscordEmbedPayload, buildTelegramMessagePayload };
