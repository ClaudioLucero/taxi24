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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Driver]),
    ThrottlerModule.forRoot([
      {
        ttl: Number(process.env.THROTTLE_TTL) || 60,
        limit: Number(process.env.THROTTLE_LIMIT) || 100,
      },
    ]),
  ],
  controllers: [DriversController],
  providers: [
    DriverRepository,
    ListDriversUseCase,
    ListAvailableDriversUseCase,
    ListNearbyDriversUseCase,
  ],
})
export class AppModule {}