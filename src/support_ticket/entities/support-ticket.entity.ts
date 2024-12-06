import { User } from 'src/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'support_ticket' })
export class SupportTicket {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column()
  readonly request!: string;

  @Column({ nullable: true })
  readonly response?: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'success', 'error'],
    default: 'pending',
  })
  readonly status?: string;

  @ManyToOne(() => User, (user) => user.support_tickets)
  @JoinColumn({ name: 'user_id' })
  readonly user!: User;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;
}
