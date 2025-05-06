import { Test, TestingModule } from '@nestjs/testing';
import { ListPassengerNearbyDriversUseCase } from '../../../application/use-cases/passengers/list-passenger-nearby-drivers.use-case';
import { PassengerRepository } from '../../../infrastructure/repositories/passenger.repository';
import { DriverRepository } from '../../../infrastructure/repositories/driver.repository';
import { InvoiceRepository } from '../../../infrastructure/repositories/invoice.repository';
import { Passenger } from '../../../domain/entities/passenger.entity';
import { Driver } from '../../../domain/entities/driver.entity';
import { Invoice } from '../../../domain/entities/invoice.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { InvoiceFiltersDto } from '../../../infrastructure/dtos/invoice.dto';

describe('ListPassengerNearbyDriversUseCase', () => {
  let useCase: ListPassengerNearbyDriversUseCase;
  let passengerRepository: PassengerRepository;
  let driverRepository: DriverRepository;
  let invoiceRepository: Repository<Invoice>;
  let invoiceRepositoryInstance: InvoiceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListPassengerNearbyDriversUseCase,
        {
          provide: PassengerRepository,
          useValue: { findById: jest.fn() },
        },
        {
          provide: DriverRepository,
          useValue: { findNearby: jest.fn() },
        },
        {
          provide: getRepositoryToken(Invoice),
          useClass: Repository,
        },
        InvoiceRepository,
      ],
    }).compile();

    useCase = module.get<ListPassengerNearbyDriversUseCase>(ListPassengerNearbyDriversUseCase);
    passengerRepository = module.get<PassengerRepository>(PassengerRepository);
    driverRepository = module.get<DriverRepository>(DriverRepository);
    invoiceRepository = module.get<Repository<Invoice>>(getRepositoryToken(Invoice));
    invoiceRepositoryInstance = module.get<InvoiceRepository>(InvoiceRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return nearby drivers for a passenger', async () => {
      const passengerId = '550e8400-e29b-41d4-a716-446655440003';
      const passenger: Passenger = {
        id: passengerId,
        name: 'María López',
        phone: '809-456-7890',
        created_at: new Date(),
      };
      const drivers: Driver[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Juan Pérez',
          phone: '1234567890',
          location: 'SRID=4326;POINT(-74.0060 40.7128)',
          status: 'available',
          created_at: new Date(),
        },
      ];
      jest.spyOn(passengerRepository, 'findById').mockResolvedValue(passenger);
      jest.spyOn(driverRepository, 'findNearby').mockResolvedValue(drivers);

      const result = await useCase.execute(passengerId);
      expect(result).toEqual(drivers);
      expect(passengerRepository.findById).toHaveBeenCalledWith(passengerId);
      expect(driverRepository.findNearby).toHaveBeenCalled();
    });

    it('should throw NotFoundException if passenger not found', async () => {
      const passengerId = '550e8400-e29b-41d4-a716-999999999999';
      jest.spyOn(passengerRepository, 'findById').mockResolvedValue(null);

      await expect(useCase.execute(passengerId)).rejects.toThrow(
        new NotFoundException(`Passenger with ID ${passengerId} not found`),
      );
    });

    it('should return empty array if no nearby drivers found', async () => {
      const passengerId = '550e8400-e29b-41d4-a716-446655440003';
      const passenger: Passenger = {
        id: passengerId,
        name: 'María López',
        phone: '809-456-7890',
        created_at: new Date(),
      };
      jest.spyOn(passengerRepository, 'findById').mockResolvedValue(passenger);
      jest.spyOn(driverRepository, 'findNearby').mockResolvedValue([]);

      const result = await useCase.execute(passengerId);
      expect(result).toEqual([]);
      expect(passengerRepository.findById).toHaveBeenCalledWith(passengerId);
      expect(driverRepository.findNearby).toHaveBeenCalled();
    });
  });

  // Pruebas relacionadas con InvoiceRepository.findAll
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
    jest.spyOn(invoiceRepository, 'createQueryBuilder').mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      cache: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([invoices, invoices.length]),
    } as any);

    const result = await invoiceRepositoryInstance.findAll(filters);
    expect(result).toEqual({
      items: invoices,
      meta: {
        total: invoices.length,
        page: filters.page ?? 1,
        limit: filters.limit ?? 10,
        totalPages: Math.ceil(invoices.length / (filters.limit ?? 10)),
      },
    });
    expect(invoiceRepository.createQueryBuilder).toHaveBeenCalledWith('invoice');
  });

  it('should return a list of invoices without passenger filter', async () => {
    const filters: InvoiceFiltersDto = { page: 1, limit: 10 };
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
    jest.spyOn(invoiceRepository, 'createQueryBuilder').mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      cache: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([invoices, invoices.length]),
    } as any);

    const result = await invoiceRepositoryInstance.findAll(filters);
    expect(result).toEqual({
      items: invoices,
      meta: {
        total: invoices.length,
        page: filters.page ?? 1,
        limit: filters.limit ?? 10,
        totalPages: Math.ceil(invoices.length / (filters.limit ?? 10)),
      },
    });
    expect(invoiceRepository.createQueryBuilder).toHaveBeenCalledWith('invoice');
    expect(invoiceRepository.createQueryBuilder().andWhere).not.toHaveBeenCalled();
  });
});