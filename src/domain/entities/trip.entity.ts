import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Driver } from './driver.entity';
import { Passenger } from './passenger.entity';

@Entity('trips')
export class Trip {
 @PrimaryGeneratedColumn('uuid')
 id!: string;

 @ManyToOne(() => Driver, { nullable: true })
 @JoinColumn({ name: 'driver_id' })
 driver?: Driver;

 @Column({ type: 'uuid', nullable: true })
 driver_id?: string;

 @ManyToOne(() => Passenger, { nullable: true })
 @JoinColumn({ name: 'passenger_id' })
 passenger?: Passenger;

 @Column({ type: 'uuid', nullable: true })
 passenger_id?: string;

 @Column({ type: 'geometry', nullable: true })
 start_location?: string;

 @Column({ type: 'geometry', nullable: true })
 end_location?: string;

 @Column({ length: 20, default: 'active' })
 status!: 'active' | 'completed' | 'canceled';

 @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
 cost?: number;

 @CreateDateColumn()
 created_at!: Date;

 @Column({ type: 'timestamp', nullable: true })
 completed_at?: Date;
}