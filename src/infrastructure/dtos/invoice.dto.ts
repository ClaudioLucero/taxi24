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
  @ApiProperty({
    description: 'ID del viaje asociado a la factura (UUID).',
    example: '550e8400-e29b-41d4-a716-446655440004',
  })
  @IsUUID()
  trip_id!: string;

  @ApiProperty({
    description: 'Monto de la factura en moneda local (mínimo 0).',
    example: 15.5,
  })
  @IsNumber()
  @Min(0)
  amount!: number;
}

export class InvoiceFiltersDto {
  @ApiProperty({
    description: 'ID del pasajero para filtrar facturas (UUID, opcional).',
    example: '550e8400-e29b-41d4-a716-446655440003',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  passengerId?: string;

  @ApiProperty({
    description: 'ID del conductor para filtrar facturas (UUID, opcional).',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  driverId?: string;

  @ApiProperty({
    description: 'Fecha de inicio para filtrar facturas (formato ISO, opcional).',
    example: '2025-05-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'Fecha de fin para filtrar facturas (formato ISO, opcional).',
    example: '2025-05-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Número de página para paginación (mínimo 1, opcional).',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Cantidad de registros por página (máximo 100, opcional).',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 100;
}