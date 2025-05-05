import { Injectable } from '@nestjs/common';
import { DriverRepository } from '../../../infrastructure/repositories/driver.repository';
import { Driver } from '../../../domain/entities/driver.entity';

@Injectable()
export class ListDriversUseCase {
  constructor(private readonly driverRepository: DriverRepository) {}

  async execute(): Promise<Driver[]> {
    return this.driverRepository.findAll();
  }
}