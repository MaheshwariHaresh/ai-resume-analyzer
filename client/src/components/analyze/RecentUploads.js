import { ArrowRight, Eye, FileText } from "lucide-react";

const resumes = [
  {
    id: 1,
    name: "Backend_Developer_Resume.pdf",
    score: 91,
    date: "Today",
    status: "Completed",
  },
  {
    id: 2,
    name: "Frontend_Resume.docx",
    score: 84,
    date: "Yesterday",
    status: "Completed",
  },
  {
    id: 3,
    name: "NodeJS_CV.pdf",
    score: 78,
    date: "2 Days Ago",
    status: "Completed",
  },
];

const RecentUploads = () => {
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

        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
          View All
          <ArrowRight size={18} />
        </button>
      </div>

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
                key={resume.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FileText className="text-blue-600" size={20} />
                    </div>

                    <div>
                      <p className="font-medium text-gray-900">{resume.name}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <span className="font-bold text-green-600">
                    {resume.score}%
                  </span>
                </td>

                <td className="px-6 py-5">
                  <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                    {resume.status}
                  </span>
                </td>

                <td className="px-6 py-5 text-gray-500">{resume.date}</td>

                <td className="px-6 py-5 text-center">
                  <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
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
          <div key={resume.id} className="border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="text-blue-600" />
              </div>

              <div>
                <h3 className="font-semibold">{resume.name}</h3>

                <p className="text-gray-500 text-sm">{resume.date}</p>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <span className="font-bold text-green-600">{resume.score}%</span>

              <button className="text-blue-600 flex items-center gap-1">
                <Eye size={16} />
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentUploads;
