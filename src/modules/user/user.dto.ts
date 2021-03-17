import { EUserType } from './user.typedef';

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
