import * as path from 'node:path';
import * as process from 'node:process';

import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ENVIRONMENTS } from 'src/common/enums/app.enums';
import { DatabaseConfig } from 'src/config/configs.types';
import { configuration } from 'src/config/configuration';

@Injectable()
export class DatabaseConnectService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const commonConfig = this.getCommonConfig(configuration.database);

    const strategies = {
      [ENVIRONMENTS.PRODUCTION]: () => this.getProductionConfig(commonConfig),
      [ENVIRONMENTS.DEVELOPMENT]: () => this.getDevelopmentConfig(commonConfig),
      [ENVIRONMENTS.LOCAL]: () => this.getLocalConfig(commonConfig),
    };

    const getConfig =
      strategies[configuration.app.environment] ||
      strategies[ENVIRONMENTS.LOCAL];
    return getConfig();
  }

  private getCommonConfig(dbConfig: DatabaseConfig): TypeOrmModuleOptions {
    return {
      type: 'postgres' as const,
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      entities: [
        path.join(
          process.cwd(),
          'dist',
          'src',
          'modules',
          '**',
          'entities',
          '*.entity.js',
        ),
      ],
      migrations: [
        path.join(
          process.cwd(),
          'dist',
          'src',
          'database',
          'migrations',
          '*.js',
        ),
      ],
      parseInt8: true,
    };
  }

  private getProductionConfig(
    commonConfig: TypeOrmModuleOptions,
  ): TypeOrmModuleOptions {
    return {
      ...commonConfig,
      ssl: true,
      extra: { ssl: { rejectUnauthorized: false } },
      synchronize: false,
      migrationsRun: true,
      logging: false,
    };
  }

  private getDevelopmentConfig(
    commonConfig: TypeOrmModuleOptions,
  ): TypeOrmModuleOptions {
    return {
      ...commonConfig,
      ssl: true,
      extra: { ssl: { rejectUnauthorized: false } },
      synchronize: false,
      migrationsRun: true,
    };
  }

  private getLocalConfig(
    commonConfig: TypeOrmModuleOptions,
  ): TypeOrmModuleOptions {
    return {
      ...commonConfig,
      synchronize: false,
      migrationsRun: false,
    };
  }
}
