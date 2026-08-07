import {
  Sparkles,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  BrainCircuit,
} from "lucide-react";

const features = [
  "ATS Compatibility Score",
  "Resume Strengths",
  "Missing Keywords",
  "Skill Gap Analysis",
  "Formatting Review",
  "Grammar & Writing Check",
  "Actionable AI Suggestions",
  "Interview Questions",
];

const AIFeaturesCard = () => {
  return (
    <div className="sticky top-6 space-y-6">
      {/* Main Card */}

      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold">AI Analysis</h2>

            <p className="text-blue-100 text-sm">
              Your resume will be checked instantly.
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {features.map((item) => (
            <div key={item} className="flex items-center gap-3">
              <CheckCircle2
                size={18}
                className="text-green-300 flex-shrink-0"
              />

              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Processing Time */}

      <div className="bg-white rounded-2xl border p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <Clock3 className="text-blue-600" />

          <h3 className="font-semibold">Estimated Time</h3>
        </div>

        <p className="text-3xl font-bold mt-4">10–15 sec</p>

        <p className="text-gray-500 mt-2">Average AI processing time.</p>
      </div>

      {/* Privacy */}

      <div className="bg-white rounded-2xl border p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-green-600" />

          <h3 className="font-semibold">Privacy First</h3>
        </div>

        <p className="text-gray-500 mt-3 leading-7">
          Your resume is securely processed and never shared with third parties.
        </p>
      </div>

      {/* AI Powered */}

      <div className="rounded-2xl bg-gray-900 text-white p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <BrainCircuit className="text-cyan-400" />

          <h3 className="font-semibold">Powered by AI</h3>
        </div>

        <p className="mt-3 text-gray-300 text-sm leading-6">
          Advanced AI analyzes your resume, identifies weaknesses, matches
          keywords with job descriptions, and generates personalized interview
          questions.
        </p>
      </div>
    </div>
  );
};

export default AIFeaturesCard;
