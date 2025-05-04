import { Injectable, NotFoundException } from '@nestjs/common';
import { InvoiceRepository } from '../../../infrastructure/repositories/invoice.repository';
import { Invoice } from '../../../domain/entities/invoice.entity';

@Injectable()
export class GetTripInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(tripId: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findByTripId(tripId);
    if (!invoice) {
      throw new NotFoundException(`Invoice for trip ID ${tripId} not found`);
    }
    return invoice;
  }
}