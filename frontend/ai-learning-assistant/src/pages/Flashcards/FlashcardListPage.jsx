import React, { useState, useEffect } from 'react';
import flashcardService from '../../services/flashcardService';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import FlashcardSetCard from '../../components/flashcards/FlashcardSetCard'; // Component name
import toast from 'react-hot-toast';

// 1. Renamed to FlashcardListPage to avoid conflict with the Card component
const FlashcardListPage = () => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      try {
        const response = await flashcardService.getAllFlashcardSets();
        // Ensure we handle both response.data or response directly
        const data = response.data || response;
        setFlashcardSets(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error('Failed to fetch flashcard sets.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardSets();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-[40vh]">
          <Spinner />
        </div>
      );
    }

    if (flashcardSets.length === 0) {
      return (
        <EmptyState
          title="No Flashcard Sets Found"
          description="You have not generated any flashcards yet. Go to a document to create your first set."
        />
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {flashcardSets.map((set) => (
          // 2. Added implicit return (using parentheses instead of curly braces)
          <FlashcardSetCard key={set._id} flashcardSet={set} />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageHeader 
        title="My Flashcards" 
        subtitle="Review and master your study materials"
      />
      <div className="mt-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default FlashcardListPage;