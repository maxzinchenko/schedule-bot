const { Router } = require('express');

const controllers = require('./controllers');

const router = Router();

router.get('/status', controllers.status.index);

router.get('/schedule', controllers.schedule.index);

module.exports = router;
