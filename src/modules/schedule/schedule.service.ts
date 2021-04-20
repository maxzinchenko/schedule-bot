import { NotFoundError } from 'routing-controllers';

import { REQUEST_TYPE } from '../../constants';
import { request, parseSchedule, toWin1251UrlEncoded, getCache, setCache } from '../../utils';
import { GroupService } from '../group/group.service';
import { IGetScheduleDTO } from './schedule.dto';

export class ScheduleService {
  private readonly groupService = new GroupService();

  public async getSchedule(query: IGetScheduleDTO) {
    const decodedGroup = decodeURIComponent(query.group);
    const cacheKey = `${ decodedGroup }-${ query.startDate }-${ query.endDate }`;

    const group = await this.groupService.getOneByName(decodedGroup.toLowerCase());
    if (!group) throw new NotFoundError('group');

    const cache = await getCache(cacheKey);
    if (cache) return cache;

    const data = await request(REQUEST_TYPE.schedule, { group: toWin1251UrlEncoded(decodedGroup) });
    const parsedData = parseSchedule(data);

    setCache(cacheKey, parsedData, () => {});

    return parsedData;
  }
}
