require('dotenv').config();

const server = require('./server');

const HOST = 'localhost';
const PORT = 3000;

// eslint-disable-next-line no-console
server.listen(PORT, () => console.log(`\n\nServer is running at ${ HOST }:${ PORT }\n`));
