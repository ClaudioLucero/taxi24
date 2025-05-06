import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
@ApiTags('trips')
@Controller('trips')
export class TripsController {
  // Inyecta los casos de uso necesarios para la lógica de negocio de los viajes
  constructor(
    private readonly listTripsUseCase: ListTripsUseCase,
    private readonly getTripUseCase: GetTripUseCase,
    private readonly createTripUseCase: CreateTripUseCase,
    private readonly completeTripUseCase: CompleteTripUseCase,
    private readonly getTripInvoiceUseCase: GetTripInvoiceUseCase
  ) {}

  // Lista todos los viajes con soporte para filtros y paginación
  @Get()
  @ApiOperation({ summary: 'List all trips with pagination' })
  @ApiResponse({ status: 200, description: 'List of trips', type: [Trip] })
  async findAll(
    @Query() query: ListTripsQueryDto
  ): Promise<{ trips: Trip[]; total: number }> {
    return this.listTripsUseCase.execute(query);
  }

  // Obtiene los detalles de un viaje por su ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a trip by ID' })
  @ApiResponse({ status: 200, description: 'Trip details', type: Trip })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async findById(@Param('id') id: string): Promise<Trip> {
    return this.getTripUseCase.execute(id);
  }

  // Crea un nuevo viaje con los datos proporcionados
  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  @ApiResponse({ status: 201, description: 'Trip created', type: Trip })
  async create(@Body() dto: CreateTripDto): Promise<Trip> {
    return this.createTripUseCase.execute(dto);
  }

  // Marca un viaje como completado, actualizando su estado
  @Patch(':id/complete')
  @ApiOperation({ summary: 'Complete a trip' })
  @ApiResponse({ status: 200, description: 'Trip completed', type: Trip })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async complete(
    @Param('id') id: string,
    @Body() dto: CompleteTripDto
  ): Promise<Trip> {
    return this.completeTripUseCase.execute(id, dto);
  }

  // Obtiene la factura asociada a un viaje por su ID
  @Get(':id/invoice')
  @ApiOperation({ summary: 'Get invoice by trip ID' })
  @ApiResponse({ status: 200, description: 'Invoice details', type: Invoice })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async getTripInvoice(@Param('id') tripId: string): Promise<Invoice> {
    return this.getTripInvoiceUseCase.execute(tripId);
  }
}
