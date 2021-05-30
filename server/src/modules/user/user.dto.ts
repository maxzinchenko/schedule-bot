import { Group } from '../group/group.entity';
import { EUserType } from './user.typedef';

export interface ICreateUserDTO {
  chatId: number;
  type: EUserType;
  group?: string;
  firstName?: string;
  title?: string;
  username?: string;
}

export interface IReturnCreateUserDTO {
  updated?: boolean;
  group: Group
}

export interface IUpdateUserDTO {
  group?: string;
  username?: string;
  title?: string;
  firstName?: string;
}
