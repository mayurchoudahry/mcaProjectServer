const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.post('/generate-quiz', async (req, res) => {
  const { topic, questionType } = req.body;

  if (!topic || !questionType) {
    return res.status(400).json({ message: 'Topic and questionType are required.' });
  }

  let prompt = `Generate 30 ${questionType} questions on the topic of "${topic}". Each question should have 4 options and one correct answer and give the aswer key always. dont generate anything else except question,option and answer . dont write anything else generate this type of respose  '**1. What is the capital of France?',
  '    1) Paris',
  '    2) London',
  '    3) Rome',
  '    4) Berlin',
  '    Answer: Paris',  `;

  if (questionType === 'MCQ') {
    prompt += ' Each question should have 4 options and one correct answer.';
  } else if (questionType === 'Short Answer') {
    prompt += ' Each question should require a short answer response.';
  } else if (questionType === 'One Word') {
    prompt += ' Each question should require a one-word response.';
  }

  try {
    // Generate content using Google Generative AI model
    const result = await model.generateContent(prompt);
    const questions = result.response.text().split('\n'); // Adjust based on actual response format
    res.json({ questions });
  } catch (error) {
    console.error('Error generating quiz:', error.message);
    res.status(500).json({ message: 'An error occurred while generating the quiz.', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
