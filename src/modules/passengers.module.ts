import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Passenger } from '../domain/entities/passenger.entity';
import { PassengersController } from '../infrastructure/controllers/passengers.controller';
import { PassengerRepository } from '../infrastructure/repositories/passenger.repository';
import { ListPassengersUseCase } from '../application/use-cases/passengers/list-passengers.use-case';
import { GetPassengerUseCase } from '../application/use-cases/passengers/get-passenger.use-case';
import { CreatePassengerUseCase } from '../application/use-cases/passengers/create-passenger.use-case';
import { ListPassengerNearbyDriversUseCase } from '../application/use-cases/passengers/list-passenger-nearby-drivers.use-case';
import { DriversModule } from './drivers.module';

// Módulo para gestionar pasajeros, organizando controladores, repositorios y casos de uso relacionados con operaciones como crear, listar o buscar conductores cercanos.
@Module({
  // Configura las dependencias del módulo
  imports: [
    // Habilita el uso de la entidad Passenger con TypeORM para operaciones en la base de datos
    TypeOrmModule.forFeature([Passenger]),
    // Incluye DriversModule para funcionalidades relacionadas con conductores
    DriversModule,
  ],
  // Define el controlador para manejar solicitudes HTTP de pasajeros
  controllers: [PassengersController],
  // Registra los servicios para la lógica de negocio y acceso a datos
  providers: [
    // Maneja operaciones de base de datos para pasajeros
    PassengerRepository,
    // Lógica para listar, obtener, crear pasajeros y buscar conductores cercanos
    ListPassengersUseCase,
    GetPassengerUseCase,
    CreatePassengerUseCase,
    ListPassengerNearbyDriversUseCase,
  ],
  // Comparte el repositorio con otros módulos
  exports: [PassengerRepository],
})
// Clase que representa el módulo de pasajeros
export class PassengersModule {}
