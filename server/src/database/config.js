const Sequelize = require('sequelize');
const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT } = require('../constants');

const commonConfig = {
  username: 'postgres',
  password: null,
  host: 'localhost',
  port: '5432',
  dialect: 'postgres',
  operatorsAliases: Sequelize.Op
};

module.exports = {
  development: {
    ...commonConfig,
    database: 'schedule-bot_development'
  },
  test: {
    ...commonConfig,
    database: 'schedule-bot_test'
  },
  production: {
    ...commonConfig,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT
  }
};
