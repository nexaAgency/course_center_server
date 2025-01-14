import { UseFilters } from '@nestjs/common';
import { Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

import { TelegramBotExceptionFilter } from './filters/telegram-bot-exception.filter';
import { BotService } from './services/bot.service';

@UseFilters(TelegramBotExceptionFilter)
@Update()
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Start()
  async startCommand(ctx: Context) {
    await this.botService.handleStartCommand(ctx);
  }
}
