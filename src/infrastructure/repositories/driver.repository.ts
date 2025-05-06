import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from '../../domain/entities/driver.entity';
import { NearbyDriversDto } from '../dtos/nearby-drivers.dto';
import { DriverStatus } from '../../domain/entities/enums/driver-status.enum';

// Repositorio para gestionar operaciones de base de datos relacionadas con conductores, como buscar, filtrar por disponibilidad o ubicación, y actualizar estados.
@Injectable()
export class DriverRepository {
  // Inyecta el repositorio de TypeORM para la entidad Driver
  constructor(
    @InjectRepository(Driver)
    private readonly repository: Repository<Driver>
  ) {}

  // Obtiene todos los conductores de la base de datos
  async findAll(): Promise<Driver[]> {
    return this.repository.find();
  }

  // Busca conductores con estado DISPONIBLE
  async findAvailable(): Promise<Driver[]> {
    return this.repository.find({ where: { status: DriverStatus.AVAILABLE } });
  }

  // Busca conductores disponibles cerca de una ubicación, usando coordenadas y un radio
  async findNearby(dto: NearbyDriversDto): Promise<Driver[]> {
    const { latitude, longitude, radius } = dto;
    console.log('findNearby called with:', {
      latitude,
      longitude,
      radius,
      types: { latitude: typeof latitude, longitude: typeof longitude },
    });
    // Evita procesar coordenadas (0, 0)
    if (Number(latitude) === 0 && Number(longitude) === 0) {
      console.log('Returning empty array for (0, 0) coordinates');
      return [];
    }
    // Valida que el radio sea positivo
    if (radius <= 0) {
      console.log('Invalid radius:', radius);
      throw new BadRequestException('Radius must be greater than 0');
    }
    // Valida que las coordenadas sean números válidos
    if (isNaN(latitude) || isNaN(longitude)) {
      console.log('Invalid coordinates:', { latitude, longitude });
      throw new BadRequestException('Invalid latitude or longitude');
    }
    console.log('Executing ST_DWithin query with:', {
      latitude,
      longitude,
      radius: radius * 1000,
    });
    // Usa una consulta espacial para encontrar conductores dentro del radio especificado
    return this.repository
      .createQueryBuilder('driver')
      .where(
        'ST_DWithin(driver.location, ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), :radius) AND driver.status = :status'
      )
      .andWhere('driver.location IS NOT NULL')
      .setParameters({
        latitude,
        longitude,
        radius: radius * 1000, // Convierte kilómetros a metros para la consulta
        status: DriverStatus.AVAILABLE,
      })
      .getMany();
  }

  // Busca un conductor por su ID, retorna null si no lo encuentra
  async findById(id: string): Promise<Driver | null> {
    return this.repository.findOne({ where: { id } });
  }

  // Actualiza el estado de un conductor por su ID
  async updateStatus(id: string, status: DriverStatus): Promise<void> {
    await this.repository.update({ id }, { status });
  }
}
