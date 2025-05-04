import { Injectable, BadRequestException } from '@nestjs/common';
import { TripRepository } from '../../../infrastructure/repositories/trip.repository';
import { InvoiceRepository } from '../../../infrastructure/repositories/invoice.repository';
import { Trip } from '../../../domain/entities/trip.entity';
import { CompleteTripDto } from '../../../infrastructure/dtos/trip.dto';

@Injectable()
export class CompleteTripUseCase {
  constructor(
    private readonly tripRepository: TripRepository,
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute(id: string, dto: CompleteTripDto): Promise<Trip> {
    const trip = await this.tripRepository.complete(id, dto);

    // Generar factura automáticamente
    await this.invoiceRepository.create({
      trip_id: trip.id,
      amount: dto.cost,
    });

    return trip;
  }
}