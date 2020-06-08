const express = require('express');
const bodyParser = require('body-parser');

const router = require('../routes');

const server = express();

server.use(bodyParser.json());
server.use('/api/v1', router);

module.exports = server;
