import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceRepository } from '../../../infrastructure/repositories/invoice.repository';
import { TripRepository } from '../../../infrastructure/repositories/trip.repository';
import { Invoice } from '../../../domain/entities/invoice.entity';
import { Trip } from '../../../domain/entities/trip.entity';
import { CreateInvoiceDto, InvoiceFiltersDto } from '../../../infrastructure/dtos/invoice.dto';
import { NotFoundException } from '@nestjs/common';

describe('InvoiceRepository', () => {
  let repository: InvoiceRepository;
  let typeOrmRepository: Repository<Invoice>;
  let tripRepository: TripRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceRepository,
        {
          provide: getRepositoryToken(Invoice),
          useClass: Repository,
        },
        {
          provide: TripRepository,
          useValue: { findById: jest.fn() },
        },
      ],
    }).compile();

    repository = module.get<InvoiceRepository>(InvoiceRepository);
    typeOrmRepository = module.get<Repository<Invoice>>(getRepositoryToken(Invoice));
    tripRepository = module.get<TripRepository>(TripRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of invoices with filters', async () => {
      const filters: InvoiceFiltersDto = { passengerId: '550e8400-e29b-41d4-a716-446655440004', page: 1, limit: 10 };
      const invoices: Invoice[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440007',
          trip_id: '550e8400-e29b-41d4-a716-446655440006',
          amount: 20.00,
          created_at: new Date(),
          trip: {
            id: '550e8400-e29b-41d4-a716-446655440006',
            passenger_id: '550e8400-e29b-41d4-a716-446655440004',
            driver_id: '550e8400-e29b-41d4-a716-446655440001',
            status: 'completed',
            created_at: new Date(),
            completed_at: new Date(),
          },
        },
      ];
      jest.spyOn(typeOrmRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([invoices, invoices.length]),
      } as any);

      const result = await repository.findAll(filters);
      expect(result).toEqual({ invoices, total: invoices.length });
      expect(typeOrmRepository.createQueryBuilder).toHaveBeenCalledWith('invoice');
    });
  });

  describe('findById', () => {
    it('should return an invoice if found', async () => {
      const invoice: Invoice = {
        id: '550e8400-e29b-41d4-a716-446655440007',
        trip_id: '550e8400-e29b-41d4-a716-446655440006',
        amount: 20.00,
        created_at: new Date(),
        trip: {
          id: '550e8400-e29b-41d4-a716-446655440006',
          passenger_id: '550e8400-e29b-41d4-a716-446655440004',
          driver_id: '550e8400-e29b-41d4-a716-446655440001',
          status: 'completed',
          created_at: new Date(),
          completed_at: new Date(),
        },
      };
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(invoice);

      const result = await repository.findById('550e8400-e29b-41d4-a716-446655440007');
      expect(result).toEqual(invoice);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440007' },
        relations: ['trip', 'trip.passenger', 'trip.driver'],
      });
    });

    it('should return null if invoice not found', async () => {
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(null);

      const result = await repository.findById('550e8400-e29b-41d4-a716-999999999999');
      expect(result).toBeNull();
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-999999999999' },
        relations: ['trip', 'trip.passenger', 'trip.driver'],
      });
    });
  });

  describe('findByTripId', () => {
    it('should return an invoice for a trip', async () => {
      const invoice: Invoice = {
        id: '550e8400-e29b-41d4-a716-446655440007',
        trip_id: '550e8400-e29b-41d4-a716-446655440006',
        amount: 20.00,
        created_at: new Date(),
        trip: {
          id: '550e8400-e29b-41d4-a716-446655440006',
          passenger_id: '550e8400-e29b-41d4-a716-446655440004',
          driver_id: '550e8400-e29b-41d4-a716-446655440001',
          status: 'completed',
          created_at: new Date(),
          completed_at: new Date(),
        },
      };
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(invoice);

      const result = await repository.findByTripId('550e8400-e29b-41d4-a716-446655440006');
      expect(result).toEqual(invoice);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { trip_id: '550e8400-e29b-41d4-a716-446655440006' },
        relations: ['trip', 'trip.passenger', 'trip.driver'],
      });
    });

    it('should return null if no invoice found for trip', async () => {
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(null);

      const result = await repository.findByTripId('550e8400-e29b-41d4-a716-999999999999');
      expect(result).toBeNull();
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { trip_id: '550e8400-e29b-41d4-a716-999999999999' },
        relations: ['trip', 'trip.passenger', 'trip.driver'],
      });
    });
  });

  describe('create', () => {
    it('should create an invoice', async () => {
      const dto: CreateInvoiceDto = {
        trip_id: '550e8400-e29b-41d4-a716-446655440006',
        amount: 20.00,
      };
      const trip: Trip = {
        id: '550e8400-e29b-41d4-a716-446655440006',
        passenger_id: '550e8400-e29b-41d4-a716-446655440004',
        driver_id: '550e8400-e29b-41d4-a716-446655440001',
        status: 'completed',
        created_at: new Date(),
        completed_at: new Date(),
      };
      const invoice: Invoice = {
        id: '550e8400-e29b-41d4-a716-446655440007',
        trip_id: dto.trip_id,
        amount: dto.amount,
        created_at: new Date(),
        trip,
      };
      jest.spyOn(tripRepository, 'findById').mockResolvedValue(trip);
      jest.spyOn(typeOrmRepository, 'create').mockReturnValue(invoice);
      jest.spyOn(typeOrmRepository, 'save').mockResolvedValue(invoice);

      const result = await repository.create(dto);
      expect(result).toEqual(invoice);
      expect(tripRepository.findById).toHaveBeenCalledWith(dto.trip_id);
      expect(typeOrmRepository.create).toHaveBeenCalledWith(dto);
      expect(typeOrmRepository.save).toHaveBeenCalledWith(invoice);
    });

    it('should throw NotFoundException if trip not found', async () => {
      const dto: CreateInvoiceDto = {
        trip_id: '550e8400-e29b-41d4-a716-999999999999',
        amount: 20.00,
      };
      jest.spyOn(tripRepository, 'findById').mockResolvedValue(null);

      await expect(repository.create(dto)).rejects.toThrow(
        new NotFoundException(`Trip with ID ${dto.trip_id} not found`),
      );
    });
  });
});