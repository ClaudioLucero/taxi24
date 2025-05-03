import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Trip } from './trip.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => Trip)
  @JoinColumn({ name: 'trip_id' })
  trip!: Trip;

  @Column({ type: 'uuid' })
  trip_id!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @CreateDateColumn()
  created_at!: Date;
}
