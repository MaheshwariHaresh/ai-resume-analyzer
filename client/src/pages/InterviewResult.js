import {
  Award,
  Brain,
  CheckCircle,
  ChevronLeft,
  Lightbulb,
  MessageSquare,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInterviewSession } from "../apis/interviewApi";

// ======================================================
// Skeleton Components
// ======================================================

const Skeleton = ({ className = "" }) => {
  return (
    <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />
  );
};

const InterviewResultSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}

      <div className="rounded-3xl bg-white border border-gray-200 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-2xl" />

            <div className="space-y-3">
              <Skeleton className="w-52 h-8" />
              <Skeleton className="w-64 h-4" />
            </div>
          </div>

          <Skeleton className="w-44 h-12 rounded-xl" />
        </div>
      </div>

      {/* Overall Score + Summary Skeleton */}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Overall Score */}

        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Skeleton className="w-40 h-40 rounded-full shrink-0" />

            <div className="w-full space-y-4">
              <Skeleton className="w-64 h-8" />
              <Skeleton className="w-full max-w-xl h-4" />
              <Skeleton className="w-full max-w-lg h-4" />
              <Skeleton className="w-3/4 h-4" />
            </div>
          </div>
        </div>

        {/* Summary */}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <Skeleton className="w-40 h-6 mb-7" />

          <div className="space-y-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <Skeleton className="w-28 h-4" />
                <Skeleton className="w-20 h-5" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Skeleton */}

      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6"
          >
            <Skeleton className="w-12 h-12 rounded-xl" />

            <Skeleton className="w-32 h-4 mt-5" />

            <Skeleton className="w-20 h-9 mt-2" />
          </div>
        ))}
      </div>

      {/* Feedback Heading Skeleton */}

      <div>
        <Skeleton className="w-72 h-8" />
        <Skeleton className="w-96 max-w-full h-4 mt-3" />
      </div>

      {/* Feedback Cards Skeleton */}

      <div className="space-y-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
          >
            {/* Question */}

            <div className="p-6 border-b bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                <div className="w-full space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="w-20 h-4" />
                  </div>

                  <Skeleton className="w-full h-6" />
                  <Skeleton className="w-4/5 h-6" />
                </div>

                <div className="space-y-2 shrink-0">
                  <Skeleton className="w-16 h-8" />
                  <Skeleton className="w-20 h-3" />
                </div>
              </div>
            </div>

            {/* Answer */}

            <div className="p-6 space-y-6">
              <div>
                <Skeleton className="w-28 h-5 mb-3" />

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-3/4 h-4" />
                </div>
              </div>

              {/* AI Feedback */}

              <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
                <div className="flex gap-3">
                  <Skeleton className="w-5 h-5 rounded-full shrink-0" />

                  <div className="w-full space-y-3">
                    <Skeleton className="w-32 h-5" />
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-2/3 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Actions Skeleton */}

      <div className="flex flex-col sm:flex-row justify-center gap-4 pb-8">
        <Skeleton className="w-48 h-12 rounded-xl" />
        <Skeleton className="w-52 h-12 rounded-xl" />
      </div>
    </div>
  );
};

// ======================================================
// Interview Result
// ======================================================

const InterviewResult = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================================
  // Fetch Result
  // ======================================================

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getInterviewSession(sessionId);

        setSession(response.data);
      } catch (error) {
        console.error("Interview Result Error:", error);

        setError(
          error.response?.data?.message || "Failed to load interview result.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [sessionId]);

  // ======================================================
  // Loading
  // ======================================================

  if (loading) {
    return <InterviewResultSkeleton />;
  }

  // ======================================================
  // Error
  // ======================================================

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center max-w-md">
          <XCircle className="mx-auto text-red-500" size={48} />

          <h2 className="text-2xl font-bold text-gray-900 mt-4">
            Unable to Load Result
          </h2>

          <p className="text-gray-500 mt-2">{error}</p>

          <button
            type="button"
            onClick={() => navigate("/dashboard/interview")}
            className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            Back to Interview Coach
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // ======================================================
  // Data
  // ======================================================

  const feedback = session.feedback || [];
  const questions = session.questions || [];

  const totalQuestions = questions.length;
  const overallScore = session.overallScore || 0;

  // ======================================================
  // Helpers
  // ======================================================

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-600";
    if (score >= 5) return "text-yellow-600";

    return "text-red-600";
  };

  const getScoreLabel = (score) => {
    if (score >= 8) return "Excellent";
    if (score >= 5) return "Good";

    return "Needs Improvement";
  };

  const strongAnswers = feedback.filter(
    (item) => Number(item.score) >= 8,
  ).length;

  const averageAnswerScore = feedback.length
    ? (
        feedback.reduce((total, item) => total + Number(item.score || 0), 0) /
        feedback.length
      ).toFixed(1)
    : "0.0";

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white">
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Brain size={34} />
            </div>

            <div>
              <p className="text-sm font-medium text-purple-100 mb-1">
                AI Interview Analysis
              </p>

              <h1 className="text-3xl font-bold">Interview Result</h1>

              <p className="mt-2 text-purple-100">
                {session.interviewType || "AI"} Interview ·{" "}
                {session.difficulty || "Medium"} Difficulty
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard/interview")}
            className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 border border-white/10 px-5 py-3 rounded-xl font-semibold transition"
          >
            <ChevronLeft size={20} />
            Interview Coach
          </button>
        </div>
      </div>

      {/* Overall Score + Summary */}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Overall Score */}

        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Score Circle */}

            <div
              className={`w-40 h-40 rounded-full border-8 flex items-center justify-center shrink-0 ${
                overallScore >= 80
                  ? "border-green-100"
                  : overallScore >= 60
                    ? "border-yellow-100"
                    : "border-red-100"
              }`}
            >
              <div className="text-center">
                <p
                  className={`text-4xl font-bold ${getScoreColor(
                    overallScore / 10,
                  )}`}
                >
                  {overallScore}%
                </p>

                <p className="text-sm text-gray-500">Overall Score</p>
              </div>
            </div>

            {/* Performance Text */}

            <div>
              <div className="flex items-center gap-3">
                <Award className="text-yellow-500" size={30} />

                <h2 className="text-2xl font-bold text-gray-900">
                  {overallScore >= 80
                    ? "Excellent Performance!"
                    : overallScore >= 60
                      ? "Good Performance!"
                      : "Keep Practicing!"}
                </h2>
              </div>

              <p className="text-gray-500 mt-3 leading-7">
                You completed {totalQuestions} interview questions. Review the
                feedback below to understand your strengths and improve your
                weaker areas.
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-lg mb-5 text-gray-900">
            Interview Summary
          </h2>

          <div className="space-y-5">
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Interview Type</span>

              <span className="font-semibold text-gray-900">
                {session.interviewType || "N/A"}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Difficulty</span>

              <span className="font-semibold text-gray-900">
                {session.difficulty || "N/A"}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Questions</span>

              <span className="font-semibold text-gray-900">
                {totalQuestions}
              </span>
            </div>

            <div className="flex justify-between items-center gap-4">
              <span className="text-gray-500">Status</span>

              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                Completed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance */}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Questions */}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <MessageSquare className="text-purple-600" />
          </div>

          <p className="text-gray-500 mt-4">Questions Answered</p>

          <p className="text-3xl font-bold text-gray-900 mt-1">
            {totalQuestions}
          </p>
        </div>

        {/* Strong Answers */}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <CheckCircle className="text-green-600" />
          </div>

          <p className="text-gray-500 mt-4">Strong Answers</p>

          <p className="text-3xl font-bold text-gray-900 mt-1">
            {strongAnswers}
          </p>
        </div>

        {/* Average */}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <TrendingUp className="text-blue-600" />
          </div>

          <p className="text-gray-500 mt-4">Average Answer Score</p>

          <p className="text-3xl font-bold text-gray-900 mt-1">
            {averageAnswerScore}
            <span className="text-lg text-gray-400">/10</span>
          </p>
        </div>
      </div>

      {/* Detailed Feedback */}

      <div>
        <div className="mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <MessageSquare size={20} className="text-purple-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Question-by-Question Feedback
            </h2>
          </div>

          <p className="text-gray-500 mt-2">
            Review your answers and AI-generated suggestions.
          </p>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => {
            const answer = session.answers?.[index];
            const itemFeedback = feedback?.[index];

            const score = Number(itemFeedback?.score || 0);

            return (
              <div
                key={question._id || index}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
              >
                {/* Question Header */}

                <div className="p-6 border-b bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0">
                          {index + 1}
                        </span>

                        <span className="text-sm font-medium text-purple-600">
                          {question.difficulty ||
                            session.difficulty ||
                            "Medium"}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold leading-7 text-gray-900">
                        {question.question}
                      </h3>
                    </div>

                    <div className="text-center shrink-0">
                      <p
                        className={`text-2xl font-bold ${getScoreColor(score)}`}
                      >
                        {score}/10
                      </p>

                      <p className="text-xs text-gray-500">
                        {getScoreLabel(score)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Answer */}

                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Your Answer
                    </h4>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-600 leading-7">
                      {answer?.answer || "No answer provided."}
                    </div>
                  </div>

                  {/* AI Feedback */}

                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
                    <div className="flex gap-3">
                      <Lightbulb
                        className="text-purple-600 shrink-0 mt-1"
                        size={20}
                      />

                      <div>
                        <h4 className="font-semibold text-purple-900">
                          AI Suggestion
                        </h4>

                        <p className="text-gray-600 mt-2 leading-7">
                          {itemFeedback?.suggestion || "No feedback available."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions */}

      <div className="flex flex-col sm:flex-row justify-center gap-4 pb-8">
        <button
          type="button"
          onClick={() => navigate("/dashboard/interview")}
          className="px-6 py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          Back to Interview Coach
        </button>

        <button
          type="button"
          onClick={() => navigate("/dashboard/interview")}
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition"
        >
          Start Another Interview
        </button>
      </div>
    </div>
  );
};

export default InterviewResult;
