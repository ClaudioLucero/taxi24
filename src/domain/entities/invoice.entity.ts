import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Trip } from './trip.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Trip, { nullable: false })
  @JoinColumn({ name: 'trip_id' })
  trip!: Trip;

  @Column({ type: 'uuid', nullable: false })
  trip_id!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @CreateDateColumn()
  created_at!: Date;
}