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
        // Based on your JSON: response.data contains the quiz object
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

  // Based on your JSON structure: results.quiz exists
  const quiz = results?.quiz || {};
  const detailedResults = quiz.results || [];

  if (!quiz || detailedResults.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-slate-600 text-lg">Quiz results not found.</p>
        </div>
      </div>
    );
  }

  const score = quiz.score || 0;
  const totalQuestions = quiz.totalQuestions || detailedResults.length;
  const correctAnswers = detailedResults.filter(r => r.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;

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
      {/* Navigation */}
      <div className='mb-6'>
        <Link
          to={`/documents/${quiz.document?._id}`}
          className='group inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors'
        >
          <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
          Back to document
        </Link>
      </div>

      <PageHeader title={`${quiz.title || 'Quiz'} Results`} />

      {/* Main Score Card */}
      <div className='bg-white border-2 border-slate-200 rounded-2xl shadow-xl p-8 mb-12'>
        <div className='text-center space-y-6'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 shadow-lg shadow-emerald-500/10'>
            <Trophy className='w-8 h-8 text-emerald-600' />
          </div>

          <div>
            <p className='text-sm font-bold text-slate-500 uppercase tracking-widest mb-2'>
              Your Score
            </p>
            <div className={`text-6xl font-black bg-gradient-to-r ${getScoreColor(score)} bg-clip-text text-transparent`}>
              {score}%
            </div>
            <p className='text-xl font-semibold text-slate-700 mt-2'>
              {getScoreMessage(score)}
            </p>
          </div>

          <div className='flex flex-wrap items-center justify-center gap-4 pt-4'>
            <div className='flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl'>
              <Target className='w-4 h-4 text-slate-500' />
              <span className='text-sm font-bold text-slate-700'>{totalQuestions} Total</span>
            </div>
            <div className='flex items-center gap-2 px-5 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl'>
              <CheckCircle2 className='w-4 h-4 text-emerald-600' />
              <span className='text-sm font-bold text-emerald-700'>{correctAnswers} Correct</span>
            </div>
            <div className='flex items-center gap-2 px-5 py-2.5 bg-rose-50 border border-rose-200 rounded-xl'>
              <XCircle className='w-4 h-4 text-rose-600' />
              <span className='text-sm font-bold text-rose-700'>{incorrectAnswers} Incorrect</span>
            </div>
          </div>
        </div>
      </div>

      {/* Question Review Section */}
      <div className='space-y-6'>
        <div className='flex items-center gap-3 mb-4'>
          <BookOpen className='w-6 h-6 text-slate-600' />
          <h3 className='text-2xl font-bold text-slate-900'>Detailed Review</h3>
        </div>

        {detailedResults.map((result, index) => {
          // In your JSON, these are strings, so we find the index in the options array
          const userAnswerIndex = result.options.findIndex(opt => opt === result.selectedAnswer);
          const correctAnswerIndex = result.options.findIndex(opt => opt === result.correctAnswer);
          const isCorrect = result.isCorrect;

          return (
            <div key={index} className='bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm'>
              <div className='flex items-start justify-between gap-4 mb-4'>
                <div className='flex-1'>
                  <div className='inline-flex items-center px-3 py-1 bg-slate-100 rounded-lg mb-3'>
                    <span className='text-xs font-bold text-slate-500 uppercase'>Question {index + 1}</span>
                  </div>
                  <h4 className='text-lg font-bold text-slate-900 leading-tight'>
                    {result.question}
                  </h4>
                </div>
                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border-2 ${
                  isCorrect ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"
                }`}>
                  {isCorrect ? <CheckCircle2 className='text-emerald-600' /> : <XCircle className='text-rose-600' />}
                </div>
              </div>

              <div className='grid gap-3 mb-6'>
                {result.options.map((option, optIndex) => {
                  const isCorrectOption = optIndex === correctAnswerIndex;
                  const isUserSelection = optIndex === userAnswerIndex;
                  const isWrongSelection = isUserSelection && !isCorrectOption;

                  return (
                    <div
                      key={optIndex}
                      className={`px-4 py-3 rounded-xl border-2 transition-all ${
                        isCorrectOption 
                          ? "bg-emerald-50 border-emerald-300 text-emerald-900" 
                          : isWrongSelection 
                          ? "bg-rose-50 border-rose-300 text-rose-900" 
                          : "bg-slate-50 border-slate-100 text-slate-600"
                      }`}
                    >
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium'>{option}</span>
                        {isCorrectOption && (
                          <span className='text-[10px] font-bold uppercase tracking-wider bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded'>Correct</span>
                        )}
                        {isWrongSelection && (
                          <span className='text-[10px] font-bold uppercase tracking-wider bg-rose-200 text-rose-800 px-2 py-0.5 rounded'>Your Answer</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {result.explanation && (
                <div className='p-4 bg-slate-50 rounded-xl border border-slate-200'>
                  <p className='text-xs font-bold text-slate-400 uppercase mb-1'>Explanation</p>
                  <p className='text-sm text-slate-700 italic'>{result.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>


     {/* Action Button */}
<div className="mt-8 flex justify-center">
  <Link to={`/documents/${quiz?.document?._id}`}>
    <button className="group relative px-8 h-12 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 overflow-hidden">
      <span className='relative z-10 flex items-center gap-2'>
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" strokeWidth={2.5} />
        Return to Document
      </span>
      <div className='absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700' />
    </button>
  </Link>
</div>

    </div>
  );
};

export default QuizResultPage;