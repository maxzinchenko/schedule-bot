import TelegramBot, { ConstructorOptions, Message } from 'node-telegram-bot-api';

import { apiErrors, ApiErrorMessage, OWNER_ID, BOT_USERNAME, BOT_ID, ADMIN_IDS } from '../constants';
import { request } from '../config';
import { ApiService } from './api.service';
import { ScheduleService } from './scedule.service';

// Public
const groupRegex = new RegExp(`^\/(group|group@${ BOT_USERNAME })$`, 'ig');
const clearRegex = new RegExp(`^\/(clear|clear@${ BOT_USERNAME })$`, 'ig');
const permissionsRegex = new RegExp(`^\/(permissions|permissions@${ BOT_USERNAME })$`, 'ig');
const todayRegex = new RegExp(`^\/(today|today@${ BOT_USERNAME })$`, 'ig');
const tomorrowRegex = new RegExp(`^\/(tomorrow|tomorrow@${ BOT_USERNAME })$`, 'ig');
const weekRegex = new RegExp(`^\/(week|week@${ BOT_USERNAME })`, 'ig');
const answerRegex = new RegExp(/^(?!\/.*$).*/g);
// Private
const usersRegex = new RegExp(`^\/(users|users@${ BOT_USERNAME })$`, 'ig');
const pmRegex = new RegExp(`^\/(pm|pm@${ BOT_USERNAME }) \w*`, 'ig');

export class BotService extends TelegramBot {
  private apiService = new ApiService();
  private scheduleService = new ScheduleService();

  constructor(token: string, options?: ConstructorOptions) {
    super(token, options);
  }

  public addPermissionsListener() {
    this.onText(permissionsRegex, async parent => {
      await this.checkMessage(parent, async () => {
        await this.sendMessage(parent.chat.id, 'З якою метою Ви хочете отримати доступ до недоступних команд?');

        this.onText(answerRegex, async data => {
          if (data.from.id === parent.from.id) {
            await this.sendMessage(parent.chat.id, 'З Вами скоро зв\'яжуться.\n\n<b>Дякуємо, що ви з нами!</b>', { parse_mode: 'HTML' });
            await this.sendHeart(data.chat.id);
            await this.sendMessage(OWNER_ID, JSON.stringify(data, null, 4));

            this.removeTextListener(answerRegex);
          }
        });
      });
    });
  }

  public addGroupListener() {
    this.onText(groupRegex, async parent => {
      await this.checkMessage(parent, async () => {
        let oldGroup;

        try {
          const { data } = await request.getUser(parent.chat.id);
          oldGroup = data.group;
        } catch {}

        await this.sendMessage(parent.chat.id, 'Введіть назву групи\n<b>(регістр не має значення)</b>', { parse_mode: 'HTML' });

        this.onText(answerRegex, async ({ chat, from, text }) => {
          if (from.id === parent.from.id) {
            const group = text.trim().toLowerCase();

            if (oldGroup) await this.updateGroup(chat.id, from.username, from.first_name, group, oldGroup.realName, chat.title || '');
            else await this.addGroup(chat.id, from.username, from.first_name, group, chat.type, chat.title || '');

            this.removeTextListener(answerRegex);
          }
        });
      });
    });
  }

  public addClearListener() {
    this.onText(clearRegex, async msg => {
      await this.checkMessage(msg, async () => {
        const { id } = msg.chat;

        try {
          await request.removeUser(id);
          await this.sendMessage(id, 'Групу успішно видалено.\n\n<b>Дякуємо, що були з нами!</b>', { parse_mode: 'HTML' });
          this.sendHeart(id);
        } catch (error) {
          await this.sendException(id, apiErrors[error.response?.data?.message] || apiErrors.SERVER_ERROR);
        }
      });
    });
  }

  public addMessageListener() {
    // return this.onText(messageRegex, async ({ chat, from, text }) => {
    //   await this.apiService.getUser(chat.id, async (error: ApiErrorMessage, res) => {
    //     // if (error) return this.sendException(chat.id, error);
    //
    //     // if (from?.id === OWNER_ID) return this.sendException(chat.id, apiErrors[ApiErrorStatus.FORBIDDEN], chat.id);
    //
    //     await this.sendMessage(chat.id, JSON.stringify({ chat, from, text }, null, 4));
    //   });
    // });
  }

  public addTodayListener() {
    this.onText(todayRegex, async msg => {
      await this.checkMessage(msg, async () => {
        await this.getSchedule(msg.chat.id, 'today');
      });
    });
  }

  public addTomorrowListener() {
    this.onText(tomorrowRegex, async msg => {
      await this.checkMessage(msg, async () => {
        await this.getSchedule(msg.chat.id, 'tomorrow');
      });
    });
  }

  public addWeekListener() {
    this.onText(weekRegex, async msg => {
      await this.checkMessage(msg, async () => {
        await this.getSchedule(msg.chat.id, 'week');
      });
    });
  }

  public addUsersPrivateListener() {
    this.onText(usersRegex, msg => {
      this.checkPrivateMessage(msg, async () => {
        try {
          const { data } = await request.getUsers();
          await this.sendMessage(msg.chat.id, `<b>Користувачiв:</b> ${ data.total }`, { parse_mode: 'HTML' });
          await this.sendMessage(msg.chat.id, JSON.stringify(data.users, null, 4));
        } catch (error) {
          await this.sendException(msg.chat.id, apiErrors[error.response?.data?.message] || apiErrors.SERVER_ERROR);
        }
      });
    });
  }

  public addPMPrivateListener() {
    this.onText(pmRegex, msg => {
      this.checkPrivateMessage(msg, async () => {
        const receiverChatId = +msg.text.replace(/\/\w* /, '');

        await this.sendMessage(msg.chat.id, `Введiть ваше повiдомлення для <b>${ receiverChatId }</b>`, { parse_mode: 'HTML' });

        this.onText(answerRegex, async ({ text }) => {
          Promise.all([
            this.sendMessage(receiverChatId, text),
            this.sendMessage(msg.chat.id, 'Повiдомлення вiдправлено')
          ]);

          this.removeTextListener(answerRegex);
        });
      });
    });
  }

  // PRIVATE

  private sendException(chatId: number, error: ApiErrorMessage | string, replaceValue?: number | string) {
    const msg = `<b>${ typeof error === 'string' ? error : `${ error.main }</b>\n\n${ error.sub || '' }` }`;
    const msgReplaced = replaceValue ? msg.replace(/_/, replaceValue.toString()) : msg;

    this.sendMessage(chatId, msgReplaced, { parse_mode: 'HTML' });
  }

  private sendHeart(chatId: number) {
    setTimeout(async () => {
      await this.sendMessage(chatId, '\u{2764}');
    }, 100);
  }

  private async addGroup(chatId: number, username: string, firstName: string, group: string, type: string, title: string) {
    try {
      const dto = { chatId, username, firstName, group, type, title };

      const res = await request.createUser(dto);
      Promise.all([
        this.sendMessage(chatId, `Групу <b>${ res.data.realName }</b> успішно додано.`, { parse_mode: 'HTML' }),
        this.sendMessage(OWNER_ID, `<b>Новий користувач:</b>\n\n${ JSON.stringify(dto, null, 4) }`, { parse_mode: 'HTML' }),
      ]);
      await this.sendKeyboard(chatId);
    } catch (error: any) {
      await this.sendException(chatId, apiErrors[error.response?.data?.message] || apiErrors.SERVER_ERROR, group);
    }
  }

  private async updateGroup(chatId: number, username: string, firstName: string, group: string, prevGroup: string, title: string) {
    try {
      if (group.toLowerCase() === prevGroup.toLowerCase()) {
        await this.sendException(chatId, apiErrors.GROUP_ALREADY_ADDED);
        return;
      }

      const res = await request.updateUser(chatId, { username, firstName, group, title });
      await this.sendMessage(chatId, `Групу <b>${ prevGroup }</b> успішно оновлено на <b>${ res.data.realName }</b>.`, { parse_mode: 'HTML' });
      await this.sendKeyboard(chatId);
    } catch (error: any) {
      await this.sendException(chatId, apiErrors[error.response?.data?.message] || apiErrors.SERVER_ERROR, group);
    }
  }

  private async getSchedule(chatId: number, period: 'today' | 'tomorrow' | 'week') {
    try {
      const dates = this.scheduleService.period(period);
      const res = await request.getSchedule({ chatId, ...dates });

      if (!Object.keys(res.data.schedule).length) {
        await this.sendMessage(chatId, '<b>Запланованих пар не знайдено!</b>', { parse_mode: 'HTML' });
      } else {
        const days = await this.scheduleService.convertSchedule(res.data.schedule);

        await days.forEach(day => {
          this.sendMessage(chatId, day.split(',').join(''), { parse_mode: 'HTML' });
        });
      }

      await setTimeout(async () => {
        await this.sendMessage(chatId, `<a href="${ res.data.check }">Перевірити розклад</a>`, { parse_mode: 'HTML' });
      }, 1000);
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
        force_reply: false,
        one_time_keyboard: true,
        resize_keyboard: true,
      }
    });
  }

  private async checkMessage({ from, chat }: Message, cb: () => void) {
    this.removeAllListeners();

    if (from.is_bot) {
      this.sendException(chat.id, apiErrors.FORBIDDEN, chat.id);
      return;
    }

    const botData =  await this.getChatMember(chat.id, BOT_ID);

    if (chat.type === 'supergroup' && botData.status !== 'administrator') {
      this.sendException(chat.id, apiErrors.GROUP_TYPE_INVALID);
      return;
    }

    cb();
  }

  private checkPrivateMessage({ from, chat }: Message, cb: () => void) {
    this.removeAllListeners();

    if (!ADMIN_IDS.includes(from.id)) {
      this.sendException(chat.id, apiErrors.FORBIDDEN, chat.id);
      return;
    }

    cb();
  }
}
