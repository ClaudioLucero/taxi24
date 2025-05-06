import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from '../../../infrastructure/controllers/invoices.controller';
import { ListInvoicesUseCase } from '../../../application/use-cases/invoices/list-invoices.use-case';
import { Invoice } from '../../../domain/entities/invoice.entity';
import { InvoiceFiltersDto } from '../../../infrastructure/dtos/invoice.dto';

describe('InvoicesController', () => {
  let controller: InvoicesController;
  let listInvoicesUseCase: ListInvoicesUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [
        {
          provide: ListInvoicesUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<InvoicesController>(InvoicesController);
    listInvoicesUseCase = module.get<ListInvoicesUseCase>(ListInvoicesUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listInvoices', () => {
    it('should return a list of invoices', async () => {
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
      jest.spyOn(listInvoicesUseCase, 'execute').mockResolvedValue({
        items: invoices,
        meta: {
          total: invoices.length,
          page: filters.page ?? 1,
          limit: filters.limit ?? 10,
          totalPages: Math.ceil(invoices.length / (filters.limit ?? 10)),
        },
      });

      const result = await controller.listInvoices(filters);
      expect(result).toEqual({
        items: invoices,
        meta: {
          total: invoices.length,
          page: filters.page ?? 1,
          limit: filters.limit ?? 10,
          totalPages: Math.ceil(invoices.length / (filters.limit ?? 10)),
        },
      });
      expect(listInvoicesUseCase.execute).toHaveBeenCalledWith(filters);
    });

    it('should return an empty list of invoices', async () => {
      const filters: InvoiceFiltersDto = { page: 1, limit: 10 };
      jest.spyOn(listInvoicesUseCase, 'execute').mockResolvedValue({
        items: [],
        meta: {
          total: 0,
          page: filters.page ?? 1,
          limit: filters.limit ?? 10,
          totalPages: 0,
        },
      });

      const result = await controller.listInvoices(filters);
      expect(result).toEqual({
        items: [],
        meta: {
          total: 0,
          page: filters.page ?? 1,
          limit: filters.limit ?? 10,
          totalPages: 0,
        },
      });
      expect(listInvoicesUseCase.execute).toHaveBeenCalledWith(filters);
    });
    
  });
});