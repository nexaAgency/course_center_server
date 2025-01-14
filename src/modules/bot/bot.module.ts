import { Module } from '@nestjs/common';

import { BotController } from './bot.controller';
import { BotService } from './services/bot.service';

@Module({
  providers: [BotService, BotController],
  exports: [BotService],
})
export class BotModule {}
