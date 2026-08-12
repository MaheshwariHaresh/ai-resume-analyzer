import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Target,
  Brain,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PublicResumeResult = () => {
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const storedAnalysis = sessionStorage.getItem("publicResumeAnalysis");

    if (!storedAnalysis) {
      navigate("/", { replace: true });
      return;
    }

    try {
      setAnalysis(JSON.parse(storedAnalysis));
    } catch (error) {
      console.error("Invalid analysis data:", error);
      navigate("/", { replace: true });
    }
  }, [navigate]);

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const sectionScores = analysis.sectionScores || {};

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}

        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium"
          >
            Create Account
          </button>
        </div>

        {/* Score */}

        <div className="bg-white border rounded-2xl shadow-sm p-8">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="text-center">
              <div className="w-36 h-36 mx-auto rounded-full border-8 border-blue-100 flex items-center justify-center">
                <div>
                  <p className="text-4xl font-bold text-blue-600">
                    {analysis.atsScore}%
                  </p>

                  <p className="text-sm text-gray-500 mt-1">ATS Score</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-500">
                Overall Verdict
              </p>

              <h1 className="text-3xl font-bold text-gray-900 mt-1">
                {analysis.overallVerdict}
              </h1>

              <p className="text-gray-600 leading-7 mt-4">{analysis.summary}</p>
            </div>
          </div>
        </div>

        {/* Section Scores */}

        <div className="bg-white border rounded-2xl shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <Target className="text-blue-600" />
            <h2 className="text-2xl font-bold">Resume Section Scores</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {Object.entries(sectionScores).map(([section, score]) => (
              <div key={section}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium capitalize">{section}</span>

                  <span className="font-bold text-blue-600">{score}%</span>
                </div>

                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths */}

        <AnalysisSection
          title="Strengths"
          icon={<CheckCircle className="text-green-600" />}
          items={analysis.strengths}
          itemClass="bg-green-50"
        />

        {/* Weaknesses */}

        <AnalysisSection
          title="Weaknesses"
          icon={<AlertCircle className="text-red-600" />}
          items={analysis.weaknesses}
          itemClass="bg-red-50"
        />

        {/* Missing Skills */}

        <div className="bg-white border rounded-2xl shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="text-purple-600" />

            <h2 className="text-2xl font-bold">Missing Skills</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {analysis.missingSkills?.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Suggestions */}

        <AnalysisSection
          title="Suggestions"
          icon={<Lightbulb className="text-yellow-600" />}
          items={analysis.suggestions}
          itemClass="bg-yellow-50"
        />

        {/* CTA */}

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold">Want to improve your resume?</h2>

          <p className="mt-3 text-blue-100 max-w-2xl mx-auto">
            Create a free account to save your resume analysis, track your
            resume history, and practice AI-powered interviews.
          </p>

          <button
            onClick={() => navigate("/register")}
            className="mt-6 bg-white text-blue-600 hover:bg-gray-100 px-7 py-3 rounded-xl font-semibold"
          >
            Create Free Account
          </button>
        </div>
      </div>
    </div>
  );
};

const AnalysisSection = ({ title, icon, items = [], itemClass }) => {
  return (
    <div className="bg-white border rounded-2xl shadow-sm p-8">
      <div className="flex items-center gap-3 mb-6">
        {icon}

        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className={`${itemClass} rounded-xl p-4 text-gray-700`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicResumeResult;
