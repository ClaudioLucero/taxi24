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

export class CreateTripDto {
  @ApiProperty({
    description: 'Driver ID (optional)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  driver_id?: string;

  @ApiProperty({
    description: 'Passenger ID',
    example: '550e8400-e29b-41d4-a716-446655440003',
  })
  @IsUUID()
  passenger_id!: string;

  @ApiProperty({ description: 'Start location latitude', example: 40.7128 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  start_latitude!: number;

  @ApiProperty({ description: 'Start location longitude', example: -74.006 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  start_longitude!: number;

  @ApiProperty({ description: 'End location latitude', example: 40.73 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  end_latitude!: number;

  @ApiProperty({ description: 'End location longitude', example: -74.0 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  end_longitude!: number;

  @ApiProperty({
    description: 'Trip status',
    example: 'active',
    enum: ['active', 'completed', 'canceled'],
  })
  @IsIn(['active', 'completed', 'canceled'])
  status: 'active' | 'completed' | 'canceled' = 'active';

  @ApiProperty({ description: 'Trip cost', example: 15.5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;
}

export class CompleteTripDto {
  @ApiProperty({ description: 'Trip cost', example: 15.5 })
  @IsNumber()
  @Min(0)
  cost!: number;
}

export class ListTripsQueryDto {
  @ApiProperty({ description: 'Page number', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

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
