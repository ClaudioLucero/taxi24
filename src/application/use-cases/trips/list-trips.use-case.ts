import { Injectable } from '@nestjs/common';
import { TripRepository } from '../../../infrastructure/repositories/trip.repository';
import { Trip } from '../../../domain/entities/trip.entity';
import { ListTripsQueryDto } from '../../../infrastructure/dtos/trip.dto';

@Injectable()
export class ListTripsUseCase {
  constructor(private readonly tripRepository: TripRepository) {}

  async execute(
    query: ListTripsQueryDto
  ): Promise<{ trips: Trip[]; total: number }> {
    return this.tripRepository.findAll(query);
  }
}
