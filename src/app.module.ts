import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from 'src/common/filters/global-exception.filter';

import { InitDataMiddleware } from './modules/auth/middlewares/init-data.middleware';
import { BotModule } from './modules/bot/bot.module';
import { BotConnectModule } from './modules/bot-connect/bot-connect.module';
import { BotNotificationModule } from './modules/bot-notification/bot-notification.module';
import { CronModule } from './modules/cron/cron.module';
import { DatabaseModule } from './modules/database/database.module';
import { EventNotificationModule } from './modules/event-notification/event-notification.module';
import { RepositoryModule } from './modules/repository/repository.module';
import { UserExistMiddleware } from './modules/user/middlewares/user-exist.middleware';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    DatabaseModule,
    BotConnectModule,
    BotModule,
    BotNotificationModule,
    UserModule,
    RepositoryModule,
    CronModule,
    EventNotificationModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InitDataMiddleware).exclude('/telegram').forRoutes('*');

    consumer
      .apply(UserExistMiddleware)
      .exclude('/telegram', '/users/join')
      .forRoutes('*');
  }
}
