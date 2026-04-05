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
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  if (loading) {
    return <Spinner />;
  }

  const quiz = results?.quiz || {};
  const detailedResults = quiz.results || [];

  // ✅ CORRECT SCORE LOGIC
  const correctAnswers = detailedResults.filter(result => {
    const correctIndex = Number(result.correctAnswer) - 1;

    const userIndex = result.options.findIndex(
      opt => opt.trim().toLowerCase() === result.selectedAnswer?.trim().toLowerCase()
    );

    return userIndex === correctIndex;
  }).length;

  const totalQuestions = detailedResults.length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="max-w-4xl mx-auto p-6">

      <Link to={`/documents/${quiz.document?._id}`} className="flex gap-2 mb-4">
        <ArrowLeft /> Back
      </Link>

      <PageHeader title="Quiz Results" />

      <div className="text-center mb-8">
        <Trophy className="mx-auto text-green-600" />
        <h1 className="text-4xl font-bold">{score}%</h1>
        <p>{correctAnswers} / {totalQuestions} Correct</p>
      </div>

      {detailedResults.map((q, i) => {
        const correctIndex = Number(q.correctAnswer) - 1;

        const userIndex = q.options.findIndex(
          opt => opt.trim().toLowerCase() === q.selectedAnswer?.trim().toLowerCase()
        );

        const isCorrect = userIndex === correctIndex;

        return (
          <div key={i} className="border p-4 mb-4 rounded">

            <div className="flex justify-between">
              <h3>{i + 1}. {q.question}</h3>
              {isCorrect ? (
                <CheckCircle2 className="text-green-600" />
              ) : (
                <XCircle className="text-red-600" />
              )}
            </div>

            {q.options.map((opt, idx) => {
              const isCorrectOpt = idx === correctIndex;
              const isUserOpt = idx === userIndex;

              return (
                <div
                  key={idx}
                  className={`p-2 mt-1 border rounded ${
                    isCorrectOpt
                      ? 'bg-green-100 border-green-400'
                      : isUserOpt
                      ? 'bg-red-100 border-red-400'
                      : ''
                  }`}
                >
                  {opt}
                </div>
              );
            })}

            <p className="text-sm mt-2 italic">{q.explanation}</p>
          </div>
        );
      })}
    </div>
  );
};

export default QuizResultPage;