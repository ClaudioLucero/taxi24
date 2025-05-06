import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from '../domain/entities/trip.entity';
import { TripsController } from '../infrastructure/controllers/trips.controller';
import { TripRepository } from '../infrastructure/repositories/trip.repository';
import { CreateTripUseCase } from '../application/use-cases/trips/create-trip.use-case';
import { CompleteTripUseCase } from '../application/use-cases/trips/complete-trip.use-case';
import { GetTripUseCase } from '../application/use-cases/trips/get-trip.use-case';
import { ListTripsUseCase } from '../application/use-cases/trips/list-trips.use-case';
import { GetTripInvoiceUseCase } from '../application/use-cases/invoices/get-trip-invoice.use-case';
import { DriversModule } from './drivers.module';
import { PassengersModule } from './passengers.module';
import { InvoicesModule } from './invoices.module';

// Módulo para gestionar viajes, integrando funcionalidades de creación, finalización, consulta y relación con facturas, conductores y pasajeros.
@Module({
  // Configura las dependencias necesarias para el módulo
  imports: [
    // Habilita el uso de la entidad Trip con TypeORM para operaciones en la base de datos
    TypeOrmModule.forFeature([Trip]),
    // Incluye módulos relacionados para conductores, pasajeros y facturas
    DriversModule,
    PassengersModule,
    // Usa forwardRef para manejar la dependencia circular con InvoicesModule
    forwardRef(() => InvoicesModule),
  ],
  // Define el controlador para manejar solicitudes HTTP de viajes
  controllers: [TripsController],
  // Registra los servicios para la lógica de negocio y acceso a datos
  providers: [
    // Maneja operaciones de base de datos para viajes
    TripRepository,
    // Lógica para crear, completar, obtener y listar viajes, y obtener facturas de viajes
    CreateTripUseCase,
    CompleteTripUseCase,
    GetTripUseCase,
    ListTripsUseCase,
    GetTripInvoiceUseCase,
  ],
  // Comparte el repositorio y el caso de uso de facturas con otros módulos
  exports: [TripRepository, GetTripInvoiceUseCase],
})
// Clase que representa el módulo de viajes
export class TripsModule {}
