import { Injectable, BadRequestException } from '@nestjs/common';
import { TripRepository } from '../../../infrastructure/repositories/trip.repository';
import { InvoiceRepository } from '../../../infrastructure/repositories/invoice.repository';
import { Trip } from '../../../domain/entities/trip.entity';
import { CompleteTripDto } from '../../../infrastructure/dtos/trip.dto';

// Caso de uso para completar un viaje, actualizando su estado y generando una factura automáticamente.
@Injectable()
export class CompleteTripUseCase {
  // Inyecta los repositorios necesarios para manejar viajes y facturas
  constructor(
    private readonly tripRepository: TripRepository,
    private readonly invoiceRepository: InvoiceRepository
  ) {}

  // Completa un viaje por su ID, actualiza sus datos y crea una factura asociada
  async execute(id: string, dto: CompleteTripDto): Promise<Trip> {
    // Finaliza el viaje usando el repositorio y los datos proporcionados
    const trip = await this.tripRepository.complete(id, dto);

    // Genera una factura con el ID del viaje y el costo especificado
    await this.invoiceRepository.create({
      trip_id: trip.id,
      amount: dto.cost,
    });

    // Retorna el viaje actualizado
    return trip;
  }
}
