import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from '../../../infrastructure/controllers/invoices.controller';
import { ListInvoicesUseCase } from '../../../application/use-cases/invoices/list-invoices.use-case';
import { GetTripInvoiceUseCase } from '../../../application/use-cases/invoices/get-trip-invoice.use-case';
import { Invoice } from '../../../domain/entities/invoice.entity';
import { InvoiceFiltersDto } from '../../../infrastructure/dtos/invoice.dto';

describe('InvoicesController', () => {
  let controller: InvoicesController;
  let listInvoicesUseCase: ListInvoicesUseCase;
  let getTripInvoiceUseCase: GetTripInvoiceUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [
        {
          provide: ListInvoicesUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetTripInvoiceUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<InvoicesController>(InvoicesController);
    listInvoicesUseCase = module.get<ListInvoicesUseCase>(ListInvoicesUseCase);
    getTripInvoiceUseCase = module.get<GetTripInvoiceUseCase>(
      GetTripInvoiceUseCase
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listInvoices', () => {
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
          amount: 20.0,
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
      jest
        .spyOn(listInvoicesUseCase, 'execute')
        .mockResolvedValue({ invoices, total: invoices.length });

      const result = await controller.listInvoices(filters);
      expect(result).toEqual({ invoices, total: invoices.length });
      expect(listInvoicesUseCase.execute).toHaveBeenCalledWith(filters);
    });

    it('should handle empty filters', async () => {
      const filters: InvoiceFiltersDto = {};
      const invoices: Invoice[] = [];
      jest
        .spyOn(listInvoicesUseCase, 'execute')
        .mockResolvedValue({ invoices, total: 0 });

      const result = await controller.listInvoices(filters);
      expect(result).toEqual({ invoices, total: 0 });
      expect(listInvoicesUseCase.execute).toHaveBeenCalledWith({});
    });
  });
});
