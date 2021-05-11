import { Entity, PrimaryGeneratedColumn, Column, Index, BaseEntity, CreateDateColumn, OneToMany } from 'typeorm';
import { IsString, IsNotEmpty } from 'class-validator';

import { User } from '../user/user.entity';

@Entity()
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Index({ unique: true })
  @Column()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Index({ unique: true })
  @Column()
  realName: string;

  @OneToMany(() => User, user => user.group)
  users: User[];

  @CreateDateColumn()
  createdAt: Date;
}
