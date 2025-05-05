import { IsString, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePassengerDto {
  @ApiProperty({
    description: 'Name of the passenger',
    example: 'Ana Martínez',
  })
  @IsString()
  @Length(1, 100)
  name!: string;

  @ApiProperty({
    description: 'Phone number of the passenger',
    example: '1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  phone?: string;
}
