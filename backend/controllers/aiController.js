import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import ChatHistory from '../models/ChatHistory.js';

import * as geminiService from '../utils/geminiService.js';
import { findRelevantChunks } from '../utils/textChunker.js';


/**
 * @desc    Generate flashcards from a document using AI
 * @route   POST /api/ai/generate-flashcards
 * @access  Private
 */
export const generateFlashcards = async (req, res, next) => {
  try {
    const { documentId } = req.body;
    let count = 10; // strictly 10

    // 1️⃣ Validate input
    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId'
      });
    }

    // 2️⃣ Fetch document
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready'
      });
    }

    // 3️⃣ Generate flashcards (exactly 10)
    const cards = await geminiService.generateFlashcards(
      document.extractedText,
      count
    );

    if (!cards || cards.length !== count) {
      return res.status(500).json({
        success: false,
        error: 'AI failed to generate exactly 10 flashcards'
      });
    }

    // 4️⃣ Save to DB
    const flashcardSet = await Flashcard.create({
      userId: req.user._id,
      documentId: document._id,
      cards: cards.map(({ question, answer, difficulty }) => ({
        question,
        answer,
        difficulty,
        reviewCount: 0,
        isStarred: false,
        lastReviewed: null
      }))
    });

    res.status(201).json({
      success: true,
      data: flashcardSet,
      message: 'Exactly 10 flashcards generated successfully'
    });

  } catch (error) {
    next(error);
  }
};
/**
 * @desc    Generate quiz from document using AI
 * @route   POST /api/ai/generate-quiz
 * @access  Private
 */
export const generateQuiz = async (req, res, next) => {
  try {
    const { documentId, numQuestions = 5, title } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId'
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready'
      });
    }

    // Generate quiz using Gemini
    const questions = await geminiService.generateQuiz(
      document.extractedText,
      parseInt(numQuestions)
    );

    // Save quiz
    const quiz = await Quiz.create({
      userId: req.user._id,
      documentId: document._id,
      title: title || `${document.title} - Quiz`,
      questions,
      totalQuestions: questions.length,
      userAnswers: [],
      score: 0
    });

    res.status(201).json({
      success: true,
      data: quiz,
      message: 'Quiz generated successfully'
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Generate document summary
 * @route   POST /api/ai/generate-summary
 * @access  Private
 */
export const generateSummary = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId'
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready'
      });
    }

    const summary = await geminiService.generateSummary(
      document.extractedText
    );

    res.status(200).json({
      success: true,
      data: {
        documentId: document._id,
        title: document.title,
        summary
      },
      message: 'Summary generated successfully'
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Chat with document
 * @route   POST /api/ai/chat
 * @access  Private
 */
export const chat = async (req, res, next) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId || !question) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId and question'
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready'
      });
    }

    // Find relevant chunks
    const relevantChunks = findRelevantChunks(
      document.chunks,
      question,
      3
    );
    const chunkIndices = relevantChunks.map(c => c.chunkIndex);

    // Get or create chat history
    let chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId: document._id
    });

    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        userId: req.user._id,
        documentId: document._id,
        messages: []
      });
    }

    // Generate answer
    const answer = await geminiService.chatWithContext(
      question,
      relevantChunks
    );

    // Save conversation
    chatHistory.messages.push(
      {
        role: 'user',
        content: question,
        timestamp: new Date(),
        relevantChunks: []
      },
      {
        role: 'assistant',
        content: answer,
        timestamp: new Date(),
        relevantChunks: chunkIndices
      }
    );

    await chatHistory.save();

    res.status(200).json({
      success: true,
      data: {
        question,
        answer,
        relevantChunks: chunkIndices,
        chatHistoryId: chatHistory._id
      },
      message: 'Response generated successfully'
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Explain a concept from document
 * @route   POST /api/ai/explain-concept
 * @access  Private
 */
export const explainConcept = async (req, res, next) => {
  try {
    const { documentId, concept } = req.body;

    if (!documentId || !concept) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId and concept'
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready'
      });
    }

    const relevantChunks = findRelevantChunks(
      document.chunks,
      concept,
      3
    );

    const context = relevantChunks
      .map(c => c.content)
      .join('\n\n');

    const explanation = await geminiService.explainConcept(
      concept,
      context
    );

    res.status(200).json({
      success: true,
      data: {
        concept,
        explanation,
        relevantChunks: relevantChunks.map(c => c.chunkIndex)
      },
      message: 'Explanation generated successfully'
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Get chat history for a document
 * @route   GET /api/ai/chat-history/:documentId
 * @access  Private
 */
export const getChatHistory = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId'
      });
    }

    const chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId
    }).select('messages');

    if (!chatHistory) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No chat history found for this document'
      });
    }

    res.status(200).json({
      success: true,
      data: chatHistory.messages,
      message: 'Chat history retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};
