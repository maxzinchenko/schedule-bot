import { API_URL, API_USER_AGENT, REQUEST_DATA, REQUEST_N } from '../constants';
import { axios } from '../config/axios.config';

export type RequestType = 'schedule' | 'teachers' | 'groups';

const toQuery = data => Object.keys(data).map(key => [key, data[key]].map(item => item).join('=')).join('&');

type Data = {
  group: string;
  sdate?: string;
  edate?: string;
}

export const request = async (type: RequestType, data?: Data): Promise<any> => {
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
