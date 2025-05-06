import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { Passenger } from '../../domain/entities/passenger.entity';
import { CreatePassengerDto } from '../dtos/passenger.dto';

// Repositorio para gestionar operaciones de base de datos relacionadas con pasajeros, como listar, buscar por ID y crear nuevos registros.
@Injectable()
export class PassengerRepository {
  // Inyecta el repositorio de TypeORM para la entidad Passenger
  constructor(
    @InjectRepository(Passenger)
    private readonly repository: Repository<Passenger>
  ) {}

  // Obtiene todos los pasajeros registrados en la base de datos
  async findAll(): Promise<Passenger[]> {
    return this.repository.find();
  }

  // Busca un pasajero por su ID, validando que el ID sea un UUID válido
  async findById(id: string): Promise<Passenger | null> {
    if (!isUUID(id)) {
      throw new BadRequestException(
        `Invalid UUID format for passenger ID: ${id}`
      );
    }
    return this.repository.findOne({ where: { id } });
  }

  // Crea un nuevo pasajero a partir de los datos proporcionados
  async create(dto: CreatePassengerDto): Promise<Passenger> {
    const passenger = this.repository.create(dto);
    return this.repository.save(passenger);
  }
}
