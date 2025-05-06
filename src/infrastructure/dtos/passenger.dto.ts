import { IsString, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// DTO para validar los datos enviados al crear un nuevo pasajero en la aplicación.
export class CreatePassengerDto {
  @ApiProperty({
    description: 'Nombre completo del pasajero (1 a 100 caracteres).',
    example: 'Ana Martínez',
  })
  @IsString()
  @Length(1, 100)
  name!: string;

  @ApiProperty({
    description: 'Número de teléfono del pasajero (máximo 20 caracteres, opcional).',
    example: '1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  phone?: string;
}