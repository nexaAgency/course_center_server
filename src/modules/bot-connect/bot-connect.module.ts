import { Global, Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';

import { BotConnectService } from './services/bot-connect.service';

@Global()
@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useClass: BotConnectService,
    }),
  ],
  providers: [BotConnectService],
  exports: [BotConnectService],
})
export class BotConnectModule {}
