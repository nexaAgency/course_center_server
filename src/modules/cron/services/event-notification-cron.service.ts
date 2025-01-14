import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';

import { EventNotificationService } from '../../event-notification/services/event-notification.service';

@Injectable()
export class EventNotificationCronService {
  private readonly logger = new Logger(EventNotificationCronService.name);
  constructor(
    private readonly eventNotificationService: EventNotificationService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  private isNotificationsSending = false;

  @Cron(CronExpression.EVERY_10_SECONDS, { name: 'sendNotifications' })
  private async sendNotifications() {
    try {
      if (!this.isNotificationsSending) {
        this.isNotificationsSending = true;
        await this.eventNotificationService.handleQueue();
        this.isNotificationsSending = false;
      }
    } catch (error) {
      this.logger.error(error);
      this.isNotificationsSending = false;
    }
  }
}
