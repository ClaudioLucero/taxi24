import { Test, TestingModule } from '@nestjs/testing';
import { TripsController } from '../../../infrastructure/controllers/trips.controller';
import { ListTripsUseCase } from '../../../application/use-cases/trips/list-trips.use-case';
import { GetTripUseCase } from '../../../application/use-cases/trips/get-trip.use-case';
import { CreateTripUseCase } from '../../../application/use-cases/trips/create-trip.use-case';
import { CompleteTripUseCase } from '../../../application/use-cases/trips/complete-trip.use-case';
import { GetTripInvoiceUseCase } from '../../../application/use-cases/invoices/get-trip-invoice.use-case';
import { Invoice } from '../../../domain/entities/invoice.entity';

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

  describe('getTripInvoice', () => {
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
      jest.spyOn(getTripInvoiceUseCase, 'execute').mockResolvedValue(invoice);

      const result = await controller.getTripInvoice('550e8400-e29b-41d4-a716-446655440006');
      expect(result).toEqual(invoice);
      expect(getTripInvoiceUseCase.execute).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440006');
    });
  });
});