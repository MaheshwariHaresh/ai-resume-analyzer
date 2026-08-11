import {
  Award,
  Brain,
  CheckCircle,
  ChevronLeft,
  Lightbulb,
  Loader2,
  MessageSquare,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInterviewSession } from "../apis/interviewApi";

const InterviewResult = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-purple-600">
          <Loader2 size={40} className="animate-spin" />

          <p className="font-medium">Loading interview result...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white border rounded-2xl shadow-sm p-8 text-center max-w-md">
          <XCircle className="mx-auto text-red-500" size={48} />

          <h2 className="text-2xl font-bold mt-4">Unable to Load Result</h2>

          <p className="text-gray-500 mt-2">{error}</p>

          <button
            onClick={() => navigate("/dashboard/interview")}
            className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-semibold"
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

  const feedback = session.feedback || [];
  const totalQuestions = session.questions?.length || 0;
  const overallScore = session.overallScore || 0;

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

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Brain size={34} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">Interview Result</h1>

              <p className="mt-2 text-purple-100">
                {session.interviewType} Interview · {session.difficulty}{" "}
                Difficulty
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard/interview")}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-5 py-3 rounded-xl font-semibold"
          >
            <ChevronLeft size={20} />
            Interview Coach
          </button>
        </div>
      </div>

      {/* Overall Score */}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border rounded-2xl shadow-sm p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Score Circle */}

            <div className="w-40 h-40 rounded-full border-8 border-purple-100 flex items-center justify-center shrink-0">
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-600">
                  {overallScore}%
                </p>

                <p className="text-sm text-gray-500">Overall Score</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <Award className="text-yellow-500" size={30} />

                <h2 className="text-2xl font-bold">
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

        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-lg mb-5">Interview Summary</h2>

          <div className="space-y-5">
            <div className="flex justify-between">
              <span className="text-gray-500">Interview Type</span>

              <span className="font-semibold">{session.interviewType}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Difficulty</span>

              <span className="font-semibold">{session.difficulty}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Questions</span>

              <span className="font-semibold">{totalQuestions}</span>
            </div>

            <div className="flex justify-between">
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
        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <MessageSquare className="text-purple-600" />
          </div>

          <p className="text-gray-500 mt-4">Questions Answered</p>

          <p className="text-3xl font-bold mt-1">{totalQuestions}</p>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <CheckCircle className="text-green-600" />
          </div>

          <p className="text-gray-500 mt-4">Strong Answers</p>

          <p className="text-3xl font-bold mt-1">
            {feedback.filter((item) => Number(item.score) >= 8).length}
          </p>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <TrendingUp className="text-blue-600" />
          </div>

          <p className="text-gray-500 mt-4">Average Answer Score</p>

          <p className="text-3xl font-bold mt-1">
            {feedback.length
              ? (
                  feedback.reduce(
                    (total, item) => total + Number(item.score || 0),
                    0,
                  ) / feedback.length
                ).toFixed(1)
              : "0.0"}
            /10
          </p>
        </div>
      </div>

      {/* Detailed Feedback */}

      <div>
        <div className="mb-5">
          <h2 className="text-2xl font-bold">Question-by-Question Feedback</h2>

          <p className="text-gray-500 mt-1">
            Review your answers and AI-generated suggestions.
          </p>
        </div>

        <div className="space-y-6">
          {session.questions.map((question, index) => {
            const answer = session.answers?.[index];
            const itemFeedback = feedback?.[index];

            const score = Number(itemFeedback?.score || 0);

            return (
              <div
                key={question._id || index}
                className="bg-white border rounded-2xl shadow-sm overflow-hidden"
              >
                {/* Question Header */}

                <div className="p-6 border-b bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                          {index + 1}
                        </span>

                        <span className="text-sm font-medium text-purple-600">
                          {question.difficulty}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold leading-7">
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

                    <div className="bg-gray-50 border rounded-xl p-4 text-gray-600 leading-7">
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

      {/* Bottom Action */}

      <div className="flex flex-col sm:flex-row justify-center gap-4 pb-8">
        <button
          onClick={() => navigate("/dashboard/interview")}
          className="px-6 py-3 rounded-xl border font-semibold hover:bg-gray-50"
        >
          Back to Interview Coach
        </button>

        <button
          onClick={() => navigate("/dashboard/interview")}
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold"
        >
          Start Another Interview
        </button>
      </div>
    </div>
  );
};

export default InterviewResult;
