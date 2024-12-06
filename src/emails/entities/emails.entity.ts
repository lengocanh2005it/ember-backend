import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'email' })
export class Email {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column()
  readonly recipient!: string;

  @Column({ type: 'enum', enum: ['verify', 'notify', 'forget-password'] })
  readonly type!: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'sent', 'failed'],
    default: 'sent',
  })
  readonly status!: string;

  @Column()
  readonly content_url!: string;

  @Column({ type: 'timestamp' })
  readonly sent_at!: Date;

  @Column({ nullable: true })
  readonly verification_code?: string;

  @Column({ nullable: true })
  readonly verification_link?: string;

  @Column({ type: 'timestamp', nullable: true })
  readonly expired_at?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;
}
