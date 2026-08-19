import {
  FileText,
  Brain,
  User,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Eye,
  Calendar,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { getDashboardData } from "../apis/dashboardApi.js";
import { useEffect, useState } from "react";
import Skeleton from "../components/utils/Skeleton.js";

const actions = [
  {
    title: "Analyze Resume",
    desc: "Upload a new resume",
    icon: FileText,
    link: "/dashboard/analyze",
  },
  {
    title: "Interview Coach",
    desc: "Practice AI interview",
    icon: Brain,
    link: "/dashboard/interview",
  },
  {
    title: "Profile",
    desc: "Manage account",
    icon: User,
    link: "/dashboard/profile",
  },
];

/*
 * Dashboard Skeleton
 *
 * Displayed while dashboard data is being fetched.
 */
const DashboardSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-white border p-8">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="w-full">
            <Skeleton className="h-10 w-72" />

            <Skeleton className="h-5 w-full max-w-xl mt-4" />
            <Skeleton className="h-5 w-4/5 max-w-lg mt-2" />
          </div>

          <Skeleton className="h-14 w-48 rounded-xl" />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-2xl border p-6 shadow-sm">
            <Skeleton className="w-14 h-14 rounded-xl" />

            <Skeleton className="h-4 w-28 mt-5" />

            <Skeleton className="h-9 w-20 mt-3" />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <Skeleton className="h-8 w-40 mb-5" />

        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white border rounded-2xl p-6">
              <Skeleton className="w-14 h-14 rounded-xl" />

              <Skeleton className="h-6 w-40 mt-5" />

              <Skeleton className="h-4 w-32 mt-3" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Analyses */}
      <div className="bg-white rounded-2xl border shadow-sm">
        <div className="p-6 border-b">
          <Skeleton className="h-7 w-48" />

          <Skeleton className="h-4 w-64 mt-3" />
        </div>

        {/* Desktop table skeleton */}
        <div className="hidden md:block overflow-hidden">
          <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-gray-50">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="grid grid-cols-5 gap-4 items-center px-6 py-5 border-t"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-11 h-11 rounded-xl" />

                <div>
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-24 mt-2" />
                </div>
              </div>

              <Skeleton className="h-5 w-12" />

              <Skeleton className="h-6 w-20 rounded-full" />

              <Skeleton className="h-4 w-24" />

              <Skeleton className="h-9 w-9 rounded-lg mx-auto" />
            </div>
          ))}
        </div>

        {/* Mobile skeleton */}
        <div className="md:hidden p-6 space-y-5">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-11 h-11 rounded-xl" />

                <div className="flex-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-24 mt-2" />
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-9 w-9 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2].map((item) => (
          <div key={item} className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-32" />

                <Skeleton className="h-10 w-20 mt-3" />
              </div>

              <Skeleton className="w-14 h-14 rounded-xl" />
            </div>

            <Skeleton className="h-4 w-72 max-w-full mt-4" />
          </div>
        ))}
      </div>

      {/* AI Tip */}
      <div className="rounded-2xl border bg-white p-6">
        <div className="flex gap-4">
          <Skeleton className="w-14 h-14 rounded-xl flex-shrink-0" />

          <div className="flex-1">
            <Skeleton className="h-6 w-40" />

            <Skeleton className="h-4 w-full mt-3" />
            <Skeleton className="h-4 w-11/12 mt-2" />
            <Skeleton className="h-4 w-4/5 mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getDashboardData();

        setDashboard(response.data);
      } catch (error) {
        console.error("Dashboard Error:", error);

        setError(error.response?.data?.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  /*
   * Dashboard loading state
   */
  if (loading) {
    return <DashboardSkeleton />;
  }

  /*
   * Dashboard error state
   */
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-600 font-medium">{error}</p>

        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  const statistics = dashboard?.statistics || {};

  const recentResumes = dashboard?.recentResumes || [];

  return (
    <div className="space-y-8">
      {/* =========================
          Welcome Banner
      ========================= */}

      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold">Welcome Back 👋</h1>

            <p className="mt-3 text-blue-100 max-w-xl">
              Analyze your resume, improve your ATS score and prepare for your
              next interview with AI.
            </p>
          </div>

          <Link
            to="/dashboard/analyze"
            className="bg-white text-blue-600 px-6 py-4 rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition"
          >
            Analyze Resume
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* =========================
          Statistics
      ========================= */}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Total Resumes */}

        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <FileText size={28} />
          </div>

          <h3 className="text-gray-500 mt-5">Total Resumes</h3>

          <p className="text-3xl font-bold mt-2">
            {statistics.totalResumes || 0}
          </p>
        </div>

        {/* Average ATS */}

        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <div className="w-14 h-14 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
            <TrendingUp size={28} />
          </div>

          <h3 className="text-gray-500 mt-5">Average ATS Score</h3>

          <p className="text-3xl font-bold mt-2 text-green-600">
            {statistics.averageATSScore || 0}%
          </p>
        </div>

        {/* Analyzed Resumes */}

        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <Brain size={28} />
          </div>

          <h3 className="text-gray-500 mt-5">Analyzed Resumes</h3>

          <p className="text-3xl font-bold mt-2">
            {statistics.analyzedResumes || 0}
          </p>
        </div>
      </div>

      {/* =========================
          Quick Actions
      ========================= */}

      <div>
        <h2 className="text-2xl font-bold mb-5">Quick Actions</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {actions.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                to={item.link}
                className="bg-white border rounded-2xl p-6 hover:shadow-lg transition hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Icon className="text-blue-600" />
                </div>

                <h3 className="font-semibold text-xl mt-5">{item.title}</h3>

                <p className="text-gray-500 mt-2">{item.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* =========================
          Recent Analyses
      ========================= */}

      <div className="bg-white rounded-2xl border shadow-sm">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Recent Analyses</h2>

            <p className="text-gray-500">Your latest resume analysis reports</p>
          </div>

          <Link
            to="/dashboard/history"
            className="text-blue-600 font-medium hover:underline"
          >
            View All
          </Link>
        </div>

        {recentResumes.length === 0 ? (
          /* Empty State */

          <div className="p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto">
              <FileText className="text-blue-600" size={30} />
            </div>

            <h3 className="text-lg font-semibold mt-4">No resumes yet</h3>

            <p className="text-gray-500 mt-2">
              Upload your first resume to get an AI-powered ATS analysis.
            </p>

            <Link
              to="/dashboard/analyze"
              className="inline-flex items-center gap-2 mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
            >
              Analyze Resume
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          /* Resume Table */

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4">Resume</th>

                  <th className="text-left px-6 py-4">ATS Score</th>

                  <th className="text-left px-6 py-4">Status</th>

                  <th className="text-left px-6 py-4">Date</th>

                  <th className="text-center px-6 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {recentResumes.map((resume) => {
                  const score = resume.analysis?.atsScore || 0;

                  const isCompleted = resume.uploadStatus === "completed";

                  return (
                    <tr
                      key={resume._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      {/* Resume Name */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                            <FileText size={20} className="text-blue-600" />
                          </div>

                          <div>
                            <h3 className="font-semibold">
                              {resume.originalFileName}
                            </h3>

                            <p className="text-sm text-gray-500">
                              Resume Document
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ATS Score */}

                      <td className="px-6 py-5">
                        {isCompleted ? (
                          <span
                            className={`font-bold ${
                              score >= 80
                                ? "text-green-600"
                                : score >= 60
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {score}%
                          </span>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </td>

                      {/* Status */}

                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            isCompleted
                              ? "bg-green-100 text-green-700"
                              : resume.uploadStatus === "analyzing"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {resume.uploadStatus}
                        </span>
                      </td>

                      {/* Date */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar size={16} />

                          {new Date(resume.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </div>
                      </td>

                      {/* Action */}

                      <td className="px-6 py-5">
                        <div className="flex justify-center">
                          <button
                            onClick={() =>
                              navigate(`/dashboard/resume/${resume._id}`)
                            }
                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600"
                            title="View Report"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================
          Score Overview
      ========================= */}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Highest Score */}

        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500">Highest ATS Score</h3>

              <p className="text-4xl font-bold text-blue-600 mt-2">
                {statistics.highestATSScore || 0}%
              </p>
            </div>

            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
              <TrendingUp size={28} className="text-blue-600" />
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Your best resume performance so far.
          </p>
        </div>

        {/* Analyzed Percentage */}

        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500">Analysis Progress</h3>

              <p className="text-4xl font-bold text-purple-600 mt-2">
                {statistics.totalResumes
                  ? Math.round(
                      (statistics.analyzedResumes / statistics.totalResumes) *
                        100,
                    )
                  : 0}
                %
              </p>
            </div>

            <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
              <Brain size={28} className="text-purple-600" />
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Percentage of your uploaded resumes that have been analyzed.
          </p>
        </div>
      </div>

      {/* =========================
          AI Tip
      ========================= */}

      <div className="rounded-2xl border bg-gradient-to-r from-yellow-50 to-orange-50 p-6">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
            <Sparkles className="text-orange-500" />
          </div>

          <div>
            <h3 className="text-xl font-bold">AI Tip of the Day</h3>

            <p className="mt-2 text-gray-600 leading-7">
              Tailor your resume for every job application by matching keywords
              from the job description. This can significantly improve your ATS
              score and increase your chances of getting shortlisted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
