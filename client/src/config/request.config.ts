import axios from 'axios';

import { SERVER_URL } from '../constants';

axios.defaults.baseURL = SERVER_URL;

export const request = {
  getSchedule: (params: any) => axios.get(`${ SERVER_URL }/schedule?${ new URLSearchParams(params).toString() }`),
  getUser: (id: number) => axios.get(`${ SERVER_URL }/users/${ id }`),
  createUser: (data: any) => axios.post(`${ SERVER_URL }/users`, data),
  updateUser: (id: number, data: any) => axios.put(`${ SERVER_URL }/users/${ id }`, data),
  removeUser: (id: number) => axios.delete(`${ SERVER_URL }/users/${ id }`)
};
