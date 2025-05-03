import { Injectable } from '@nestjs/common';
import { PassengerRepository } from '../../../infrastructure/repositories/passenger.repository';
import { Passenger } from '../../../domain/entities/passenger.entity';

@Injectable()
export class ListPassengersUseCase {
  constructor(private readonly passengerRepository: PassengerRepository) {}

  async execute(): Promise<Passenger[]> {
    return this.passengerRepository.findAll();
  }
}