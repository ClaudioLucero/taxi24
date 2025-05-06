// src/application/use-cases/invoices/list-invoices.use-case.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InvoiceRepository } from '../../../infrastructure/repositories/invoice.repository';
import { Invoice } from '../../../domain/entities/invoice.entity';
import { InvoiceFiltersDto } from '../../../infrastructure/dtos/invoice.dto';

// Caso de uso para listar facturas aplicando filtros como pasajero, conductor o fechas, encapsulando la lógica de negocio.
@Injectable()
export class ListInvoicesUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(
    filters: InvoiceFiltersDto
  ): Promise<{ items: Invoice[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
    // Validar page y limit
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 100;
    if (page < 1) {
      throw new BadRequestException('El parámetro page debe ser mayor o igual a 1.');
    }
    if (limit < 1 || limit > 100) {
      throw new BadRequestException('El parámetro limit debe estar entre 1 y 100.');
    }

    return this.invoiceRepository.findAll({ ...filters, page, limit });
  }
}