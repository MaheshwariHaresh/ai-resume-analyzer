import {
  FileText,
  Brain,
  User,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    title: "Total Analyses",
    value: "12",
    icon: FileText,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Average ATS",
    value: "84%",
    icon: TrendingUp,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Interview Sessions",
    value: "18",
    icon: Brain,
    color: "bg-purple-100 text-purple-600",
  },
];

const recent = [
  {
    id: 1,
    name: "Backend_Resume.pdf",
    score: "91%",
    date: "Today",
  },
  {
    id: 2,
    name: "Frontend_CV.pdf",
    score: "84%",
    date: "Yesterday",
  },
  {
    id: 3,
    name: "NodeJS.docx",
    score: "79%",
    date: "2 Days Ago",
  },
];

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

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}

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

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-white rounded-2xl border p-6 shadow-sm"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${item.color}`}
              >
                <Icon size={28} />
              </div>

              <h3 className="text-gray-500 mt-5">{item.title}</h3>

              <p className="text-3xl font-bold mt-2">{item.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}

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

      {/* Recent Analysis */}

      <div className="bg-white rounded-2xl border shadow-sm">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Recent Analyses</h2>

            <p className="text-gray-500">Your latest AI reports</p>
          </div>

          <Link to="/dashboard/history" className="text-blue-600 font-medium">
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4">Resume</th>

                <th className="text-left px-6 py-4">ATS Score</th>

                <th className="text-left px-6 py-4">Date</th>

                <th className="text-left px-6 py-4"></th>
              </tr>
            </thead>

            <tbody>
              {recent.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-5">{item.name}</td>

                  <td className="px-6 py-5 font-semibold text-green-600">
                    {item.score}
                  </td>

                  <td className="px-6 py-5 text-gray-500">{item.date}</td>

                  <td className="px-6 py-5">
                    <button className="text-blue-600 hover:underline">
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Tip */}

      <div className="rounded-2xl border bg-gradient-to-r from-yellow-50 to-orange-50 p-6">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-xl bg-yellow-100 flex items-center justify-center">
            <Sparkles className="text-orange-500" />
          </div>

          <div>
            <h3 className="text-xl font-bold">AI Tip of the Day</h3>

            <p className="mt-2 text-gray-600 leading-7">
              Tailor your resume for every job application by matching the
              keywords from the job description. This can significantly improve
              your ATS score and increase your chances of getting shortlisted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
