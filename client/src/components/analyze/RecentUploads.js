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

        setResumes(response.data.slice(0, 3));
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

  if (loading) {
    return (
      <div className="bg-white border rounded-2xl shadow-sm p-8 text-center">
        Loading recent analyses...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border rounded-2xl shadow-sm p-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-2xl shadow-sm">
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
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          View All
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Empty State */}

      {resumes.length === 0 ? (
        <div className="p-10 text-center">
          <FileText size={45} className="mx-auto text-gray-300" />

          <h3 className="mt-4 font-semibold text-gray-700">
            No Resume Analyses Yet
          </h3>

          <p className="text-gray-500 mt-2">
            Upload your first resume to get an AI analysis.
          </p>
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
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <FileText className="text-blue-600" size={20} />
                        </div>

                        <p className="font-medium text-gray-900">
                          {resume.originalFileName}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      {resume.uploadStatus === "completed" ? (
                        <span className="font-bold text-green-600">
                          {resume.analysis?.atsScore ?? 0}%
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`text-sm px-3 py-1 rounded-full ${
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

                    <td className="px-6 py-5 text-gray-500">
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </td>

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
              <div key={resume._id} className="border rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="text-blue-600" />
                  </div>

                  <div>
                    <h3 className="font-semibold">{resume.originalFileName}</h3>

                    <p className="text-gray-500 text-sm">
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-green-600">
                    {resume.uploadStatus === "completed"
                      ? `${resume.analysis?.atsScore ?? 0}%`
                      : "—"}
                  </span>

                  <button
                    onClick={() => navigate(`/dashboard/resume/${resume._id}`)}
                    disabled={resume.uploadStatus !== "completed"}
                    className="text-blue-600 disabled:text-gray-400 flex items-center gap-1"
                  >
                    <Eye size={16} />
                    View
                  </button>
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
