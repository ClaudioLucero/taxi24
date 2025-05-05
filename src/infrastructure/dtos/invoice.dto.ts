import {
  IsUUID,
  IsNumber,
  Min,
  IsOptional,
  IsDateString,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'Trip ID',
    example: '550e8400-e29b-41d4-a716-446655440005',
  })
  @IsUUID()
  trip_id!: string;

  @ApiProperty({ description: 'Invoice amount', example: 15.5 })
  @IsNumber()
  @Min(0)
  amount!: number;
}

export class InvoiceFiltersDto {
  @ApiProperty({
    description: 'Passenger ID',
    example: '550e8400-e29b-41d4-a716-446655440003',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  passengerId?: string;

  @ApiProperty({
    description: 'Driver ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  driverId?: string;

  @ApiProperty({
    description: 'Start date',
    example: '2025-05-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'End date',
    example: '2025-05-31T23:59:59.999Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

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
