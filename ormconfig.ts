import databaseConfig from './src/database/database.config';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const config = databaseConfig();

export default new DataSource(config);
