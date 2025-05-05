import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PassengerRepository } from '../../../infrastructure/repositories/passenger.repository';
import { Passenger } from '../../../domain/entities/passenger.entity';
import { BadRequestException } from '@nestjs/common';

describe('PassengerRepository', () => {
  let repository: PassengerRepository;
  let typeOrmRepository: Repository<Passenger>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PassengerRepository,
        {
          provide: getRepositoryToken(Passenger),
          useClass: Repository,
        },
      ],
    }).compile();

    repository = module.get<PassengerRepository>(PassengerRepository);
    typeOrmRepository = module.get<Repository<Passenger>>(
      getRepositoryToken(Passenger)
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of passengers', async () => {
      const passengers: Passenger[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          name: 'Ana Martínez',
          phone: '1112223333',
          created_at: new Date(),
        },
      ];
      jest.spyOn(typeOrmRepository, 'find').mockResolvedValue(passengers);

      const result = await repository.findAll();
      expect(result).toEqual(passengers);
      expect(typeOrmRepository.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a passenger if found', async () => {
      const passenger: Passenger = {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Ana Martínez',
        phone: '1112223333',
        created_at: new Date(),
      };
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(passenger);

      const result = await repository.findById(
        '550e8400-e29b-41d4-a716-446655440003'
      );
      expect(result).toEqual(passenger);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440003' },
      });
    });

    it('should throw BadRequestException for invalid UUID', async () => {
      await expect(repository.findById('invalid-id')).rejects.toThrow(
        new BadRequestException(
          'Invalid UUID format for passenger ID: invalid-id'
        )
      );
    });

    it('should return null if passenger not found with valid UUID', async () => {
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

  describe('create', () => {
    it('should create a passenger', async () => {
      const dto = { name: 'Test Passenger', phone: '1234567890' };
      const passenger: Passenger = {
        id: '550e8400-e29b-41d4-a716-446655440006',
        name: dto.name,
        phone: dto.phone,
        created_at: new Date(),
      };
      jest.spyOn(typeOrmRepository, 'create').mockReturnValue(passenger);
      jest.spyOn(typeOrmRepository, 'save').mockResolvedValue(passenger);

      const result = await repository.create(dto);
      expect(result).toEqual(passenger);
      expect(typeOrmRepository.create).toHaveBeenCalledWith(dto);
      expect(typeOrmRepository.save).toHaveBeenCalledWith(passenger);
    });
  });
});
