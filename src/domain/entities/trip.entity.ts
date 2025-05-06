import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Driver } from './driver.entity';
import { Passenger } from './passenger.entity';

@Entity('trips')
export class Trip {
  @ApiProperty({
    description: 'ID único del viaje (UUID).',
    example: '550e8400-e29b-41d4-a716-446655440004',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    description: 'Conductor asociado al viaje (opcional).',
    type: () => Driver,
    required: false,
  })
  @ManyToOne(() => Driver, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver?: Driver;

  @ApiProperty({
    description: 'ID del conductor (UUID, opcional).',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @Column({ type: 'uuid', nullable: true })
  driver_id?: string;

  @ApiProperty({
    description: 'Pasajero asociado al viaje (opcional).',
    type: () => Passenger,
    required: false,
  })
  @ManyToOne(() => Passenger, { nullable: true })
  @JoinColumn({ name: 'passenger_id' })
  passenger?: Passenger;

  @ApiProperty({
    description: 'ID del pasajero (UUID, opcional).',
    example: '550e8400-e29b-41d4-a716-446655440003',
    required: false,
  })
  @Column({ type: 'uuid', nullable: true })
  passenger_id?: string;

  @ApiProperty({
    description: 'Ubicación de inicio del viaje en formato GeoJSON (opcional).',
    example: 'SRID=4326;POINT(-74.006 40.7128)',
    required: false,
  })
  @Column({ type: 'geometry', nullable: true })
  start_location?: string;

  @ApiProperty({
    description: 'Ubicación de destino del viaje en formato GeoJSON (opcional).',
    example: 'SRID=4326;POINT(-74.0 40.73)',
    required: false,
  })
  @Column({ type: 'geometry', nullable: true })
  end_location?: string;

  @ApiProperty({
    description: 'Estado del viaje (activo, completado o cancelado).',
    example: 'active',
    enum: ['active', 'completed', 'canceled'],
  })
  @Column({ length: 20, default: 'active' })
  status!: 'active' | 'completed' | 'canceled';

  @ApiProperty({
    description: 'Costo del viaje en moneda local (opcional).',
    example: 15.5,
    required: false,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost?: number;

  @ApiProperty({
    description: 'Fecha de creación del viaje.',
    example: '2025-05-06T12:00:00Z',
  })
  @CreateDateColumn()
  created_at!: Date;

  @ApiProperty({
    description: 'Fecha de finalización del viaje (opcional).',
    example: '2025-05-06T12:30:00Z',
    required: false,
  })
  @Column({ type: 'timestamp', nullable: true })
  completed_at?: Date;
}