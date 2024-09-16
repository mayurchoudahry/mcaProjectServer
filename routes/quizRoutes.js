const express = require('express');
const { generateQuiz } = require('../controllers/quizController');

const router = express.Router();

router.post('/generate-quiz', generateQuiz);

module.exports = router;
