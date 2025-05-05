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
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [Driver, Passenger, Trip, Invoice],
        synchronize: false,
        logging: ['error', 'warn'],
      }),
      inject: [ConfigService],
    }),
    DriversModule,
    PassengersModule,
    TripsModule,
    InvoicesModule,
  ],
})
export class AppModule {}