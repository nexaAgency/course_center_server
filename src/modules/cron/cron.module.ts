import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { EventNotificationModule } from '../event-notification/event-notification.module';
import { EventNotificationCronService } from './services/event-notification-cron.service';

@Module({
  imports: [ScheduleModule.forRoot(), EventNotificationModule],
  providers: [EventNotificationCronService],
})
export class CronModule {}
