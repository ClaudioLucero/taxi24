import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from '../../../infrastructure/repositories/invoice.repository';
import { Invoice } from '../../../domain/entities/invoice.entity';
import { InvoiceFiltersDto } from '../../../infrastructure/dtos/invoice.dto';

@Injectable()
export class ListInvoicesUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(filters: InvoiceFiltersDto): Promise<{ invoices: Invoice[]; total: number }> {
    return this.invoiceRepository.findAll(filters);
  }
}