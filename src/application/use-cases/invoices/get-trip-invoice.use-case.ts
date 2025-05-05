import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { InvoiceRepository } from '../../../infrastructure/repositories/invoice.repository';
import { Invoice } from '../../../domain/entities/invoice.entity';

@Injectable()
export class GetTripInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {
    console.log('GetTripInvoiceUseCase initialized');
  }

  async execute(tripId: string): Promise<Invoice> {
    if (!isUUID(tripId)) {
      throw new BadRequestException(`Invalid UUID format for trip ID: ${tripId}`);
    }

    const invoice = await this.invoiceRepository.findByTripId(tripId);
    if (!invoice) {
      throw new NotFoundException(`Invoice for trip ID ${tripId} not found`);
    }
    return invoice;
  }
}