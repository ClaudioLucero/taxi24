import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListInvoicesUseCase } from '../../application/use-cases/invoices/list-invoices.use-case';
import { GetTripInvoiceUseCase } from '../../application/use-cases/invoices/get-trip-invoice.use-case';
import { InvoiceFiltersDto } from '../dtos/invoice.dto';
import { Invoice } from '../../domain/entities/invoice.entity';

// Controladores para manejar solicitudes HTTP relacionadas con facturas y viajes, proporcionando endpoints para listar facturas con filtros y obtener una factura por ID de viaje.
@ApiTags('invoices')
@Controller('invoices')
export class InvoicesController {
  // Inyecta los casos de uso para listar facturas y obtener facturas por viaje
  constructor(
    private readonly listInvoicesUseCase: ListInvoicesUseCase,
    private readonly getTripInvoiceUseCase: GetTripInvoiceUseCase
  ) {}

  // Endpoint para listar facturas aplicando filtros como pasajero, conductor o fechas
  @Get()
  @ApiOperation({ summary: 'List invoices with filters' })
  @ApiResponse({
    status: 200,
    description: 'List of invoices',
    type: [Invoice],
  })
  async listInvoices(
    @Query() filters: InvoiceFiltersDto
  ): Promise<{ invoices: Invoice[]; total: number }> {
    return this.listInvoicesUseCase.execute(filters);
  }
}

// Controlador para manejar solicitudes HTTP relacionadas con viajes
@Controller('trips')
export class TripsController {
  // Inyecta el caso de uso para obtener una factura por ID de viaje
  constructor(private readonly getTripInvoiceUseCase: GetTripInvoiceUseCase) {}

  // Endpoint para obtener la factura asociada a un viaje específico por su ID
  @Get(':id/invoice')
  @ApiOperation({ summary: 'Get invoice by trip ID' })
  @ApiResponse({ status: 200, description: 'Invoice details', type: Invoice })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async getTripInvoice(@Param('id') tripId: string): Promise<Invoice> {
    return this.getTripInvoiceUseCase.execute(tripId);
  }
}
