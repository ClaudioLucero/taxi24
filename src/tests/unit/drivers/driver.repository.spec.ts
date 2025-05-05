import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverRepository } from '../../../infrastructure/repositories/driver.repository';
import { Driver } from '../../../domain/entities/driver.entity';
import { NearbyDriversDto } from '../../../infrastructure/dtos/nearby-drivers.dto';
import { DriverStatus } from '../../../domain/entities/enums/driver-status.enum';
import { BadRequestException } from '@nestjs/common';

describe('DriverRepository', () => {
  let repository: DriverRepository;
  let typeOrmRepository: Repository<Driver>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriverRepository,
        {
          provide: getRepositoryToken(Driver),
          useClass: Repository,
        },
      ],
    }).compile();

    repository = module.get<DriverRepository>(DriverRepository);
    typeOrmRepository = module.get<Repository<Driver>>(
      getRepositoryToken(Driver)
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of drivers', async () => {
      const drivers: Driver[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Juan Pérez',
          phone: '1234567890',
          location: 'SRID=4326;POINT(-74.006 40.7128)',
          status: DriverStatus.AVAILABLE,
          created_at: new Date(),
        },
      ];
      jest.spyOn(typeOrmRepository, 'find').mockResolvedValue(drivers);

      const result = await repository.findAll();
      expect(result).toEqual(drivers);
      expect(typeOrmRepository.find).toHaveBeenCalled();
    });
  });

  describe('findAvailable', () => {
    it('should return a list of available drivers', async () => {
      const drivers: Driver[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Juan Pérez',
          phone: '1234567890',
          location: 'SRID=4326;POINT(-74.006 40.7128)',
          status: DriverStatus.AVAILABLE,
          created_at: new Date(),
        },
      ];
      jest.spyOn(typeOrmRepository, 'find').mockResolvedValue(drivers);

      const result = await repository.findAvailable();
      expect(result).toEqual(drivers);
      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        where: { status: DriverStatus.AVAILABLE },
      });
    });
  });

  describe('findNearby', () => {
    it('should return a list of nearby drivers', async () => {
      const drivers: Driver[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Juan Pérez',
          phone: '1234567890',
          location: 'SRID=4326;POINT(-74.006 40.7128)',
          status: DriverStatus.AVAILABLE,
          created_at: new Date(),
        },
      ];
      const dto: NearbyDriversDto = {
        latitude: 40.7128,
        longitude: -74.006,
        radius: 5,
      };
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(drivers),
      };
      jest
        .spyOn(typeOrmRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder as any);

      const result = await repository.findNearby(dto);
      expect(result).toEqual(drivers);
      expect(typeOrmRepository.createQueryBuilder).toHaveBeenCalledWith(
        'driver'
      );
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'ST_DWithin(driver.location, ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), :radius) AND driver.status = :status'
      );
      expect(queryBuilder.setParameters).toHaveBeenCalledWith({
        latitude: dto.latitude,
        longitude: dto.longitude,
        radius: dto.radius * 1000,
        status: DriverStatus.AVAILABLE,
      });
    });

    it('should return empty array for (0, 0) coordinates', async () => {
      const dto: NearbyDriversDto = { latitude: 0, longitude: 0, radius: 1 };

      const result = await repository.findNearby(dto);
      expect(result).toEqual([]);
    });

    it('should throw BadRequestException for invalid coordinates', async () => {
      const dto: NearbyDriversDto = {
        latitude: NaN,
        longitude: -74.006,
        radius: 5,
      };

      await expect(repository.findNearby(dto)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('findById', () => {
    it('should return a driver by ID', async () => {
      const driver: Driver = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Juan Pérez',
        phone: '1234567890',
        location: 'SRID=4326;POINT(-74.006 40.7128)',
        status: DriverStatus.AVAILABLE,
        created_at: new Date(),
      };
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(driver);

      const result = await repository.findById(
        '550e8400-e29b-41d4-a716-446655440000'
      );
      expect(result).toEqual(driver);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
      });
    });

    it('should return null if driver not found', async () => {
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(null);

      const result = await repository.findById(
        '550e8400-e29b-41d4-a716-999999999999'
      );
      expect(result).toBeNull();
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-999999999999' },
      });
    });
  });

  describe('updateStatus', () => {
    it('should update driver status', async () => {
      jest
        .spyOn(typeOrmRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      await repository.updateStatus(
        '550e8400-e29b-41d4-a716-446655440000',
        DriverStatus.BUSY
      );
      expect(typeOrmRepository.update).toHaveBeenCalledWith(
        { id: '550e8400-e29b-41d4-a716-446655440000' },
        { status: DriverStatus.BUSY }
      );
    });
  });
});
