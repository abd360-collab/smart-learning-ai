import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import quizService from '../../services/quizService';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RefreshCcw, BookOpen, ChevronRight } from 'lucide-react';

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
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [quizId]);

  if (loading) return <Spinner />;

  const quiz = results?.quiz || {};
  const detailedResults = quiz.results || [];

  const correctAnswers = detailedResults.filter(result => {
    const correctIndex = Number(result.correctAnswer) - 1;
    const userIndex = result.options.findIndex(
      opt => opt.trim().toLowerCase() === result.selectedAnswer?.trim().toLowerCase()
    );
    return userIndex === correctIndex;
  }).length;

  const totalQuestions = detailedResults.length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  // Determine feedback message/color based on score
  const getPerformanceData = (score) => {
    if (score >= 80) return { color: 'text-green-600', bg: 'bg-green-50', label: 'Excellent!', icon: <Trophy className="w-12 h-12" /> };
    if (score >= 50) return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Good Job!', icon: <BookOpen className="w-12 h-12" /> };
    return { color: 'text-red-600', bg: 'bg-red-50', label: 'Keep Practicing!', icon: <RefreshCcw className="w-12 h-12" /> };
  };

  const performance = getPerformanceData(score);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-3xl mx-auto px-4 pt-8">
        
        {/* Navigation */}
        <Link 
          to={`/documents/${quiz.document?._id}`} 
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Document
        </Link>

        {/* Score Hero Section */}
        <div className={`rounded-3xl p-8 mb-10 shadow-sm border border-white flex flex-col items-center text-center ${performance.bg}`}>
          <div className={`${performance.color} mb-4`}>
            {performance.icon}
          </div>
          <h2 className={`text-2xl font-bold mb-1 ${performance.color}`}>
            {performance.label}
          </h2>
          <div className="flex items-baseline gap-1">
            <span className="text-6xl font-black text-gray-900">{score}%</span>
          </div>
          <p className="text-gray-600 mt-2 font-medium">
            You got <span className="text-gray-900">{correctAnswers}</span> out of <span className="text-gray-900">{totalQuestions}</span> questions correct.
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Detailed Review</h3>
          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
            {totalQuestions} Questions
          </span>
        </div>

        {/* Question List */}
        <div className="space-y-6">
          {detailedResults.map((q, i) => {
            const correctIndex = Number(q.correctAnswer) - 1;
            const userIndex = q.options.findIndex(
              opt => opt.trim().toLowerCase() === q.selectedAnswer?.trim().toLowerCase()
            );
            const isCorrect = userIndex === correctIndex;

            return (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                <div className="p-6">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm">
                        {i + 1}
                      </span>
                      <h4 className="text-lg font-semibold text-gray-800 leading-tight">
                        {q.question}
                      </h4>
                    </div>
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                    )}
                  </div>

                  <div className="grid gap-3 ml-11">
                    {q.options.map((opt, idx) => {
                      const isCorrectOpt = idx === correctIndex;
                      const isUserOpt = idx === userIndex;
                      
                      let variantClasses = "border-gray-100 bg-gray-50 text-gray-600";
                      if (isCorrectOpt) variantClasses = "border-green-200 bg-green-50 text-green-700 font-medium";
                      if (isUserOpt && !isCorrectOpt) variantClasses = "border-red-200 bg-red-50 text-red-700";

                      return (
                        <div
                          key={idx}
                          className={`group flex items-center justify-between p-3.5 rounded-xl border-2 transition-all ${variantClasses}`}
                        >
                          <span className="text-sm">{opt}</span>
                          {isCorrectOpt && <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 bg-green-200 text-green-800 rounded">Correct</span>}
                          {isUserOpt && !isCorrectOpt && <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 bg-red-200 text-red-800 rounded">Your Answer</span>}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="mt-5 ml-11 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
                      <BookOpen className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Explanation</span>
                        <p className="text-sm text-blue-800 leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Footer Action */}
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
    </div>
  );
};

export default QuizResultPage;