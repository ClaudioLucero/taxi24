import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { PassengerRepository } from '../../../infrastructure/repositories/passenger.repository';
import { Passenger } from '../../../domain/entities/passenger.entity';

@Injectable()
export class GetPassengerUseCase {
  constructor(private readonly passengerRepository: PassengerRepository) {}

  async execute(id: string): Promise<Passenger> {
    if (!isUUID(id)) {
      throw new BadRequestException(
        `Invalid UUID format for passenger ID: ${id}`
      );
    }

    const passenger = await this.passengerRepository.findById(id);
    if (!passenger) {
      throw new NotFoundException(`Passenger with ID ${id} not found`);
    }
    return passenger;
  }
}
