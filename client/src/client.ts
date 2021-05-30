import http from 'http';

import { BotService } from './services';

export class Client {
  private botService: BotService;

  constructor(private readonly port: number, private readonly token: string) {
    this.port = port;
    this.botService = new BotService(token, { polling: true });
  }

  public run() {
    const client = http.createServer();

    client.listen(this.port);

    console.log(`\nClient is up and running on port ${ this.port }\n`)
  }

  public resetListeners() {
    this.botService.removeAllListeners();

    console.log(`\nListeners have been removed\n`);
  }

  public initListeners() {
    // Public
    this.botService.addGroupListener();
    this.botService.addClearListener();
    this.botService.addTodayListener();
    this.botService.addTomorrowListener();
    this.botService.addWeekListener();
    this.botService.addPermissionsListener();
    this.botService.addMessageListener();
    // Private
    this.botService.addUsersPrivateListener();
    this.botService.addPMPrivateListener();

    console.log(`\nListeners have been added\n`);
  }
}
