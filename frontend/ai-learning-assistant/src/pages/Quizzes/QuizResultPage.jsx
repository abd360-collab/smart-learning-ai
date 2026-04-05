import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import quizService from '../../services/quizService';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Target, BookOpen } from 'lucide-react';

const QuizResultPage = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await quizService.getQuizResults(quizId);
        setResults(response.data || response);
      } catch (error) {
        toast.error('Failed to fetch quiz results.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  const quiz = results?.quiz || {};
  const detailedResults = quiz.results || [];

  if (!quiz || detailedResults.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-600 text-lg">Quiz results not found.</p>
      </div>
    );
  }

  // ✅ SCORE FIX (index-based)
  const correctAnswers = detailedResults.filter(
    r => parseInt(r.selectedAnswer) === parseInt(r.correctAnswer)
  ).length;

  const totalQuestions = quiz.totalQuestions || detailedResults.length;
  const incorrectAnswers = totalQuestions - correctAnswers;

  const score = totalQuestions
    ? Math.round((correctAnswers / totalQuestions) * 100)
    : 0;

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-500 to-teal-500';
    if (score >= 60) return 'from-amber-500 to-orange-500';
    return 'from-rose-500 to-red-500';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Outstanding!';
    if (score >= 80) return 'Great job!';
    if (score >= 70) return 'Good work!';
    if (score >= 60) return 'Not bad!';
    return 'Keep practicing!';
  };

  return (
    <div className='max-w-5xl mx-auto px-4 py-8'>

      {/* Back */}
      <div className='mb-6'>
        <Link
          to={`/documents/${quiz.document?._id}`}
          className='inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to document
        </Link>
      </div>

      <PageHeader title={`${quiz.title || 'Quiz'} Results`} />

      {/* Score */}
      <div className='bg-white border rounded-2xl p-8 mb-10 text-center shadow'>
        <Trophy className='mx-auto w-10 h-10 text-emerald-600 mb-3' />
        <h2 className={`text-5xl font-bold bg-gradient-to-r ${getScoreColor(score)} bg-clip-text text-transparent`}>
          {score}%
        </h2>
        <p className='mt-2 text-lg'>{getScoreMessage(score)}</p>

        <div className='flex justify-center gap-4 mt-6'>
          <div>{totalQuestions} Total</div>
          <div className='text-green-600'>{correctAnswers} Correct</div>
          <div className='text-red-600'>{incorrectAnswers} Wrong</div>
        </div>
      </div>

      {/* Questions */}
      <div className='space-y-6'>
        <h3 className='text-xl font-bold flex items-center gap-2'>
          <BookOpen className='w-5 h-5' />
          Detailed Review
        </h3>

        {detailedResults.map((result, index) => {
          // ✅ FIX: index-based logic
          const correctAnswerIndex = parseInt(result.correctAnswer) - 1;
          const userAnswerIndex = parseInt(result.selectedAnswer) - 1;

          const isCorrect = userAnswerIndex === correctAnswerIndex;

          return (
            <div key={index} className='border rounded-xl p-5 bg-white shadow-sm'>

              {/* Question */}
              <div className='flex justify-between mb-3'>
                <h4 className='font-semibold'>
                  Q{index + 1}. {result.question}
                </h4>

                {isCorrect ? (
                  <CheckCircle2 className='text-green-600' />
                ) : (
                  <XCircle className='text-red-600' />
                )}
              </div>

              {/* Options */}
              <div className='space-y-2'>
                {result.options.map((opt, i) => {
                  const isCorrectOption = i === correctAnswerIndex;
                  const isUserOption = i === userAnswerIndex;
                  const isWrong = isUserOption && !isCorrectOption;

                  return (
                    <div
                      key={i}
                      className={`p-3 rounded border ${
                        isCorrectOption
                          ? 'bg-green-100 border-green-400'
                          : isWrong
                          ? 'bg-red-100 border-red-400'
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className='flex justify-between'>
                        <span>{opt}</span>

                        {isCorrectOption && (
                          <span className='text-xs bg-green-300 px-2 rounded'>
                            Correct
                          </span>
                        )}

                        {isWrong && (
                          <span className='text-xs bg-red-300 px-2 rounded'>
                            Your Answer
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {result.explanation && (
                <div className='mt-3 p-3 bg-gray-50 rounded'>
                  <p className='text-sm italic'>{result.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Button */}
      <div className="mt-8 flex justify-center">
        <Link to={`/documents/${quiz?.document?._id}`}>
          <button className="px-6 py-2 bg-green-500 text-white rounded-lg">
            Back to Document
          </button>
        </Link>
      </div>

    </div>
  );
};

export default QuizResultPage;