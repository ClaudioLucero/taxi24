import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from '../../domain/entities/driver.entity';
import { NearbyDriversDto } from '../dtos/nearby-drivers.dto';

@Injectable()
export class DriverRepository {
  constructor(
    @InjectRepository(Driver)
    private readonly repository: Repository<Driver>,
  ) {}

  async findAll(): Promise<Driver[]> {
    return this.repository.find();
  }

  async findAvailable(): Promise<Driver[]> {
    return this.repository.find({ where: { status: 'available' } });
  }

  async findNearby(dto: NearbyDriversDto): Promise<Driver[]> {
    const { latitude, longitude, radius } = dto;
    const point = `SRID=4326;POINT(${longitude} ${latitude})`;
    return this.repository
      .createQueryBuilder('driver')
      .where('ST_DWithin(driver.location, ST_GeomFromText(:point), :radius * 1000)')
      .andWhere('driver.status = :status')
      .setParameters({ point, radius, status: 'available' })
      .getMany();
  }

  async findById(id: string): Promise<Driver | null> {
    return this.repository.findOne({ where: { id } });
  }

  async updateStatus(id: string, status: 'available' | 'busy' | 'offline'): Promise<void> {
    await this.repository.update(id, { status });
  }
}