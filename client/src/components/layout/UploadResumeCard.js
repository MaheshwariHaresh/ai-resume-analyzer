import {
  FileText,
  UploadCloud,
  Sparkles,
  ShieldCheck,
  Lightbulb,
} from "lucide-react";
import { useState } from "react";
import { analyzePublicResume } from "../../apis/resumeApi";
import { useNavigate } from "react-router-dom";

const UploadResumeCard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!selectedFile) {
      return alert("Please select a resume.");
    }

    try {
      setLoading(true);
      setError("");

      const response = await analyzePublicResume(selectedFile);

      console.log("Public Resume Analysis:", response);

      sessionStorage.setItem(
        "publicResumeAnalysis",
        JSON.stringify(response.data.analysis),
      );

      navigate("/resume-analysis");
    } catch (error) {
      console.error("Resume Analysis Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to analyze resume. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      file.type !==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setError("Only PDF and DOCX files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Maximum file size is 5MB.");
      return;
    }

    setError("");
    setSelectedFile(file);
  };

  return (
    <section
      id="upload-resume"
      className="relative overflow-hidden bg-gray-50/70 py-16"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-blue-100/40 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold">
            <Sparkles size={14} />
            AI-Powered Resume Analysis
          </div>

          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            See How Strong Your Resume Really Is
          </h2>

          <p className="mt-3 text-sm sm:text-base text-gray-500 leading-7">
            Upload your resume and get an instant ATS score, AI-powered
            feedback, missing skills, and personalized recommendations.
          </p>
        </div>

        {/* Main Content */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          {/* Upload Card */}
          <div className="lg:col-span-2">
            <div className="h-full bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              {/* Card Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Upload Your Resume
                  </h3>

                  <p className="text-xs text-gray-500 mt-0.5">
                    PDF or DOCX • Maximum 5MB
                  </p>
                </div>
              </div>

              {/* Upload Area */}
              <label
                htmlFor="resume"
                className={`mt-6 flex flex-col items-center justify-center min-h-[190px] px-5 rounded-xl border-2 border-dashed cursor-pointer transition ${
                  selectedFile
                    ? "border-blue-300 bg-blue-50/50"
                    : "border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/40"
                }`}
              >
                {selectedFile ? (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-white border border-blue-100 shadow-sm flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>

                    <h4 className="mt-3 text-sm font-semibold text-gray-900 text-center break-all max-w-full">
                      {selectedFile.name}
                    </h4>

                    <p className="mt-1 text-xs text-gray-500">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>

                    <span className="mt-3 text-xs font-semibold text-blue-600">
                      Choose another file
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                      <UploadCloud className="w-6 h-6 text-blue-600" />
                    </div>

                    <h4 className="mt-3 text-sm font-semibold text-gray-900">
                      Click to upload your resume
                    </h4>

                    <p className="mt-1 text-xs text-gray-500">
                      Drag & drop or browse your files
                    </p>
                  </>
                )}

                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {/* Error */}
              {error && (
                <p className="mt-3 text-center text-xs font-medium text-red-500">
                  {error}
                </p>
              )}

              {/* Samples */}
              <div className="mt-5">
                <p className="text-center text-xs text-gray-400">
                  Or try a sample resume
                </p>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <SampleResume
                    title="Marketing Manager"
                    experience="5+ years"
                  />

                  <SampleResume
                    title="Software Engineer"
                    experience="8+ years"
                  />
                </div>
              </div>

              {/* Analyze Button */}
              <button
                type="button"
                onClick={handleUpload}
                disabled={loading}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-semibold transition shadow-sm shadow-blue-600/20"
              >
                <UploadCloud size={17} />

                {loading ? "Analyzing Resume..." : "Analyze Resume"}
              </button>

              {/* Security Note */}
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                <ShieldCheck size={14} />
                Your resume is securely processed
              </div>
            </div>
          </div>

          {/* Analysis Process Preview */}
          <div className="lg:col-span-3">
            <div className="relative h-full min-h-[420px] overflow-hidden rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
              {/* Background Decoration */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-indigo-50 rounded-full blur-3xl pointer-events-none" />

              <div className="relative">
                {/* Header */}
                <div className="max-w-xl">
                  <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
                    Simple & Intelligent
                  </span>

                  <h3 className="mt-2 text-2xl font-bold text-gray-900">
                    From resume to actionable insights.
                  </h3>

                  <p className="mt-3 text-sm text-gray-500 leading-6">
                    Upload your resume and let our AI evaluate it through
                    multiple stages to give you practical recommendations.
                  </p>
                </div>

                {/* Process Steps */}
                <div className="mt-8 space-y-4">
                  <ProcessStep
                    number="01"
                    title="Upload your resume"
                    description="Upload your PDF or DOCX resume securely."
                    icon={<UploadCloud size={19} />}
                  />

                  <ProcessStep
                    number="02"
                    title="AI analyzes your resume"
                    description="Our AI evaluates structure, skills, experience and keywords."
                    icon={<Sparkles size={19} />}
                  />

                  <ProcessStep
                    number="03"
                    title="Get personalized insights"
                    description="Receive actionable recommendations to improve your resume."
                    icon={<Lightbulb size={19} />}
                  />
                </div>

                {/* Security Note */}
                <div className="mt-7 flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                  <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                    <ShieldCheck size={18} className="text-green-600" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Your resume stays private
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Securely processed for analysis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* Sample Resume */

const SampleResume = ({ title, experience }) => {
  return (
    <button
      type="button"
      className="text-left border border-gray-200 rounded-xl p-3 hover:border-blue-300 hover:bg-blue-50/40 transition"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-blue-600" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold text-gray-900 truncate">
            {title}
          </p>

          <p className="text-[11px] text-gray-500 mt-0.5">{experience}</p>
        </div>
      </div>
    </button>
  );
};

/* Analysis Process Step */

const ProcessStep = ({ number, title, description, icon }) => {
  return (
    <div className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/70 p-4 hover:border-blue-100 hover:bg-blue-50/40 transition">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-400 shrink-0">
        {number}
      </div>

      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
        {icon}
      </div>

      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>

        <p className="mt-1 text-xs text-gray-500 leading-5">{description}</p>
      </div>
    </div>
  );
};

export default UploadResumeCard;
