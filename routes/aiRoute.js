const express = require('express');
const router = express.Router();
const controller = require('../controllers/aiController');
const controllerOpenAI = require('../controllers/aiControllerOpenAI');

router.post('/gemini', controller.chat);
router.post('/openai', controllerOpenAI.chat);

module.exports = router;