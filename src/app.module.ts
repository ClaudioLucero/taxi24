import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from './domain/entities/driver.entity';
import { Passenger } from './domain/entities/passenger.entity';
import { Trip } from './domain/entities/trip.entity';
import { Invoice } from './domain/entities/invoice.entity';
import { DriversModule } from './modules/drivers.module';
import { PassengersModule } from './modules/passengers.module';
import { TripsModule } from './modules/trips.module';
import { InvoicesModule } from './modules/invoices.module';

@Module({
  imports: [
    // Configura el módulo global para cargar variables de entorno desde el archivo .env
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables de entorno estén disponibles en toda la aplicación
      envFilePath: '.env', // Especifica la ubicación del archivo de configuración
    }),
    // Configura TypeORM para conectar con la base de datos PostgreSQL usando variables de entorno
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Permite acceso al ConfigService
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // Define el tipo de base de datos
        url: configService.get<string>('DATABASE_URL'), // Obtiene la URL de conexión desde .env
        entities: [Driver, Passenger, Trip, Invoice],
        synchronize: false, // Evita la sincronización automática para producción
        logging: ['error', 'warn'], // Registra solo errores y advertencias
      }),
      inject: [ConfigService], // Inyecta el ConfigService para acceder a las variables de entorno
    }),
    // Incluye los módulos de funcionalidades específicas de la aplicación
    DriversModule,
    PassengersModule,
    TripsModule,
    InvoicesModule,
  ],
})
export class AppModule {}
