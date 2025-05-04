import { Test, TestingModule } from '@nestjs/testing';
import { TripsController } from '../../../infrastructure/controllers/trips.controller';
import { ListTripsUseCase } from '../../../application/use-cases/trips/list-trips.use-case';
import { GetTripUseCase } from '../../../application/use-cases/trips/get-trip.use-case';
import { CreateTripUseCase } from '../../../application/use-cases/trips/create-trip.use-case';
import { CompleteTripUseCase } from '../../../application/use-cases/trips/complete-trip.use-case';
import { GetTripInvoiceUseCase } from '../../../application/use-cases/invoices/get-trip-invoice.use-case';
import { Trip } from '../../../domain/entities/trip.entity';
import { Invoice } from '../../../domain/entities/invoice.entity';
import { CreateTripDto, CompleteTripDto, ListTripsQueryDto } from '../../../infrastructure/dtos/trip.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('TripsController', () => {
  let controller: TripsController;
  let listTripsUseCase: ListTripsUseCase;
  let getTripUseCase: GetTripUseCase;
  let createTripUseCase: CreateTripUseCase;
  let completeTripUseCase: CompleteTripUseCase;
  let getTripInvoiceUseCase: GetTripInvoiceUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripsController],
      providers: [
        {
          provide: ListTripsUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetTripUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: CreateTripUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: CompleteTripUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetTripInvoiceUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<TripsController>(TripsController);
    listTripsUseCase = module.get<ListTripsUseCase>(ListTripsUseCase);
    getTripUseCase = module.get<GetTripUseCase>(GetTripUseCase);
    createTripUseCase = module.get<CreateTripUseCase>(CreateTripUseCase);
    completeTripUseCase = module.get<CompleteTripUseCase>(CompleteTripUseCase);
    getTripInvoiceUseCase = module.get<GetTripInvoiceUseCase>(GetTripInvoiceUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
          completed_at: null,
          driver: { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Juan Pérez', status: 'available', created_at: new Date() } as any,
          passenger: { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Ana Martínez', created_at: new Date() } as any,
        },
      ];
      jest.spyOn(listTripsUseCase, 'execute').mockResolvedValue({ trips, total: trips.length });

      const result = await controller.findAll({});
      expect(result).toEqual({ trips, total: trips.length });
      expect(listTripsUseCase.execute).toHaveBeenCalledWith({});
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
        completed_at: null,
        driver: { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Juan Pérez', status: 'available', created_at: new Date() } as any,
        passenger: { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Ana Martínez', created_at: new Date() } as any,
      };
      jest.spyOn(getTripUseCase, 'execute').mockResolvedValue(trip);

      const result = await controller.findById('550e8400-e29b-41d4-a716-446655440005');
      expect(result).toEqual(trip);
      expect(getTripUseCase.execute).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440005');
    });

    it('should throw NotFoundException if trip not found', async () => {
      jest.spyOn(getTripUseCase, 'execute').mockRejectedValue(new NotFoundException('Trip with ID invalid-id not found'));

      await expect(controller.findById('invalid-id')).rejects.toThrow(NotFoundException);
      expect(getTripUseCase.execute).toHaveBeenCalledWith('invalid-id');
    });
  });

  describe('create', () => {
    it('should create a new trip', async () => {
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
      const trip: Trip = {
        id: 'a6c4c08c-54b8-4640-8751-4cd896e9e391',
        driver_id: dto.driver_id,
        passenger_id: dto.passenger_id,
        start_location: 'SRID=4326;POINT(-74.006 40.7128)',
        end_location: 'SRID=4326;POINT(-74.0 40.73)',
        status: 'active',
        cost: 25.00,
        created_at: new Date(),
        completed_at: null,
        driver: { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Juan Pérez', status: 'busy', created_at: new Date() } as any,
        passenger: { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Ana Martínez', created_at: new Date() } as any,
      };
      jest.spyOn(createTripUseCase, 'execute').mockResolvedValue(trip);

      const result = await controller.create(dto);
      expect(result).toEqual(trip);
      expect(createTripUseCase.execute).toHaveBeenCalledWith(dto);
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
      jest.spyOn(createTripUseCase, 'execute').mockRejectedValue(
        new BadRequestException('Driver with ID 550e8400-e29b-41d4-a716-446655440000 is not available'),
      );

      await expect(controller.create(dto)).rejects.toThrow(BadRequestException);
      expect(createTripUseCase.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe('complete', () => {
    it('should complete a trip', async () => {
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
        driver: { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Juan Pérez', status: 'available', created_at: new Date() } as any,
        passenger: { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Ana Martínez', created_at: new Date() } as any,
      };
      jest.spyOn(completeTripUseCase, 'execute').mockResolvedValue(trip);

      const result = await controller.complete('550e8400-e29b-41d4-a716-446655440005', dto);
      expect(result).toEqual(trip);
      expect(completeTripUseCase.execute).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440005', dto);
    });

    it('should throw NotFoundException if trip not found', async () => {
      const dto: CompleteTripDto = { cost: 15.50 };
      jest.spyOn(completeTripUseCase, 'execute').mockRejectedValue(new NotFoundException('Trip with ID invalid-id not found'));

      await expect(controller.complete('invalid-id', dto)).rejects.toThrow(NotFoundException);
      expect(completeTripUseCase.execute).toHaveBeenCalledWith('invalid-id', dto);
    });

    it('should throw BadRequestException if trip is not active', async () => {
      const dto: CompleteTripDto = { cost: 15.50 };
      jest.spyOn(completeTripUseCase, 'execute').mockRejectedValue(new BadRequestException('Trip with ID 550e8400-e29b-41d4-a716-446655440005 is not active'));

      await expect(controller.complete('550e8400-e29b-41d4-a716-446655440005', dto)).rejects.toThrow(BadRequestException);
      expect(completeTripUseCase.execute).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440005', dto);
    });
  });

  describe('getTripInvoice', () => {
    it('should return the invoice for a trip', async () => {
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
        } as any,
      };
      jest.spyOn(getTripInvoiceUseCase, 'execute').mockResolvedValue(invoice);

      const result = await controller.getTripInvoice('550e8400-e29b-41d4-a716-446655440006');
      expect(result).toEqual(invoice);
      expect(getTripInvoiceUseCase.execute).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440006');
    });

    it('should throw NotFoundException if invoice not found', async () => {
      jest.spyOn(getTripInvoiceUseCase, 'execute').mockRejectedValue(
        new NotFoundException('Invoice for trip ID invalid-id not found'),
      );

      await expect(controller.getTripInvoice('invalid-id')).rejects.toThrow(NotFoundException);
      expect(getTripInvoiceUseCase.execute).toHaveBeenCalledWith('invalid-id');
    });
  });
});