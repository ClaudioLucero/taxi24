import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from '../../../infrastructure/repositories/invoice.repository';
import { Invoice } from '../../../domain/entities/invoice.entity';
import { InvoiceFiltersDto } from '../../../infrastructure/dtos/invoice.dto';

// Caso de uso para listar facturas aplicando filtros como pasajero, conductor o fechas, encapsulando la lógica de negocio.
@Injectable()
export class ListInvoicesUseCase {
  // Inyecta el repositorio de facturas para acceder a las operaciones de base de datos
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  // Ejecuta la lógica para obtener una lista de facturas con filtros y devuelve los resultados junto con el total
  async execute(
    filters: InvoiceFiltersDto
  ): Promise<{ invoices: Invoice[]; total: number }> {
    return this.invoiceRepository.findAll(filters);
  }
}
