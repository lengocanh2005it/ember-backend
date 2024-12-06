import { Discount } from 'src/discounts/entities/discounts.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user_discount' })
export class UserDiscount {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ type: 'int' })
  readonly quantity!: number;

  @Column({ type: 'enum', enum: ['used', 'unused'], default: 'unused' })
  readonly status!: string;

  @Column({ type: 'timestamp', nullable: true })
  readonly date_used?: Date;

  @ManyToOne(() => User, (user) => user.userDiscounts)
  @JoinColumn({ name: 'user_id' })
  readonly user!: User;

  @ManyToOne(() => Discount, (discount) => discount.userDiscounts)
  @JoinColumn({ name: 'discount_id' })
  readonly discount!: Discount;
}
