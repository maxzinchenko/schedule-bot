import axios from 'axios';
import iconv from 'iconv-lite';

import { API_URL, API_USER_AGENT, REQUEST_DATA, REQUEST_N } from '../constants';
import { RequestType } from '../typedef';

axios.interceptors.response.use(res => {
  res.data = iconv.decode(Buffer.from(res.data, 'binary'), 'win1251');

  return res;
})

const toQuery = data => new URLSearchParams(data).toString();

export const request = async (type: RequestType, data: any): Promise<any> => {
  const queryString = toQuery({ ...REQUEST_DATA[type], ...data });

  const res = await axios(`${ API_URL }?n=${ REQUEST_N[type] }${ !data ? `&${ queryString }` : '' }`, {
    method: data ? 'POST' : 'GET',
    responseType: 'arraybuffer',
    headers: {
      'User-Agent': API_USER_AGENT,
      'Content-Type': 'text/plain; charset=utf-8'
    },
    ...(data && { data: queryString })
  });

  return data ? res.data : JSON.parse(res.data);
}
