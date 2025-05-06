import { Injectable } from '@nestjs/common';
import { TripRepository } from '../../../infrastructure/repositories/trip.repository';
import { Trip } from '../../../domain/entities/trip.entity';
import { ListTripsQueryDto } from '../../../infrastructure/dtos/trip.dto';

// Caso de uso para listar viajes, utilizando el repositorio de viajes para obtener datos con filtros y paginación.
@Injectable()
export class ListTripsUseCase {
  // Inyecta el repositorio de viajes para acceder a los datos
  constructor(private readonly tripRepository: TripRepository) {}

  // Ejecuta la lógica para obtener una lista de viajes según los filtros proporcionados
  async execute(
    query: ListTripsQueryDto
  ): Promise<{ trips: Trip[]; total: number }> {
    return this.tripRepository.findAll(query);
  }
}
