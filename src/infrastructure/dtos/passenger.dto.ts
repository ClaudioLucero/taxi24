import { IsString, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// DTO para validar los datos enviados al crear un nuevo pasajero en la aplicación.
export class CreatePassengerDto {
  // Nombre del pasajero, obligatorio, con longitud de 1 a 100 caracteres
  @ApiProperty({
    description: 'Name of the passenger',
    example: 'Ana Martínez',
  })
  @IsString()
  @Length(1, 100)
  name!: string;

  // Número de teléfono del pasajero, opcional, con longitud máxima de 20 caracteres
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
