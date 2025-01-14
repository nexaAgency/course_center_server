import { TelegramConfig } from '../configs.types';

export const telegramConfig: TelegramConfig = {
  secretToken: process.env.SECRET_TOKEN,
  domain: process.env.WEBHOOK_DOMAIN,
  token: process.env.BOT_TOKEN,
  url: process.env.TELEGRAM_BOT_URL,
  adminIds: process.env.ADMIN_IDS,
};
