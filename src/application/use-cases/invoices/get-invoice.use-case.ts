import { Injectable, NotFoundException } from '@nestjs/common';
import { InvoiceRepository } from '../../../infrastructure/repositories/invoice.repository';
import { Invoice } from '../../../domain/entities/invoice.entity';

// Caso de uso para obtener una factura por su ID, encapsulando la lógica de negocio y la interacción con el repositorio de facturas.
@Injectable()
export class GetInvoiceUseCase {
  // Inyecta el repositorio de facturas para acceder a los datos
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  // Busca una factura por su ID y la retorna, lanzando una excepción si no se encuentra
  async execute(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findById(id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }
}
