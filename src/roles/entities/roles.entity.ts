import { Permission } from 'src/permissions/entities/permissions.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'role' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ unique: true })
  readonly name!: string;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;

  @ManyToMany(() => User, (user) => user.roles)
  readonly users!: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  readonly permissions!: Permission[];
}
