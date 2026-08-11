import {
  Brain,
  ChevronLeft,
  ChevronRight,
  Clock,
  Send,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getInterviewSession,
  saveInterviewProgress,
  submitInterviewSession,
} from "../apis/interviewApi";

const InterviewSession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getInterviewSession(sessionId);

        const interview = response.data;

        setSession(interview);

        // Create answer array based on questions
        setAnswers(
          interview.questions.map((question, index) => ({
            question: question.question,
            answer: interview.answers?.[index]?.answer || "",
          })),
        );
      } catch (error) {
        console.error("Interview Session Error:", error);

        setError(
          error.response?.data?.message || "Failed to load interview session.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const handleAnswerChange = (value) => {
    setAnswers((prev) =>
      prev.map((item, index) =>
        index === currentQuestion
          ? {
              ...item,
              answer: value,
            }
          : item,
      ),
    );
  };

  const handleNext = async () => {
    try {
      await saveInterviewProgress(sessionId, answers);

      if (currentQuestion < session.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Save Progress Error:", error);

      setError(
        error.response?.data?.message || "Failed to save interview progress.",
      );
    }
  };

  const handlePrevious = async () => {
    try {
      await saveInterviewProgress(sessionId, answers);

      if (currentQuestion > 0) {
        setCurrentQuestion((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Save Progress Error:", error);

      setError(
        error.response?.data?.message || "Failed to save interview progress.",
      );
    }
  };

  // Submit Interview Answers
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError("");

      // Make sure all questions have been answered
      const unanswered = answers.some(
        (item) => !item.answer || !item.answer.trim(),
      );

      if (unanswered) {
        setError(
          "Please answer all questions before submitting the interview.",
        );
        setSubmitting(false);
        return;
      }

      // Submit answers to backend
      const response = await submitInterviewSession(sessionId, answers);

      console.log("Interview Submitted:", response);

      // Navigate to result page
      navigate(`/dashboard/interview/result/${sessionId}`);
    } catch (error) {
      console.error("Submit Interview Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to submit interview. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-purple-600">
          <Loader2 className="animate-spin" size={28} />
          <span className="font-medium">Loading interview...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 text-center">
          <h2 className="font-bold text-lg">Unable to Load Interview</h2>

          <p className="mt-2">{error}</p>

          <button
            onClick={() => navigate("/dashboard/interview")}
            className="mt-5 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg"
          >
            Back to Interview Coach
          </button>
        </div>
      </div>
    );
  }

  if (!session || !session.questions?.length) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold">No Questions Found</h2>

          <button
            onClick={() => navigate("/dashboard/interview")}
            className="mt-4 text-purple-600 hover:underline"
          >
            Back to Interview Coach
          </button>
        </div>
      </div>
    );
  }

  const question = session.questions[currentQuestion];

  const progress = ((currentQuestion + 1) / session.questions.length) * 100;

  const isLastQuestion = currentQuestion === session.questions.length - 1;

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
              <h1 className="text-3xl font-bold">AI Interview</h1>

              <p className="mt-2 text-purple-100">
                {session.interviewType} Interview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <Clock size={18} />

              <span>{session.difficulty}</span>
            </div>

            <div className="bg-white/20 px-4 py-2 rounded-xl">
              {session.questions.length} Questions
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}

      <div className="bg-white border rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold">
            Question {currentQuestion + 1} of {session.questions.length}
          </span>

          <span className="text-gray-500">{Math.round(progress)}%</span>
        </div>

        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}

      <div className="bg-white border rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-4 py-2 rounded-full">
            {question.difficulty}
          </span>

          <span className="text-sm text-gray-500">
            Question {currentQuestion + 1}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
          {question.question}
        </h2>

        <div className="mt-8">
          <label className="font-semibold text-gray-700 block mb-3">
            Your Answer
          </label>

          <textarea
            value={answers[currentQuestion]?.answer || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer here..."
            rows={8}
            className="w-full border rounded-2xl p-5 outline-none resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />

          <p className="text-sm text-gray-400 mt-2">
            Explain your answer clearly and use examples from your projects
            whenever possible.
          </p>
        </div>
      </div>

      {/* Navigation */}

      <div className="bg-white border rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-6 py-3 rounded-xl border font-semibold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronLeft size={20} />
          Previous
        </button>

        {!isLastQuestion ? (
          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center justify-center gap-2"
          >
            Next Question
            <ChevronRight size={20} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Evaluating Interview...
              </>
            ) : (
              <>
                <Send size={20} />
                Submit Interview
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default InterviewSession;
