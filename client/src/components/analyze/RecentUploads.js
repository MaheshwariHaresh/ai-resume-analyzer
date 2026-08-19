import { ArrowRight, Eye, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyResumes } from "../../apis/resumeApi";

const RecentUploads = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyResumes();

        setResumes(response.data?.slice(0, 3) || []);
      } catch (error) {
        console.error("Recent Resumes Error:", error);

        setError(
          error.response?.data?.message || "Failed to load recent resumes.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  /*
   * Skeleton Loader
   */
  if (loading) {
    return (
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        {/* Header Skeleton */}

        <div className="flex items-center justify-between p-6 border-b">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-gray-200 rounded-lg animate-pulse" />

            <div className="h-4 w-64 bg-gray-100 rounded-md animate-pulse" />
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <div className="h-5 w-16 bg-gray-200 rounded-md animate-pulse" />

            <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Desktop Skeleton */}

        <div className="hidden md:block overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-6 py-4">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </th>

                <th className="px-6 py-4">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </th>

                <th className="px-6 py-4">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                </th>

                <th className="px-6 py-4">
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                </th>

                <th className="px-6 py-4">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mx-auto" />
                </th>
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3].map((item) => (
                <tr key={item} className="border-t">
                  {/* Resume */}

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse shrink-0" />

                      <div className="space-y-2">
                        <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />

                        <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                      </div>
                    </div>
                  </td>

                  {/* ATS Score */}

                  <td className="px-6 py-5">
                    <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
                  </td>

                  {/* Status */}

                  <td className="px-6 py-5">
                    <div className="h-7 w-20 bg-gray-200 rounded-full animate-pulse" />
                  </td>

                  {/* Date */}

                  <td className="px-6 py-5">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </td>

                  {/* Action */}

                  <td className="px-6 py-5">
                    <div className="h-9 w-28 bg-gray-200 rounded-lg animate-pulse mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Skeleton */}

        <div className="md:hidden p-4 space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border rounded-xl p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-200 shrink-0" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 bg-gray-200 rounded" />

                  <div className="h-3 w-24 bg-gray-100 rounded" />
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="h-5 w-12 bg-gray-200 rounded" />

                <div className="h-5 w-16 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /*
   * Error State
   */
  if (error) {
    return (
      <div className="bg-white border rounded-2xl shadow-sm p-8 text-center">
        <div className="w-12 h-12 mx-auto rounded-xl bg-red-50 flex items-center justify-center">
          <FileText size={22} className="text-red-500" />
        </div>

        <h3 className="mt-4 font-semibold text-gray-800">
          Unable to Load Recent Analyses
        </h3>

        <p className="text-red-500 text-sm mt-2">{error}</p>

        <button
          onClick={() => window.location.reload()}
          className="mt-5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}

      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recent Analyses</h2>

          <p className="text-gray-500 mt-1">
            View your recently analyzed resumes.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/history")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
        >
          View All
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Empty State */}

      {resumes.length === 0 ? (
        <div className="p-10 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center">
            <FileText size={45} className="text-gray-300" />
          </div>

          <h3 className="mt-4 font-semibold text-gray-700">
            No Resume Analyses Yet
          </h3>

          <p className="text-gray-500 mt-2">
            Upload your first resume to get an AI analysis.
          </p>

          <button
            onClick={() => navigate("/dashboard/analyze")}
            className="mt-5 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition"
          >
            <FileText size={17} />
            Analyze Resume
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600">
                  <th className="px-6 py-4">Resume</th>

                  <th className="px-6 py-4">ATS Score</th>

                  <th className="px-6 py-4">Status</th>

                  <th className="px-6 py-4">Date</th>

                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {resumes.map((resume) => (
                  <tr
                    key={resume._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    {/* Resume */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                          <FileText className="text-blue-600" size={20} />
                        </div>

                        <div className="min-w-0">
                          <p
                            className="font-medium text-gray-900 truncate max-w-[260px]"
                            title={resume.originalFileName}
                          >
                            {resume.originalFileName}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            Resume Analysis
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ATS Score */}

                    <td className="px-6 py-5">
                      {resume.uploadStatus === "completed" ? (
                        <span className="font-bold text-green-600">
                          {resume.analysis?.atsScore ?? 0}%
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    {/* Status */}

                    <td className="px-6 py-5">
                      <span
                        className={`text-sm px-3 py-1 rounded-full capitalize font-medium ${
                          resume.uploadStatus === "completed"
                            ? "bg-green-100 text-green-700"
                            : resume.uploadStatus === "failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {resume.uploadStatus}
                      </span>
                    </td>

                    {/* Date */}

                    <td className="px-6 py-5 text-gray-500">
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </td>

                    {/* Action */}

                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/resume/${resume._id}`)
                        }
                        disabled={resume.uploadStatus !== "completed"}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition"
                      >
                        <Eye size={18} />
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}

          <div className="md:hidden p-4 space-y-4">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="border rounded-xl p-4 hover:border-blue-200 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <FileText className="text-blue-600" size={20} />
                  </div>

                  <div className="min-w-0">
                    <h3
                      className="font-semibold text-gray-900 truncate"
                      title={resume.originalFileName}
                    >
                      {resume.originalFileName}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">ATS Score</p>

                    <span
                      className={`font-bold ${
                        resume.uploadStatus === "completed"
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {resume.uploadStatus === "completed"
                        ? `${resume.analysis?.atsScore ?? 0}%`
                        : "—"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full capitalize font-medium ${
                        resume.uploadStatus === "completed"
                          ? "bg-green-100 text-green-700"
                          : resume.uploadStatus === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {resume.uploadStatus}
                    </span>

                    <button
                      onClick={() =>
                        navigate(`/dashboard/resume/${resume._id}`)
                      }
                      disabled={resume.uploadStatus !== "completed"}
                      className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 flex items-center gap-1 font-medium"
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecentUploads;
