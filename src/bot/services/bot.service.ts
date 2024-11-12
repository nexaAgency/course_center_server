import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Markup, Telegraf } from 'telegraf';

@Injectable()
export class BotService {
  constructor(
    @InjectBot() public readonly bot: Telegraf<Context>,
    private configService: ConfigService,
  ) {}

  async replyWithSticker(ctx: Context, stickerId: string) {
    await ctx.replyWithSticker(stickerId);
  }

  async replyWithCurrentVideoId(ctx: Context) {
    if ('video' in ctx.message) {
      const videoId = ctx.message.video.file_id;
      await ctx.reply(`Video ID: ${videoId}`);
    } else {
      await ctx.reply('No video found in the message.');
    }
  }

  async sendVideo(ctx: Context, videoId: string) {
    await ctx.sendVideo(videoId);
  }

  async handleStartCommand(ctx: Context) {
    // const languageCode = ctx.from?.language_code;
    await ctx.reply('hello', {
      reply_markup: {
        inline_keyboard: [
          // [Markup.button.webApp('hello', process.env.ORIGIN_MINIAPP)],
          // [Markup.button.url('hello', TelegramLinks.Channel)],
        ],
      },
    });
    // await ctx.setChatMenuButton({
    //   type: 'web_app',
    //   text: 'hello',
    //   web_app: {
    //     url: process.env.ORIGIN_MINIAPP,
    //   },
    // });
  }

  async isSubscribedToTelegram(telegramId: number, telegramChannel: string) {
    try {
      const result = await this.bot.telegram.getChatMember(
        telegramChannel,
        telegramId,
      );

      const isSubscribed = result.status !== 'left';

      return isSubscribed;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  isUserAdmin(userId: number) {
    const adminIds = this.configService
      .get<string>('ADMIN_USER_IDS')
      .split(',')
      .map(Number);

    return adminIds.includes(userId);
  }

  async sendMessageWithWebAppButton(
    telegramId: number,
    message: string,
    buttonMessage: string,
    buttonUrl: string = process.env.ORIGIN_MINIAPP,
  ) {
    await this.bot.telegram.sendMessage(telegramId, message, {
      reply_markup: {
        inline_keyboard: [[Markup.button.webApp(buttonMessage, buttonUrl)]],
      },
    });
  }

  async sendMessageWithWebAppButtonAndPhoto(
    telegramId: number,
    photoUrl: string,
    message: string,
    buttonMessage: string,
    buttonWebAppUrl: string = process.env.ORIGIN_MINIAPP,
  ) {
    await this.bot.telegram.sendPhoto(telegramId, photoUrl, {
      caption: message,
      reply_markup: {
        inline_keyboard: [[Markup.button.url(buttonMessage, buttonWebAppUrl)]],
      },
    });
  }

  public getBotInstance(): Telegraf<Context> {
    return this.bot;
  }
}
