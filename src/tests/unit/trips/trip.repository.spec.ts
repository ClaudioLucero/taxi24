import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripRepository } from '../../../infrastructure/repositories/trip.repository';
import { Trip } from '../../../domain/entities/trip.entity';
import { CreateTripDto, CompleteTripDto } from '../../../infrastructure/dtos/trip.dto';
import { DriverRepository } from '../../../infrastructure/repositories/driver.repository';
import { PassengerRepository } from '../../../infrastructure/repositories/passenger.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';

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
          useValue: {
            findById: jest.fn(),
          },
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
      const trips: Trip[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440005',
          driver_id: '550e8400-e29b-41d4-a716-446655440000',
          passenger_id: '550e8400-e29b-41d4-a716-446655440003',
          start_location: 'SRID=4326;POINT(-74.006 40.7128)',
          end_location: 'SRID=4326;POINT(-74.0 40.73)',
          status: 'active',
          cost: 15.50,
          created_at: new Date(),
          completed_at: undefined,
          driver: {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Juan Pérez',
            status: 'available',
            created_at: new Date(),
          } as any,
          passenger: {
            id: '550e8400-e29b-41d4-a716-446655440003',
            name: 'Ana Martínez',
            created_at: new Date(),
          } as any,
        },
      ];
      jest.spyOn(typeOrmRepository, 'find').mockResolvedValue(trips);

      const result = await repository.findAll();
      expect(result).toEqual(trips);
      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        relations: ['driver', 'passenger'],
      });
    });
  });

  describe('findById', () => {
    it('should return a trip by ID', async () => {
      const trip: Trip = {
        id: '550e8400-e29b-41d4-a716-446655440005',
        driver_id: '550e8400-e29b-41d4-a716-446655440000',
        passenger_id: '550e8400-e29b-41d4-a716-446655440003',
        start_location: 'SRID=4326;POINT(-74.006 40.7128)',
        end_location: 'SRID=4326;POINT(-74.0 40.73)',
        status: 'active',
        cost: 15.50,
        created_at: new Date(),
        completed_at: undefined,
        driver: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Juan Pérez',
          status: 'available',
          created_at: new Date(),
        } as any,
        passenger: {
          id: '550e8400-e29b-41d4-a716-446655440003',
          name: 'Ana Martínez',
          created_at: new Date(),
        } as any,
      };
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(trip);

      const result = await repository.findById('550e8400-e29b-41d4-a716-446655440005');
      expect(result).toEqual(trip);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440005' },
        relations: ['driver', 'passenger'],
      });
    });

    it('should return null if trip not found', async () => {
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(null);

      const result = await repository.findById('invalid-id');
      expect(result).toBeNull();
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'invalid-id' },
        relations: ['driver', 'passenger'],
      });
    });
  });

  describe('create', () => {
    it('should create a new trip with specified driver', async () => {
      const dto: CreateTripDto = {
        driver_id: '550e8400-e29b-41d4-a716-446655440000',
        passenger_id: '550e8400-e29b-41d4-a716-446655440003',
        start_latitude: 40.7128,
        start_longitude: -74.0060,
        end_latitude: 40.7300,
        end_longitude: -74.0000,
        status: 'active',
        cost: 25.00,
      };
      const passenger = {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Ana Martínez',
        created_at: new Date(),
      };
      const driver = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Juan Pérez',
        status: 'available',
        created_at: new Date(),
      };
      const trip: Trip = {
        id: 'a6c4c08c-54b8-4640-8751-4cd896e9e391',
        driver_id: dto.driver_id,
        passenger_id: dto.passenger_id,
        start_location: 'SRID=4326;POINT(-74.006 40.7128)',
        end_location: 'SRID=4326;POINT(-74.0 40.73)',
        status: 'active',
        cost: 25.00,
        created_at: new Date(),
        completed_at: undefined,
        driver,
        passenger,
      };
      jest.spyOn(passengerRepository, 'findById').mockResolvedValue(passenger as any);
      jest.spyOn(driverRepository, 'findById').mockResolvedValue(driver as any);
      jest.spyOn(driverRepository, 'updateStatus').mockResolvedValue();
      jest.spyOn(typeOrmRepository, 'query').mockResolvedValue([trip]);

      const result = await repository.create(dto);
      expect(result).toEqual(trip);
      expect(passengerRepository.findById).toHaveBeenCalledWith(dto.passenger_id);
      expect(driverRepository.findById).toHaveBeenCalledWith(dto.driver_id);
      expect(driverRepository.updateStatus).toHaveBeenCalledWith(dto.driver_id, 'busy');
      expect(typeOrmRepository.query).toHaveBeenCalledWith(
        expect.any(String),
        [
          dto.driver_id,
          dto.passenger_id,
          dto.start_longitude,
          dto.start_latitude,
          dto.end_longitude,
          dto.end_latitude,
          dto.status,
          dto.cost,
        ],
      );
    });

    it('should create a new trip with auto-assigned driver', async () => {
      const dto: CreateTripDto = {
        passenger_id: '550e8400-e29b-41d4-a716-446655440003',
        start_latitude: 40.7128,
        start_longitude: -74.0060,
        end_latitude: 40.7300,
        end_longitude: -74.0000,
        status: 'active',
        cost: 25.00,
      };
      const passenger = {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Ana Martínez',
        created_at: new Date(),
      };
      const driver = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Juan Pérez',
        status: 'available',
        created_at: new Date(),
      };
      const trip: Trip = {
        id: 'a6c4c08c-54b8-4640-8751-4cd896e9e391',
        driver_id: driver.id,
        passenger_id: dto.passenger_id,
        start_location: 'SRID=4326;POINT(-74.006 40.7128)',
        end_location: 'SRID=4326;POINT(-74.0 40.73)',
        status: 'active',
        cost: 25.00,
        created_at: new Date(),
        completed_at: undefined,
        driver,
        passenger,
      };
      jest.spyOn(passengerRepository, 'findById').mockResolvedValue(passenger as any);
      jest.spyOn(driverRepository, 'findNearby').mockResolvedValue([driver] as any);
      jest.spyOn(driverRepository, 'updateStatus').mockResolvedValue();
      jest.spyOn(typeOrmRepository, 'query').mockResolvedValue([trip]);

      const result = await repository.create(dto);
      expect(result).toEqual(trip);
      expect(passengerRepository.findById).toHaveBeenCalledWith(dto.passenger_id);
      expect(driverRepository.findNearby).toHaveBeenCalledWith({
        latitude: dto.start_latitude,
        longitude: dto.start_longitude,
        radius: 3,
      });
      expect(driverRepository.updateStatus).toHaveBeenCalledWith(driver.id, 'busy');
      expect(typeOrmRepository.query).toHaveBeenCalledWith(
        expect.any(String),
        [
          driver.id,
          dto.passenger_id,
          dto.start_longitude,
          dto.start_latitude,
          dto.end_longitude,
          dto.end_latitude,
          dto.status,
          dto.cost,
        ],
      );
    });

    it('should throw NotFoundException if passenger not found', async () => {
      const dto: CreateTripDto = {
        driver_id: '550e8400-e29b-41d4-a716-446655440000',
        passenger_id: 'invalid-id',
        start_latitude: 40.7128,
        start_longitude: -74.0060,
        end_latitude: 40.7300,
        end_longitude: -74.0000,
        status: 'active',
        cost: 25.00,
      };
      jest.spyOn(passengerRepository, 'findById').mockResolvedValue(null);

      await expect(repository.create(dto)).rejects.toThrow(NotFoundException);
      expect(passengerRepository.findById).toHaveBeenCalledWith(dto.passenger_id);
    });

    it('should throw NotFoundException if driver not found', async () => {
      const dto: CreateTripDto = {
        driver_id: 'invalid-id',
        passenger_id: '550e8400-e29b-41d4-a716-446655440003',
        start_latitude: 40.7128,
        start_longitude: -74.0060,
        end_latitude: 40.7300,
        end_longitude: -74.0000,
        status: 'active',
        cost: 25.00,
      };
      const passenger = {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Ana Martínez',
        created_at: new Date(),
      };
      jest.spyOn(passengerRepository, 'findById').mockResolvedValue(passenger as any);
      jest.spyOn(driverRepository, 'findById').mockResolvedValue(null);

      await expect(repository.create(dto)).rejects.toThrow(NotFoundException);
      expect(passengerRepository.findById).toHaveBeenCalledWith(dto.passenger_id);
      expect(driverRepository.findById).toHaveBeenCalledWith(dto.driver_id);
    });

    it('should throw BadRequestException if driver is not available', async () => {
      const dto: CreateTripDto = {
        driver_id: '550e8400-e29b-41d4-a716-446655440000',
        passenger_id: '550e8400-e29b-41d4-a716-446655440003',
        start_latitude: 40.7128,
        start_longitude: -74.0060,
        end_latitude: 40.7300,
        end_longitude: -74.0000,
        status: 'active',
        cost: 25.00,
      };
      const passenger = {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Ana Martínez',
        created_at: new Date(),
      };
      const driver = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Juan Pérez',
        status: 'busy',
        created_at: new Date(),
      };
      jest.spyOn(passengerRepository, 'findById').mockResolvedValue(passenger as any);
      jest.spyOn(driverRepository, 'findById').mockResolvedValue(driver as any);

      await expect(repository.create(dto)).rejects.toThrow(BadRequestException);
      expect(passengerRepository.findById).toHaveBeenCalledWith(dto.passenger_id);
      expect(driverRepository.findById).toHaveBeenCalledWith(dto.driver_id);
    });

    it('should throw BadRequestException if no drivers are available nearby', async () => {
      const dto: CreateTripDto = {
        passenger_id: '550e8400-e29b-41d4-a716-446655440003',
        start_latitude: 40.7128,
        start_longitude: -74.0060,
        end_latitude: 40.7300,
        end_longitude: -74.0000,
        status: 'active',
        cost: 25.00,
      };
      const passenger = {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Ana Martínez',
        created_at: new Date(),
      };
      jest.spyOn(passengerRepository, 'findById').mockResolvedValue(passenger as any);
      jest.spyOn(driverRepository, 'findNearby').mockResolvedValue([]);

      await expect(repository.create(dto)).rejects.toThrow(BadRequestException);
      expect(passengerRepository.findById).toHaveBeenCalledWith(dto.passenger_id);
      expect(driverRepository.findNearby).toHaveBeenCalledWith({
        latitude: dto.start_latitude,
        longitude: dto.start_longitude,
        radius: 3,
      });
    });
  });

  describe('complete', () => {
    it('should complete a trip and free the driver', async () => {
      const dto: CompleteTripDto = { cost: 15.50 };
      const trip: Trip = {
        id: '550e8400-e29b-41d4-a716-446655440005',
        driver_id: '550e8400-e29b-41d4-a716-446655440000',
        passenger_id: '550e8400-e29b-41d4-a716-446655440003',
        start_location: 'SRID=4326;POINT(-74.006 40.7128)',
        end_location: 'SRID=4326;POINT(-74.0 40.73)',
        status: 'active',
        cost: undefined,
        created_at: new Date(),
        completed_at: undefined,
        driver: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Juan Pérez',
          status: 'busy',
          created_at: new Date(),
        } as any,
        passenger: {
          id: '550e8400-e29b-41d4-a716-446655440003',
          name: 'Ana Martínez',
          created_at: new Date(),
        } as any,
      };
      const completedTrip: Trip = {
        ...trip,
        status: 'completed',
        cost: 15.50,
        completed_at: new Date(),
        driver: { ...trip.driver, status: 'available' } as any,
      };
      jest.spyOn(repository, 'findById').mockResolvedValue(trip);
      jest.spyOn(typeOrmRepository, 'save').mockResolvedValue(completedTrip);
      jest.spyOn(driverRepository, 'updateStatus').mockResolvedValue();

      const result = await repository.complete('550e8400-e29b-41d4-a716-446655440005', dto);
      expect(result).toEqual(completedTrip);
      expect(repository.findById).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440005');
      expect(driverRepository.updateStatus).toHaveBeenCalledWith(trip.driver_id, 'available');
      expect(typeOrmRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        status: 'completed',
        cost: 15.50,
        completed_at: expect.any(Date),
      }));
    });

    it('should throw NotFoundException if trip not found', async () => {
      const dto: CompleteTripDto = { cost: 15.50 };
      jest.spyOn(repository, 'findById').mockResolvedValue(null);

      await expect(repository.complete('invalid-id', dto)).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith('invalid-id');
    });

    it('should throw BadRequestException if trip is not active', async () => {
      const dto: CompleteTripDto = { cost: 15.50 };
      const trip: Trip = {
        id: '550e8400-e29b-41d4-a716-446655440005',
        driver_id: '550e8400-e29b-41d4-a716-446655440000',
        passenger_id: '550e8400-e29b-41d4-a716-446655440003',
        start_location: 'SRID=4326;POINT(-74.006 40.7128)',
        end_location: 'SRID=4326;POINT(-74.0 40.73)',
        status: 'completed',
        cost: 15.50,
        created_at: new Date(),
        completed_at: new Date(),
        driver: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Juan Pérez',
          status: 'available',
          created_at: new Date(),
        } as any,
        passenger: {
          id: '550e8400-e29b-41d4-a716-446655440003',
          name: 'Ana Martínez',
          created_at: new Date(),
        } as any,
      };
      jest.spyOn(repository, 'findById').mockResolvedValue(trip);

      await expect(repository.complete('550e8400-e29b-41d4-a716-446655440005', dto)).rejects.toThrow(BadRequestException);
      expect(repository.findById).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440005');
    });
  });
});