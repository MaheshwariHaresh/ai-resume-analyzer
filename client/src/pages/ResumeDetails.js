import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  FileText,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Target,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

import { getResumeDetails } from "../apis/resumeApi";
import Skeleton from "../components/utils/Skeleton";

const ResumeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await getResumeDetails(id);

        console.log(data);

        setResume(data);
      } catch (error) {
        console.error("Resume Details Error:", error);

        setError(
          error.response?.data?.message || "Failed to load resume report.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  /* =====================================================
     Loading Skeleton
  ===================================================== */

  if (loading) {
    return <ResumeDetailsSkeleton />;
  }

  /* =====================================================
     Error State
  ===================================================== */

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm max-w-md w-full">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />

          <h2 className="text-xl font-bold text-gray-900 mt-4">
            Unable to Load Report
          </h2>

          <p className="text-gray-500 mt-2">{error}</p>

          <button
            type="button"
            onClick={() => navigate("/dashboard/history")}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition"
          >
            Back to Resume History
          </button>
        </div>
      </div>
    );
  }

  if (!resume) return null;

  const analysis = resume.analysis || {};
  const sectionScores = analysis.sectionScores || {};

  /* =====================================================
     Helpers
  ===================================================== */

  const getScoreColor = (score = 0) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";

    return "text-red-600";
  };

  const getScoreBg = (score = 0) => {
    if (score >= 80) return "bg-green-50 border-green-200";
    if (score >= 60) return "bg-yellow-50 border-yellow-200";

    return "bg-red-50 border-red-200";
  };

  const sections = [
    {
      name: "Contact Information",
      score: sectionScores.contactInfo || 0,
    },
    {
      name: "Experience",
      score: sectionScores.experience || 0,
    },
    {
      name: "Skills",
      score: sectionScores.skills || 0,
    },
    {
      name: "Education",
      score: sectionScores.education || 0,
    },
    {
      name: "Projects",
      score: sectionScores.projects || 0,
    },
    {
      name: "Keywords",
      score: sectionScores.keywords || 0,
    },
    {
      name: "Formatting",
      score: sectionScores.formatting || 0,
    },
  ];

  return (
    <div className="space-y-8">
      {/* =================================================
          Header
      ================================================= */}

      <div className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl p-6 md:p-7 shadow-sm">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-50 rounded-full blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard/history")}
              className="w-11 h-11 shrink-0 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition"
              aria-label="Back to resume history"
            >
              <ArrowLeft size={19} />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <FileText size={22} className="text-blue-600" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-blue-600 mb-1">
                  Resume Analysis
                </p>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Resume Report
                </h1>

                <p className="text-sm text-gray-500 mt-1.5 truncate max-w-xl">
                  {resume.originalFileName}
                </p>
              </div>
            </div>
          </div>

          {resume.fileUrl && (
            <a
              href={resume.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm hover:shadow-md transition shrink-0"
            >
              <ExternalLink size={17} />
              View Resume
            </a>
          )}
        </div>
      </div>

      {/* =================================================
          ATS Score + Summary
      ================================================= */}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ATS Score */}

        <div className="lg:col-span-1 bg-white border rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <TrendingUp className="text-blue-600" />
            </div>

            <div>
              <p className="text-gray-500 text-sm">ATS Score</p>

              <h2 className="text-lg font-bold text-gray-900">Overall Score</h2>
            </div>
          </div>

          <div className="flex items-center justify-center py-8">
            <div
              className={`w-40 h-40 rounded-full border-[14px] flex flex-col items-center justify-center ${
                analysis.atsScore >= 80
                  ? "border-green-200"
                  : analysis.atsScore >= 60
                    ? "border-yellow-200"
                    : "border-red-200"
              }`}
            >
              <span
                className={`text-5xl font-bold ${getScoreColor(
                  analysis.atsScore,
                )}`}
              >
                {analysis.atsScore || 0}
              </span>

              <span className="text-gray-400 text-sm">out of 100</span>
            </div>
          </div>

          <div className="text-center">
            <span
              className={`inline-block px-4 py-2 rounded-full font-semibold ${getScoreBg(
                analysis.atsScore,
              )} ${getScoreColor(analysis.atsScore)}`}
            >
              {analysis.overallVerdict || "Not Available"}
            </span>
          </div>
        </div>

        {/* Summary */}

        <div className="lg:col-span-2 bg-white border rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Resume Summary</h2>

          <p className="text-gray-600 leading-8 mt-5">
            {analysis.summary || "No summary available."}
          </p>
        </div>
      </div>

      {/* =================================================
          Section Scores
      ================================================= */}

      <section>
        <div className="flex items-center gap-3 mb-5">
          <Target className="text-blue-600" />

          <h2 className="text-2xl font-bold text-gray-900">Section Scores</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {sections.map((section) => (
            <div
              key={section.name}
              className="bg-white border rounded-2xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">{section.name}</h3>

                <span className={`font-bold ${getScoreColor(section.score)}`}>
                  {section.score}%
                </span>
              </div>

              <div className="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    section.score >= 80
                      ? "bg-green-500"
                      : section.score >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{
                    width: `${Math.min(section.score, 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================
          Strengths & Weaknesses
      ================================================= */}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Strengths */}

        <section className="bg-white border rounded-2xl p-7 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <CheckCircle className="text-green-600" />
            </div>

            <h2 className="text-xl font-bold text-gray-900">Strengths</h2>
          </div>

          <div className="space-y-4">
            {analysis.strengths?.length > 0 ? (
              analysis.strengths.map((strength, index) => (
                <div key={index} className="flex gap-3 text-gray-600 leading-7">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />

                  <p>{strength}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No strengths available.</p>
            )}
          </div>
        </section>

        {/* Weaknesses */}

        <section className="bg-white border rounded-2xl p-7 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="text-red-600" />
            </div>

            <h2 className="text-xl font-bold text-gray-900">Weaknesses</h2>
          </div>

          <div className="space-y-4">
            {analysis.weaknesses?.length > 0 ? (
              analysis.weaknesses.map((weakness, index) => (
                <div key={index} className="flex gap-3 text-gray-600 leading-7">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-1 shrink-0" />

                  <p>{weakness}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No weaknesses available.</p>
            )}
          </div>
        </section>
      </div>

      {/* =================================================
          Missing Skills
      ================================================= */}

      <section className="bg-white border rounded-2xl p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <Target className="text-orange-600" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">Missing Skills</h2>

            <p className="text-gray-500 text-sm mt-1">
              Skills that could improve your resume and job-market
              competitiveness.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {analysis.missingSkills?.length > 0 ? (
            analysis.missingSkills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-orange-50 border border-orange-200 text-orange-700 rounded-xl font-medium"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No missing skills identified.</p>
          )}
        </div>
      </section>

      {/* =================================================
          AI Suggestions
      ================================================= */}

      <section className="bg-white border rounded-2xl p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
            <Lightbulb className="text-yellow-600" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">AI Suggestions</h2>

            <p className="text-gray-500 text-sm mt-1">
              Recommended improvements based on your resume analysis.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {analysis.suggestions?.length > 0 ? (
            analysis.suggestions.map((suggestion, index) => (
              <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold shrink-0">
                  {index + 1}
                </div>

                <p className="text-gray-600 leading-7">{suggestion}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No suggestions available.</p>
          )}
        </div>
      </section>

      {/* =================================================
          Interview Questions
      ================================================= */}

      <section className="bg-white border rounded-2xl p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <MessageSquare className="text-purple-600" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              AI Interview Questions
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Practice questions generated from your resume.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {analysis.interviewQuestions?.length > 0 ? (
            analysis.interviewQuestions.map((question, index) => (
              <div
                key={index}
                className="border rounded-xl p-5 hover:border-purple-300 transition"
              >
                <div className="flex gap-4">
                  <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
                    {index + 1}
                  </span>

                  <p className="font-medium text-gray-800 leading-7">
                    {question}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No interview questions available.</p>
          )}
        </div>
      </section>

      {/* =================================================
          Bottom CTA
      ================================================= */}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <h2 className="text-2xl font-bold">
            Want to improve your ATS score?
          </h2>

          <p className="text-blue-100 mt-2">
            Upload an updated resume and compare your new score.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard/analyze")}
          className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold transition"
        >
          Analyze New Resume
        </button>
      </div>
    </div>
  );
};

/* =====================================================
   Resume Details Skeleton
===================================================== */

const ResumeDetailsSkeleton = () => {
  const sectionSkeletons = Array.from({ length: 7 });

  const listSkeletons = Array.from({ length: 3 });

  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}

      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-start gap-4">
            <Skeleton className="w-11 h-11 rounded-xl shrink-0" />

            <div className="flex items-start gap-4">
              <Skeleton className="w-12 h-12 rounded-xl shrink-0" />

              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </div>

          <Skeleton className="h-11 w-36 rounded-xl" />
        </div>
      </div>

      {/* ATS + Summary Skeleton */}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ATS */}

        <div className="lg:col-span-1 bg-white border rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <Skeleton className="w-11 h-11 rounded-xl" />

            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-28" />
            </div>
          </div>

          <div className="flex items-center justify-center py-8">
            <Skeleton className="w-40 h-40 rounded-full" />
          </div>

          <div className="flex justify-center">
            <Skeleton className="h-9 w-32 rounded-full" />
          </div>
        </div>

        {/* Summary */}

        <div className="lg:col-span-2 bg-white border rounded-2xl p-8 shadow-sm">
          <Skeleton className="h-7 w-48" />

          <div className="space-y-3 mt-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-8/12" />
          </div>
        </div>
      </div>

      {/* Section Scores Skeleton */}

      <section>
        <div className="flex items-center gap-3 mb-5">
          <Skeleton className="w-6 h-6 rounded" />
          <Skeleton className="h-7 w-40" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {sectionSkeletons.map((_, index) => (
            <div
              key={index}
              className="bg-white border rounded-2xl p-5 shadow-sm"
            >
              <div className="flex justify-between">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-10" />
              </div>

              <Skeleton className="h-2 w-full rounded-full mt-4" />
            </div>
          ))}
        </div>
      </section>

      {/* Strengths + Weaknesses Skeleton */}

      <div className="grid lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, cardIndex) => (
          <section
            key={cardIndex}
            className="bg-white border rounded-2xl p-7 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="h-6 w-28" />
            </div>

            <div className="space-y-5">
              {listSkeletons.map((_, index) => (
                <div key={index} className="flex gap-3">
                  <Skeleton className="w-5 h-5 rounded-full shrink-0" />

                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-10/12" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Missing Skills Skeleton */}

      <section className="bg-white border rounded-2xl p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-10 h-10 rounded-xl" />

          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-80" />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className={`h-10 rounded-xl ${
                index % 3 === 0 ? "w-28" : index % 3 === 1 ? "w-36" : "w-24"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Suggestions Skeleton */}

      <section className="bg-white border rounded-2xl p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-10 h-10 rounded-xl" />

          <div className="space-y-2">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
        </div>

        <div className="space-y-4">
          {listSkeletons.map((_, index) => (
            <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
              <Skeleton className="w-8 h-8 rounded-lg shrink-0" />

              <div className="flex-1 space-y-2 pt-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-10/12" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interview Questions Skeleton */}

      <section className="bg-white border rounded-2xl p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-10 h-10 rounded-xl" />

          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-80" />
          </div>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="border rounded-xl p-5 flex gap-4">
              <Skeleton className="w-8 h-8 rounded-lg shrink-0" />

              <div className="flex-1 space-y-2 pt-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-9/12" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Skeleton */}

      <div className="bg-white border rounded-2xl p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="space-y-3">
          <Skeleton className="h-7 w-72" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>

        <Skeleton className="h-11 w-40 rounded-xl" />
      </div>
    </div>
  );
};

export default ResumeDetails;
