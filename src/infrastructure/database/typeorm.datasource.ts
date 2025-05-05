import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { Driver } from '../../domain/entities/driver.entity';
import { Passenger } from '../../domain/entities/passenger.entity';
import { Trip } from '../../domain/entities/trip.entity';
import { Invoice } from '../../domain/entities/invoice.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Driver, Passenger, Trip, Invoice],
  migrations: [join(__dirname, './migrations/*.ts')],
  synchronize: false,
  logging: ['error', 'warn'],
});