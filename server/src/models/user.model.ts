import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm';
import { IsString, IsNotEmpty, Max } from 'class-validator';

import { EUserRole } from '../typedef';
import { DB_NAME } from '../constants';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @IsString()
  @Index({ unique: true })
  @Column()
  chatId: string;

  @Index()
  @Column({ nullable: true })
  group?: string;

  @Index()
  @Column({ nullable: true })
  teacher?: string;

  @Index()
  @Column('enum', { default: EUserRole.Default, enum: EUserRole })
  role: EUserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
