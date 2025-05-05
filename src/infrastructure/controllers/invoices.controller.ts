import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListInvoicesUseCase } from '../../application/use-cases/invoices/list-invoices.use-case';
import { GetTripInvoiceUseCase } from '../../application/use-cases/invoices/get-trip-invoice.use-case';
import { InvoiceFiltersDto } from '../dtos/invoice.dto';
import { Invoice } from '../../domain/entities/invoice.entity';

@ApiTags('invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly listInvoicesUseCase: ListInvoicesUseCase,
    private readonly getTripInvoiceUseCase: GetTripInvoiceUseCase
  ) {}

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

@Controller('trips')
export class TripsController {
  constructor(private readonly getTripInvoiceUseCase: GetTripInvoiceUseCase) {}

  @Get(':id/invoice')
  @ApiOperation({ summary: 'Get invoice by trip ID' })
  @ApiResponse({ status: 200, description: 'Invoice details', type: Invoice })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async getTripInvoice(@Param('id') tripId: string): Promise<Invoice> {
    return this.getTripInvoiceUseCase.execute(tripId);
  }
}
