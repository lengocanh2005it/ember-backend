import { Order } from 'src/orders/entities/orders.entity';
import { Product } from 'src/products/entities/products.entity';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'review' })
export class Review {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ type: 'int' })
  readonly rating_number!: number;

  @Column()
  readonly comment!: string;

  @Column({
    type: 'enum',
    enum: ['restaurant', 'order', 'reservation', 'product'],
  })
  readonly type!: string;

  @Column({ type: 'boolean', default: false })
  readonly is_featured?: boolean;

  @Column({ type: 'timestamp' })
  readonly date!: Date;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  readonly user!: User;

  @OneToMany(() => Product, (product) => product.reviews, { nullable: true })
  @JoinColumn({ name: 'product_id' })
  readonly product?: Product;

  @ManyToMany(() => Order, (order) => order.reviews, { nullable: true })
  @JoinTable({
    name: 'review_order',
    joinColumn: {
      name: 'review_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'order_id',
      referencedColumnName: 'id',
    },
  })
  readonly orders?: Order[];

  @ManyToMany(() => Reservation, (reservation) => reservation.reviews, {
    nullable: true,
  })
  @JoinTable({
    name: 'review_reservation',
    joinColumn: {
      name: 'review_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'reservation_id',
      referencedColumnName: 'id',
    },
  })
  readonly reservations?: Reservation[];
}
