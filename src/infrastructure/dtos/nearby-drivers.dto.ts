import { IsNumber, Min, Max, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// DTO para validar los datos de entrada al buscar conductores cercanos, incluyendo coordenadas geográficas y un radio de búsqueda.
export class NearbyDriversDto {
  // Latitud de la ubicación, debe ser un número entre -90 y 90
  @ApiProperty({ description: 'Latitude of the location', example: 40.7128 })
  @IsNotEmpty()
  @IsNumber({}, { message: 'Latitude must be a number' })
  @Min(-90)
  @Max(90)
  latitude!: number;

  // Longitud de la ubicación, debe ser un número entre -180 y 180
  @ApiProperty({ description: 'Longitude of the location', example: -74.006 })
  @IsNotEmpty()
  @IsNumber({}, { message: 'Longitude must be a number' })
  @Min(-180)
  @Max(180)
  longitude!: number;

  // Radio de búsqueda en kilómetros, debe ser un número no negativo
  @ApiProperty({ description: 'Radius in kilometers', example: 5 })
  @IsNotEmpty()
  @IsNumber({}, { message: 'Radius must be a number' })
  @Min(0, { message: 'Radius must be greater than or equal to 0' })
  radius!: number;
}
