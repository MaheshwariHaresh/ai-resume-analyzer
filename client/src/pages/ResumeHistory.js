import {
  Search,
  FileText,
  Eye,
  Trash2,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { getMyResumes, deleteResume } from "../apis/resumeApi";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

const ResumeHistory = () => {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);

      const res = await getMyResumes();

      setResumes(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResumes = useMemo(() => {
    return resumes.filter((resume) =>
      resume.originalFileName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [resumes, search]);

  // DELETE RESUME
  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this resume?");

    if (!ok) return;

    try {
      await deleteResume(id);

      setResumes((prev) => prev.filter((resume) => resume._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const averageScore =
    resumes.length > 0
      ? Math.round(
          resumes.reduce(
            (total, resume) => total + (resume.analysis?.atsScore || 0),
            0,
          ) / resumes.length,
        )
      : 0;

  const highestScore =
    resumes.length > 0
      ? Math.max(...resumes.map((resume) => resume.analysis?.atsScore || 0))
      : 0;
  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resume History</h1>

          <p className="text-gray-500 mt-2">
            View and manage all your analyzed resumes.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/analyze")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
        >
          + Analyze New Resume
        </button>
      </div>

      {/* Search & Filter */}

      <div className="bg-white rounded-2xl border p-5 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search resume..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select className="border rounded-xl px-4 py-3 outline-none">
          <option>All Status</option>

          <option>Completed</option>

          <option>Pending</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-2xl p-20 text-center">Loading...</div>
      ) : (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4">Resume</th>

                <th className="text-left px-6 py-4">ATS Score</th>

                <th className="text-left px-6 py-4">Status</th>

                <th className="text-left px-6 py-4">Date</th>

                <th className="text-center px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredResumes.map((resume) => (
                <tr
                  key={resume.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                        <FileText className="text-blue-600" />
                      </div>

                      <div>
                        <h3 className="font-semibold">
                          {resume.originalFileName}
                        </h3>

                        <p className="text-sm text-gray-500">Resume Document</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={18} className="text-green-600" />

                      <span className="font-bold text-green-600">
                        {resume.analysis?.atsScore || 0}%
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                      {resume.uploadStatus}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar size={16} />

                      {new Date(resume.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/resume/${resume._id}`)
                        }
                        className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(resume._id)}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Cards */}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Total Resumes */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h3 className="text-gray-500">Total Resumes</h3>

          <p className="text-3xl font-bold mt-2">{resumes.length}</p>
        </div>

        {/* Average ATS Score */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h3 className="text-gray-500">Average ATS Score</h3>

          <p className="text-3xl font-bold text-green-600 mt-2">
            {averageScore}%
          </p>
        </div>

        {/* Highest Score */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h3 className="text-gray-500">Highest Score</h3>

          <p className="text-3xl font-bold text-blue-600 mt-2">
            {highestScore}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumeHistory;
