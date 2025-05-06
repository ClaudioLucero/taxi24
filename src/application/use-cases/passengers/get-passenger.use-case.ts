import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { PassengerRepository } from '../../../infrastructure/repositories/passenger.repository';
import { Passenger } from '../../../domain/entities/passenger.entity';

// Caso de uso para obtener los datos de un pasajero por su ID, validando el formato del ID y verificando su existencia.
@Injectable()
export class GetPassengerUseCase {
  // Inyecta el repositorio de pasajeros para acceder a los datos
  constructor(private readonly passengerRepository: PassengerRepository) {}

  // Obtiene un pasajero por su ID, lanzando errores si el ID es inválido o el pasajero no existe
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
