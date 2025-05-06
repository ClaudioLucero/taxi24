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
  @ApiProperty({
    description: 'ID del conductor (UUID, opcional).',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  driver_id?: string;

  @ApiProperty({
    description: 'ID del pasajero (UUID, requerido).',
    example: '550e8400-e29b-41d4-a716-446655440003',
  })
  @IsUUID()
  passenger_id!: string;

  @ApiProperty({
    description: 'Latitud del punto de inicio (entre -90 y 90).',
    example: 40.7128,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  start_latitude!: number;

  @ApiProperty({
    description: 'Longitud del punto de inicio (entre -180 y 180).',
    example: -74.006,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  start_longitude!: number;

  @ApiProperty({
    description: 'Latitud del punto de destino (entre -90 y 90).',
    example: 40.73,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  end_latitude!: number;

  @ApiProperty({
    description: 'Longitud del punto de destino (entre -180 y 180).',
    example: -74.0,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  end_longitude!: number;

  @ApiProperty({
    description: 'Estado del viaje (activo, completado o cancelado).',
    example: 'active',
    enum: ['active', 'completed', 'canceled'],
    default: 'active',
  })
  @IsIn(['active', 'completed', 'canceled'])
  status: 'active' | 'completed' | 'canceled' = 'active';

  @ApiProperty({
    description: 'Costo del viaje en moneda local (mínimo 0, opcional).',
    example: 15.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;
}

export class CompleteTripDto {
  @ApiProperty({
    description: 'Costo del viaje en moneda local (mínimo 0).',
    example: 15.5,
  })
  @IsNumber()
  @Min(0)
  cost!: number;
}

export class ListTripsQueryDto {
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