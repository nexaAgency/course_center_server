import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { EventNotification } from 'src/modules/event-notification/entities/event-notification.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class BotNotificationService {
  constructor(@InjectBot() public readonly bot: Telegraf<Context>) {}

  async sendEventMessage(user: User, event: EventNotification) {
    try {
      await this.bot.telegram.sendMessage(user.telegramId, event.message, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: event.buttonText,
                url: event.buttonUrl,
              },
            ],
          ],
        },
        parse_mode: 'HTML',
      });
      return { success: true };
    } catch (error) {
      if (
        error?.response?.error_code === 429 &&
        error.response?.parameters?.retry_after
      ) {
        const timeToWait = (error.response.parameters.retry_after || 0) * 1000;
        return { success: false, timeToWait };
      }
      return { success: false };
    }
  }
}
