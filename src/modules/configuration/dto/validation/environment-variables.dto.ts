import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EnvironmentVariablesDto {
  @IsNumber()
  PORT: number;

  @IsString()
  @IsOptional()
  HOST?: string;

  @IsString()
  SWAGGER_PASSWORD: string;

  @IsString()
  NODE_ENV: string;

  @IsNumber()
  DATABASE_PORT: number;

  @IsString()
  DATABASE_HOST: string;

  @IsString()
  DATABASE_USER: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_DB: string;

  @IsString()
  BOT_TOKEN: string;

  @IsString()
  WEB_APP_URL: string;

  @IsString()
  WEBHOOK_DOMAIN: string;

  @IsString()
  SECRET_TOKEN: string;

  @IsString()
  TWITTER_1_API_BEARER_TOKEN: string;

  @IsString()
  TWITTER_2_API_BEARER_TOKEN: string;
}
