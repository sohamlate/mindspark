const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/generateScedule', eventController.generateSchedule);


module.exports = router;