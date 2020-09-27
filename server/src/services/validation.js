const { invalid, blank } = require('./errors');

const scheduleValidation = ({ chat, days }, callback) => {
  if (!chat) return callback(`${ invalid('Query') }: ${ blank('Chat') }`);

  if (!days) return callback(`${ invalid('Query') }: ${ blank('Days') }`);
  if (days && Number.isNaN(Number(days))) return callback(`${ invalid('Query') }: ${ invalid('Days') }`);

  return callback(null);
};

module.exports = { scheduleValidation };
