import { Module } from '@nestjs/common';

import { BotNotificationService } from './services/bot-notification.service';

@Module({
  providers: [BotNotificationService],
  exports: [BotNotificationService],
})
export class BotNotificationModule {}
