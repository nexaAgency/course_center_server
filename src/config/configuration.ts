import { Config } from './configs.types';
import { appConfig } from './configs/app.config';
import { dbConfig } from './configs/db.config';
import { telegramConfig } from './configs/telegram.config';

export const configuration: Config = {
  app: appConfig,
  database: dbConfig,
  telegram: telegramConfig,
};
