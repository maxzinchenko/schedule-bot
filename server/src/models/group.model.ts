import { Entity, PrimaryGeneratedColumn, Column, Index, BaseEntity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { IsString, IsNotEmpty } from 'class-validator';

@Entity()
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @IsString()
  @Index({ unique: true })
  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;
}
