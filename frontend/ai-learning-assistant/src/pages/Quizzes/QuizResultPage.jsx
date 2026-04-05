import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import quizService from '../../services/quizService';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, BookOpen } from 'lucide-react';

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
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  const quiz = results?.quiz || {};
  const detailedResults = quiz.results || [];

  if (!quiz || detailedResults.length === 0) {
    return <div className="text-center mt-10">No results found</div>;
  }

  // ✅ SCORE (INDEX BASED)
  const correctAnswers = detailedResults.filter(
    r => Number(r.selectedAnswer) === Number(r.correctAnswer)
  ).length;

  const totalQuestions = detailedResults.length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* BACK */}
      <Link to={`/documents/${quiz.document?._id}`} className="flex items-center gap-2 mb-6">
        <ArrowLeft /> Back
      </Link>

      <PageHeader title="Quiz Results" />

      {/* SCORE */}
      <div className="text-center mb-10">
        <Trophy className="mx-auto text-green-600 mb-2" />
        <h1 className="text-4xl font-bold">{score}%</h1>
        <p>{correctAnswers} Correct / {totalQuestions}</p>
      </div>

      {/* QUESTIONS */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BookOpen /> Detailed Review
        </h2>

        {detailedResults.map((q, index) => {

          // ✅ FIXED LOGIC
          const correctIndex = Number(q.correctAnswer) - 1;
          const userIndex = Number(q.selectedAnswer) - 1;

          const isCorrect = correctIndex === userIndex;

          return (
            <div key={index} className="border p-4 rounded-lg">

              <div className="flex justify-between mb-2">
                <h3 className="font-semibold">
                  Q{index + 1}. {q.question}
                </h3>

                {isCorrect ? (
                  <CheckCircle2 className="text-green-600" />
                ) : (
                  <XCircle className="text-red-600" />
                )}
              </div>

              {/* OPTIONS */}
              {q.options.map((opt, i) => {
                const isCorrectOption = i === correctIndex;
                const isUserOption = i === userIndex;

                return (
                  <div
                    key={i}
                    className={`p-2 my-1 rounded border ${
                      isCorrectOption
                        ? 'bg-green-100 border-green-400'
                        : isUserOption
                        ? 'bg-red-100 border-red-400'
                        : ''
                    }`}
                  >
                    {opt}
                  </div>
                );
              })}

              {/* EXPLANATION */}
              {q.explanation && (
                <p className="mt-2 text-sm italic text-gray-600">
                  {q.explanation}
                </p>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizResultPage;