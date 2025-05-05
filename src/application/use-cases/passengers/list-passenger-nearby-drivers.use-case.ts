import { Injectable, NotFoundException } from '@nestjs/common';
import { PassengerRepository } from '../../../infrastructure/repositories/passenger.repository';
import { ListNearbyDriversUseCase } from '../drivers/list-nearby-drivers.use-case';
import { NearbyDriversDto } from '../../../infrastructure/dtos/nearby-drivers.dto';
import { Driver } from '../../../domain/entities/driver.entity';

@Injectable()
export class ListPassengerNearbyDriversUseCase {
  constructor(
    private readonly passengerRepository: PassengerRepository,
    private readonly listNearbyDriversUseCase: ListNearbyDriversUseCase,
  ) {}

  async execute(passengerId: string): Promise<Driver[]> {
    const passenger = await this.passengerRepository.findById(passengerId);
    if (!passenger) {
      throw new NotFoundException(`Passenger with ID ${passengerId} not found`);
    }
    const dto: NearbyDriversDto = {
      latitude: 40.7128, // Placeholder, ajustar según lógica real
      longitude: -74.0060,
      radius: 3,
    };
    return this.listNearbyDriversUseCase.execute(dto);
  }
}