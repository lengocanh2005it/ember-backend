import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'event' })
export class Event {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column()
  readonly title!: string;

  @Column({ nullable: true })
  readonly description?: string;

  @Column({ type: 'timestamp' })
  readonly start_date!: Date;

  @Column({ type: 'timestamp' })
  readonly end_date!: Date;

  @Column({ type: 'int' })
  readonly guests_number!: number;

  @Column()
  readonly image!: string;

  @Column({
    type: 'enum',
    enum: ['concert', 'food_festival', 'cooking_class', 'holiday_event'],
  })
  readonly type!: string;

  @Column({
    type: 'enum',
    enum: ['scheduled', 'ongoing', 'finished'],
    default: 'scheduled',
  })
  readonly status!: string;

  @Column({ nullable: true })
  readonly note?: string;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;
}
