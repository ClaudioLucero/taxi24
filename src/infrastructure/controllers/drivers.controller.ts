import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ListDriversUseCase } from '../../application/use-cases/drivers/list-drivers.use-case';
import { ListAvailableDriversUseCase } from '../../application/use-cases/drivers/list-available-drivers.use-case';
import { ListNearbyDriversUseCase } from '../../application/use-cases/drivers/list-nearby-drivers.use-case';
import { NearbyDriversDto } from '../dtos/nearby-drivers.dto';
import { Driver } from '../../domain/entities/driver.entity';

// Controlador que maneja las solicitudes HTTP relacionadas con conductores, proporcionando endpoints para listar todos, los disponibles y los cercanos a una ubicación.
@ApiTags('Conductores')
@Controller('drivers')
export class DriversController {
  constructor(
    private readonly listDriversUseCase: ListDriversUseCase,
    private readonly listAvailableDriversUseCase: ListAvailableDriversUseCase,
    private readonly listNearbyDriversUseCase: ListNearbyDriversUseCase
  ) {}

  // Endpoint para obtener la lista de todos los conductores
  @Get()
  @ApiOperation({ summary: 'Listar todos los conductores' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos los conductores registrados en el sistema.',
    type: [Driver],
    example: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Juan Pérez',
        phone: '1234567890',
        location: 'SRID=4326;POINT(-74.006 40.7128)',
        status: 'available',
        created_at: '2025-05-06T12:00:00Z',
      },
    ],
  })
  async findAll(): Promise<Driver[]> {
    return this.listDriversUseCase.execute();
  }

  // Endpoint para obtener la lista de conductores disponibles
  @Get('available')
  @ApiOperation({ summary: 'Listar conductores disponibles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de conductores con estado "disponible".',
    type: [Driver],
    example: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Juan Pérez',
        phone: '1234567890',
        location: 'SRID=4326;POINT(-74.006 40.7128)',
        status: 'available',
        created_at: '2025-05-06T12:00:00Z',
      },
    ],
  })
  async findAvailable(): Promise<Driver[]> {
    return this.listAvailableDriversUseCase.execute();
  }

  // Endpoint para obtener la lista de conductores cercanos según coordenadas
  @Get('nearby')
  @ApiOperation({ summary: 'Listar conductores cercanos a una ubicación' })
  @ApiQuery({
    name: 'latitude',
    required: true,
    type: Number,
    description: 'Latitud de la ubicación (entre -90 y 90).',
    example: 40.7128,
  })
  @ApiQuery({
    name: 'longitude',
    required: true,
    type: Number,
    description: 'Longitud de la ubicación (entre -180 y 180).',
    example: -74.006,
  })
  @ApiQuery({
    name: 'radius',
    required: true,
    type: Number,
    description: 'Radio de búsqueda en kilómetros (mínimo 0).',
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de conductores disponibles dentro del radio especificado.',
    type: [Driver],
    example: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Juan Pérez',
        phone: '1234567890',
        location: 'SRID=4326;POINT(-74.006 40.7128)',
        status: 'available',
        created_at: '2025-05-06T12:00:00Z',
      },
    ],
  })
  @ApiBadRequestResponse({
    description: 'Parámetros inválidos (por ejemplo, coordenadas fuera de rango o radio negativo).',
  })
  async findNearby(@Query() dto: NearbyDriversDto): Promise<Driver[]> {
    return this.listNearbyDriversUseCase.execute(dto);
  }
}