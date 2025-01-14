import { AppConfig } from '../configs.types';

export const appConfig: AppConfig = {
  port: parseInt(process.env.PORT) || 3000,
  host: process.env.HOST || '0.0.0.0',
  swaggerPassword: process.env.SWAGGER_PASSWORD || 'password',
  environment: process.env.NODE_ENV || 'local',
  webAppUrl: process.env.WEB_APP_URL,
};
