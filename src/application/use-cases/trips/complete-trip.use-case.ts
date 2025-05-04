import { Injectable } from '@nestjs/common';
import { TripRepository } from '../../../infrastructure/repositories/trip.repository';
import { Trip } from '../../../domain/entities/trip.entity';
import { CompleteTripDto } from '../../../infrastructure/dtos/trip.dto';

@Injectable()
export class CompleteTripUseCase {
 constructor(private readonly tripRepository: TripRepository) {}

 async execute(id: string, dto: CompleteTripDto): Promise<Trip> {
 return this.tripRepository.complete(id, dto);
 }
}