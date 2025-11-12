import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_name' })
  customerName: string;

  @Column({ name: 'customer_email' })
  customerEmail: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.bookings)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Column({ name: 'starts_at', type: 'datetime' })
  startsAt: Date;

  @Column({ name: 'ends_at', type: 'datetime' })
  endsAt: Date;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'],
    default: 'pending',
  })
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

  @Column({ name: 'amount_cents', type: 'int' })
  amountCents: number;

  @Column({ default: 'eur' })
  currency: string;

  @Column({ name: 'stripe_payment_intent_id', nullable: true })
  stripePaymentIntentId: string;

  @Column({ name: 'refund_amount_cents', type: 'int', default: 0 })
  refundAmountCents: number;

  @Column({ name: 'cancelled_at', type: 'datetime', nullable: true })
  cancelledAt: Date;

  @Column({ name: 'cancel_reason', nullable: true })
  cancelReason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
