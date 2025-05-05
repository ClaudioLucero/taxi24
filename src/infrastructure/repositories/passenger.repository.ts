import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { Passenger } from '../../domain/entities/passenger.entity';
import { CreatePassengerDto } from '../dtos/passenger.dto';

@Injectable()
export class PassengerRepository {
  constructor(
    @InjectRepository(Passenger)
    private readonly repository: Repository<Passenger>,
  ) {
    console.log('PassengerRepository initialized');
  }

  async findAll(): Promise<Passenger[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Passenger | null> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format for passenger ID: ${id}`);
    }
    return this.repository.findOne({ where: { id } });
  }

  async create(dto: CreatePassengerDto): Promise<Passenger> {
    const passenger = this.repository.create(dto);
    return this.repository.save(passenger);
  }
}