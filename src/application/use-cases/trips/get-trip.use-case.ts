import { Injectable, NotFoundException } from '@nestjs/common';
import { TripRepository } from '../../../infrastructure/repositories/trip.repository';
import { Trip } from '../../../domain/entities/trip.entity';

@Injectable()
export class GetTripUseCase {
 constructor(private readonly tripRepository: TripRepository) {}

 async execute(id: string): Promise<Trip> {
 const trip = await this.tripRepository.findById(id);
 if (!trip) {
 throw new NotFoundException(`Trip with ID ${id} not found`);
 }
 return trip;
 }
}