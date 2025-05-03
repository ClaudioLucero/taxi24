import { IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NearbyDriversDto {
  @ApiProperty({ description: 'Latitude of the location', example: 40.7128 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @ApiProperty({ description: 'Longitude of the location', example: -74.006 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;

  @ApiProperty({ description: 'Radius in kilometers', example: 5 })
  @IsNumber()
  @Min(0)
  radius!: number;
}
