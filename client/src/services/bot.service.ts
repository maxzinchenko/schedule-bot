import TelegramBot, { ConstructorOptions } from 'node-telegram-bot-api';

import { apiErrors, ApiErrorMessage, OWNER_ID } from '../constants';
import { ApiService } from './api.service';
import { request } from '../config';

const registerRegex = new RegExp(/\/register(\s|)/ig);
const unregisterRegex = new RegExp(/\/unregister(\s|)/ig);
const permissionsRegex = new RegExp(/\/permissions(\s|)/ig);
const groupRegex = new RegExp(/\/group(\s|)/ig);
const answerRegex = new RegExp(/^(?!\/.*$).*/g);

export class BotService extends TelegramBot {
  private apiService = new ApiService();

  constructor(token: string, options?: ConstructorOptions) {
    super(token, options);
  }

  public addPermissionsListener(): void {
    this.onText(permissionsRegex, async parent => {
      await this.sendMessage(parent.chat.id, 'Навіщо вам потрібен доступ до команд модератора?');

      this.onText(answerRegex, async data => {
        if (data.from.id === parent.from.id) {
          await this.sendMessage(parent.chat.id, 'З Вами скоро зв\'яжуться.\n\n<b>Дякуємо, що ви з нами!</b>', { parse_mode: 'HTML' });
          await this.sendHeart(data.chat.id);

          await this.sendMessage(OWNER_ID, JSON.stringify(data, null, 4));
        }
      });
    });
  }

  public addRegisterListener(): void {
    this.onText(registerRegex, async parent => {
      await this.sendMessage(parent.chat.id, 'Введіть назву групи\n<b>(регістр не має значення)</b>', { parse_mode: 'HTML' });

      this.onText(answerRegex, async ({ chat, from, text }) => {
        const group = text.trim();

        if (from.id === parent.from.id) {
          try {
            await request.createUser({
              chatId: chat.id,
              username: from.username,
              firstName: from.first_name,
              group,
              type: chat.type
            });

            await this.sendMessage(chat.id, `Ви успішно зареєструвалися.\n\nДодана група: <b>${ group }</b>`, { parse_mode: 'HTML' });
          } catch (error: any) {
            console.log(error,'\n\n\n\n\n\n\n');
            await this.sendException(chat.id, apiErrors[error.response.data.message] || apiErrors.SERVER_ERROR, group);
          }

          this.removeTextListener(answerRegex);
        }
      });
    });
  }

  public addUnregisterListener(): void {
    this.onText(unregisterRegex, async ({ chat }) => {
      try {
        await request.removeUser(chat.id);
        await this.sendMessage(chat.id, 'Ви успішно відмінили реєстрацію\n\n<b>Дякуємо, що були з нами!</b>', { parse_mode: 'HTML' });
        this.sendHeart(chat.id);
      } catch (error) {
        console.log(error);
        await this.sendException(chat.id, apiErrors[error.response.data.message || apiErrors.SERVER_ERROR]);
      }
    });
  }

  public addUpdateListener(): void {
    return this.onText(groupRegex, async ({ chat, from, text }) => {
      const group = text.replace(groupRegex, '');
      // if (!group) return this.sendException(chat.id, apiErrors[ApiErrorStatus.GROUP_BAD_REQUEST], 'group');

      const data = { username: from.username, firstName: from.first_name, group };

      await this.apiService.updateUser(chat.id, data, (error: ApiErrorMessage, res) => {
        if (error) return this.sendException(chat.id, error, group);

        return this.sendMessage(chat.id, `Вашу групу змінено на: <b>${ res.group.realName }</b>.`, { parse_mode: 'HTML' });
      });
    });
  }



  public addMessageListener(): void {
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
}
