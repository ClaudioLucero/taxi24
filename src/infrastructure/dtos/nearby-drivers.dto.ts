import { IsNumber, Min, Max, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NearbyDriversDto {
  @ApiProperty({ description: 'Latitude of the location', example: 40.7128 })
  @IsNotEmpty()
  @IsNumber({}, { message: 'Latitude must be a number' })
  @Min(-90)
  @Max(90)
  latitude!: number;

  @ApiProperty({ description: 'Longitude of the location', example: -74.006 })
  @IsNotEmpty()
  @IsNumber({}, { message: 'Longitude must be a number' })
  @Min(-180)
  @Max(180)
  longitude!: number;

  @ApiProperty({ description: 'Radius in kilometers', example: 5 })
  @IsNotEmpty()
  @IsNumber({}, { message: 'Radius must be a number' })
  @Min(0, { message: 'Radius must be greater than or equal to 0' })
  radius!: number;
}