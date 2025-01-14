export type Config = {
  app: AppConfig;
  database: DatabaseConfig;
  telegram: TelegramConfig;
};

export type AppConfig = {
  port: number;
  host: string;
  environment: string;
  swaggerPassword: string;
  webAppUrl: string;
};

export type DatabaseConfig = {
  port: number;
  host: string;
  user: string;
  password: string;
  database: string;
};

export type TelegramConfig = {
  domain: string;
  secretToken: string;
  token: string;
  url: string;
  adminIds: string;
};
