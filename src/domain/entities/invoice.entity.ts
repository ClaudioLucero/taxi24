import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Trip } from './trip.entity';

@Entity('invoices')
export class Invoice {
  @ApiProperty({
    description: 'ID único de la factura (UUID).',
    example: '550e8400-e29b-41d4-a716-446655440005',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    description: 'Viaje asociado a la factura.',
    type: () => Trip,
  })
  @ManyToOne(() => Trip, { nullable: false })
  @JoinColumn({ name: 'trip_id' })
  trip!: Trip;

  @ApiProperty({
    description: 'ID del viaje asociado (UUID).',
    example: '550e8400-e29b-41d4-a716-446655440004',
  })
  @Column({ type: 'uuid', nullable: false })
  trip_id!: string;

  @ApiProperty({
    description: 'Monto de la factura en moneda local.',
    example: 15.5,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @ApiProperty({
    description: 'Fecha de creación de la factura.',
    example: '2025-05-06T12:00:00Z',
  })
  @CreateDateColumn()
  created_at!: Date;
}