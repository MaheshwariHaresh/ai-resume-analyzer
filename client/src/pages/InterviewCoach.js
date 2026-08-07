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

const previousSessions = [
  {
    company: "Backend Interview",
    score: "86%",
    questions: 10,
    date: "24 Aug 2026",
  },
  {
    company: "MERN Interview",
    score: "91%",
    questions: 15,
    date: "20 Aug 2026",
  },
];

const InterviewCoach = () => {
  return (
    <div className="space-y-8">
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

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Interview Setup */}

        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">Start New Interview</h2>

          <div className="space-y-6">
            <div>
              <label className="font-medium mb-2 block">Select Resume</label>

              <select className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500">
                <option>Backend_Resume.pdf</option>
                <option>Frontend_Resume.pdf</option>
                <option>MERN_Resume.docx</option>
              </select>
            </div>

            <div>
              <label className="font-medium mb-2 block">Interview Type</label>

              <select className="w-full border rounded-xl p-3 outline-none">
                <option>Technical Interview</option>
                <option>HR Interview</option>
                <option>Behavioral Interview</option>
                <option>Mixed Interview</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="font-medium mb-2 block">Difficulty</label>

                <select className="w-full border rounded-xl p-3">
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>

              <div>
                <label className="font-medium mb-2 block">Questions</label>

                <select className="w-full border rounded-xl p-3">
                  <option>5 Questions</option>
                  <option>10 Questions</option>
                  <option>15 Questions</option>
                  <option>20 Questions</option>
                </select>
              </div>
            </div>

            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition">
              <PlayCircle size={22} />
              Start AI Interview
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

          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white p-6">
            <h3 className="font-bold text-xl">Best Score</h3>

            <p className="text-4xl font-bold mt-3">91%</p>

            <p className="mt-2 text-green-100">
              Keep practicing to improve your interview performance.
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
          {previousSessions.map((session, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 p-6 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
                  <FileText className="text-purple-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">{session.company}</h3>

                  <div className="flex gap-5 mt-2 text-gray-500 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar size={15} />
                      {session.date}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock size={15} />
                      {session.questions} Questions
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-green-600 font-bold">
                  <Trophy size={18} />
                  {session.score}
                </div>

                <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium">
                  View Details
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewCoach;
