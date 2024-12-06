import { Order } from 'src/orders/entities/orders.entity';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'payment' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ nullable: true })
  readonly payment_intent_id?: string;

  @Column({ nullable: true })
  readonly payment_method_id?: string;

  @Column({ type: 'float' })
  readonly amount!: number;

  @Column({ type: 'enum', enum: ['cash', 'card'] })
  readonly payment_method!: string;

  @Column({ type: 'enum', enum: ['order', 'reservation'] })
  readonly type!: string;

  @Column({ type: 'enum', enum: ['usd', 'vnd'], default: 'usd' })
  readonly currency?: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'success', 'error'],
    default: 'pending',
  })
  readonly status?: string;

  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'user_id' })
  readonly user!: User;

  @OneToOne(() => Order, (order) => order.payment, { nullable: true })
  readonly order?: Order;

  @OneToOne(() => Reservation, (reservation) => reservation.payment, {
    nullable: true,
  })
  readonly reservation?: Reservation;
}
