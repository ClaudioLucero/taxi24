import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('passengers')
export class Passenger {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @CreateDateColumn()
  created_at!: Date;
}
