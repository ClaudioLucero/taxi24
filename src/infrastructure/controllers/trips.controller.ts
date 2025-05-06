import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ListTripsUseCase } from '../../application/use-cases/trips/list-trips.use-case';
import { GetTripUseCase } from '../../application/use-cases/trips/get-trip.use-case';
import { CreateTripUseCase } from '../../application/use-cases/trips/create-trip.use-case';
import { CompleteTripUseCase } from '../../application/use-cases/trips/complete-trip.use-case';
import { GetTripInvoiceUseCase } from '../../application/use-cases/invoices/get-trip-invoice.use-case';
import {
  CreateTripDto,
  CompleteTripDto,
  ListTripsQueryDto,
} from '../dtos/trip.dto';
import { Invoice } from '../../domain/entities/invoice.entity';
import { Trip } from '../../domain/entities/trip.entity';

// Controlador que maneja las solicitudes HTTP para gestionar viajes, como listar, crear, completar o consultar facturas asociadas.
@ApiTags('Viajes')
@Controller('trips')
export class TripsController {
  constructor(
    private readonly listTripsUseCase: ListTripsUseCase,
    private readonly getTripUseCase: GetTripUseCase,
    private readonly createTripUseCase: CreateTripUseCase,
    private readonly completeTripUseCase: CompleteTripUseCase,
    private readonly getTripInvoiceUseCase: GetTripInvoiceUseCase
  ) {}

  // Lista todos los viajes con soporte para filtros y paginación
  @Get()
  @ApiOperation({ summary: 'Listar todos los viajes con paginación' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página para paginación (mínimo 1).',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de registros por página (máximo 100).',
    example: 100,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de viajes con el total de registros.',
    example: {
      trips: [
        {
          id: '550e8400-e29b-41d4-a716-446655440004',
          driver_id: '550e8400-e29b-41d4-a716-446655440000',
          passenger_id: '550e8400-e29b-41d4-a716-446655440003',
          start_location: 'SRID=4326;POINT(-74.006 40.7128)',
          end_location: 'SRID=4326;POINT(-74.0 40.73)',
          status: 'active',
          cost: 15.5,
          created_at: '2025-05-06T12:00:00Z',
          completed_at: null,
        },
      ],
      total: 1,
    },
  })
  @ApiBadRequestResponse({
    description: 'Parámetros de paginación inválidos (por ejemplo, página negativa).',
  })
  async findAll(
    @Query() query: ListTripsQueryDto
  ): Promise<{ trips: Trip[]; total: number }> {
    return this.listTripsUseCase.execute(query);
  }

  // Obtiene los detalles de un viaje por su ID
  @Get(':id')
  @ApiOperation({ summary: 'Obtener viaje por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del viaje (UUID).',
    example: '550e8400-e29b-41d4-a716-446655440004',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles del viaje solicitado.',
    type: Trip,
    example: {
      id: '550e8400-e29b-41d4-a716-446655440004',
      driver_id: '550e8400-e29b-41d4-a716-446655440000',
      passenger_id: '550e8400-e29b-41d4-a716-446655440003',
      start_location: 'SRID=4326;POINT(-74.006 40.7128)',
      end_location: 'SRID=4326;POINT(-74.0 40.73)',
      status: 'active',
      cost: 15.5,
      created_at: '2025-05-06T12:00:00Z',
      completed_at: null,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Viaje no encontrado.',
  })
  async findById(@Param('id') id: string): Promise<Trip> {
    return this.getTripUseCase.execute(id);
  }

  // Crea un nuevo viaje con los datos proporcionados
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo viaje' })
  @ApiBody({
    type: CreateTripDto,
    description: 'Datos requeridos para crear un viaje.',
  })
  @ApiResponse({
    status: 201,
    description: 'Viaje creado exitosamente.',
    type: Trip,
    example: {
      id: '550e8400-e29b-41d4-a716-446655440004',
      driver_id: '550e8400-e29b-41d4-a716-446655440000',
      passenger_id: '550e8400-e29b-41d4-a716-446655440003',
      start_location: 'SRID=4326;POINT(-74.006 40.7128)',
      end_location: 'SRID=4326;POINT(-74.0 40.73)',
      status: 'active',
      cost: 15.5,
      created_at: '2025-05-06T12:00:00Z',
      completed_at: null,
    },
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos (por ejemplo, coordenadas fuera de rango o UUIDs incorrectos).',
  })
  async create(@Body() dto: CreateTripDto): Promise<Trip> {
    return this.createTripUseCase.execute(dto);
  }

  // Marca un viaje como completado, actualizando su estado
  @Patch(':id/complete')
  @ApiOperation({ summary: 'Completar un viaje' })
  @ApiParam({
    name: 'id',
    description: 'ID del viaje (UUID).',
    example: '550e8400-e29b-41d4-a716-446655440004',
  })
  @ApiBody({
    type: CompleteTripDto,
    description: 'Datos requeridos para completar el viaje.',
  })
  @ApiResponse({
    status: 200,
    description: 'Viaje completado exitosamente.',
    type: Trip,
    example: {
      id: '550e8400-e29b-41d4-a716-446655440004',
      driver_id: '550e8400-e29b-41d4-a716-446655440000',
      passenger_id: '550e8400-e29b-41d4-a716-446655440003',
      start_location: 'SRID=4326;POINT(-74.006 40.7128)',
      end_location: 'SRID=4326;POINT(-74.0 40.73)',
      status: 'completed',
      cost: 15.5,
      created_at: '2025-05-06T12:00:00Z',
      completed_at: '2025-05-06T12:30:00Z',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Viaje no encontrado.',
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos (por ejemplo, costo negativo).',
  })
  async complete(
    @Param('id') id: string,
    @Body() dto: CompleteTripDto
  ): Promise<Trip> {
    return this.completeTripUseCase.execute(id, dto);
  }

  // Obtiene la factura asociada a un viaje por su ID
  @Get(':id/invoice')
  @ApiOperation({ summary: 'Obtener factura por ID de viaje' })
  @ApiParam({
    name: 'id',
    description: 'ID del viaje asociado a la factura (UUID).',
    example: '550e8400-e29b-41d4-a716-446655440004',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles de la factura asociada al viaje.',
    type: Invoice,
    example: {
      id: '550e8400-e29b-41d4-a716-446655440005',
      trip_id: '550e8400-e29b-41d4-a716-446655440004',
      amount: 15.5,
      created_at: '2025-05-06T12:00:00Z',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Factura no encontrada para el viaje especificado.',
  })
  async getTripInvoice(@Param('id') tripId: string): Promise<Invoice> {
    return this.getTripInvoiceUseCase.execute(tripId);
  }
}