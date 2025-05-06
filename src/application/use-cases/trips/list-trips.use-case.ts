// src/application/use-cases/trips/list-trips.use-case.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { TripRepository } from '../../../infrastructure/repositories/trip.repository';
import { Trip } from '../../../domain/entities/trip.entity';
import { ListTripsQueryDto } from '../../../infrastructure/dtos/trip.dto';

// Caso de uso para listar viajes, utilizando el repositorio de viajes para obtener datos con filtros y paginación.
@Injectable()
export class ListTripsUseCase {
  constructor(private readonly tripRepository: TripRepository) {}

  async execute(
    query: ListTripsQueryDto
  ): Promise<{ items: Trip[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
    // Validar page y limit
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 100;
    if (page < 1) {
      throw new BadRequestException('El parámetro page debe ser mayor o igual a 1.');
    }
    if (limit < 1 || limit > 100) {
      throw new BadRequestException('El parámetro limit debe estar entre 1 y 100.');
    }

    return this.tripRepository.findAll({ ...query, page, limit });
  }
}