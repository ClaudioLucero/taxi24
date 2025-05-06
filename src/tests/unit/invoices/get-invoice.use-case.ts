import { Test, TestingModule } from '@nestjs/testing';
import { GetInvoiceUseCase } from '../../../application/use-cases/invoices/get-invoice.use-case';
import { InvoiceRepository } from '../../../infrastructure/repositories/invoice.repository';
import { Invoice } from '../../../domain/entities/invoice.entity';
import { NotFoundException } from '@nestjs/common';

describe('GetInvoiceUseCase', () => {
  let useCase: GetInvoiceUseCase;
  let invoiceRepository: InvoiceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetInvoiceUseCase,
        {
          provide: InvoiceRepository,
          useValue: { findById: jest.fn() },
        },
      ],
    }).compile();

    useCase = module.get<GetInvoiceUseCase>(GetInvoiceUseCase);
    invoiceRepository = module.get<InvoiceRepository>(InvoiceRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return an invoice by ID', async () => {
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
      jest.spyOn(invoiceRepository, 'findById').mockResolvedValue(invoice);

      const result = await useCase.execute('550e8400-e29b-41d4-a716-446655440007');
      expect(result).toEqual(invoice);
      expect(invoiceRepository.findById).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440007');
    });

    it('should throw NotFoundException if invoice not found', async () => {
      jest.spyOn(invoiceRepository, 'findById').mockResolvedValue(null);

      await expect(useCase.execute('550e8400-e29b-41d4-a716-999999999999')).rejects.toThrow(
        new NotFoundException(`Invoice with ID 550e8400-e29b-41d4-a716-999999999999 not found`),
      );
    });
  });
});