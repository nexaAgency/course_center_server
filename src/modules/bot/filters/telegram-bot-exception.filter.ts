import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Scenes, TelegramError } from 'telegraf';

@Catch()
export class TelegramBotExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(TelegramBotExceptionFilter.name);

  constructor() {}

  async catch(exception: TelegramError, host: ArgumentsHost) {
    const ctx = host.getArgByIndex<Scenes.WizardContext>(0);

    await ctx.reply(exception.message || 'Something went wrong...');

    if (ctx.scene) await ctx.scene.leave();

    this.logger.error(exception.message);
  }
}
