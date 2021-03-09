export enum EUserRole {
  Admin = 'A',
  Moderator = 'M',
  Default = 'D',
  Banned = 'B'
}

export interface ICreateUserDTO {
  chatId: string;
  group?: string;
  teacher?: string;
}

export interface IUpdateUserDTO {
  group?: string;
  teacher?: string;
}

export interface IUserDTO {
  id: string;
  chatId: string;
  role: EUserRole;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  group?: string;
  teacher?: string;
}
