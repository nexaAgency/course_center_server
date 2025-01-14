import * as path from 'node:path';

import { configuration } from 'src/config/configuration';
import { DataSource } from 'typeorm';

const { database } = configuration;

export default new DataSource({
  type: 'postgres',
  host: database.host,
  port: database.port,
  username: database.user,
  password: database.password,
  database: database.database,
  entities: [
    path.join(process.cwd(), 'src', 'modules', '**', 'entities', '*.entity.ts'),
  ],
  migrations: [
    path.join(process.cwd(), 'src', 'database', 'migrations', '*.ts'),
  ],
  synchronize: false,
});
