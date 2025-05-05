import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from '../domain/entities/driver.entity';
import { DriversController } from '../infrastructure/controllers/drivers.controller';
import { DriverRepository } from '../infrastructure/repositories/driver.repository';
import { ListDriversUseCase } from '../application/use-cases/drivers/list-drivers.use-case';
import { ListAvailableDriversUseCase } from '../application/use-cases/drivers/list-available-drivers.use-case';
import { ListNearbyDriversUseCase } from '../application/use-cases/drivers/list-nearby-drivers.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Driver])],
  controllers: [DriversController],
  providers: [
    DriverRepository,
    ListDriversUseCase,
    ListAvailableDriversUseCase,
    ListNearbyDriversUseCase,
  ],
  exports: [DriverRepository, ListNearbyDriversUseCase], // Añadir ListNearbyDriversUseCase
})
export class DriversModule {}