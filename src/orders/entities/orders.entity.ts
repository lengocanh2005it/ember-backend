import { Discount } from 'src/discounts/entities/discounts.entity';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { Payment } from 'src/payments/entities/payments.entity';
import { Review } from 'src/reviews/entities/reviews.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'order' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ type: 'float' })
  readonly total_price!: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'success', 'error'],
    default: 'pending',
  })
  readonly status!: string;

  @Column({ nullable: true })
  readonly delivery_address?: string;

  @Column({ type: 'boolean', default: false })
  readonly is_paid!: boolean;

  @Column({ type: 'enum', enum: ['home_delivery', 'pick_up'] })
  readonly delivery_method!: string;

  @Column({ nullable: true })
  readonly note?: string;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order, {
    cascade: true,
  })
  readonly order_details!: OrderProduct[];

  @OneToOne(() => Payment, (payment) => payment.order, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'payment_id' })
  readonly payment?: Payment;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  readonly user!: User;

  @ManyToMany(() => Review, (review) => review.orders)
  readonly reviews?: Review[];

  @OneToOne(() => Discount, (discount) => discount.order, { nullable: true })
  @JoinColumn({ name: 'discount_id' })
  readonly discount?: Discount;

  @DeleteDateColumn({ type: 'timestamp' })
  readonly deletedAt?: Date;
}
