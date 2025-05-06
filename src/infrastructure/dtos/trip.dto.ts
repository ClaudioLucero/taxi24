import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsUUID,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Define DTOs para estructurar y validar datos relacionados con viajes, como creación, finalización y paginación de listas.
export class CreateTripDto {
  // ID del conductor (opcional, debe ser un UUID válido)
  @ApiProperty({
    description: 'Driver ID (optional)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  driver_id?: string;

  // ID del pasajero (requerido, debe ser un UUID válido)
  @ApiProperty({
    description: 'Passenger ID',
    example: '550e8400-e29b-41d4-a716-446655440003',
  })
  @IsUUID()
  passenger_id!: string;

  // Latitud del punto de inicio (requerida, entre -90 y 90)
  @ApiProperty({ description: 'Start location latitude', example: 40.7128 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  start_latitude!: number;

  // Longitud del punto de inicio (requerida, entre -180 y 180)
  @ApiProperty({ description: 'Start location longitude', example: -74.006 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  start_longitude!: number;

  // Latitud del punto de destino (requerida, entre -90 y 90)
  @ApiProperty({ description: 'End location latitude', example: 40.73 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  end_latitude!: number;

  // Longitud del punto de destino (requerida, entre -180 y 180)
  @ApiProperty({ description: 'End location longitude', example: -74.0 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  end_longitude!: number;

  // Estado del viaje (activo, completado o cancelado, por defecto 'active')
  @ApiProperty({
    description: 'Trip status',
    example: 'active',
    enum: ['active', 'completed', 'canceled'],
  })
  @IsIn(['active', 'completed', 'canceled'])
  status: 'active' | 'completed' | 'canceled' = 'active';

  // Costo del viaje (opcional, debe ser un número positivo)
  @ApiProperty({ description: 'Trip cost', example: 15.5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;
}

// DTO para estructurar y validar datos al completar un viaje
export class CompleteTripDto {
  // Costo del viaje (requerido, debe ser un número positivo)
  @ApiProperty({ description: 'Trip cost', example: 15.5 })
  @IsNumber()
  @Min(0)
  cost!: number;
}

// DTO para estructurar y validar parámetros de paginación al listar viajes
export class ListTripsQueryDto {
  // Número de página (opcional, por defecto 1)
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
