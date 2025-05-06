import { Injectable, NotFoundException } from '@nestjs/common';
import { TripRepository } from '../../../infrastructure/repositories/trip.repository';
import { Trip } from '../../../domain/entities/trip.entity';

// Caso de uso para obtener un viaje por su ID, encapsulando la lógica de negocio para buscar y validar la existencia del viaje.
@Injectable()
export class GetTripUseCase {
  // Inyecta el repositorio de viajes para acceder a los datos
  constructor(private readonly tripRepository: TripRepository) {}

  // Busca un viaje por su ID y lanza una excepción si no se encuentra
  async execute(id: string): Promise<Trip> {
    const trip = await this.tripRepository.findById(id);
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }
    return trip;
  }
}
