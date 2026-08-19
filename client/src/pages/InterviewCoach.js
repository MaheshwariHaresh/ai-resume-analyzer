import {
  Brain,
  PlayCircle,
  Clock,
  Trophy,
  Calendar,
  ChevronRight,
  FileText,
  Lightbulb,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyResumes } from "../apis/resumeApi";
import { getInterviewSessions, startInterview } from "../apis/interviewApi";

const InterviewCoach = () => {
  const navigate = useNavigate();

  // ==========================================
  // Resumes
  // ==========================================

  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState("");

  // ==========================================
  // Interview Configuration
  // ==========================================

  const [interviewType, setInterviewType] = useState("Technical");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(10);

  // ==========================================
  // Previous Sessions
  // ==========================================

  const [sessions, setSessions] = useState([]);

  // ==========================================
  // Loading States
  // ==========================================

  const [loadingResumes, setLoadingResumes] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [startingInterview, setStartingInterview] = useState(false);

  // ==========================================
  // Error
  // ==========================================

  const [error, setError] = useState("");

  // ==========================================
  // Fetch Resumes
  // ==========================================

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoadingResumes(true);
        setError("");

        const response = await getMyResumes();

        const resumeData = response.data || [];

        // Only analyzed resumes
        const completedResumes = resumeData.filter(
          (resume) => resume.uploadStatus?.toLowerCase() === "completed",
        );

        setResumes(completedResumes);

        // Automatically select first resume
        if (completedResumes.length > 0) {
          setSelectedResume(completedResumes[0]._id);
        }
      } catch (error) {
        console.error("Resume Fetch Error:", error);

        setError(error.response?.data?.message || "Failed to load resumes.");
      } finally {
        setLoadingResumes(false);
      }
    };

    fetchResumes();
  }, []);

  // ==========================================
  // Fetch Previous Interviews
  // ==========================================

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoadingSessions(true);

        const response = await getInterviewSessions();

        setSessions(response.data || []);
      } catch (error) {
        console.error("Interview Sessions Error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load previous interviews.",
        );
      } finally {
        setLoadingSessions(false);
      }
    };

    fetchSessions();
  }, []);

  // ==========================================
  // Start Interview
  // ==========================================

  const handleStartInterview = async () => {
    if (!selectedResume) {
      setError("Please select a resume first.");
      return;
    }

    try {
      setStartingInterview(true);
      setError("");

      const response = await startInterview(
        selectedResume,
        interviewType,
        difficulty,
        questionCount,
      );

      const session = response.data;

      navigate(`/dashboard/interview/session/${session._id}`);
    } catch (error) {
      console.error("Start Interview Error:", error);

      setError(error.response?.data?.message || "Failed to start interview.");
    } finally {
      setStartingInterview(false);
    }
  };

  // ==========================================
  // Best Score
  // ==========================================

  const completedSessions = sessions.filter(
    (session) => session.status === "completed",
  );

  const bestScore =
    completedSessions.length > 0
      ? Math.max(
          ...completedSessions.map((session) => session.overallScore || 0),
        )
      : 0;

  return (
    <div className="space-y-8">
      {/* ==========================================
          Error
      ========================================== */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
          {error}
        </div>
      )}

      {/* ==========================================
          Header
      ========================================== */}

      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-600 to-indigo-700 rounded-3xl p-7 md:p-8 text-white shadow-lg">
        {/* Background Decoration */}

        <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

        <div className="absolute -bottom-32 -left-20 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />

        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 shrink-0 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
            <Brain size={34} />
          </div>

          <div>
            <p className="text-sm font-medium text-purple-100">
              AI-Powered Practice
            </p>

            <h1 className="text-2xl md:text-3xl font-bold mt-1">
              AI Interview Coach
            </h1>

            <p className="mt-2 text-sm md:text-base text-purple-100">
              Practice realistic AI-generated interview questions based on your
              resume.
            </p>
          </div>
        </div>
      </div>

      {/* ==========================================
          Interview Setup + Tips
      ========================================== */}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ==========================================
            Interview Setup
        ========================================== */}

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Start New Interview
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Configure your interview and start practicing.
            </p>
          </div>

          <div className="space-y-6">
            {/* Resume */}

            <div>
              <label className="font-medium text-sm text-gray-700 mb-2 block">
                Select Resume
              </label>

              {loadingResumes ? (
                <div className="h-12 rounded-xl bg-gray-100 animate-pulse" />
              ) : (
                <select
                  value={selectedResume}
                  onChange={(e) => setSelectedResume(e.target.value)}
                  disabled={resumes.length === 0}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {resumes.length === 0 ? (
                    <option value="">No analyzed resumes found</option>
                  ) : (
                    <>
                      <option value="">Select a resume</option>

                      {resumes.map((resume) => (
                        <option key={resume._id} value={resume._id}>
                          {resume.originalFileName}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              )}
            </div>

            {/* Interview Type */}

            <div>
              <label className="font-medium text-sm text-gray-700 mb-2 block">
                Interview Type
              </label>

              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
              >
                <option value="Technical">Technical Interview</option>

                <option value="HR">HR Interview</option>

                <option value="Behavioral">Behavioral Interview</option>

                <option value="Mixed">Mixed Interview</option>
              </select>
            </div>

            {/* Difficulty + Questions */}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Difficulty */}

              <div>
                <label className="font-medium text-sm text-gray-700 mb-2 block">
                  Difficulty
                </label>

                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
                >
                  <option value="Easy">Easy</option>

                  <option value="Medium">Medium</option>

                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Questions */}

              <div>
                <label className="font-medium text-sm text-gray-700 mb-2 block">
                  Questions
                </label>

                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
                >
                  <option value={5}>5 Questions</option>

                  <option value={10}>10 Questions</option>

                  <option value={15}>15 Questions</option>

                  <option value={20}>20 Questions</option>
                </select>
              </div>
            </div>

            {/* Start Interview */}

            <button
              type="button"
              onClick={handleStartInterview}
              disabled={
                startingInterview ||
                loadingResumes ||
                resumes.length === 0 ||
                !selectedResume
              }
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              {startingInterview ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Interview...
                </>
              ) : (
                <>
                  <PlayCircle size={21} />
                  Start AI Interview
                </>
              )}
            </button>

            {resumes.length === 0 && !loadingResumes && (
              <p className="text-center text-xs text-gray-500">
                You need at least one completed resume analysis before starting
                an interview.
              </p>
            )}
          </div>
        </div>

        {/* ==========================================
            Right Sidebar
        ========================================== */}

        <div className="space-y-6">
          {/* Interview Tips */}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                <Lightbulb size={19} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">Interview Tips</h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  Make the most of your practice
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </div>

                <p className="text-sm text-gray-600 leading-6">
                  Answer confidently and clearly.
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </div>

                <p className="text-sm text-gray-600 leading-6">
                  Use real project examples whenever possible.
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </div>

                <p className="text-sm text-gray-600 leading-6">
                  Practice regularly to improve your confidence.
                </p>
              </div>
            </div>
          </div>

          {/* Best Score */}

          {loadingSessions ? (
            <div className="rounded-2xl bg-gray-100 p-6 animate-pulse">
              <div className="h-5 w-28 bg-gray-200 rounded" />

              <div className="h-10 w-24 bg-gray-200 rounded mt-4" />

              <div className="h-4 w-full bg-gray-200 rounded mt-4" />

              <div className="h-4 w-3/4 bg-gray-200 rounded mt-2" />
            </div>
          ) : (
            <div className="relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white p-6 shadow-sm">
              <div className="absolute -right-10 -top-10 w-28 h-28 bg-white/10 rounded-full" />

              <div className="relative">
                <div className="flex items-center gap-2">
                  <Trophy size={19} />

                  <h3 className="font-bold text-lg">Best Score</h3>
                </div>

                <p className="text-4xl font-bold mt-3">{bestScore}%</p>

                <p className="mt-2 text-sm text-green-100 leading-6">
                  {bestScore > 0
                    ? "Keep practicing to improve your interview performance."
                    : "Complete an interview to get your first score."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==========================================
          Previous Sessions
      ========================================== */}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}

        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Previous Interviews
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Review your previous interview sessions and scores.
              </p>
            </div>

            {!loadingSessions && sessions.length > 0 && (
              <span className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full bg-purple-50 text-purple-600 text-xs font-semibold">
                {sessions.length}{" "}
                {sessions.length === 1 ? "Session" : "Sessions"}
              </span>
            )}
          </div>
        </div>

        {/* Sessions */}

        <div className="divide-y divide-gray-100">
          {loadingSessions ? (
            <>
              <InterviewSessionSkeleton />
              <InterviewSessionSkeleton />
              <InterviewSessionSkeleton />
            </>
          ) : sessions.length === 0 ? (
            <div className="p-12 md:p-16 text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                <Brain size={26} className="text-gray-300" />
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                No previous interviews
              </h3>

              <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                Start your first AI interview to practice your skills and
                receive personalized feedback.
              </p>

              <button
                type="button"
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition"
              >
                <PlayCircle size={17} />
                Start Interview
              </button>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session._id}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 p-6 hover:bg-gray-50/70 transition"
              >
                {/* Session Info */}

                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 shrink-0 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                    <FileText className="text-purple-600" size={21} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base">
                      {session.interviewType
                        ? `${session.interviewType} Interview`
                        : "AI Interview"}
                    </h3>

                    <div className="flex flex-wrap gap-x-5 gap-y-2 mt-2 text-gray-500 text-sm">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} />

                        {session.createdAt
                          ? new Date(session.createdAt).toLocaleDateString()
                          : "-"}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {session.questions?.length || 0} Questions
                      </span>

                      <span className="capitalize">
                        {session.difficulty || "Medium"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score + Action */}

                <div className="flex items-center justify-between lg:justify-end gap-5">
                  {/* Completed */}

                  {session.status === "completed" && (
                    <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                      <Trophy size={17} />
                      {session.overallScore || 0}%
                    </div>
                  )}

                  {/* Pending */}

                  {session.status === "pending" && (
                    <span className="px-3 py-1.5 rounded-full bg-yellow-50 border border-yellow-100 text-yellow-700 text-xs font-semibold">
                      Pending
                    </span>
                  )}

                  {/* In Progress */}

                  {session.status === "in-progress" && (
                    <span className="px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
                      In Progress
                    </span>
                  )}

                  {/* Action */}

                  {session.status === "completed" ? (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/dashboard/interview/result/${session._id}`)
                      }
                      className="flex items-center gap-1.5 text-purple-600 hover:text-purple-700 text-sm font-semibold transition"
                    >
                      View Result
                      <ChevronRight size={17} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/dashboard/interview/session/${session._id}`)
                      }
                      className="flex items-center gap-1.5 text-purple-600 hover:text-purple-700 text-sm font-semibold transition"
                    >
                      {session.status === "pending"
                        ? "Start Interview"
                        : "Continue Interview"}

                      <ChevronRight size={17} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/* =================================================
   Interview Session Skeleton
================================================= */

const InterviewSessionSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 p-6">
      {/* Left */}

      <div className="flex items-center gap-4">
        {/* Icon */}

        <div className="w-14 h-14 shrink-0 rounded-xl bg-gray-100 animate-pulse" />

        {/* Content */}

        <div className="space-y-3">
          <div className="h-5 w-44 bg-gray-100 rounded animate-pulse" />

          <div className="flex gap-4">
            <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />

            <div className="h-4 w-28 bg-gray-100 rounded animate-pulse" />

            <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Right */}

      <div className="flex items-center gap-5">
        <div className="h-5 w-14 bg-gray-100 rounded animate-pulse" />

        <div className="h-5 w-28 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  );
};

export default InterviewCoach;
