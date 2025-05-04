import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from '../../../infrastructure/repositories/invoice.repository';
import { Invoice } from '../../../domain/entities/invoice.entity';
import { CreateInvoiceDto } from '../../../infrastructure/dtos/invoice.dto';

@Injectable()
export class CreateInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(dto: CreateInvoiceDto): Promise<Invoice> {
    return this.invoiceRepository.create(dto);
  }
}