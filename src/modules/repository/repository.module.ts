import { Global, Module } from '@nestjs/common';

import { EventNotificationRepository } from './services/event-notification.repository';
import { UserRepository } from './services/user.repository';

const repositories = [UserRepository, EventNotificationRepository];

@Global()
@Module({ providers: repositories, exports: repositories })
export class RepositoryModule {}
