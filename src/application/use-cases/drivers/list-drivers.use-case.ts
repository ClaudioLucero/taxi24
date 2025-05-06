import { Injectable } from '@nestjs/common';
import { DriverRepository } from '../../../infrastructure/repositories/driver.repository';
import { Driver } from '../../../domain/entities/driver.entity';

// Caso de uso para obtener la lista de todos los conductores registrados en el sistema.
@Injectable()
export class ListDriversUseCase {
  // Inyecta el repositorio de conductores para acceder a los datos
  constructor(private readonly driverRepository: DriverRepository) {}

  // Obtiene todos los conductores llamando al método correspondiente del repositorio
  async execute(): Promise<Driver[]> {
    return this.driverRepository.findAll();
  }
}
