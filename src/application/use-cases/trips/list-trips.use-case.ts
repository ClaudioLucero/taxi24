import { Injectable } from '@nestjs/common';
import { TripRepository } from '../../../infrastructure/repositories/trip.repository';
import { Trip } from '../../../domain/entities/trip.entity';

@Injectable()
export class ListTripsUseCase {
 constructor(private readonly tripRepository: TripRepository) {}

 async execute(): Promise<Trip[]> {
 return this.tripRepository.findAll();
 }
}