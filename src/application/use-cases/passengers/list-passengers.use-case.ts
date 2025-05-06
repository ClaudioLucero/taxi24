import { Injectable } from '@nestjs/common';
import { PassengerRepository } from '../../../infrastructure/repositories/passenger.repository';
import { Passenger } from '../../../domain/entities/passenger.entity';

// Caso de uso para obtener la lista completa de pasajeros registrados en el sistema.
@Injectable()
export class ListPassengersUseCase {
  // Inyecta el repositorio de pasajeros para acceder a las operaciones de base de datos
  constructor(private readonly passengerRepository: PassengerRepository) {}

  // Obtiene todos los pasajeros almacenados en la base de datos
  async execute(): Promise<Passenger[]> {
    return this.passengerRepository.findAll();
  }
}
