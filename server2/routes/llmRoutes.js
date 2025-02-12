const express = require('express');
const router = express.Router();
const { fetchAndAnalyzeImage } = require('../controllers/llmController');

router.post('/fetchimage', fetchAndAnalyzeImage);

module.exports = router;
