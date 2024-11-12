import { INestApplication } from '@nestjs/common';
import { getBotToken } from 'nestjs-telegraf';

export function setupBot(app: INestApplication): void {
  const bot = app.get(getBotToken());
  app.use(bot.webhookCallback('/telegram'));
}
