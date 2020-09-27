const { scheduleValidation } = require('../services/validation');
const { request } = require('../services/request');

const index = (req, res) => {
  const { query } = req;

  return scheduleValidation(query, error => {
    if (error) return res.status(400).json({ error });

    return request({ group: 'Web-1811' }, data => res.status(200).json(data));
  }
  );
};

module.exports = { index };
