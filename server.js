const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Import Google Generative AI SDK

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.post('/generate-quiz', async (req, res) => {
  const { topic, questionType } = req.body;

  if (!topic || !questionType) {
    return res.status(400).json({ message: 'Topic and questionType are required.' });
  }

  let prompt = `Generate 30 ${questionType} questions on the topic of "${topic}".`;

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
    res.json({ questions: result.response.text().split('\n') }); // Adjust based on actual response format
  } catch (error) {
    console.error('Error generating quiz:', error.message);
    res.status(500).json({ message: 'An error occurred while generating the quiz.', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
