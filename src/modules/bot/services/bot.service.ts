import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { appConfig } from 'src/config/configs/app.config';
import { Context, Telegraf } from 'telegraf';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';

import { configuration } from '../../../config/configuration';

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);

  constructor(@InjectBot() public readonly bot: Telegraf<Context>) {}

  async handleStartCommand(ctx: Context): Promise<void> {
    await ctx.reply('Hello');

    await ctx.setChatMenuButton({
      type: 'web_app',
      text: `Open app 🚀`,
      web_app: {
        url: appConfig.webAppUrl,
      },
    });
  }

  async updateMenu(
    ctx: Context,
    message: string,
    buttons: InlineKeyboardButton[][],
  ): Promise<void> {
    const method =
      ctx.updateType === 'callback_query' ? 'editMessageText' : 'reply';

    try {
      await ctx[method](message, {
        reply_markup: { inline_keyboard: buttons },
      });
    } catch (error) {
      this.logger.error('Failed to update menu', error);
    }
  }

  isUserAdmin(userId: number): boolean {
    const adminIds = configuration.telegram.adminIds;
    if (!adminIds) return false;

    return adminIds.split(',').map(Number).includes(userId);
  }

  public async deleteMessage(ctx: Context, messageId: number): Promise<void> {
    try {
      await ctx.deleteMessage(messageId);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
