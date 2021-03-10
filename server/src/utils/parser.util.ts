import iconv from 'iconv-lite';
import cheerio from 'cheerio';

import { SCHEDULE_TIME_TABLE } from '../constants';

const teacherRegex = new RegExp(/((старший|[`ЄІЇА-яєії]*\.)\s[`ЄІЇА-яєії]*|[`ЄІЇА-яєії]*)\s[`ЄІЇА-яєії]*\s(?:[`ЄІЇА-Я].){2}/g);
const audienceRegex = new RegExp(/[ЄІЇА-яєії]\.(\d*|\d*[A-zЄІЇА-яєії]*)-[ЄІЇА-яєії]*\s\d*/g);

const getData = (string: string, index: number) => {
  const number = index + 1;
  const slicedString = string.split(audienceRegex);

  const group = string && slicedString[2].trim() || null;
  const subject = string && slicedString[0].split(teacherRegex)[0].trim() || null;
  const teacher = string && slicedString[0].match(teacherRegex) && slicedString[0].match(teacherRegex)[0] || null;
  const audience = string && string.match(audienceRegex)[0].trim() || null;
  const message = !string ? `Немає ${ number }-ої пари` : null;

  return { group, subject, teacher, audience, message, number, ...SCHEDULE_TIME_TABLE[index] };
};

export const parseSchedule = (data: string) => {
  const html = iconv.decode(Buffer.from(data, 'binary'), 'win1251');
  const $ = cheerio.load(html);
  const schedule = [];

  const header = $('div.jumbotron div.container h4').text();

  $('table.table-striped tr td:nth-child(3)').each((i, elem) => {
    schedule.push(getData($(elem).text().trim(), i))
  });

  return { header, schedule };
};
