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
  // Inyecta el repositorio de TypeORM para la entidad Trip y los repositorios de conductores y pasajeros
  constructor(
    @InjectRepository(Trip)
    private readonly repository: Repository<Trip>,
    private readonly driverRepository: DriverRepository,
    private readonly passengerRepository: PassengerRepository
  ) {}

  // Obtiene una lista de viajes con paginación, incluyendo datos de conductor y pasajero
  async findAll(
    query: ListTripsQueryDto
  ): Promise<{ trips: Trip[]; total: number }> {
    const { page = 1, limit = 100 } = query;
    const [trips, total] = await this.repository.findAndCount({
      relations: ['driver', 'passenger'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return { trips, total };
  }

  // Busca un viaje por su ID, incluyendo datos de conductor y pasajero
  async findById(id: string): Promise<Trip | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['driver', 'passenger'],
    });
  }

  // Crea un nuevo viaje, verificando la existencia de pasajero y conductor, asignando un conductor disponible si no se especifica
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

  // Completa un viaje activo, actualizando su estado, costo y liberando al conductor
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
      await this.driverRepository.updateStatus(
        trip.driver_id,
        DriverStatus.AVAILABLE
      );
    }

    return this.repository.save(trip);
  }
}
