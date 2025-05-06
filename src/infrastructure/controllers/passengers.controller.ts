import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ListPassengersUseCase } from '../../application/use-cases/passengers/list-passengers.use-case';
import { GetPassengerUseCase } from '../../application/use-cases/passengers/get-passenger.use-case';
import { CreatePassengerUseCase } from '../../application/use-cases/passengers/create-passenger.use-case';
import { ListNearbyDriversUseCase } from '../../application/use-cases/drivers/list-nearby-drivers.use-case';
import { CreatePassengerDto } from '../dtos/passenger.dto';
import { NearbyDriversDto } from '../dtos/nearby-drivers.dto';
import { Passenger } from '../../domain/entities/passenger.entity';
import { Driver } from '../../domain/entities/driver.entity';

// Controlador que maneja las solicitudes HTTP relacionadas con pasajeros, como listar, obtener detalles, crear pasajeros y buscar conductores cercanos.
@ApiTags('Pasajeros')
@Controller('passengers')
export class PassengersController {
  constructor(
    private readonly listPassengersUseCase: ListPassengersUseCase,
    private readonly getPassengerUseCase: GetPassengerUseCase,
    private readonly createPassengerUseCase: CreatePassengerUseCase,
    private readonly listNearbyDriversUseCase: ListNearbyDriversUseCase
  ) {}

  // Lista todos los pasajeros en la aplicación
  @Get()
  @ApiOperation({ summary: 'Listar todos los pasajeros' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos los pasajeros registrados en el sistema.',
    type: [Passenger],
    example: [
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Ana Martínez',
        phone: '1234567890',
        created_at: '2025-05-06T12:00:00Z',
      },
    ],
  })
  async findAll(): Promise<Passenger[]> {
    return this.listPassengersUseCase.execute();
  }

  // Obtiene los detalles de un pasajero por su ID
  @Get(':id')
  @ApiOperation({ summary: 'Obtener pasajero por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del pasajero (UUID).',
    example: '550e8400-e29b-41d4-a716-446655440003',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles del pasajero solicitado.',
    type: Passenger,
    example: {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Ana Martínez',
      phone: '1234567890',
      created_at: '2025-05-06T12:00:00Z',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Pasajero no encontrado.',
  })
  async findById(@Param('id') id: string): Promise<Passenger> {
    return this.getPassengerUseCase.execute(id);
  }

  // Crea un nuevo pasajero con los datos proporcionados
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo pasajero' })
  @ApiBody({
    type: CreatePassengerDto,
    description: 'Datos requeridos para crear un pasajero.',
  })
  @ApiResponse({
    status: 201,
    description: 'Pasajero creado exitosamente.',
    type: Passenger,
    example: {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Ana Martínez',
      phone: '1234567890',
      created_at: '2025-05-06T12:00:00Z',
    },
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos (por ejemplo, nombre vacío o demasiado largo).',
  })
  async create(@Body() dto: CreatePassengerDto): Promise<Passenger> {
    return this.createPassengerUseCase.execute(dto);
  }

  // Busca conductores cercanos para un pasajero, verificando primero que el pasajero exista
  @Get(':id/nearby-drivers')
  @ApiOperation({ summary: 'Listar conductores cercanos para un pasajero' })
  @ApiParam({
    name: 'id',
    description: 'ID del pasajero (UUID).',
    example: '550e8400-e29b-41d4-a716-446655440003',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de conductores disponibles cercanos al pasajero.',
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
  @ApiResponse({
    status: 404,
    description: 'Pasajero no encontrado.',
  })
  @ApiBadRequestResponse({
    description: 'Parámetros inválidos en la búsqueda de conductores cercanos.',
  })
  async findNearbyDrivers(@Param('id') id: string): Promise<Driver[]> {
    // Verificar que el pasajero existe
    await this.getPassengerUseCase.execute(id);
    // Usar coordenadas de prueba (ajustar según lógica real)
    const dto: NearbyDriversDto = {
      latitude: 40.7128,
      longitude: -74.006,
      radius: 3,
    };
    return this.listNearbyDriversUseCase.execute(dto);
  }
}