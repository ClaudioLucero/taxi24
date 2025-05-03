import { Injectable } from '@nestjs/common';
import { DriverRepository } from '../../../infrastructure/repositories/driver.repository';
import { Driver } from '../../../domain/entities/driver.entity';
import { NearbyDriversDto } from '../../../infrastructure/dtos/nearby-drivers.dto';

@Injectable()
export class ListNearbyDriversUseCase {
  constructor(private readonly driverRepository: DriverRepository) {}

  async execute(dto: NearbyDriversDto): Promise<Driver[]> {
    return this.driverRepository.findNearby(dto);
  }
}
