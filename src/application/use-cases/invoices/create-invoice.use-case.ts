import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from '../../../infrastructure/repositories/invoice.repository';
import { Invoice } from '../../../domain/entities/invoice.entity';
import { CreateInvoiceDto } from '../../../infrastructure/dtos/invoice.dto';

// Caso de uso para manejar la lógica de negocio relacionada con la creación de facturas, delegando las operaciones de persistencia al repositorio.
@Injectable()
export class CreateInvoiceUseCase {
  // Inyecta el repositorio de facturas para acceder a operaciones de base de datos
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  // Crea una nueva factura utilizando los datos proporcionados en el DTO
  async execute(dto: CreateInvoiceDto): Promise<Invoice> {
    return this.invoiceRepository.create(dto);
  }
}
