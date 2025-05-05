import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

export const typeOrmTestConfig: TypeOrmModuleOptions & DataSourceOptions = {
  type: 'postgres', // Especificar explícitamente el tipo como 'postgres'
  url: process.env.TEST_DATABASE_URL!,
  entities: [join(__dirname, '../../domain/entities/*.entity{.ts,.js}')],
  migrations: [join(__dirname, './migrations/*{.ts,.js}')],
  synchronize: false,
  migrationsRun: true,
  logging: ['error', 'warn'],
};

export const AppTestDataSource = new DataSource(typeOrmTestConfig);