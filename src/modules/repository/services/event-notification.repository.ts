import { Injectable } from '@nestjs/common';
import {
  NotificationEventType,
  NotificationStatus,
} from 'src/modules/event-notification/models/enums/notification-event.enums';
import { DataSource, Repository } from 'typeorm';

import { EventNotification } from '../../event-notification/entities/event-notification.entity';

@Injectable()
export class EventNotificationRepository extends Repository<EventNotification> {
  constructor(private readonly dataSource: DataSource) {
    super(EventNotification, dataSource.manager);
  }

  async findFirstPendingWithPriority(): Promise<EventNotification> {
    return await this.createQueryBuilder('nf')
      .where('nf.status = :startedStatus', {
        startedStatus: NotificationStatus.STARTED,
      })
      .orWhere('nf.status = :pendingStatus', {
        pendingStatus: NotificationStatus.PENDING,
      })
      .andWhere('nf.started_at <= :now', { now: new Date() })
      .orderBy('nf.priority', 'DESC')
      .addOrderBy('nf.startedAt', 'ASC')
      .getOne();
  }

  async getLastNotificationWithType(
    type: NotificationEventType,
  ): Promise<EventNotification> {
    return await this.createQueryBuilder('nf')
      .where('nf.type = :type', { type })
      .orderBy('nf."createdAt"', 'DESC')
      .getOne();
  }
}
