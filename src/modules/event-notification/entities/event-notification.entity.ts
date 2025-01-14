import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import {
  NotificationEventType,
  NotificationStatus,
} from '../models/enums/notification-event.enums';

@Entity('event_notifications')
export class EventNotification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: 1 })
  priority: number;

  @Column()
  type: NotificationEventType;

  @Column()
  status: NotificationStatus;

  @Column({ name: 'last_notified_user_id' })
  lastNotifiedUserId: number;

  @Column()
  message: string;

  @Column({ nullable: true, type: 'timestamptz', name: 'started_at' })
  startedAt: Date;

  @Column({ nullable: true, name: 'button_text' })
  buttonText: string;

  @Column({ nullable: true, name: 'button_url' })
  buttonUrl: string;
}
