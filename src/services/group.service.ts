import { getRepository } from 'typeorm';

import { REQUEST_TYPE } from '../constants';
import { Group } from '../models';
import { request } from '../utils';

export class GroupService {
  private groupRepository = getRepository(Group);

  public async getGroupsNamesFromAPI(): Promise<string[]> {
    const data = await request(REQUEST_TYPE.groups, null);

    return data.suggestions;
  }

  public getAll(): Promise<Group[]> {
    return this.groupRepository.find();
  }

  public async create(name: string) {
    const group = new Group();
    group.name = name;

    await group.save();

    return group;
  }

  public async removeAll() {
    const groups = await this.getAll();
    await this.groupRepository.remove(groups);
  }
}
