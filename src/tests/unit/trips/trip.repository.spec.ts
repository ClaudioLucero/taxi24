import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripRepository } from '../../../infrastructure/repositories/trip.repository';
import { DriverRepository } from '../../../infrastructure/repositories/driver.repository';
import { PassengerRepository } from '../../../infrastructure/repositories/passenger.repository';
import { Trip } from '../../../domain/entities/trip.entity';
import { Driver } from '../../../domain/entities/driver.entity';
import { Passenger } from '../../../domain/entities/passenger.entity';
import {
  CreateTripDto,
  CompleteTripDto,
  ListTripsQueryDto,
} from '../../../infrastructure/dtos/trip.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DriverStatus } from '../../../domain/entities/enums/driver-status.enum';

describe('TripRepository', () => {
  let repository: TripRepository;
  let typeOrmRepository: Repository<Trip>;
  let driverRepository: DriverRepository;
  let passengerRepository: PassengerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripRepository,
        {
          provide: getRepositoryToken(Trip),
          useClass: Repository,
        },
        {
          provide: DriverRepository,
          useValue: {
            findById: jest.fn(),
            findNearby: jest.fn(),
            updateStatus: jest.fn(),
          },
        },
        {
          provide: PassengerRepository,
          useValue: { findById: jest.fn() },
        },
      ],
    }).compile();

    repository = module.get<TripRepository>(TripRepository);
    typeOrmRepository = module.get<Repository<Trip>>(getRepositoryToken(Trip));
    driverRepository = module.get<DriverRepository>(DriverRepository);
    passengerRepository = module.get<PassengerRepository>(PassengerRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of trips', async () => {
      const query: ListTripsQueryDto = { page: 1, limit: 10 };
      const trips: Trip[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440005',
          passenger_id: '550e8400-e29b-41d4-a716-446655440003',
          driver_id: '550e8400-e29b-41d4-a716-446655440000',
          status: 'active',
          created_at: new Date(),
          completed_at: undefined,
        },
      ];
      jest
        .spyOn(typeOrmRepository, 'findAndCount')
        .mockResolvedValue([trips, trips.length]);

      const result = await repository.findAll(query);
      const page = query.page ?? 1;
      const limit = query.limit ?? 100;
      expect(result).toEqual({ trips, total: trips.length });
      expect(typeOrmRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['driver', 'passenger'],
        skip: (page - 1) * limit,
        take: limit,
      });
    });
  });

  describe('findById', () => {
    it('should return a trip if found', async () => {
      const trip: Trip = {
        id: '550e8400-e29b-41d4-a716-446655440005',
        passenger_id: '550e8400-e29b-41d4-a716-446655440003',
        driver_id: '550e8400-e29b-41d4-a716-446655440000',
        status: 'active',
        created_at: new Date(),
        completed_at: undefined,
      };
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(trip);

      const result = await repository.findById(
        '550e8400-e29b-41d4-a716-446655440005'
      );
      expect(result).toEqual(trip);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440005' },
        relations: ['driver', 'passenger'],
      });
    });

    it('should return null if trip not found', async () => {
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(null);

      const result = await repository.findById(
        '550e8400-e29b-41d4-a716-999999999999'
      );
      expect(result).toBeNull();
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-999999999999' },
        relations: ['driver', 'passenger'],
      });
    });
  });

  describe('create', () => {
    it('should create a trip with provided driver', async () => {
      const dto: CreateTripDto = {
        driver_id: '550e8400-e29b-41d4-a716-446655440000',
        passenger_id: '550e8400-e29b-41d4-a716-446655440003',
        start_latitude: 40.7128,
        start_longitude: -74.006,
        end_latitude: 40.73,
        end_longitude: -74.0,
        status: 'active',
        cost: 25.0,
      };
      const passenger: Passenger = {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Ana Martínez',
        phone: '1112223333',
        created_at: new Date(),
      };
      const driver: Driver = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Juan Pérez',
        phone: '1234567890',
        location: 'SRID=4326;POINT(-74.006 40.7128)',
        status: DriverStatus.AVAILABLE,
        created_at: new Date(),
      };
      const trip: Trip = {
        id: '550e8400-e29b-41d4-a716-446655440005',
        driver_id: dto.driver_id,
        passenger_id: dto.passenger_id,
        status: 'active',
        created_at: new Date(),
        completed_at: undefined,
      };
      jest.spyOn(passengerRepository, 'findById').mockResolvedValue(passenger);
      jest.spyOn(driverRepository, 'findById').mockResolvedValue(driver);
      jest.spyOn(driverRepository, 'updateStatus').mockResolvedValue();
      jest.spyOn(typeOrmRepository, 'query').mockResolvedValue([trip]);

      const result = await repository.create(dto);
      expect(result).toEqual(trip);
      expect(passengerRepository.findById).toHaveBeenCalledWith(
        dto.passenger_id
      );
      expect(driverRepository.findById).toHaveBeenCalledWith(dto.driver_id);
      expect(driverRepository.updateStatus).toHaveBeenCalledWith(
        dto.driver_id,
        DriverStatus.BUSY
      );
    });

    it('should throw NotFoundException if passenger not found', async () => {
      const dto: CreateTripDto = {
        passenger_id: '550e8400-e29b-41d4-a716-999999999999',
        start_latitude: 40.7128,
        start_longitude: -74.006,
        end_latitude: 40.73,
        end_longitude: -74.0,
        status: 'active',
        cost: 25.0,
      };
      jest.spyOn(passengerRepository, 'findById').mockResolvedValue(null);

      await expect(repository.create(dto)).rejects.toThrow(
        new NotFoundException(`Passenger with ID ${dto.passenger_id} not found`)
      );
    });

    it('should throw BadRequestException if driver not available', async () => {
      const dto: CreateTripDto = {
        driver_id: '550e8400-e29b-41d4-a716-446655440002',
        passenger_id: '550e8400-e29b-41d4-a716-446655440003',
        start_latitude: 40.7128,
        start_longitude: -74.006,
        end_latitude: 40.73,
        end_longitude: -74.0,
        status: 'active',
        cost: 25.0,
      };
      const passenger: Passenger = {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Ana Martínez',
        phone: '1112223333',
        created_at: new Date(),
      };
      const driver: Driver = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Carlos López',
        phone: '5556667777',
        location: 'SRID=4326;POINT(-74.007 40.714)',
        status: DriverStatus.BUSY,
        created_at: new Date(),
      };
      jest.spyOn(passengerRepository, 'findById').mockResolvedValue(passenger);
      jest.spyOn(driverRepository, 'findById').mockResolvedValue(driver);

      await expect(repository.create(dto)).rejects.toThrow(
        new BadRequestException(
          `Driver with ID ${dto.driver_id} is not available (current status: ${driver.status})`
        )
      );
    });

    it('should assign a nearby driver if no driver_id provided', async () => {
      const dto: CreateTripDto = {
        passenger_id: '550e8400-e29b-41d4-a716-446655440003',
        start_latitude: 40.7128,
        start_longitude: -74.006,
        end_latitude: 40.73,
        end_longitude: -74.0,
        status: 'active',
        cost: 25.0,
      };
      const passenger: Passenger = {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Ana Martínez',
        phone: '1112223333',
        created_at: new Date(),
      };
      const driver: Driver = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Juan Pérez',
        phone: '1234567890',
        location: 'SRID=4326;POINT(-74.006 40.7128)',
        status: DriverStatus.AVAILABLE,
        created_at: new Date(),
      };
      const trip: Trip = {
        id: '550e8400-e29b-41d4-a716-446655440005',
        driver_id: driver.id,
        passenger_id: dto.passenger_id,
        status: 'active',
        created_at: new Date(),
        completed_at: undefined,
      };
      jest.spyOn(passengerRepository, 'findById').mockResolvedValue(passenger);
      jest.spyOn(driverRepository, 'findNearby').mockResolvedValue([driver]);
      jest.spyOn(driverRepository, 'updateStatus').mockResolvedValue();
      jest.spyOn(typeOrmRepository, 'query').mockResolvedValue([trip]);

      const result = await repository.create(dto);
      expect(result).toEqual(trip);
      expect(passengerRepository.findById).toHaveBeenCalledWith(
        dto.passenger_id
      );
      expect(driverRepository.findNearby).toHaveBeenCalledWith({
        latitude: dto.start_latitude,
        longitude: dto.start_longitude,
        radius: 3,
      });
      expect(driverRepository.updateStatus).toHaveBeenCalledWith(
        driver.id,
        DriverStatus.BUSY
      );
    });

    it('should throw BadRequestException if no nearby drivers available', async () => {
      const dto: CreateTripDto = {
        passenger_id: '550e8400-e29b-41d4-a716-446655440003',
        start_latitude: 40.7128,
        start_longitude: -74.006,
        end_latitude: 40.73,
        end_longitude: -74.0,
        status: 'active',
        cost: 25.0,
      };
      const passenger: Passenger = {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Ana Martínez',
        phone: '1112223333',
        created_at: new Date(),
      };
      jest.spyOn(passengerRepository, 'findById').mockResolvedValue(passenger);
      jest.spyOn(driverRepository, 'findNearby').mockResolvedValue([]);

      await expect(repository.create(dto)).rejects.toThrow(
        new BadRequestException(
          'No available drivers found near the start location'
        )
      );
    });
  });

  describe('complete', () => {
    it('should complete a trip', async () => {
      const tripId = '550e8400-e29b-41d4-a716-446655440005';
      const dto: CompleteTripDto = { cost: 25.0 };
      const trip: Trip = {
        id: tripId,
        driver_id: '550e8400-e29b-41d4-a716-446655440000',
        passenger_id: '550e8400-e29b-41d4-a716-446655440003',
        status: 'active',
        created_at: new Date(),
        completed_at: undefined,
      };
      const updatedTrip: Trip = {
        ...trip,
        status: 'completed',
        cost: dto.cost,
        completed_at: new Date(),
      };
      jest.spyOn(repository, 'findById').mockResolvedValue(trip);
      jest.spyOn(typeOrmRepository, 'save').mockResolvedValue(updatedTrip);
      jest.spyOn(driverRepository, 'updateStatus').mockResolvedValue();

      const result = await repository.complete(tripId, dto);
      expect(result).toEqual(updatedTrip);
      expect(repository.findById).toHaveBeenCalledWith(tripId);
      expect(typeOrmRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'completed',
          cost: dto.cost,
          completed_at: expect.any(Date),
        })
      );
      expect(driverRepository.updateStatus).toHaveBeenCalledWith(
        trip.driver_id,
        DriverStatus.AVAILABLE
      );
    });

    it('should throw NotFoundException if trip not found', async () => {
      const tripId = '550e8400-e29b-41d4-a716-999999999999';
      const dto: CompleteTripDto = { cost: 25.0 };
      jest.spyOn(repository, 'findById').mockResolvedValue(null);

      await expect(repository.complete(tripId, dto)).rejects.toThrow(
        new NotFoundException(`Trip with ID ${tripId} not found`)
      );
    });

    it('should throw BadRequestException if trip not active', async () => {
      const tripId = '550e8400-e29b-41d4-a716-446655440006';
      const dto: CompleteTripDto = { cost: 25.0 };
      const trip: Trip = {
        id: tripId,
        driver_id: '550e8400-e29b-41d4-a716-446655440001',
        passenger_id: '550e8400-e29b-41d4-a716-446655440004',
        status: 'completed',
        created_at: new Date(),
        completed_at: new Date(),
      };
      jest.spyOn(repository, 'findById').mockResolvedValue(trip);

      await expect(repository.complete(tripId, dto)).rejects.toThrow(
        new BadRequestException(`Trip with ID ${tripId} is not active`)
      );
    });
  });
});
