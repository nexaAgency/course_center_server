import { Injectable } from '@nestjs/common';
import { TelegrafModuleOptions, TelegrafOptionsFactory } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import { session } from 'telegraf';

@Injectable()
export class BotConnectService implements TelegrafOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTelegrafOptions(): TelegrafModuleOptions {
    return {
      token: this.configService.get<string>('TELEGRAM_BOT_TOKEN'),
      middlewares: [session()],
      launchOptions: {
        webhook: {
          domain: this.configService.get<string>('TELEGRAM_WEBHOOK_URL'),
          secretToken: this.configService.get<string>('TELEGRAM_SECRET_TOKEN'),
          path: '/telegram',
        },
      },
    };
  }
}
