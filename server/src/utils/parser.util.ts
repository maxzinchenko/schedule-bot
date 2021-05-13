import cheerio from 'cheerio';

import { API_URL, SCHEDULE_TIME_TABLE } from '../constants';

const teacherRegex = new RegExp(/((старший|[`ЄІЇА-яєії]*\.)\s[`ЄІЇА-яєії]*|[`ЄІЇА-яєії]*)\s[`ЄІЇА-яєії]*\s(?:[`ЄІЇА-Я].){2}/g);
const audienceRegex = new RegExp(/ (а\.\d*[A-zЄІЇА-яєії]*-[ЄІЇА-яєії]*\s\d*|а\.\d*[A-zЄІЇА-яєії]*-[ЄІЇА-яєії]*)/g);

const getData = (string: string, idx: number) => {
  if (!string) return null;

  const [data, audience, group] = string.split(audienceRegex);

  const subject = data.split(teacherRegex)[0].trim() || null;
  const teacher = data.match(teacherRegex) && data.match(teacherRegex)[0] || null;

  return { subject, teacher, audience, group: group?.trim() || null, ...SCHEDULE_TIME_TABLE[idx] };
};

export const parseSchedule = (data: string) => {
  const $ = cheerio.load(data);
  const schedule = {};

  const link = $('div.container').children('h4').first().children('a').attr('href');
  const check = link ? `${ API_URL }${ link.replace(/(.|)\/timetable.cgi/, '') }` : null;

  $('table.table-striped').each((_, table) => {
    const date = $(table.parentNode).children('h4').text().replace(/\s.*/, '');

    schedule[date] = [];

    $(table.firstChild).children('tbody tr').each((idx, tr) => {
      const innerText = $(tr.lastChild).text()?.trim();

      schedule[date].push(getData(innerText, idx));
    });
  });

  return { schedule, check };
};
