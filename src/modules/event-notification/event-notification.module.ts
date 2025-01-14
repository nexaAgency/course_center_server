import { Module } from '@nestjs/common';

import { BotNotificationModule } from '../bot-notification/bot-notification.module';
import { EventNotificationService } from './services/event-notification.service';

@Module({
  imports: [BotNotificationModule],
  providers: [EventNotificationService],
  exports: [EventNotificationService],
})
export class EventNotificationModule {}
