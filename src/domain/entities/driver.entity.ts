import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DriverStatus } from './enums/driver-status.enum';

@Entity('drivers')
export class Driver {
  @ApiProperty({
    description: 'ID único del conductor (UUID).',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    description: 'Nombre completo del conductor.',
    example: 'Juan Pérez',
  })
  @Column()
  name!: string;

  @ApiProperty({
    description: 'Número de teléfono del conductor (opcional).',
    example: '1234567890',
    required: false,
  })
  @Column({ nullable: true })
  phone!: string;

  @ApiProperty({
    description: 'Ubicación geográfica del conductor en formato GeoJSON (opcional).',
    example: 'SRID=4326;POINT(-74.006 40.7128)',
    required: false,
  })
  @Column({ type: 'geometry', srid: 4326, nullable: true })
  location!: string;

  @ApiProperty({
    description: 'Estado del conductor (disponible, ocupado o desconectado).',
    example: 'available',
    enum: ['available', 'busy', 'offline'],
  })
  @Column({
    type: 'varchar',
    enum: DriverStatus,
    default: DriverStatus.AVAILABLE,
  })
  status!: DriverStatus;

  @ApiProperty({
    description: 'Fecha de creación del registro del conductor.',
    example: '2025-05-06T12:00:00Z',
  })
  @Column()
  created_at!: Date;
}