import { request } from '../config';
import { AxiosError } from 'axios';

import { apiErrors, ApiErrorMessage, ApiErrorStatus } from '../constants';

const ECONNREFUSED = 'ECONNREFUSED';

export class ApiService {
  public getSchedule() {

  }

  public async getUser(id: number, callback): Promise<void> {
    try {
      const res = await request.getUser(id);
      callback(null, res.data);
    } catch (error) {
      console.log(error);
      callback(this.getErrorMessage(error));
    }
  }

  public async createUser(data: any, callback): Promise<void> {
    try {
      const res = await request.createUser(data);
      callback(null, res.data);
    } catch (error) {
      console.log(error);
      callback(this.getErrorMessage(error));
    }
  }

  public async updateUser(id: number, data: any, callback): Promise<void> {
    try {
      const res = await request.updateUser(id, data);
      console.log(res);
      callback(null, res.data);
    } catch (error) {
      console.log(error);
      callback(this.getErrorMessage(error));
    }
  }

  public async removeUser(id: number, callback): Promise<void> {
    try {
      const res = await request.removeUser(id);
      console.log(res);
      callback(null, res.data);
    } catch (error) {
      callback(this.getErrorMessage(error));
    }
  }

  private getErrorMessage(error: AxiosError): ApiErrorMessage {
    if (error.code === ECONNREFUSED) return apiErrors[ApiErrorStatus.serverNotReady];
    if (error.response?.data?.message && Object.keys(apiErrors).includes(error.response.data.message)) {
      return apiErrors[error.response.data.message];
    }

    return apiErrors[ApiErrorStatus.serverError];
  }
}
