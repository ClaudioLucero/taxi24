import { Injectable } from '@nestjs/common';
import { DriverRepository } from '../../../infrastructure/repositories/driver.repository';
import { Driver } from '../../../domain/entities/driver.entity';

// Caso de uso para obtener la lista de conductores disponibles en el sistema.
@Injectable()
export class ListAvailableDriversUseCase {
  // Inyecta el repositorio de conductores para acceder a datos de la base de datos
  constructor(private readonly driverRepository: DriverRepository) {}

  // Ejecuta la lógica para buscar y retornar conductores con estado DISPONIBLE
  async execute(): Promise<Driver[]> {
    return this.driverRepository.findAvailable();
  }
}
