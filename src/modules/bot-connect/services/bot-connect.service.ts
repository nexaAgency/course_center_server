import { Injectable } from '@nestjs/common';
import { TelegrafModuleOptions, TelegrafOptionsFactory } from 'nestjs-telegraf';
import { configuration } from 'src/config/configuration';
import { session } from 'telegraf';

@Injectable()
export class BotConnectService implements TelegrafOptionsFactory {
  createTelegrafOptions(): TelegrafModuleOptions {
    const { telegram } = configuration;

    return {
      token: telegram.token,
      middlewares: [session()],
      launchOptions: {
        webhook: {
          domain: telegram.domain,
          secretToken: telegram.secretToken,
          path: '/telegram',
        },
      },
    };
  }
}
