// src/infrastructure/database/typeorm.test.datasource.ts
import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppTestDataSource = new DataSource({
  type: 'postgres',
  url: process.env.TEST_DATABASE_URL,
  entities: [join(__dirname, '../../domain/entities/*.entity{.ts,.js}')],
  migrations: [join(__dirname, './migrations/*.ts')],
  synchronize: false,
  migrationsRun: true,
  logging: ['error', 'warn'],
});
