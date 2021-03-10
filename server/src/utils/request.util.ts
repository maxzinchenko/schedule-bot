import axios, { AxiosPromise } from 'axios';

import { API_S_URL, API_S_USER_AGENT, REQUEST_DATA, REQUEST_N } from '../constants';
import { RequestType } from '../typedef';

const toQuery = data => new URLSearchParams(data).toString();

export const request = (type: RequestType, data?: any): AxiosPromise => axios(`${ API_S_URL }?n=${ REQUEST_N[type] }`, {
  method: data ? 'POST' : 'GET',
  responseType: data ? 'arraybuffer' : 'json',
  headers: {
    'User-Agent': API_S_USER_AGENT,
    'Content-Type': data ? 'text/plain; charset=utf-8' : 'application/json'
  },
  ...(data && { data: toQuery({ ...REQUEST_DATA[type], ...data }) })
});
