const req = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

const { toQuery } = require('./text');
const { timetable } = require('../constants/timetable');

iconv.skipDecodeWarning = true;

const teacherRegex = new RegExp(/((старший|[`ЄІЇА-яєії]*\.)\s[`ЄІЇА-яєії]*|[`ЄІЇА-яєії]*)\s[`ЄІЇА-яєії]*\s(?:[`ЄІЇА-Я].){2}/g);
const audienceRegex = new RegExp(/[ЄІЇА-яєії]\.(\d*|\d*[A-zЄІЇА-яєії]*)-[ЄІЇА-яєії]*\s\d*/g);

const defaultData = {
  faculty: 0,
  teacher: '',
  group: 'web-1811',
  sdate: '',
  edate: '12.06.2020',
  n: 700
};

const getSchedule = (string, index) => {
  const number = index + 1;
  const slicedString = string.split(audienceRegex);

  const group = string && slicedString[2].trim() || null;
  const subject = string && slicedString[0].split(teacherRegex)[0].trim() || null;
  const teacher = string && slicedString[0].match(teacherRegex) && slicedString[0].match(teacherRegex)[0] || null;
  const audience = string && string.match(audienceRegex)[0].trim() || null;
  const message = !string ? `Немає ${ number }-ої пари` : null;

  return { group, subject, teacher, audience, message, number, ...timetable[number] };
};

const request = (data, callback) => req.post({
  url: 'http://195.95.232.162:8082/cgi-bin/timetable.cgi?n=700',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
    'Content-Type': 'text/plain; charset=utf-8'
  },
  encoding: 'binary',
  body: toQuery({ ...defaultData })
}, (error, response, body) => {
  const html = iconv.decode(Buffer.from(body, 'binary'), 'win1251');
  const $ = cheerio.load(html);
  const list = [];

  const header = $('div.jumbotron div.container h4').text();
  $('table.table-striped tr td:nth-child(3)').each((i, elem) => list.push(getSchedule($(elem).text().trim(), i)));

  return callback({ header, list });
});

module.exports = { request };
