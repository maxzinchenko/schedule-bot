import 'dotenv/config';

import { CLIENT_PORT, BOT_TOKEN } from './constants';
import { Client } from './client';

const client = new Client(CLIENT_PORT, BOT_TOKEN);

client.run();
client.resetListeners();
client.initListeners();
