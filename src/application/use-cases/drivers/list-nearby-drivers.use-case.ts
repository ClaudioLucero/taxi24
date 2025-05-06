import { Injectable } from '@nestjs/common';
import { DriverRepository } from '../../../infrastructure/repositories/driver.repository';
import { Driver } from '../../../domain/entities/driver.entity';
import { NearbyDriversDto } from '../../../infrastructure/dtos/nearby-drivers.dto';

// Caso de uso para obtener la lista de conductores disponibles cerca de una ubicación específica.
@Injectable()
export class ListNearbyDriversUseCase {
  // Inyecta el repositorio de conductores para acceder a las operaciones de base de datos
  constructor(private readonly driverRepository: DriverRepository) {}

  // Ejecuta la lógica para buscar conductores cercanos según las coordenadas y el radio proporcionados
  async execute(dto: NearbyDriversDto): Promise<Driver[]> {
    return this.driverRepository.findNearby(dto);
  }
}
