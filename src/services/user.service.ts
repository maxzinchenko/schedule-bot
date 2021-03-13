import { getRepository } from 'typeorm';
import { validate } from 'class-validator';

import { ICreateUserDTO, IUpdateUserDTO, IUserDTO } from '../typedef';
import { User } from '../models';

export class UserService {
  private userRepository = getRepository(User);

  public async getByChatId(chatId: string): Promise<IUserDTO> {
    const instance = await this.userRepository.findOne({ chatId });

    return instance;
  }

  public async create({ chatId, group, teacher }: ICreateUserDTO): Promise<IUserDTO> {
    const instance = new User();
    instance.chatId = chatId;
    instance.group = group;
    instance.teacher = teacher;

    const errors = await validate(instance);
    if (errors.length) {
      throw new Error(errors[0].toString())
    } else {
      await instance.save();

      return instance;
    }
  }

  public async update(chatId: string, { group, teacher }: IUpdateUserDTO): Promise<IUserDTO> {
    const instance = await this.userRepository.findOne({ chatId });
    if (!instance) return;

    instance.group = group;
    instance.teacher = teacher;

    const errors = await validate(instance);
    if (errors.length) {
      throw new Error(errors[0].toString())
    } else {
      await instance.save();

      return instance;
    }
  }

  public async remove(chatId: string): Promise<IUserDTO> {
    const instance = await this.userRepository.findOne({ chatId });
    if (!instance) return;

    await instance.softRemove();

    return instance;
  }
}
