import { Area } from 'src/areas/entities/areas.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'table' })
export class Table {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column()
  readonly name!: string;

  @Column({ nullable: true })
  readonly note?: string;

  @Column({ type: 'int' })
  readonly capacity!: number;

  @Column({
    type: 'enum',
    enum: ['running', 'maintenance'],
    default: 'running',
  })
  readonly status!: string;

  @ManyToOne(() => Area, (area) => area.tables)
  @JoinColumn({ name: 'area_id' })
  readonly area!: Area;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;
}
