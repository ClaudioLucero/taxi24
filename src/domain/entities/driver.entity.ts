import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { DriverStatus } from './enums/driver-status.enum';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column()
  name!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ type: 'geometry', srid: 4326, nullable: true })
  location!: string;

  @Column({
    type: 'varchar',
    enum: DriverStatus,
    default: DriverStatus.AVAILABLE,
  })
  status!: DriverStatus;

  @Column()
  created_at!: Date;
}
