import { registerAs } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default registerAs('database', () => {
  let config: PostgresConnectionOptions;
  const environment = process.env.NODE_ENV || 'production';

  if (environment === 'production') {
    config = {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      synchronize: false,
      ssl: true,
      extra: {
        max: 35, // depends on heroku
        connectionTimeoutMillis: 10000,
        ssl: { rejectUnauthorized: false },
      },
      logging: false,
      parseInt8: true,
    };
  }

  if (environment === 'development') {
    config = {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      synchronize: false,
      ssl: true,
      extra: {
        max: 1,
        connectionTimeoutMillis: 10000,
        ssl: { rejectUnauthorized: false },
      },
      logging: true,
      parseInt8: true,
    };
  }

  if (environment === 'local') {
    config = {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      synchronize: false,
      ssl: false,
      extra: {
        max: 1,
        connectionTimeoutMillis: 10000,
      },
      logging: true,
      parseInt8: true,
    };
  }

  return config;
});
