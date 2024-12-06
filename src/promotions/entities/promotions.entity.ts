import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'promotion' })
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ unique: true })
  readonly title!: string;

  @Column()
  readonly description!: string;

  @Column({ unique: true })
  readonly code!: string;

  @Column()
  readonly image!: string;

  @Column({ type: 'timestamp' })
  readonly start_date!: Date;

  @Column({ type: 'timestamp' })
  readonly end_date!: Date;

  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
  readonly status?: string;

  @Column({ nullable: true })
  readonly note?: string;
}
