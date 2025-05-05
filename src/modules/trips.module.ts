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

@Module({
  imports: [
    TypeOrmModule.forFeature([Trip]),
    DriversModule,
    PassengersModule,
    forwardRef(() => InvoicesModule),
  ],
  controllers: [TripsController],
  providers: [
    TripRepository,
    CreateTripUseCase,
    CompleteTripUseCase,
    GetTripUseCase,
    ListTripsUseCase,
    GetTripInvoiceUseCase,
  ],
  exports: [TripRepository, GetTripInvoiceUseCase], // Añadir GetTripInvoiceUseCase
})
export class TripsModule {}