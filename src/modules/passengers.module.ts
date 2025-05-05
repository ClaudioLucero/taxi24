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

@Module({
  imports: [TypeOrmModule.forFeature([Passenger]), DriversModule],
  controllers: [PassengersController],
  providers: [
    PassengerRepository,
    ListPassengersUseCase,
    GetPassengerUseCase,
    CreatePassengerUseCase,
    ListPassengerNearbyDriversUseCase,
  ],
  exports: [PassengerRepository],
})
export class PassengersModule {}