import { getRepository } from 'typeorm';

import { REQUEST_TYPE } from '../../constants';
import { request } from '../../utils';
import { Group } from './group.entity';

export class GroupService {
  private groupRepository = getRepository(Group);

  public async getAllGroupsNames(): Promise<string[]> {
    const data = await request(REQUEST_TYPE.groups, null);

    return data.suggestions;
  }

  public getAll(): Promise<Group[]> {
    return this.groupRepository.find();
  }

  public getOneByName(name: string): Promise<Group> {
    return this.groupRepository.findOne({ name });
  }

  public async create(name: string): Promise<Group> {
    const group = new Group();
    group.name = name.toLowerCase();
    group.realName = name;

    await group.save();

    return group;
  }

  public async removeAll() {
    const groups = await this.getAll();
    await this.groupRepository.remove(groups);
  }
}
