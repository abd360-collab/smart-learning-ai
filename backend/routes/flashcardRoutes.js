import express from 'express';
import {
  getFlashcards,
  getAllFlashcardSets,
  reviewFlashcard,
  toggleStarFlashcard,
  deleteFlashcardSet,
} from '../controllers/flashcardController.js';

import protect from '../middleware/auth.js';

const router = express.Router();

// All routes below this line require login
router.use(protect);

// Get all flashcard sets of logged-in user
router.get('/', getAllFlashcardSets);

// Get flashcards for a specific document
router.get('/:documentId', getFlashcards);

// Review a flashcard (mark reviewed / update stats)
router.post('/:cardId/review', reviewFlashcard);

// Star / unstar a flashcard
router.put('/:cardId/star', toggleStarFlashcard);

// Delete a flashcard set
router.delete('/:id', deleteFlashcardSet);

export default router;
