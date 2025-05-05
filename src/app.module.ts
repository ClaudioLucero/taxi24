import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Driver } from './domain/entities/driver.entity';
import { Passenger } from './domain/entities/passenger.entity';
import { Trip } from './domain/entities/trip.entity';
import { Invoice } from './domain/entities/invoice.entity';
import { DriversController } from './infrastructure/controllers/drivers.controller';
import { PassengersController } from './infrastructure/controllers/passengers.controller';
import { TripsController } from './infrastructure/controllers/trips.controller';
import { InvoicesController } from './infrastructure/controllers/invoices.controller';
import { DriverRepository } from './infrastructure/repositories/driver.repository';
import { PassengerRepository } from './infrastructure/repositories/passenger.repository';
import { TripRepository } from './infrastructure/repositories/trip.repository';
import { InvoiceRepository } from './infrastructure/repositories/invoice.repository';
import { ListDriversUseCase } from './application/use-cases/drivers/list-drivers.use-case';
import { ListAvailableDriversUseCase } from './application/use-cases/drivers/list-available-drivers.use-case';
import { ListNearbyDriversUseCase } from './application/use-cases/drivers/list-nearby-drivers.use-case';
import { ListPassengersUseCase } from './application/use-cases/passengers/list-passengers.use-case';
import { GetPassengerUseCase } from './application/use-cases/passengers/get-passenger.use-case';
import { CreatePassengerUseCase } from './application/use-cases/passengers/create-passenger.use-case';
import { ListPassengerNearbyDriversUseCase } from './application/use-cases/passengers/list-passenger-nearby-drivers.use-case';
import { CreateTripUseCase } from './application/use-cases/trips/create-trip.use-case';
import { CompleteTripUseCase } from './application/use-cases/trips/complete-trip.use-case';
import { GetTripUseCase } from './application/use-cases/trips/get-trip.use-case';
import { ListTripsUseCase } from './application/use-cases/trips/list-trips.use-case';
import { CreateInvoiceUseCase } from './application/use-cases/invoices/create-invoice.use-case';
import { GetTripInvoiceUseCase } from './application/use-cases/invoices/get-trip-invoice.use-case';
import { ListInvoicesUseCase } from './application/use-cases/invoices/list-invoices.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Driver, Passenger, Trip, Invoice],
      synchronize: false,
      logging: ['error', 'warn'],
    }),
    TypeOrmModule.forFeature([Driver, Passenger, Trip, Invoice]),
  ],
  controllers: [
    DriversController,
    PassengersController,
    TripsController,
    InvoicesController,
  ],
  providers: [
    DriverRepository,
    PassengerRepository,
    TripRepository,
    InvoiceRepository,
    ListDriversUseCase,
    ListAvailableDriversUseCase,
    ListNearbyDriversUseCase,
    ListPassengersUseCase,
    GetPassengerUseCase,
    CreatePassengerUseCase,
    ListPassengerNearbyDriversUseCase,
    CreateTripUseCase,
    CompleteTripUseCase,
    GetTripUseCase,
    ListTripsUseCase,
    CreateInvoiceUseCase,
    GetTripInvoiceUseCase,
    ListInvoicesUseCase,
  ],
})
export class AppModule {}