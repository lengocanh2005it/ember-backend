import { Table } from 'src/tables/entities/tables.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'area' })
export class Area {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ unique: true })
  readonly name!: string;

  @Column({ nullable: true })
  readonly description?: string;

  @Column({ type: 'int' })
  readonly capacity!: number;

  @Column({ type: 'int' })
  readonly floor_number!: number;

  @Column({
    type: 'enum',
    enum: ['running', 'maintenance'],
    default: 'running',
  })
  readonly status!: string;

  @Column()
  readonly operating_hours!: string;

  @OneToMany(() => Table, (table) => table.area)
  readonly tables!: Table[];

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;
}
