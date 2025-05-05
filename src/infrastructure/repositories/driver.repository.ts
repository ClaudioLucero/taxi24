import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from '../../domain/entities/driver.entity';
import { NearbyDriversDto } from '../dtos/nearby-drivers.dto';
import { DriverStatus } from '../../domain/entities/enums/driver-status.enum';

@Injectable()
export class DriverRepository {
  constructor(
    @InjectRepository(Driver)
    private readonly repository: Repository<Driver>,
  ) {
    console.log('DriverRepository initialized');
  }

  async findAll(): Promise<Driver[]> {
    return this.repository.find();
  }

  async findAvailable(): Promise<Driver[]> {
    return this.repository.find({ where: { status: DriverStatus.AVAILABLE } });
  }

  async findNearby(dto: NearbyDriversDto): Promise<Driver[]> {
    const { latitude, longitude, radius } = dto;
    console.log('findNearby called with:', { latitude, longitude, radius, types: { latitude: typeof latitude, longitude: typeof longitude } });
    // Validar coordenadas (0, 0)
    if (Number(latitude) === 0 && Number(longitude) === 0) {
      console.log('Returning empty array for (0, 0) coordinates');
      return [];
    }
    // Validar que radius sea positivo
    if (radius <= 0) {
      console.log('Invalid radius:', radius);
      throw new BadRequestException('Radius must be greater than 0');
    }
    // Validar que latitude y longitude sean números válidos
    if (isNaN(latitude) || isNaN(longitude)) {
      console.log('Invalid coordinates:', { latitude, longitude });
      throw new BadRequestException('Invalid latitude or longitude');
    }
    console.log('Executing ST_DWithin query with:', { latitude, longitude, radius: radius * 1000 });
    return this.repository
      .createQueryBuilder('driver')
      .where(
        'ST_DWithin(driver.location, ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), :radius) AND driver.status = :status',
      )
      .andWhere('driver.location IS NOT NULL')
      .setParameters({
        latitude,
        longitude,
        radius: radius * 1000, // Convertir km a metros
        status: DriverStatus.AVAILABLE,
      })
      .getMany();
  }

  async findById(id: string): Promise<Driver | null> {
    return this.repository.findOne({ where: { id } });
  }

  async updateStatus(id: string, status: DriverStatus): Promise<void> {
    await this.repository.update({ id }, { status });
  }
}