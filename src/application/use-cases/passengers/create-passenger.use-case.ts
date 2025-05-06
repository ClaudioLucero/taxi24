import { Injectable } from '@nestjs/common';
import { PassengerRepository } from '../../../infrastructure/repositories/passenger.repository';
import { Passenger } from '../../../domain/entities/passenger.entity';
import { CreatePassengerDto } from '../../../infrastructure/dtos/passenger.dto';

// Caso de uso para manejar la lógica de negocio de creación de un nuevo pasajero en el sistema.
@Injectable()
export class CreatePassengerUseCase {
  // Inyecta el repositorio de pasajeros para realizar operaciones en la base de datos
  constructor(private readonly passengerRepository: PassengerRepository) {}

  // Crea un nuevo pasajero usando los datos proporcionados en el DTO
  async execute(dto: CreatePassengerDto): Promise<Passenger> {
    return this.passengerRepository.create(dto);
  }
}
