// Configura la conexión a la base de datos PostgreSQL usando TypeORM, definiendo parámetros como la URL, entidades, migraciones y opciones de logging.
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Define las opciones de configuración para TypeORM
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  // Ruta a las entidades que representan las tablas de la base de datos
  entities: [join(__dirname, '../../domain/entities/*.entity{.ts,.js}')],
  // Ruta a las migraciones para gestionar cambios en el esquema de la base de datos
  migrations: [join(__dirname, './migrations/*{.ts,.js}')],
  // Desactiva la sincronización automática para evitar modificaciones no controladas
  synchronize: false,
  // Desactiva la ejecución automática de migraciones al iniciar la aplicación
  migrationsRun: false,
  // Registra solo errores y advertencias en los logs
  logging: ['error', 'warn'],
};
