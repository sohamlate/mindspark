const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');

router.post('/stats', getDashboardStats);

module.exports = router;
