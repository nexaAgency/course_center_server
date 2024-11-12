import { On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotService } from './services/bot.service';

@Update()
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Start()
  async startCommand(ctx: Context) {
    await this.botService.handleStartCommand(ctx);
  }

  @On('video')
  async onVideo(ctx: Context) {
    await this.botService.replyWithCurrentVideoId(ctx);
  }
}
