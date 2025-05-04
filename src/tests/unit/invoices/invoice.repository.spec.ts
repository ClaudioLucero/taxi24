import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceRepository } from '../../../infrastructure/repositories/invoice.repository';
import { TripRepository } from '../../../infrastructure/repositories/trip.repository';
import { Invoice } from '../../../domain/entities/invoice.entity';
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
          useValue: {
            findById: jest.fn(),
          },
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
      const filters: InvoiceFiltersDto = {
        passengerId: '550e8400-e29b-41d4-a716-446655440003',
        page: 1,
        limit: 10,
      };
      const invoices: Invoice[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440007',
          trip_id: '550e8400-e29b-41d4-a716-446655440006',
          amount: 20.00,
          created_at: new Date('2025-05-04T12:00:00Z'),
          trip: {
            id: '550e8400-e29b-41d4-a716-446655440006',
            passenger_id: '550e8400-e29b-41d4-a716-446655440003',
            driver_id: '550e8400-e29b-41d4-a716-446655440001',
            status: 'completed',
            created_at: new Date('2025-05-04T11:00:00Z'),
            passenger: { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Ana Martínez' },
            driver: { id: '550e8400-e29b-41d4-a716-446655440001', name: 'María Gómez' },
          } as any,
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
      expect(typeOrmRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith('trip.passenger_id = :passengerId', {
        passengerId: filters.passengerId,
      });
      expect(typeOrmRepository.createQueryBuilder().skip).toHaveBeenCalledWith(0);
      expect(typeOrmRepository.createQueryBuilder().take).toHaveBeenCalledWith(10);
    });

    it('should return an empty list if no invoices match filters', async () => {
      const filters: InvoiceFiltersDto = { page: 1, limit: 10 };
      jest.spyOn(typeOrmRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      } as any);

      const result = await repository.findAll(filters);
      expect(result).toEqual({ invoices: [], total: 0 });
      expect(typeOrmRepository.createQueryBuilder).toHaveBeenCalledWith('invoice');
    });

    it('should apply date filters correctly', async () => {
      const filters: InvoiceFiltersDto = {
        startDate: '2025-05-01T00:00:00Z',
        endDate: '2025-05-31T23:59:59Z',
        page: 1,
        limit: 10,
      };
      const invoices: Invoice[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440007',
          trip_id: '550e8400-e29b-41d4-a716-446655440006',
          amount: 20.00,
          created_at: new Date('2025-05-04T12:00:00Z'),
          trip: {
            id: '550e8400-e29b-41d4-a716-446655440006',
            passenger_id: '550e8400-e29b-41d4-a716-446655440003',
            driver_id: '550e8400-e29b-41d4-a716-446655440001',
            status: 'completed',
            created_at: new Date('2025-05-04T11:00:00Z'),
          } as any,
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
      expect(typeOrmRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith('invoice.created_at >= :startDate', {
        startDate: filters.startDate,
      });
      expect(typeOrmRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith('invoice.created_at <= :endDate', {
        endDate: filters.endDate,
      });
    });
  });

  describe('findById', () => {
    it('should return an invoice by ID', async () => {
      const invoice: Invoice = {
        id: '550e8400-e29b-41d4-a716-446655440007',
        trip_id: '550e8400-e29b-41d4-a716-446655440006',
        amount: 20.00,
        created_at: new Date('2025-05-04T12:00:00Z'),
        trip: {
          id: '550e8400-e29b-41d4-a716-446655440006',
          passenger_id: '550e8400-e29b-41d4-a716-446655440003',
          driver_id: '550e8400-e29b-41d4-a716-446655440001',
          status: 'completed',
          created_at: new Date('2025-05-04T11:00:00Z'),
        } as any,
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

      const result = await repository.findById('invalid-id');
      expect(result).toBeNull();
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'invalid-id' },
        relations: ['trip', 'trip.passenger', 'trip.driver'],
      });
    });
  });

  describe('findByTripId', () => {
    it('should return an invoice by trip ID', async () => {
      const invoice: Invoice = {
        id: '550e8400-e29b-41d4-a716-446655440007',
        trip_id: '550e8400-e29b-41d4-a716-446655440006',
        amount: 20.00,
        created_at: new Date('2025-05-04T12:00:00Z'),
        trip: {
          id: '550e8400-e29b-41d4-a716-446655440006',
          passenger_id: '550e8400-e29b-41d4-a716-446655440003',
          driver_id: '550e8400-e29b-41d4-a716-446655440001',
          status: 'completed',
          created_at: new Date('2025-05-04T11:00:00Z'),
        } as any,
      };
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(invoice);

      const result = await repository.findByTripId('550e8400-e29b-41d4-a716-446655440006');
      expect(result).toEqual(invoice);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { trip_id: '550e8400-e29b-41d4-a716-446655440006' },
        relations: ['trip', 'trip.passenger', 'trip.driver'],
      });
    });

    it('should return null if invoice not found for trip ID', async () => {
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(null);

      const result = await repository.findByTripId('invalid-trip-id');
      expect(result).toBeNull();
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { trip_id: 'invalid-trip-id' },
        relations: ['trip', 'trip.passenger', 'trip.driver'],
      });
    });
  });

  describe('create', () => {
    it('should create a new invoice', async () => {
      const dto: CreateInvoiceDto = {
        trip_id: '550e8400-e29b-41d4-a716-446655440006',
        amount: 20.00,
      };
      const trip = {
        id: '550e8400-e29b-41d4-a716-446655440006',
        passenger_id: '550e8400-e29b-41d4-a716-446655440003',
        driver_id: '550e8400-e29b-41d4-a716-446655440001',
        status: 'completed',
        created_at: new Date('2025-05-04T11:00:00Z'),
      };
      const invoice: Invoice = {
        id: '550e8400-e29b-41d4-a716-446655440007',
        trip_id: dto.trip_id,
        amount: dto.amount,
        created_at: new Date('2025-05-04T12:00:00Z'),
        trip,
      };
      jest.spyOn(tripRepository, 'findById').mockResolvedValue(trip as any);
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
        trip_id: 'invalid-trip-id',
        amount: 20.00,
      };
      jest.spyOn(tripRepository, 'findById').mockResolvedValue(null);

      await expect(repository.create(dto)).rejects.toThrow(NotFoundException);
      expect(tripRepository.findById).toHaveBeenCalledWith(dto.trip_id);
      expect(typeOrmRepository.create).not.toHaveBeenCalled();
      expect(typeOrmRepository.save).not.toHaveBeenCalled();
    });
  });
});