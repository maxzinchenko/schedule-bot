import { OWNER_USERNAME } from './config.constants';

export enum ApiErrorStatus {
  serverNotReady = 'SERVER_NOT_READY',
  groupNotFound = 'GROUP_NOT_FOUND',
  groupInvalid = 'GROUP_INVALID',
  groupTypeInvalid = 'GROUP_TYPE_INVALID',
  groupAlreadyAdded = 'GROUP_ALREADY_ADDED',
  userNotFound = 'USER_NOT_FOUND',
  forbidden = 'FORBIDDEN',
  serverError = 'SERVER_ERROR'
}

export type ApiErrorMessage = {
  main: string;
  sub: null | string;
};

export type ApiErrors = { [key in ApiErrorStatus]: ApiErrorMessage };

export const apiErrors: ApiErrors = {
  [ApiErrorStatus.serverNotReady]: {
    main: 'На даний момент Бот недоступний. Будь ласка, спробуйте пізніше.',
    sub: 'Ми вже процюємо над цим. Вибачаємось за незручності.'
  },
  [ApiErrorStatus.groupInvalid]: {
    main: 'Не валідна назва групи.',
    sub: null
  },
  [ApiErrorStatus.groupTypeInvalid]: {
    main: 'У вас SUPERGROUP група.',
    sub: 'Потрібні права адміністратора щоб бот працював у такій групі або змініть тип групи.'
  },
  [ApiErrorStatus.groupAlreadyAdded]: {
    main: 'Ви вже додали цю групу.',
    sub: 'Щоб оновити групу введіть: /group.'
  },
  [ApiErrorStatus.groupNotFound]: {
    main: 'Групу <b>_</b> не знайдено.',
    sub: 'Щоб cпробувати ще введіть: /group.'
  },
  [ApiErrorStatus.userNotFound]: {
    main: 'Ви ще не додали групу.',
    sub: 'Щоб додати групу введіть: /group.'
  },
  [ApiErrorStatus.userNotFound]: {
    main: 'Ви ще не додали групу.',
    sub: 'Щоб додати групу введіть: /group.'
  },
  [ApiErrorStatus.forbidden]: {
    main: 'Відмовлено у доступі.',
    sub: `Щоб отримати доступ зверніться до @${ OWNER_USERNAME }.\n\nВаш унікальний код: <b>_</b>.`
  },
  [ApiErrorStatus.serverError]: {
    main: 'Сталася помилка. Будь ласка, спробуйте ще.',
    sub: 'Ми вже процюємо над цим. Вибачаємось за незручності.'
  }
};
