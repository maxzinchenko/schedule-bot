import { REQUEST_TYPE } from '../../constants';
import { request, parseSchedule } from '../../utils';

export class ScheduleService {
  public async getSchedule(query) {
    const data = await request(REQUEST_TYPE.schedule, query);

    return parseSchedule(data);
  }
}
