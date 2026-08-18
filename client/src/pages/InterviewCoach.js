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

  // Resumes
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState("");

  // Interview configuration
  const [interviewType, setInterviewType] = useState("Technical");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(10);

  // Previous sessions
  const [sessions, setSessions] = useState([]);

  // Loading states
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [startingInterview, setStartingInterview] = useState(false);

  // Error
  const [error, setError] = useState("");

  // ==========================================
  // Fetch Resumes
  // ==========================================

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoadingResumes(true);

        const response = await getMyResumes();

        const resumeData = response.data || [];

        // Only analyzed resumes
        const completedResumes = resumeData.filter(
          (resume) => resume.uploadStatus === "completed",
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

      // Navigate to actual interview session page
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
      {/* Error */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4">
          {error}
        </div>
      )}

      {/* Header */}

      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <Brain size={34} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">AI Interview Coach</h1>

            <p className="mt-2 text-purple-100">
              Practice realistic AI-generated interview questions based on your
              resume.
            </p>
          </div>
        </div>
      </div>

      {/* Interview Setup + Tips */}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Interview Setup */}

        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">Start New Interview</h2>

          <div className="space-y-6">
            {/* Resume */}

            <div>
              <label className="font-medium mb-2 block">Select Resume</label>

              <select
                value={selectedResume}
                onChange={(e) => setSelectedResume(e.target.value)}
                disabled={loadingResumes}
                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
              >
                {loadingResumes ? (
                  <option>Loading resumes...</option>
                ) : resumes.length === 0 ? (
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
            </div>

            {/* Interview Type */}

            <div>
              <label className="font-medium mb-2 block">Interview Type</label>

              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500"
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
                <label className="font-medium mb-2 block">Difficulty</label>

                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Easy">Easy</option>

                  <option value="Medium">Medium</option>

                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Questions */}

              <div>
                <label className="font-medium mb-2 block">Questions</label>

                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500"
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
              onClick={handleStartInterview}
              disabled={
                startingInterview ||
                loadingResumes ||
                resumes.length === 0 ||
                !selectedResume
              }
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
            >
              <PlayCircle size={22} />

              {startingInterview
                ? "Generating Interview..."
                : "Start AI Interview"}
            </button>
          </div>
        </div>

        {/* Tips */}

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="font-bold text-lg mb-4">Interview Tips</h2>

            <div className="space-y-4 text-gray-600">
              <div className="flex gap-3">
                <Lightbulb className="text-yellow-500 mt-1" size={18} />

                <p>Answer confidently and clearly.</p>
              </div>

              <div className="flex gap-3">
                <Lightbulb className="text-yellow-500 mt-1" size={18} />

                <p>Use real project examples whenever possible.</p>
              </div>

              <div className="flex gap-3">
                <Lightbulb className="text-yellow-500 mt-1" size={18} />

                <p>Practice regularly to improve your confidence.</p>
              </div>
            </div>
          </div>

          {/* Best Score */}

          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white p-6">
            <h3 className="font-bold text-xl">Best Score</h3>

            <p className="text-4xl font-bold mt-3">{bestScore}%</p>

            <p className="mt-2 text-green-100">
              {bestScore > 0
                ? "Keep practicing to improve your interview performance."
                : "Complete an interview to get your first score."}
            </p>
          </div>
        </div>
      </div>

      {/* Previous Sessions */}

      <div className="bg-white rounded-2xl border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Previous Interviews</h2>
        </div>

        <div className="divide-y">
          {loadingSessions ? (
            <div className="p-8 text-center text-gray-500">
              Loading previous interviews...
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center">
              <Brain size={40} className="mx-auto text-gray-300" />

              <p className="mt-3 text-gray-500">No previous interviews yet.</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session._id}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 p-6 hover:bg-gray-50 transition"
              >
                {/* Session Info */}

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
                    <FileText className="text-purple-600" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">
                      {session.interviewType
                        ? `${session.interviewType} Interview`
                        : "AI Interview"}
                    </h3>

                    <div className="flex flex-wrap gap-5 mt-2 text-gray-500 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar size={15} />

                        {new Date(session.createdAt).toLocaleDateString()}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock size={15} />
                        {session.questions?.length || 0} Questions
                      </span>

                      <span>{session.difficulty || "Medium"}</span>
                    </div>
                  </div>
                </div>

                {/* Score + Details */}

                {/* Score + Action */}

                <div className="flex items-center gap-6">
                  {/* Completed Interview */}
                  {session.status === "completed" && (
                    <div className="flex items-center gap-2 text-green-600 font-bold">
                      <Trophy size={18} />
                      {session.overallScore || 0}%
                    </div>
                  )}

                  {/* Pending Interview */}
                  {session.status === "pending" && (
                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                      Pending
                    </span>
                  )}

                  {/* In Progress Interview */}
                  {session.status === "in-progress" && (
                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                      In Progress
                    </span>
                  )}

                  {/* Action */}
                  {session.status === "completed" ? (
                    <button
                      onClick={() =>
                        navigate(`/dashboard/interview/result/${session._id}`)
                      }
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                    >
                      View Result
                      <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        navigate(`/dashboard/interview/session/${session._id}`)
                      }
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                    >
                      {session.status === "pending"
                        ? "Start Interview"
                        : "Continue Interview"}

                      <ChevronRight size={18} />
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

export default InterviewCoach;
