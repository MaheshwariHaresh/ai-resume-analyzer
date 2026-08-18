import { FileSearch, Sparkles, ShieldCheck } from "lucide-react";
import UploadSection from "../components/analyze/UploadSection";
import JobDescription from "../components/analyze/JobDescription";
import AIFeaturesCard from "../components/analyze/AIFeaturesCard";
import RecentUploads from "../components/analyze/RecentUploads";

const AnalyzeResume = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm">
        {/* Background Decoration */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-indigo-50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left Content */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <FileSearch size={23} className="text-blue-600" />
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Analyze Resume
                </h1>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-semibold">
                  <Sparkles size={12} />
                  AI Powered
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-2 max-w-2xl leading-6">
                Upload your resume to receive an AI-powered ATS score, keyword
                analysis, skill gap insights, personalized recommendations, and
                interview questions.
              </p>
            </div>
          </div>

          {/* Right Trust Indicator */}
          <div className="hidden md:flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
              <ShieldCheck size={18} className="text-green-600" />
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-900">
                Secure Analysis
              </p>

              <p className="text-[11px] text-gray-500 mt-0.5">
                Your resume stays private
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <UploadSection />

          <JobDescription />
        </div>

        <AIFeaturesCard />
      </div>

      {/* Recent Uploads */}
      <RecentUploads />
    </div>
  );
};

export default AnalyzeResume;
