import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export const typeOrmTestConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.TEST_DATABASE_URL,
  entities: [join(__dirname, '../../domain/entities/*.entity{.ts,.js}')],
  migrations: [join(__dirname, './migrations/*{.ts,.js}')],
  synchronize: false,
  migrationsRun: true,
  logging: ['query', 'error', 'warn'], // Habilitar query logging para depuración
};