import { REQUEST_TYPE } from '../../constants';
import { request, parseSchedule, toWin1251UrlEncoded } from '../../utils';

export class ScheduleService {
  public async getSchedule(query) {
    const group = toWin1251UrlEncoded(decodeURIComponent(query.group));
    const data = await request(REQUEST_TYPE.schedule, { group });

    return parseSchedule(data);
  }
}
