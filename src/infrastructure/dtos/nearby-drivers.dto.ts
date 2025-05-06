import { IsNumber, Min, Max, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// DTO para validar los datos de entrada al buscar conductores cercanos, incluyendo coordenadas geográficas y un radio de búsqueda.
export class NearbyDriversDto {
  @ApiProperty({
    description: 'Latitud de la ubicación (entre -90 y 90).',
    example: 40.7128,
  })
  @IsNotEmpty()
  @IsNumber({}, { message: 'La latitud debe ser un número.' })
  @Min(-90)
  @Max(90)
  latitude!: number;

  @ApiProperty({
    description: 'Longitud de la ubicación (entre -180 y 180).',
    example: -74.006,
  })
  @IsNotEmpty()
  @IsNumber({}, { message: 'La longitud debe ser un número.' })
  @Min(-180)
  @Max(180)
  longitude!: number;

  @ApiProperty({
    description: 'Radio de búsqueda en kilómetros (mínimo 0).',
    example: 5,
  })
  @IsNotEmpty()
  @IsNumber({}, { message: 'El radio debe ser un número.' })
  @Min(0, { message: 'El radio debe ser mayor o igual a 0.' })
  radius!: number;
}