import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';
import { Block } from '../../block/entities/block.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ['electric', 'thermal'] })
  type: 'electric' | 'thermal';

  @Column({
    type: 'enum',
    enum: ['available', 'maintenance', 'out_of_service'],
    default: 'available',
  })
  status: 'available' | 'maintenance' | 'out_of_service';

  @Column({ name: 'base_price_cents', type: 'int', default: 0 })
  basePriceCents: number;

  @Column({ name: 'buffer_minutes', type: 'int', default: 30 })
  bufferMinutes: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Booking, (booking) => booking.vehicle)
  bookings: Booking[];

  @OneToMany(() => Block, (block) => block.vehicle)
  blocks: Block[];
}
