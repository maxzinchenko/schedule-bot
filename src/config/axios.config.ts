import axios from 'axios';
import iconv from 'iconv-lite';

axios.interceptors.response.use(res => {
  res.data = iconv.decode(Buffer.from(res.data, 'binary'), 'win1251');

  return res;
});

export { axios };
