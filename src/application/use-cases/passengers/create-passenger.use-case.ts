import { Injectable } from '@nestjs/common';
import { PassengerRepository } from '../../../infrastructure/repositories/passenger.repository';
import { Passenger } from '../../../domain/entities/passenger.entity';
import { CreatePassengerDto } from '../../../infrastructure/dtos/passenger.dto';

@Injectable()
export class CreatePassengerUseCase {
  constructor(private readonly passengerRepository: PassengerRepository) {}

  async execute(dto: CreatePassengerDto): Promise<Passenger> {
    return this.passengerRepository.create(dto);
  }
}