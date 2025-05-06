import {
  IsUUID,
  IsNumber,
  Min,
  IsOptional,
  IsDateString,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Define DTOs para la creación y filtrado de facturas, con validaciones y documentación para la API.
export class CreateInvoiceDto {
  // ID del viaje asociado a la factura
  @ApiProperty({
    description: 'Trip ID',
    example: '550e8400-e29b-41d4-a716-446655440005',
  })
  @IsUUID()
  trip_id!: string;

  // Monto de la factura
  @ApiProperty({ description: 'Invoice amount', example: 15.5 })
  @IsNumber()
  @Min(0)
  amount!: number;
}

// Define filtros para buscar facturas, con campos opcionales para pasajero, conductor, fechas y paginación
export class InvoiceFiltersDto {
  // ID del pasajero (opcional)
  @ApiProperty({
    description: 'Passenger ID',
    example: '550e8400-e29b-41d4-a716-446655440003',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  passengerId?: string;

  // ID del conductor (opcional)
  @ApiProperty({
    description: 'Driver ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  driverId?: string;

  // Fecha de inicio para filtrar facturas (opcional)
  @ApiProperty({
    description: 'Start date',
    example: '2025-05-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  // Fecha de fin para filtrar facturas (opcional)
  @ApiProperty({
    description: 'End date',
    example: '2025-05-31T23:59:59.999Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  // Número de página para paginación (opcional, por defecto 1)
  @ApiProperty({ description: 'Page number', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  // Cantidad de registros por página (opcional, por defecto 100, máximo 100)
  @ApiProperty({
    description: 'Number of records per page',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 100;
}
