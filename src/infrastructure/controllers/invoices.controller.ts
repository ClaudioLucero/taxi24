// src/infrastructure/controllers/invoices.controller.ts
import { Controller, Get, Query, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBadRequestResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ListInvoicesUseCase } from '../../application/use-cases/invoices/list-invoices.use-case';
import { GetTripInvoiceUseCase } from '../../application/use-cases/invoices/get-trip-invoice.use-case';
import { InvoiceFiltersDto } from '../dtos/invoice.dto';
import { Invoice } from '../../domain/entities/invoice.entity';

// Controlador para manejar solicitudes HTTP relacionadas con facturas, proporcionando endpoints para listar facturas con filtros y obtener una factura por ID de viaje.
@ApiTags('Facturas')
@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly listInvoicesUseCase: ListInvoicesUseCase,
    private readonly getTripInvoiceUseCase: GetTripInvoiceUseCase
  ) {}

  // Endpoint para listar facturas aplicando filtros como pasajero, conductor o fechas
  @Get()
  @ApiOperation({ summary: 'Listar facturas con filtros y paginación' })
  @ApiQuery({
    name: 'passengerId',
    required: false,
    type: String,
    description: 'ID del pasajero para filtrar facturas (UUID).',
    example: '550e8400-e29b-41d4-a716-446655440003',
  })
  @ApiQuery({
    name: 'driverId',
    required: false,
    type: String,
    description: 'ID del conductor para filtrar facturas (UUID).',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Fecha de inicio para filtrar facturas (formato ISO).',
    example: '2025-05-01T00:00:00Z',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Fecha de fin para filtrar facturas (formato ISO).',
    example: '2025-05-31T23:59:59Z',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página para paginación (mínimo 1, por defecto 1).',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de registros por página (mínimo 1, máximo 100, por defecto 100).',
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de facturas filtradas con metadatos de paginación.',
    example: {
      items: [
        {
          id: '550e8400-e29b-41d4-a716-446655440005',
          trip_id: '550e8400-e29b-41d4-a716-446655440004',
          amount: 15.5,
          created_at: '2025-05-06T12:00:00Z',
        },
      ],
      meta: {
        total: 50,
        page: 1,
        limit: 5,
        totalPages: 10,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Filtros inválidos (por ejemplo, fechas mal formateadas, UUIDs incorrectos, o parámetros de paginación inválidos).',
  })
  async listInvoices(
    @Query() filters: InvoiceFiltersDto
  ): Promise<{ items: Invoice[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
    return this.listInvoicesUseCase.execute(filters);
  }
}

// Controlador para manejar solicitudes HTTP relacionadas con viajes
@ApiTags('Facturas')
@Controller('trips')
export class TripsController {
  constructor(private readonly getTripInvoiceUseCase: GetTripInvoiceUseCase) {}

  // Endpoint para obtener la factura asociada a un viaje específico por su ID
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