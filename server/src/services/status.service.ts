import { ENV } from '../constants';
import { IStatusDTO } from '../typedef/status.typedef';

export class StatusService {
  public getStatus(): IStatusDTO {
    return { online: true, environment: ENV, message: 'Ready to accept connections', status: 'OK' };
  }
}
