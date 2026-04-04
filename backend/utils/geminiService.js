import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

// Validate API key
if (!process.env.GEMINI_API_KEY) {
  console.error('FATAL ERROR: GEMINI_API_KEY is not set.');
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});



/**
 * Generate flashcards from text
 * @param {string} text - Document text
 * @param {number} count - Number of flashcards to generate
 * @returns {Promise<Array<{question: string, answer: string, difficulty: string}>>}
 */
export const generateFlashcards = async (text, count = 10) => {

  const prompt = `
You MUST generate EXACTLY ${count} flashcards.

Return ONLY valid JSON.
Do NOT add markdown.
Do NOT add explanation.
Do NOT add extra text.

Format STRICTLY like this:

[
  {
    "question": "string",
    "answer": "string",
    "difficulty": "easy | medium | hard"
  }
]

Text:
${text.substring(0, 15000)}
`;

  const maxRetries = 8;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {

    try {

      // ⏳ Timeout protection (15 seconds)
      // 👉 It runs multiple promises and returns the one that finishes first
      const response = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-1.5-flash-lite',
          contents: prompt
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI timeout')), 30000)
        )
      ]);

      const rawText = response.text.trim();

      // 🛑 Extract JSON safely
      const jsonStart = rawText.indexOf('[');
      const jsonEnd = rawText.lastIndexOf(']');

      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('Invalid JSON format');
      }

      const jsonString = rawText.substring(jsonStart, jsonEnd + 1);

      let flashcards = JSON.parse(jsonString);

      if (!Array.isArray(flashcards)) {
        throw new Error('Response is not array');
      }

      // 🧠 Validate structure
      flashcards = flashcards
        .filter(card => card.question && card.answer)
        .map(card => ({
          question: card.question.trim(),
          answer: card.answer.trim(),
          difficulty: ['easy', 'medium', 'hard']
            .includes((card.difficulty || '').toLowerCase())
            ? card.difficulty.toLowerCase()
            : 'medium'
        }));

      if (flashcards.length === count) {
        return flashcards;
      }

      // ❌ If not exact count → retry
      if (attempt === maxRetries) {
        throw new Error('AI did not return exact number of cards');
      }

    } catch (error) {
      if (attempt === maxRetries) {
        console.error('Gemini API error:', error);
        throw new Error('Failed to generate flashcards');
      }
    }
  }
};


/**
 * Generate quiz questions from text
 * @param {string} text - Document text
 * @param {number} numQuestions - Number of questions
 * @returns {Promise<Array>}
 */
export const generateQuiz = async (text, numQuestions = 5) => {
  const prompt = `
Generate exactly ${numQuestions} multiple choice questions from the following text.

Format each question as:
Q: [Question]
01: [Option 1]
02: [Option 2]
03: [Option 3]
04: [Option 4]
C: [Correct option - exactly as written]
E: [Brief explanation]
D: [Difficulty: easy, medium, or hard]

Separate questions with " --- "

Text:
${text.substring(0, 15000)}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash-lite',
      contents: prompt
    });

    const generatedText = response.text;

    const questions = [];
    const blocks = generatedText.split(' --- ').filter(b => b.trim());

    for (const block of blocks) {
      const lines = block.trim().split('\n');

      let question = '';
      let options = [];
      let correctAnswer = '';
      let explanation = '';
      let difficulty = 'medium';

      for (const line of lines) {
        const trimmed = line.trim();

        if (trimmed.startsWith('Q:')) {
          question = trimmed.substring(2).trim();
        } else if (/^0\d:/.test(trimmed)) {
          options.push(trimmed.substring(3).trim());
        } else if (trimmed.startsWith('C:')) {
          correctAnswer = trimmed.substring(2).trim();
        } else if (trimmed.startsWith('E:')) {
          explanation = trimmed.substring(2).trim();
        } else if (trimmed.startsWith('D:')) {
          const diff = trimmed.substring(2).trim().toLowerCase();
          if (['easy', 'medium', 'hard'].includes(diff)) {
            difficulty = diff;
          }
        }
      }

      if (question && options.length === 4 && correctAnswer) {
        questions.push({
          question,
          options,
          correctAnswer,
          explanation,
          difficulty
        });
      }
    }

    return questions.slice(0, numQuestions);
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate quiz');
  }
};





/**
 * Generate document summary
 * @param {string} text - Document text
 * @returns {Promise<string>}
 */
export const generateSummary = async (text) => {
  const prompt = `
Provide a concise summary of the following text.
Highlight key ideas and important points clearly.

Text:
${text.substring(0, 20000)}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt
    });

    return response.text;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate summary');
  }
};








// 👉 This function:

// Takes a user question
// Takes document chunks (pieces of text)
// Sends both to AI
// AI answers using only that context

// 👉 This concept is called:

// 🧠 Context-based AI / Retrieval-Augmented Generation (RAG)
/**
 * Chat with document context
 * @param {string} question - User question
 * @param {Array<{content: string}>} chunks - Relevant document chunks
 * @returns {Promise<string>}
 */

export const chatWithContext = async (question, chunks) => {
  const context = chunks
    .map((c, i) => `[Chunk ${i + 1}]\n${c.content}`)
    .join('\n\n');

  const prompt = `
Based on the following document context, answer the user's question.
If the answer is not present, say so clearly.

Context:
${context}

Question:
${question}

Answer:
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt
    });

    return response.text;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to process chat request');
  }
};



/**
 * Explain a specific concept
 * @param {string} concept - Concept to explain
 * @param {string} context - Relevant context
 * @returns {Promise<string>}
 */
export const explainConcept = async (concept, context) => {
  const prompt = `
Explain the concept of "${concept}" using the context below.
Make it clear and easy to understand. Use examples if helpful.

Context:
${context.substring(0, 10000)}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt
    });

    return response.text;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to explain concept');
  }
};



