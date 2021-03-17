import { Group } from '../modules/group/group.entity';

export enum EUserRole {
  ADMIN = 'A',
  MODERATOR = 'M',
  DEFAULT = 'D',
  BANNED = 'B'
}

export enum EUserType {
  PRIVATE = 'private',
  GROUP = 'group',
  SUPERGROUP = 'supergroup'
}

export interface ICreateUserDTO {
  chatId: number;
  type: EUserType;
  group?: string;
  firstName?: string;
  username?: string;
}

export interface IUpdateUserDTO {
  group?: string;
  username?: string;
  firstName?: string;
}

export interface IUserDTO {
  id: number;
  chatId: number;
  role: EUserRole;
  type: EUserType;
  firstName?: string;
  username?: string;
  group?: Group;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
