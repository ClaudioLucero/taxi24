import { Injectable, NotFoundException } from '@nestjs/common';
import { PassengerRepository } from '../../../infrastructure/repositories/passenger.repository';
import { Passenger } from '../../../domain/entities/passenger.entity';

@Injectable()
export class GetPassengerUseCase {
  constructor(private readonly passengerRepository: PassengerRepository) {}

  async execute(id: string): Promise<Passenger> {
    const passenger = await this.passengerRepository.findById(id);
    if (!passenger) {
      throw new NotFoundException(`Passenger with ID ${id} not found`);
    }
    return passenger;
  }
}