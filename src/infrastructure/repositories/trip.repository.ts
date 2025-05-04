import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from '../../domain/entities/trip.entity';
import { CreateTripDto, CompleteTripDto } from '../dtos/trip.dto';
import { DriverRepository } from './driver.repository';
import { PassengerRepository } from './passenger.repository';

@Injectable()
export class TripRepository {
  constructor(
    @InjectRepository(Trip)
    private readonly repository: Repository<Trip>,
    private readonly driverRepository: DriverRepository,
    private readonly passengerRepository: PassengerRepository,
  ) {}

  async findAll(): Promise<Trip[]> {
    return this.repository.find({ relations: ['driver', 'passenger'] });
  }

  async findById(id: string): Promise<Trip | null> {
    return this.repository.findOne({ where: { id }, relations: ['driver', 'passenger'] });
  }

  async create(dto: CreateTripDto): Promise<Trip> {
    // Validar pasajero
    const passenger = await this.passengerRepository.findById(dto.passenger_id);
    if (!passenger) {
      throw new NotFoundException(`Passenger with ID ${dto.passenger_id} not found`);
    }

    // Validar conductor (si se proporciona)
    let driverId = dto.driver_id;
    if (driverId) {
      const driver = await this.driverRepository.findById(driverId);
      if (!driver) {
        throw new NotFoundException(`Driver with ID ${driverId} not found`);
      }
      if (driver.status !== 'available') {
        throw new BadRequestException(`Driver with ID ${driverId} is not available (current status: ${driver.status})`);
      }
    } else {
      // Buscar conductor disponible más cercano
      const drivers = await this.driverRepository.findNearby({
        latitude: dto.start_latitude,
        longitude: dto.start_longitude,
        radius: 3, // 3 km
      });
      if (!drivers.length) {
        throw new BadRequestException('No available drivers found near the start location');
      }
      driverId = drivers[0].id;
    }

    // Actualizar estado del conductor
    await this.driverRepository.updateStatus(driverId, 'busy');

    // Crear viaje
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

    // Liberar conductor
    if (trip.driver_id) {
      await this.driverRepository.updateStatus(trip.driver_id, 'available');
    }

    return this.repository.save(trip);
  }
}