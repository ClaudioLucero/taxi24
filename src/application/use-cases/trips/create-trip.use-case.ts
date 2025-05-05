import { Injectable } from '@nestjs/common';
import { TripRepository } from '../../../infrastructure/repositories/trip.repository';
import { Trip } from '../../../domain/entities/trip.entity';
import { CreateTripDto } from '../../../infrastructure/dtos/trip.dto';

@Injectable()
export class CreateTripUseCase {
  constructor(private readonly tripRepository: TripRepository) {}

  async execute(dto: CreateTripDto): Promise<Trip> {
    return this.tripRepository.create(dto);
  }
}
