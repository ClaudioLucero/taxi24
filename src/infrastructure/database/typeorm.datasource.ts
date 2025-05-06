// Configura la conexión a la base de datos PostgreSQL usando TypeORM, definiendo entidades y migraciones para la aplicación.
import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { Driver } from '../../domain/entities/driver.entity';
import { Passenger } from '../../domain/entities/passenger.entity';
import { Trip } from '../../domain/entities/trip.entity';
import { Invoice } from '../../domain/entities/invoice.entity';

// Carga las variables de entorno desde un archivo .env
dotenv.config();

// Define la fuente de datos para la conexión a la base de datos
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  // Lista de entidades que representan las tablas en la base de datos
  entities: [Driver, Passenger, Trip, Invoice],
  // Directorio donde se encuentran los archivos de migraciones
  migrations: [join(__dirname, './migrations/*.ts')],
  // Desactiva la sincronización automática para evitar cambios directos en el esquema
  synchronize: false,
  // Configura el registro de logs solo para errores y advertencias
  logging: ['error', 'warn'],
});
