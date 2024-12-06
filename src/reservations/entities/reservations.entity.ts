import { Discount } from 'src/discounts/entities/discounts.entity';
import { Payment } from 'src/payments/entities/payments.entity';
import { Review } from 'src/reviews/entities/reviews.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'reservation' })
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ type: 'timestamp' })
  readonly date_time!: Date;

  @Column({ type: 'boolean', default: false })
  readonly is_paid!: boolean;

  @Column({
    type: 'enum',
    enum: ['pending', 'success', 'error'],
    default: 'pending',
  })
  readonly status!: string;

  @Column({ type: 'int' })
  readonly guests_count!: number;

  @Column({ nullable: true })
  readonly note?: string;

  @OneToOne(() => Payment, (payment) => payment.reservation, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'payment_id' })
  readonly payment!: Payment;

  @ManyToOne(() => User, (user) => user.reservations)
  @JoinColumn({ name: 'user_id' })
  readonly user!: User;

  @ManyToMany(() => Review, (review) => review.reservations, { nullable: true })
  readonly reviews?: Review[];

  @OneToOne(() => Discount, (discount) => discount.reservation, {
    nullable: true,
  })
  @JoinColumn({ name: 'discount_id' })
  readonly discount?: Discount;
}
