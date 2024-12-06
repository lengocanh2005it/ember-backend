import { Order } from 'src/orders/entities/orders.entity';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { UserDiscount } from 'src/user-discount/entities/user-discount.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'discount' })
export class Discount {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ type: 'enum', enum: ['percentage', 'fixed'] })
  readonly type!: string;

  @Column({ type: 'float' })
  readonly value!: number;

  @Column({ nullable: true })
  readonly description?: string;

  @Column({ type: 'timestamp' })
  readonly start_date!: Date;

  @Column({ type: 'timestamp' })
  readonly end_date!: Date;

  @Column({ type: 'boolean' })
  readonly is_active!: boolean;

  @Column({ type: 'enum', enum: ['vnd', 'usd'], default: 'usd' })
  readonly currency!: string;

  @OneToMany(() => UserDiscount, (userDiscount) => userDiscount.discount)
  readonly userDiscounts!: UserDiscount[];

  @OneToOne(() => Order, (order) => order.discount, { nullable: true })
  readonly order?: Order;

  @OneToOne(() => Reservation, (reservation) => reservation.discount, {
    nullable: true,
  })
  readonly reservation?: Reservation;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;
}
