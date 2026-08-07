import {
  Search,
  FileText,
  Eye,
  Download,
  Trash2,
  Calendar,
  TrendingUp,
} from "lucide-react";

const resumes = [
  {
    id: 1,
    name: "Backend_Developer_Resume.pdf",
    score: 91,
    status: "Completed",
    date: "22 Aug 2026",
  },
  {
    id: 2,
    name: "Frontend_Resume.pdf",
    score: 84,
    status: "Completed",
    date: "18 Aug 2026",
  },
  {
    id: 3,
    name: "MERN_Resume.docx",
    score: 78,
    status: "Completed",
    date: "10 Aug 2026",
  },
];

const ResumeHistory = () => {
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

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold">
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
            {resumes.map((resume) => (
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
                      <h3 className="font-semibold">{resume.name}</h3>

                      <p className="text-sm text-gray-500">Resume Document</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-green-600" />

                    <span className="font-bold text-green-600">
                      {resume.score}%
                    </span>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                    {resume.status}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar size={16} />

                    {resume.date}
                  </div>
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center justify-center gap-3">
                    <button className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600">
                      <Eye size={18} />
                    </button>

                    <button className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600">
                      <Download size={18} />
                    </button>

                    <button className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h3 className="text-gray-500">Total Resumes</h3>

          <p className="text-3xl font-bold mt-2">12</p>
        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h3 className="text-gray-500">Average ATS Score</h3>

          <p className="text-3xl font-bold text-green-600 mt-2">84%</p>
        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h3 className="text-gray-500">Highest Score</h3>

          <p className="text-3xl font-bold text-blue-600 mt-2">91%</p>
        </div>
      </div>
    </div>
  );
};

export default ResumeHistory;
