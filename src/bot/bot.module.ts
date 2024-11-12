import { Global, Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotController } from './bot.controller';
import { BotConnectService } from './services/bot-connect.service';
import { BotService } from './services/bot.service';

@Global()
@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useClass: BotConnectService,
    }),
  ],
  providers: [BotService, BotConnectService, BotController],
  exports: [BotService],
})
export class BotModule {}
