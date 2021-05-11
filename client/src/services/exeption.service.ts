import { SendMessageOptions, Message } from 'node-telegram-bot-api';

type SendMessage = (chatId: number | string, text: string, options?: SendMessageOptions) => Promise<Message>;

export class ExceptionService {
  private readonly sendMessage: SendMessage;

  constructor(sendMessage: SendMessage) {
    this.sendMessage = sendMessage;
  }

  public permissions(chatId: number | string): Promise<Message> {
    return this.sendMessage(chatId, 'Permissions Denied!');
  };
}
