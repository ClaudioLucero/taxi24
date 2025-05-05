import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm/data-source/DataSource';

dotenv.config();

export const AppTestDataSource = new DataSource({
  type: 'postgres',
  url: process.env.TEST_DATABASE_URL,
  entities: [join(__dirname, '../../domain/entities/*.entity{.ts,.js}')],
  migrations: [join(__dirname, './migrations/*{.ts,.js}')],
  synchronize: false,
  migrationsRun: true,
  logging: ['error', 'warn'],
});