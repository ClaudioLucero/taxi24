import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverRepository } from '../../../infrastructure/repositories/driver.repository';
import { Driver } from '../../../domain/entities/driver.entity';
import { NearbyDriversDto } from '../../../infrastructure/dtos/nearby-drivers.dto';

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
    typeOrmRepository = module.get<Repository<Driver>>(getRepositoryToken(Driver));
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
          location: 'POINT(-74.006 40.7128)',
          status: 'available',
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
          location: 'POINT(-74.006 40.7128)',
          status: 'available',
          created_at: new Date(),
        },
      ];
      jest.spyOn(typeOrmRepository, 'find').mockResolvedValue(drivers);

      const result = await repository.findAvailable();
      expect(result).toEqual(drivers);
      expect(typeOrmRepository.find).toHaveBeenCalledWith({ where: { status: 'available' } });
    });
  });

  describe('findNearby', () => {
    it('should return a list of nearby drivers', async () => {
      const drivers: Driver[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Juan Pérez',
          phone: '1234567890',
          location: 'POINT(-74.006 40.7128)',
          status: 'available',
          created_at: new Date(),
        },
      ];
      const dto: NearbyDriversDto = { latitude: 40.7128, longitude: -74.0060, radius: 5 };
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(drivers),
      };
      jest.spyOn(typeOrmRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

      const result = await repository.findNearby(dto);
      expect(result).toEqual(drivers);
      expect(typeOrmRepository.createQueryBuilder).toHaveBeenCalledWith('driver');
      expect(queryBuilder.where).toHaveBeenCalledWith('ST_DWithin(driver.location, ST_GeomFromText(:point), :radius * 1000)');
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('driver.status = :status');
    });
  });
});