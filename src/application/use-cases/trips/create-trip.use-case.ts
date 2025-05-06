import { Injectable } from '@nestjs/common';
import { TripRepository } from '../../../infrastructure/repositories/trip.repository';
import { Trip } from '../../../domain/entities/trip.entity';
import { CreateTripDto } from '../../../infrastructure/dtos/trip.dto';

// Caso de uso para crear un nuevo viaje, encapsulando la lógica de negocio y delegando la persistencia al repositorio de viajes.
@Injectable()
export class CreateTripUseCase {
  // Inyecta el repositorio de viajes para realizar operaciones en la base de datos
  constructor(private readonly tripRepository: TripRepository) {}

  // Crea un nuevo viaje a partir de los datos proporcionados y lo guarda en la base de datos
  async execute(dto: CreateTripDto): Promise<Trip> {
    return this.tripRepository.create(dto);
  }
}
