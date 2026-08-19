import {
  Brain,
  ChevronRight,
  Gauge,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock3,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getInterviewSession,
  saveInterviewProgress,
  submitInterviewSession,
} from "../apis/interviewApi";

import { useInterview } from "../context/InterviewContext";

const InterviewSession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const { setActiveInterview, clearInterview } = useInterview();

  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // Load Interview Session
  // ==========================================

  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getInterviewSession(sessionId);

        const interview = response.data;

        setSession(interview);

        // Mark interview as active
        setActiveInterview(sessionId);

        // Restore previously saved answers
        const restoredAnswers = interview.questions.map((question, index) => ({
          question: question.question,
          answer: interview.answers?.[index]?.answer || "",
        }));

        setAnswers(restoredAnswers);

        // Resume from first unanswered question
        const firstUnansweredIndex = restoredAnswers.findIndex(
          (item) => !item.answer || !item.answer.trim(),
        );

        if (firstUnansweredIndex !== -1) {
          setCurrentQuestion(firstUnansweredIndex);
        } else {
          setCurrentQuestion(interview.questions.length - 1);
        }
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
  }, [sessionId, setActiveInterview]);

  // ==========================================
  // Browser Refresh / Tab Close Protection
  // ==========================================

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!session || submitting) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [session, submitting]);

  // ==========================================
  // Handle Answer Change
  // ==========================================

  const handleAnswerChange = (value) => {
    if (saving || submitting) {
      return;
    }

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

    if (error) {
      setError("");
    }
  };

  // ==========================================
  // Save Current Answer + Next
  // ==========================================

  const handleNext = async () => {
    if (saving || submitting) {
      return;
    }

    const currentAnswer = answers[currentQuestion]?.answer?.trim();

    if (!currentAnswer) {
      setError(
        "Please answer this question before continuing to the next question.",
      );

      return;
    }

    try {
      setSaving(true);
      setError("");

      await saveInterviewProgress(sessionId, answers);

      if (currentQuestion < session.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    } catch (error) {
      console.error("Save Progress Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to save your answer. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Submit Interview
  // ==========================================

  const handleSubmit = async () => {
    if (submitting || saving) {
      return;
    }

    const unanswered = answers.some(
      (item) => !item.answer || !item.answer.trim(),
    );

    if (unanswered) {
      setError("Please answer all questions before submitting the interview.");

      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await submitInterviewSession(sessionId, answers);

      // Clear active interview
      clearInterview();

      // Navigate to result
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

  // ==========================================
  // Loading State
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-8 py-7 text-center">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mx-auto">
            <Loader2 size={25} className="text-purple-600 animate-spin" />
          </div>

          <h2 className="mt-4 font-semibold text-gray-900">
            Loading Interview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Preparing your interview session...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // Error State
  // ==========================================

  if (error && !session) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center max-w-md">
          <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mx-auto">
            <AlertCircle size={28} className="text-red-500" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-5">
            Unable to Load Interview
          </h2>

          <p className="text-sm text-gray-500 mt-2 leading-6">{error}</p>

          <button
            type="button"
            onClick={() => navigate("/dashboard/interview")}
            className="mt-6 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition"
          >
            Back to Interview Coach
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // No Questions
  // ==========================================

  if (!session || !session.questions?.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center max-w-md">
          <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center mx-auto">
            <Brain size={28} className="text-gray-400" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-5">
            No Questions Found
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            This interview session does not contain any questions.
          </p>

          <button
            type="button"
            onClick={() => navigate("/dashboard/interview")}
            className="mt-5 text-sm font-semibold text-purple-600 hover:text-purple-700"
          >
            Back to Interview Coach
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // Interview Data
  // ==========================================

  const question = session.questions[currentQuestion];

  const totalQuestions = session.questions.length;

  const questionNumber = currentQuestion + 1;

  const remainingQuestions = totalQuestions - questionNumber;

  const progress = (questionNumber / totalQuestions) * 100;

  const isLastQuestion = currentQuestion === totalQuestions - 1;

  const currentAnswer = answers[currentQuestion]?.answer || "";

  const answeredQuestions = answers.filter(
    (item) => item.answer && item.answer.trim(),
  ).length;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="space-y-8 pb-8">
      {/* ========================================== */}
      {/* Header */}
      {/* ========================================== */}

      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-7 md:p-8 text-white shadow-sm">
        {/* Decorative Circle */}

        <div className="absolute -top-20 -right-20 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Title */}

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/15 border border-white/10 flex items-center justify-center shrink-0">
              <Brain size={31} />
            </div>

            <div>
              <p className="text-sm font-medium text-purple-100 mb-1">
                AI Interview Session
              </p>

              <h1 className="text-2xl md:text-3xl font-bold">
                {session.interviewType || "AI"} Interview
              </h1>

              <p className="mt-2 text-sm text-purple-100">
                Answer each question carefully and demonstrate your experience.
              </p>
            </div>
          </div>

          {/* Interview Information */}

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-sm">
              <Gauge size={17} />

              <span>{session.difficulty || "Medium"}</span>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-sm">
              <Clock3 size={17} />

              <span>{totalQuestions} Questions</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* Progress Card */}
      {/* ========================================== */}

      <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <p className="text-sm text-gray-500">Interview Progress</p>

            <h2 className="font-bold text-gray-900 mt-0.5">
              Question {questionNumber} of {totalQuestions}
            </h2>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-purple-600">
              {Math.round(progress)}%
            </p>

            <p className="text-xs text-gray-400">
              {remainingQuestions > 0
                ? `${remainingQuestions} remaining`
                : "Final question"}
            </p>
          </div>
        </div>

        {/* Progress Bar */}

        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        {/* Progress Details */}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <CheckCircle2 size={15} className="text-green-500" />

            <span>{answeredQuestions} answered</span>
          </div>

          <span className="text-xs text-gray-400">
            {totalQuestions - answeredQuestions} remaining
          </span>
        </div>
      </div>

      {/* ========================================== */}
      {/* Question Card */}
      {/* ========================================== */}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Question Header */}

        <div className="bg-gray-50 border-b border-gray-100 p-6 md:p-7">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                {questionNumber}
              </span>

              <span className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-600 text-xs font-semibold">
                {question.difficulty || session.difficulty || "Medium"}
              </span>
            </div>

            <span className="text-xs font-medium text-gray-400">
              Question {questionNumber}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-8">
            {question.question}
          </h2>
        </div>

        {/* Answer Area */}

        <div className="p-6 md:p-7">
          <div className="flex items-center justify-between gap-4 mb-3">
            <label
              htmlFor="interview-answer"
              className="text-sm font-semibold text-gray-800"
            >
              Your Answer
            </label>

            <span className="text-xs text-gray-400">
              {currentAnswer.trim().length} characters
            </span>
          </div>

          <textarea
            id="interview-answer"
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            disabled={saving || submitting}
            placeholder="Write your answer here..."
            rows={9}
            className="w-full border border-gray-200 rounded-2xl p-5 text-sm md:text-base text-gray-800 leading-7 outline-none resize-none bg-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 disabled:bg-gray-50 disabled:cursor-not-allowed transition"
          />

          {/* Answer Tip */}

          <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-purple-50 border border-purple-100">
            <Brain size={18} className="text-purple-600 shrink-0 mt-0.5" />

            <div>
              <p className="text-sm font-semibold text-purple-900">
                Interview Tip
              </p>

              <p className="text-xs md:text-sm text-purple-800/70 mt-1 leading-6">
                Structure your answer clearly and use real examples from your
                projects or professional experience whenever relevant.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* Error */}
      {/* ========================================== */}

      {error && session && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3.5">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />

          <p className="text-sm leading-6">{error}</p>
        </div>
      )}

      {/* ========================================== */}
      {/* Navigation / Action */}
      {/* ========================================== */}

      <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          {/* Status */}

          <div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  isLastQuestion ? "bg-green-500" : "bg-purple-500"
                }`}
              />

              <span className="text-sm font-semibold text-gray-800">
                {isLastQuestion ? "You're on the final question" : "Keep going"}
              </span>
            </div>

            <p className="text-xs text-gray-400 mt-1.5">
              {isLastQuestion
                ? "Review your answer and submit the interview."
                : "Save your answer to continue."}
            </p>
          </div>

          {/* Action */}

          {!isLastQuestion ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={saving || submitting}
              className="w-full sm:w-auto min-w-[190px] px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving Answer...
                </>
              ) : (
                <>
                  Save & Continue
                  <ChevronRight size={19} />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                submitting ||
                saving ||
                !currentAnswer.trim() ||
                answeredQuestions !== totalQuestions
              }
              className="w-full sm:w-auto min-w-[210px] px-6 py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all"
            >
              {submitting ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Evaluating Interview...
                </>
              ) : (
                <>
                  Submit Interview
                  <Send size={18} />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* Bottom Progress */}
      {/* ========================================== */}

      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
        <CheckCircle2 size={14} className="text-green-500" />

        <span>
          {answeredQuestions} of {totalQuestions} questions answered
        </span>

        <span>•</span>

        <span>
          {isLastQuestion ? "Ready to submit" : "Interview in progress"}
        </span>
      </div>
    </div>
  );
};

export default InterviewSession;
