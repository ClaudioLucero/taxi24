import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { InvoiceRepository } from '../../../infrastructure/repositories/invoice.repository';
import { Invoice } from '../../../domain/entities/invoice.entity';

// Caso de uso para obtener la factura asociada a un viaje específico, validando el ID del viaje y manejando errores si no se encuentra la factura.
@Injectable()
export class GetTripInvoiceUseCase {
  // Inyecta el repositorio de facturas para acceder a los datos
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  // Obtiene la factura de un viaje por su ID, validando el formato UUID y verificando su existencia
  async execute(tripId: string): Promise<Invoice> {
    if (!isUUID(tripId)) {
      throw new BadRequestException(
        `Invalid UUID format for trip ID: ${tripId}`
      );
    }

    const invoice = await this.invoiceRepository.findByTripId(tripId);
    if (!invoice) {
      throw new NotFoundException(`Invoice for trip ID ${tripId} not found`);
    }
    return invoice;
  }
}
