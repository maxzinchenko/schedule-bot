import { Entity, PrimaryGeneratedColumn, Column, Index, BaseEntity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from 'typeorm';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

import { Group } from '../group/group.entity';
import { EUserRole, EUserType } from './user.typedef';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Index({ unique: true })
  @Column()
  chatId: string;

  @IsString()
  @Index({ unique: true })
  @Column({ nullable: true })
  username?: string;

  @IsString()
  @Column({ nullable: true })
  firstName?: string;

  @ManyToOne(() => Group, group => group.users)
  group?: Group;

  @Index()
  @Column('enum', { default: EUserRole.DEFAULT, enum: EUserRole })
  role: EUserRole;

  @IsNotEmpty()
  @Index()
  @Column('enum', { enum: EUserType })
  type: EUserType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
