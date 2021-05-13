import TelegramBot, { ConstructorOptions } from 'node-telegram-bot-api';

import { apiErrors, ApiErrorMessage, OWNER_ID } from '../constants';
import { request } from '../config';
import { ApiService } from './api.service';
import { ScheduleService } from './scedule.service';

const groupRegex = new RegExp(/^\/group$/ig);
const clearRegex = new RegExp(/^\/clear$/ig);
const permissionsRegex = new RegExp(/^\/permissions$/ig);
const todayRegex = new RegExp(/^\/today$/ig);
const tomorrowRegex = new RegExp(/^\/tomorrow$/ig);
const weekRegex = new RegExp(/^\/week$/ig);
const answerRegex = new RegExp(/^(?!\/.*$).*/g);

export class BotService extends TelegramBot {
  private apiService = new ApiService();
  private scheduleService = new ScheduleService();

  constructor(token: string, options?: ConstructorOptions) {
    super(token, options);
  }

  public addPermissionsListener() {
    this.onText(permissionsRegex, async parent => {
      if (parent.from.is_bot) return;

      await this.sendMessage(parent.chat.id, 'З якою метою ви хочете отримати доступ до команд модератора?');

      this.onText(answerRegex, async data => {
        if (data.from.id === parent.from.id) {
          await this.sendMessage(parent.chat.id, 'З Вами скоро зв\'яжуться.\n\n<b>Дякуємо, що ви з нами!</b>', { parse_mode: 'HTML' });
          await this.sendHeart(data.chat.id);

          await this.sendMessage(OWNER_ID, JSON.stringify(data, null, 4));
        }
      });
    });
  }

  public addGroupListener() {
    this.onText(groupRegex, async parent => {
      if (parent.from.is_bot) return;
      this.removeTextListener(answerRegex);

      const { data } = await request.getUser(parent.chat.id);
      await this.sendMessage(parent.chat.id, 'Введіть назву групи\n<b>(регістр не має значення)</b>', { parse_mode: 'HTML' });

      this.onText(answerRegex, async ({ chat, from, text }) => {
        if (from.id === parent.from.id) {
          const group = text.trim();

          if (!data || !data.group) await this.addGroup(chat.id, from.username, from.first_name, group, chat.type);
          else await this.updateGroup(chat.id, from.username, from.first_name, group, data.group.realName);
        }
      });
    });
  }

  public addClearListener() {
    this.onText(clearRegex, async ({ chat, from }) => {
      if (from.is_bot) return;

      try {
        await request.removeUser(chat.id);
        await this.sendMessage(chat.id, 'Групу успішно видалено.\n\n<b>Дякуємо, що були з нами!</b>', { parse_mode: 'HTML' });
        this.sendHeart(chat.id);
      } catch (error) {
        await this.sendException(chat.id, apiErrors[error.response?.data?.message] || apiErrors.SERVER_ERROR);
      }
    });
  }

  public addMessageListener() {
    // return this.onText(messageRegex, async ({ chat, from, text }) => {
    //   await this.apiService.getUser(chat.id, async (error: ApiErrorMessage, res) => {
    //     // if (error) return this.sendException(chat.id, error);
    //
    //     // if (from?.id === OWNER_ID) return this.sendException(chat.id, apiErrors[ApiErrorStatus.FORBIDDEN], chat.id);
    //
    //     console.log('ADSA', res);
    //
    //     await this.sendMessage(chat.id, JSON.stringify({ chat, from, text }, null, 4));
    //   });
    // });
  }

  public addTodayListener() {
    this.onText(todayRegex, async ({ chat }) => {
      await this.getSchedule(chat.id, 'today');
    });
  }

  public addTomorrowListener() {
    this.onText(tomorrowRegex, async ({ chat }) => {
      await this.getSchedule(chat.id, 'tomorrow');
    });
  }

  public addWeekListener() {
    this.onText(weekRegex, async ({ chat }) => {
      await this.getSchedule(chat.id, 'week');
    });
  }

  // PRIVATE

  private sendException(chatId: number, error: ApiErrorMessage | string, replaceValue?: number | string) {
    const msg = `<b>Помилка:</b> ${ typeof error === 'string' ? error : `${ error.main }\n\n${ error.sub || '' }` }`;
    const msgReplaced = replaceValue ? msg.replace(/_/, replaceValue.toString()) : msg;

    return this.sendMessage(chatId, msgReplaced, { parse_mode: 'HTML' });
  }

  private sendHeart(chatId: number) {
    setTimeout(async () => {
      await this.sendMessage(chatId, '\u{2764}');
    }, 100);
  }

  private async addGroup(chatId: number, username: string, firstName: string, group: string, type: string) {
    try {
      const res = await request.createUser({ chatId, username, firstName, group, type });
      await this.sendMessage(chatId, `Групу <b>${ res.data.realName }</b> успішно додано.`, { parse_mode: 'HTML' });
      await this.sendKeyboard(chatId);
    } catch (error: any) {
      await this.sendException(chatId, apiErrors[error.response?.data?.message] || apiErrors.SERVER_ERROR, group);
    }
  }

  private async updateGroup(chatId: number, username: string, firstName: string, group: string, prevGroup: string) {
    try {
      const res = await request.updateUser(chatId, { username, firstName, group });
      await this.sendMessage(chatId, `Групу <b>${ prevGroup }</b> успішно оновлено на <b>${ res.data.realName }</b>.`, { parse_mode: 'HTML' });
      await this.sendKeyboard(chatId);
    } catch (error: any) {
      await this.sendException(chatId, apiErrors[error.response?.data?.message] || apiErrors.SERVER_ERROR, group);
    }
  }

  private async getSchedule(chatId: number, period: 'today' | 'tomorrow' | 'week') {
    let message;

    try {
      const dates = this.scheduleService.period(period);
      const res = await request.getSchedule({ chatId, ...dates });

      if (!Object.keys(res.data.schedule).length) {
        message = '<b>Запланованих пар не знайдено!</b>';
      } else {
        message = this.scheduleService.convertSchedule(res.data.schedule);
      }

      await this.sendMessage(chatId, `${ message }\n\n<a href="${ res.data.check }">Перевірити розклад</a>`, { parse_mode: 'HTML' });
    } catch (error) {
      await this.sendException(chatId, apiErrors[error.response?.data?.message] || apiErrors.SERVER_ERROR);
    }
  }

  private async sendKeyboard(chatId: number) {
    await this.sendMessage(chatId, 'Розклад:', {
      reply_markup: {
        keyboard: [
          [{ text: '/today' }, { text: '/tomorrow' }, { text: '/week' }]
        ],
        one_time_keyboard: true,
        resize_keyboard: true,
      }
    });
  }
}
