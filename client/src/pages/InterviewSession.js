import { Brain, ChevronRight, Gauge, Send, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getInterviewSession,
  saveInterviewProgress,
  submitInterviewSession,
} from "../apis/interviewApi";
import { useInterview } from "../context/InterviewContext";

const InterviewSession = () => {
  console.log("InterviewSession rendered");

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

  /*
   * Load Interview Session
   *
   * This runs only when sessionId changes.
   */
  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      console.log("Fetching interview session:", sessionId);

      try {
        setLoading(true);
        setError("");

        const response = await getInterviewSession(sessionId);

        const interview = response.data;

        setSession(interview);

        /*
         * Mark this interview as active.
         */
        setActiveInterview(sessionId);

        /*
         * Restore previously saved answers.
         */
        const restoredAnswers = interview.questions.map((question, index) => ({
          question: question.question,
          answer: interview.answers?.[index]?.answer || "",
        }));

        setAnswers(restoredAnswers);

        /*
         * Resume from the first unanswered question.
         */
        const firstUnansweredIndex = restoredAnswers.findIndex(
          (item) => !item.answer || !item.answer.trim(),
        );

        if (firstUnansweredIndex !== -1) {
          setCurrentQuestion(firstUnansweredIndex);
        } else {
          /*
           * If all questions are answered,
           * open the final question.
           */
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

  /*
   * Browser refresh / tab close protection.
   */
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

  /*
   * Handle Answer Change
   */
  const handleAnswerChange = (value) => {
    /*
     * Do not allow changes while saving/submitting.
     */
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

    /*
     * Clear validation error when user starts typing.
     */
    if (error) {
      setError("");
    }
  };

  /*
   * Save Current Answer + Move To Next Question
   */
  const handleNext = async () => {
    /*
     * Prevent duplicate clicks.
     */
    if (saving || submitting) {
      return;
    }

    const currentAnswer = answers[currentQuestion]?.answer?.trim();

    /*
     * Current question MUST be answered before
     * moving to the next question.
     */
    if (!currentAnswer) {
      setError(
        "Please answer this question before continuing to the next question.",
      );

      return;
    }

    try {
      setSaving(true);
      setError("");

      /*
       * Save the complete current progress.
       *
       * The next question will only open after
       * the backend successfully saves the answer.
       */
      await saveInterviewProgress(sessionId, answers);

      /*
       * Move forward only after successful save.
       */
      if (currentQuestion < session.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);

        /*
         * Scroll to top so the next question starts
         * from a clean position.
         */
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

  /*
   * Submit Interview
   */
  const handleSubmit = async () => {
    if (submitting || saving) {
      return;
    }

    /*
     * Validate every answer before submission.
     */
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

      /*
       * Submit answers to backend.
       */
      const response = await submitInterviewSession(sessionId, answers);

      console.log("Interview Submitted:", response);

      /*
       * Interview completed.
       */
      clearInterview();

      /*
       * Navigate to result page.
       */
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

  /*
   * Loading State
   */
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

  /*
   * Error State
   */
  if (error && !session) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 text-center max-w-md">
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

  /*
   * No Questions State
   */
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

  const totalQuestions = session.questions.length;

  const questionNumber = currentQuestion + 1;

  const remainingQuestions = totalQuestions - questionNumber;

  const progress = (questionNumber / totalQuestions) * 100;

  const isLastQuestion = currentQuestion === totalQuestions - 1;

  const currentAnswer = answers[currentQuestion]?.answer || "";

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Title */}

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Brain size={34} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">AI Interview Coach</h1>

              <p className="mt-2 text-purple-100">
                {session.interviewType} Interview
              </p>
            </div>
          </div>

          {/* Interview Information */}

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Gauge size={18} />

              <span>{session.difficulty}</span>
            </div>

            <div className="bg-white/20 px-4 py-2 rounded-xl">
              {totalQuestions} Questions
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}

      <div className="bg-white border rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold">
            Question {questionNumber} of {totalQuestions}
          </span>

          <span className="text-gray-500">
            {remainingQuestions > 0
              ? `${remainingQuestions} remaining`
              : "Final question"}
          </span>
        </div>

        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-end mt-2">
          <span className="text-sm text-gray-400">
            {Math.round(progress)}% complete
          </span>
        </div>
      </div>

      {/* Question */}

      <div className="bg-white border rounded-2xl shadow-sm p-8">
        {/* Question Meta */}

        <div className="flex items-center justify-between gap-4 mb-6">
          <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-4 py-2 rounded-full">
            {question.difficulty}
          </span>

          <span className="text-sm text-gray-500">
            Question {questionNumber}
          </span>
        </div>

        {/* Question Text */}

        <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
          {question.question}
        </h2>

        {/* Answer */}

        <div className="mt-8">
          <label className="font-semibold text-gray-700 block mb-3">
            Your Answer
          </label>

          <textarea
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            disabled={saving || submitting}
            placeholder="Type your answer here..."
            rows={8}
            className="w-full border border-gray-200 rounded-2xl p-5 outline-none resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition"
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
            <p className="text-sm text-gray-400">
              <span className="font-medium text-gray-500">Tip:</span> Structure
              your answer clearly and include real examples from your projects
              whenever relevant.
            </p>

            <span className="text-xs text-gray-400 shrink-0">
              {currentAnswer.trim().length} characters
            </span>
          </div>
        </div>
      </div>

      {/* Error */}

      {error && session && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Navigation */}

      <div className="bg-white border rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Question Counter */}

          <div className="text-sm font-semibold text-gray-500">
            <span className="text-purple-600">{questionNumber}</span>

            <span className="mx-1">/</span>

            <span>{totalQuestions}</span>

            <span className="ml-2 text-gray-400 font-normal">
              {isLastQuestion ? "Final question" : "Keep going"}
            </span>
          </div>

          {/* Action Button */}

          {!isLastQuestion ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={saving || submitting}
              className="w-full sm:w-auto min-w-[180px] px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {saving ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Saving Answer...
                </>
              ) : (
                <>
                  Save & Continue
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || saving || !currentAnswer.trim()}
              className="w-full sm:w-auto min-w-[180px] px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Evaluating Interview...
                </>
              ) : (
                <>
                  Submit Interview
                  <Send size={19} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
