import { REQUEST_TYPE } from '../constants';
import { request, parseSchedule } from '../utils';

export class ScheduleService {
  public async getSchedule(data) {
    const res = await request(REQUEST_TYPE.schedule, data);

    return parseSchedule(res.data);
  }
}
