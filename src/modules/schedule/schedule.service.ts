import { BadRequestError, NotFoundError } from 'routing-controllers';

import { GROUP_NOT_FOUND, REQUEST_TYPE, USER_HAS_NO_GROUP, USER_NOT_REGISTERED } from '../../constants';
import { request, parseSchedule, toWin1251UrlEncoded, getCache, setCache } from '../../utils';
import { UserService } from '../user/user.service';
import { GroupService } from '../group/group.service';
import { IGetScheduleDTO } from './schedule.dto';

export class ScheduleService {
  private readonly userService = new UserService();
  private readonly groupService = new GroupService();

  public async get(query: IGetScheduleDTO) {
    if (query.group) {
      const group = decodeURIComponent(query.group);
      const schedule = await this.getSchedule(group, query.startDate, query.endDate);

      return schedule;
    }

    const user = await this.userService.get(query.chatId);
    if (!user) throw new BadRequestError(USER_NOT_REGISTERED);
    if (!user.group) throw new BadRequestError(USER_HAS_NO_GROUP);

    const schedule = await this.getSchedule(user.group.name, query.startDate, query.endDate, true);

    return schedule;
  }

  // PRIVATE

  private async getSchedule(groupName: string, sdate: string, edate: string, skipGroupCheck?: boolean) {
    const cacheKey = `${ groupName }-${ sdate }-${ edate }`;

    const cache = await getCache(cacheKey);
    if (cache) return cache;

    if (!skipGroupCheck) {
      const group = await this.groupService.getOneByName(groupName.toLowerCase());
      if (!group) throw new NotFoundError(GROUP_NOT_FOUND);
    }

    const data = await request(REQUEST_TYPE.schedule, { group: toWin1251UrlEncoded(groupName), sdate, edate });

    const parsedData = parseSchedule(data);

    setCache(cacheKey, parsedData, () => {});

    return parsedData;
  }
}
