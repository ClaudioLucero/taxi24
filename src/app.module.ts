import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { typeOrmConfig } from './infrastructure/database/typeorm.config';
import { DriversController } from './infrastructure/controllers/drivers.controller';
import { DriverRepository } from './infrastructure/repositories/driver.repository';
import { ListDriversUseCase } from './application/use-cases/drivers/list-drivers.use-case';
import { ListAvailableDriversUseCase } from './application/use-cases/drivers/list-available-drivers.use-case';
import { ListNearbyDriversUseCase } from './application/use-cases/drivers/list-nearby-drivers.use-case';
import { Driver } from './domain/entities/driver.entity';
import { PassengersController } from './infrastructure/controllers/passengers.controller';
import { PassengerRepository } from './infrastructure/repositories/passenger.repository';
import { ListPassengersUseCase } from './application/use-cases/passengers/list-passengers.use-case';
import { GetPassengerUseCase } from './application/use-cases/passengers/get-passenger.use-case';
import { CreatePassengerUseCase } from './application/use-cases/passengers/create-passenger.use-case';
import { Passenger } from './domain/entities/passenger.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Driver, Passenger]),
    ThrottlerModule.forRoot([
      {
        ttl: Number(process.env.THROTTLE_TTL) || 60,
        limit: Number(process.env.THROTTLE_LIMIT) || 100,
      },
    ]),
  ],
  controllers: [DriversController, PassengersController],
  providers: [
    DriverRepository,
    ListDriversUseCase,
    ListAvailableDriversUseCase,
    ListNearbyDriversUseCase,
    PassengerRepository,
    ListPassengersUseCase,
    GetPassengerUseCase,
    CreatePassengerUseCase,
  ],
})
export class AppModule {}