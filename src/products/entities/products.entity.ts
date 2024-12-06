import { Cart } from 'src/carts/entities/carts.entity';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { Review } from 'src/reviews/entities/reviews.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ unique: true })
  readonly name!: string;

  @Column()
  readonly description!: string;

  @Column({ type: 'float' })
  readonly price!: number;

  @Column({ type: 'int', default: 0 })
  readonly rating_count!: number;

  @Column({ type: 'float', default: 0 })
  readonly average_rating!: number;

  @Column({ type: 'int' })
  readonly stock!: number;

  @Column()
  readonly image!: string;

  @Column({ type: 'boolean', default: true })
  readonly is_available!: boolean;

  @Column({ type: 'boolean', default: false })
  readonly is_featured!: boolean;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  readonly order_details!: OrderProduct[];

  @ManyToOne(() => Review, (review) => review.product, { cascade: true })
  readonly reviews!: Review[];

  @OneToOne(() => Cart, (cart) => cart.product, {
    cascade: true,
    nullable: true,
  })
  readonly cart?: Cart;
}
