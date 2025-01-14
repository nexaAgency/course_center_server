import { Injectable, Logger } from '@nestjs/common';
import Bottleneck from 'bottleneck';
import { chunkArray } from 'src/common/utils/chunk-array.util';
import { BotNotificationService } from 'src/modules/bot-notification/services/bot-notification.service';
import { EventNotificationRepository } from 'src/modules/repository/services/event-notification.repository';
import { UserRepository } from 'src/modules/repository/services/user.repository';
import { User } from 'src/modules/user/entities/user.entity';
import { DeepPartial } from 'typeorm';

import { EventNotification } from '../entities/event-notification.entity';
import {
  NotificationEventType,
  NotificationStatus,
} from '../models/enums/notification-event.enums';
import { EventNotificationResponse } from '../models/interfaces/event-notification.interfaces';

@Injectable()
export class EventNotificationService {
  private readonly limiter: Bottleneck;
  private readonly logger: Logger = new Logger(EventNotificationService.name);
  private readonly limiterTime: number = 1000 / 35;

  constructor(
    private readonly eventNotificationRepository: EventNotificationRepository,
    private readonly userRepository: UserRepository,
    private readonly botNotificationiService: BotNotificationService,
  ) {
    this.limiter = new Bottleneck({
      maxConcurrent: 25,
      minTime: this.limiterTime,
    });
  }

  async limitForTelegram<T>(fn: () => Promise<T>): Promise<T> {
    return await this.limiter.schedule(fn);
  }

  async create(
    data: DeepPartial<EventNotification>,
  ): Promise<EventNotification> {
    return await this.eventNotificationRepository.save(
      this.eventNotificationRepository.create(data),
    );
  }

  async update(
    id: number,
    notificationEvent: EventNotification,
  ): Promise<void> {
    await this.eventNotificationRepository.update(id, notificationEvent);
  }

  async sendDailyNotification(notificationEvent: EventNotification) {
    const users = await this.userRepository.getBatchOfUsers(
      notificationEvent.lastNotifiedUserId,
      240,
    );

    if (notificationEvent.status === NotificationStatus.PENDING) {
      notificationEvent.status = NotificationStatus.STARTED;
    }

    if (!users.length) {
      notificationEvent.status = NotificationStatus.SENT;
      return;
    }

    const batches = chunkArray(users, 50);
    for (const batch of batches) {
      await Promise.all(
        batch.map(async (user) => {
          await this.sendNotificationToUserProccess(user, notificationEvent);
        }),
      );
    }

    const maxUserId = Math.max(...users.map((u) => u.id));
    notificationEvent.lastNotifiedUserId = maxUserId;
  }

  async sendPersonalNotification(
    notificationEvent: EventNotification,
  ): Promise<void> {
    const user = await this.userRepository.findOneBy({
      telegramId: notificationEvent.lastNotifiedUserId,
    });

    const success = await this.sendNotificationToUserProccess(
      user,
      notificationEvent,
    );

    notificationEvent.status = success
      ? NotificationStatus.SENT
      : NotificationStatus.FAILED;
  }

  async createPersonalNotification(
    userNumber: number,
    message: string,
    startedAt: Date = new Date(),
  ): Promise<void> {
    await this.create({
      message,
      startedAt,
      lastNotifiedUserId: userNumber,
      priority: 1,
      type: NotificationEventType.PERSONAL,
      status: NotificationStatus.PENDING,
    });
  }

  private async sendNotificationToUser(
    user: User,
    event: EventNotification,
  ): Promise<EventNotificationResponse> {
    return await this.limitForTelegram(async () => {
      const { success, timeToWait } =
        await this.botNotificationiService.sendEventMessage(user, event);

      if (timeToWait) {
        this.logger.warn(`Rate limit hit. Waiting for ${timeToWait} ms`);
        await new Promise((resolve) => setTimeout(resolve, timeToWait));
      }

      return { success, timeToWait };
    });
  }

  private async sendNotificationToUserAndWait(
    user: User,
    event: EventNotification,
  ) {
    const { success } = await this.sendNotificationToUser(user, event);

    return success;
  }

  private async sendNotificationToUserProccess(
    user: User,
    event: EventNotification,
  ) {
    const success = await this.sendNotificationToUserAndWait(user, event);

    if (!success) {
      return await this.sendNotificationToUserAndWait(user, event);
    }

    return success;
  }

  async handleQueue(): Promise<void> {
    const notificationEvent =
      await this.eventNotificationRepository.findFirstPendingWithPriority();
    if (!notificationEvent) return;

    if (notificationEvent.type === NotificationEventType.PERSONAL) {
      await this.sendPersonalNotification(notificationEvent);
    }

    if (notificationEvent.type === NotificationEventType.DAILY) {
      await this.sendDailyNotification(notificationEvent);
    }

    await this.update(notificationEvent.id, notificationEvent);
  }
}
