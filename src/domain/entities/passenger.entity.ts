import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('passengers')
export class Passenger {
  @ApiProperty({
    description: 'ID único del pasajero (UUID).',
    example: '550e8400-e29b-41d4-a716-446655440003',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    description: 'Nombre completo del pasajero (máximo 100 caracteres).',
    example: 'Ana Martínez',
  })
  @Column({ length: 100 })
  name!: string;

  @ApiProperty({
    description: 'Número de teléfono del pasajero (máximo 20 caracteres, opcional).',
    example: '1234567890',
    required: false,
  })
  @Column({ length: 20, nullable: true })
  phone?: string;

  @ApiProperty({
    description: 'Fecha de creación del registro del pasajero.',
    example: '2025-05-06T12:00:00Z',
  })
  @CreateDateColumn()
  created_at!: Date;
}