import {
  Search,
  FileText,
  Eye,
  Trash2,
  Calendar,
  TrendingUp,
  X,
} from "lucide-react";

import { getMyResumes, deleteResume } from "../apis/resumeApi";

import { useNavigate, useSearchParams } from "react-router-dom";

import { useEffect, useMemo, useState } from "react";

import Skeleton from "../components/utils/Skeleton";

const ResumeHistory = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [statusFilter, setStatusFilter] = useState("All");

  // --------------------------------------------------
  // Sync search with URL
  // --------------------------------------------------

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  // --------------------------------------------------
  // Fetch Resumes
  // --------------------------------------------------

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);

      const res = await getMyResumes();

      setResumes(res.data || []);
    } catch (error) {
      console.error("Get Resumes Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Search + Status Filter
  // --------------------------------------------------

  const filteredResumes = useMemo(() => {
    return resumes.filter((resume) => {
      const fileName = resume.originalFileName?.toLowerCase() || "";

      const searchValue = search.toLowerCase().trim();

      const matchesSearch = fileName.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        resume.uploadStatus?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [resumes, search, statusFilter]);

  // --------------------------------------------------
  // Search Handler
  // --------------------------------------------------

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearch(value);

    const params = new URLSearchParams(searchParams);

    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    setSearchParams(params, {
      replace: true,
    });
  };

  // --------------------------------------------------
  // Delete Resume
  // --------------------------------------------------

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this resume?");

    if (!ok) return;

    try {
      await deleteResume(id);

      setResumes((prev) => prev.filter((resume) => resume._id !== id));
    } catch (error) {
      console.error("Delete Resume Error:", error);
    }
  };

  // --------------------------------------------------
  // Clear Filters
  // --------------------------------------------------

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");

    const params = new URLSearchParams(searchParams);

    params.delete("search");

    setSearchParams(params, {
      replace: true,
    });
  };

  const hasFilters = search.trim() !== "" || statusFilter !== "All";

  // --------------------------------------------------
  // Average ATS Score
  // --------------------------------------------------

  const averageScore =
    resumes.length > 0
      ? Math.round(
          resumes.reduce(
            (total, resume) => total + (resume.analysis?.atsScore || 0),
            0,
          ) / resumes.length,
        )
      : 0;

  // --------------------------------------------------
  // Highest ATS Score
  // --------------------------------------------------

  const highestScore =
    resumes.length > 0
      ? Math.max(...resumes.map((resume) => resume.analysis?.atsScore || 0))
      : 0;

  // ==================================================
  // LOADING SKELETON
  // ==================================================

  if (loading) {
    return (
      <div className="space-y-8">
        {/* =========================
            Header Skeleton
        ========================= */}

        <div className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl p-6 md:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <Skeleton className="w-12 h-12 rounded-xl shrink-0" />

              <div className="space-y-2">
                {/* Small Label */}
                <Skeleton className="h-4 w-28 rounded" />

                {/* Heading */}
                <Skeleton className="h-8 w-52 rounded-lg" />

                {/* Description */}
                <Skeleton className="h-4 w-80 max-w-full rounded" />
              </div>
            </div>

            {/* Button */}
            <Skeleton className="h-12 w-44 rounded-xl shrink-0" />
          </div>
        </div>

        {/* =========================
            Search Skeleton
        ========================= */}

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <Skeleton className="h-12 flex-1 rounded-xl" />

            {/* Select */}
            <Skeleton className="h-12 md:w-48 rounded-xl" />

            {/* Clear */}
            <Skeleton className="h-12 w-24 rounded-xl" />
          </div>
        </div>

        {/* =========================
            Table Skeleton
        ========================= */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="grid grid-cols-5 gap-6">
              <Skeleton className="h-4 w-20 rounded" />

              <Skeleton className="h-4 w-20 rounded" />

              <Skeleton className="h-4 w-16 rounded" />

              <Skeleton className="h-4 w-14 rounded" />

              <Skeleton className="h-4 w-16 rounded mx-auto" />
            </div>
          </div>

          {/* Table Rows */}
          <div>
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="px-6 py-5 border-t border-gray-100">
                <div className="grid grid-cols-5 gap-6 items-center">
                  {/* Resume */}
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-xl shrink-0" />

                    <div className="space-y-2 min-w-0">
                      <Skeleton className="h-4 w-40 rounded" />
                      <Skeleton className="h-3 w-24 rounded" />
                    </div>
                  </div>

                  {/* ATS */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <Skeleton className="h-4 w-12 rounded" />
                  </div>

                  {/* Status */}
                  <Skeleton className="h-7 w-20 rounded-full" />

                  {/* Date */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded" />
                    <Skeleton className="h-4 w-24 rounded" />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-center gap-3">
                    <Skeleton className="w-9 h-9 rounded-lg" />
                    <Skeleton className="w-9 h-9 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================
            Summary Skeleton
        ========================= */}

        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
              <Skeleton className="h-4 w-28 rounded" />

              <Skeleton className="h-9 w-20 rounded-lg mt-3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==================================================
  // MAIN UI
  // ==================================================

  return (
    <div className="space-y-8">
      {/* =========================
          Header
      ========================= */}

      <div className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl p-6 md:p-7 shadow-sm">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Title */}

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <FileText size={22} className="text-blue-600" />
            </div>

            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">
                Your Resumes
              </p>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Resume History
              </h1>

              <p className="text-sm text-gray-500 mt-1.5">
                Review your previous resume analyses and track your progress.
              </p>
            </div>
          </div>

          {/* Action */}

          <button
            type="button"
            onClick={() => navigate("/dashboard/analyze")}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm hover:shadow-md transition shrink-0"
          >
            <FileText size={17} />
            Analyze New Resume
          </button>
        </div>
      </div>

      {/* =========================
          Search & Filter
      ========================= */}

      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />

            <input
              type="text"
              placeholder="Search resume..."
              value={search}
              onChange={handleSearchChange}
              className="w-full border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>

          {/* Status */}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="md:w-48 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none bg-white cursor-pointer transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          >
            <option value="All">All Status</option>

            <option value="Completed">Completed</option>

            <option value="Pending">Pending</option>

            <option value="Analyzing">Analyzing</option>
          </select>

          {/* Clear */}

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>

        {/* Filter Result */}

        {hasFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredResumes.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {resumes.length}
              </span>{" "}
              resumes
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* =========================
          Resume Table / Empty
      ========================= */}

      {filteredResumes.length === 0 ? (
        /* Empty State */

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
            <FileText size={24} className="text-gray-400" />
          </div>

          <h3 className="mt-4 text-base font-semibold text-gray-900">
            {hasFilters ? "No resumes found" : "No resumes yet"}
          </h3>

          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            {hasFilters
              ? "Try changing your search or status filter."
              : "Upload your first resume to start analyzing and tracking your progress."}
          </p>

          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              Clear Filters
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/dashboard/analyze")}
              className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
            >
              <FileText size={17} />
              Analyze Resume
            </button>
          )}
        </div>
      ) : (
        /* Resume Table */

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Resume
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    ATS Score
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Date
                  </th>

                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredResumes.map((resume) => {
                  const status = resume.uploadStatus?.toLowerCase();

                  const score = resume.analysis?.atsScore || 0;

                  return (
                    <tr
                      key={resume._id}
                      className="border-t border-gray-100 hover:bg-gray-50/70 transition"
                    >
                      {/* Resume */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                            <FileText className="text-blue-600" size={21} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate max-w-[280px]">
                              {resume.originalFileName}
                            </h3>

                            <p className="text-sm text-gray-500 mt-0.5">
                              Resume Document
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ATS */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <TrendingUp
                            size={18}
                            className={
                              score >= 80
                                ? "text-green-600"
                                : score >= 60
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }
                          />

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
                        </div>
                      </td>

                      {/* Status */}

                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            status === "completed"
                              ? "bg-green-100 text-green-700"
                              : status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : status === "analyzing"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {resume.uploadStatus || "Unknown"}
                        </span>
                      </td>

                      {/* Date */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
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

                      {/* Actions */}

                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/dashboard/resume/${resume._id}`)
                            }
                            title="View resume"
                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(resume._id)}
                            title="Delete resume"
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================
          Summary Cards
      ========================= */}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Total */}

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm text-gray-500">Total Resumes</h3>

          <p className="text-3xl font-bold text-gray-900 mt-2">
            {resumes.length}
          </p>
        </div>

        {/* Average */}

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm text-gray-500">Average ATS Score</h3>

          <p className="text-3xl font-bold text-green-600 mt-2">
            {averageScore}%
          </p>
        </div>

        {/* Highest */}

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm text-gray-500">Highest Score</h3>

          <p className="text-3xl font-bold text-blue-600 mt-2">
            {highestScore}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumeHistory;
