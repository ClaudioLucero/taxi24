// src/infrastructure/repositories/trip.repository.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from '../../domain/entities/trip.entity';
import {
  CreateTripDto,
  CompleteTripDto,
  ListTripsQueryDto,
} from '../dtos/trip.dto';
import { DriverRepository } from './driver.repository';
import { PassengerRepository } from './passenger.repository';
import { DriverStatus } from '../../domain/entities/enums/driver-status.enum';

// Repositorio para gestionar operaciones de base de datos relacionadas con viajes, como crear, listar, buscar por ID y completar viajes, asegurando la disponibilidad de conductores y pasajeros.
@Injectable()
export class TripRepository {
  constructor(
    @InjectRepository(Trip)
    private readonly repository: Repository<Trip>,
    private readonly driverRepository: DriverRepository,
    private readonly passengerRepository: PassengerRepository
  ) {}

  async findAll(
    query: ListTripsQueryDto
  ): Promise<{ items: Trip[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
    const { page = 1, limit = 100 } = query;
    const queryBuilder = this.repository
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.driver', 'driver')
      .leftJoinAndSelect('trip.passenger', 'passenger')
      .orderBy('trip.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .cache(false);

    const [items, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findById(id: string): Promise<Trip | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['driver', 'passenger'],
    });
  }

  async create(dto: CreateTripDto): Promise<Trip> {
    const passenger = await this.passengerRepository.findById(dto.passenger_id);
    if (!passenger) {
      throw new NotFoundException(
        `Passenger with ID ${dto.passenger_id} not found`
      );
    }

    let driverId = dto.driver_id;
    if (driverId) {
      const driver = await this.driverRepository.findById(driverId);
      if (!driver) {
        throw new NotFoundException(`Driver with ID ${driverId} not found`);
      }
      if (driver.status !== 'available') {
        throw new BadRequestException(
          `Driver with ID ${driverId} is not available (current status: ${driver.status})`
        );
      }
    } else {
      const drivers = await this.driverRepository.findNearby({
        latitude: dto.start_latitude,
        longitude: dto.start_longitude,
        radius: 3,
      });
      if (!drivers.length) {
        throw new BadRequestException(
          'No available drivers found near the start location'
        );
      }
      driverId = drivers[0].id;
    }

    await this.driverRepository.updateStatus(driverId, DriverStatus.BUSY);

    const query = `
      INSERT INTO trips (driver_id, passenger_id, start_location, end_location, status, cost, created_at)
      VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326), ST_SetSRID(ST_MakePoint($5, $6), 4326), $7, $8, NOW())
      RETURNING *
    `;
    const result = await this.repository.query(query, [
      driverId,
      dto.passenger_id,
      dto.start_longitude,
      dto.start_latitude,
      dto.end_longitude,
      dto.end_latitude,
      dto.status || 'active',
      dto.cost || null,
    ]);
    return result[0];
  }

  async complete(id: string, dto: CompleteTripDto): Promise<Trip> {
    const trip = await this.findById(id);
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }
    if (trip.status !== 'active') {
      throw new BadRequestException(`Trip with ID ${id} is not active`);
    }
  
    trip.status = 'completed';
    trip.cost = dto.cost;
    trip.completed_at = new Date();
  
    if (trip.driver_id) {
      console.log(`Updating driver ${trip.driver_id} to available`);
      await this.driverRepository.updateStatus(trip.driver_id, DriverStatus.AVAILABLE);
    } else {
      console.log(`No driver_id for trip ${id}`);
    }
  
    return this.repository.save(trip);
  }
}