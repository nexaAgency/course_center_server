import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { BotModule } from './bot/bot.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './database/database.config';

@Module({
  imports: [
    DatabaseModule,
    BotModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
  ],
})
export class AppModule {}
