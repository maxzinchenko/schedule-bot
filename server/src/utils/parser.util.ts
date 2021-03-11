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
  const $ = cheerio.load(data);
  const schedule = {};

  const header = $('div.jumbotron div.container h4').text();

  $('table.table-striped').each((_, table) => {
    const date = $(table.parentNode).children('h4').text().replace(/\s.*/, '');

    schedule[date] = [];

    $(table.firstChild).children('tbody tr').each((idx, tr) => {
      const innerText = $(tr.lastChild).text().trim();

      schedule[date].push(getData(innerText, idx));
    });
  });

  return { header, schedule };
};
