import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'geometry', nullable: true })
  location?: string;

  @Column({ length: 20, default: 'available' })
  status!: 'available' | 'busy' | 'offline';

  @CreateDateColumn()
  created_at!: Date;
}
