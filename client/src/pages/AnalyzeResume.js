import UploadSection from "../components/analyze/UploadSection";
import JobDescription from "../components/analyze/JobDescription";
import AIFeaturesCard from "../components/analyze/AIFeaturesCard";
import RecentUploads from "../components/analyze/RecentUploads";

const AnalyzeResume = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analyze Resume</h1>

        <p className="text-gray-500 mt-2">
          Upload your resume and receive an AI-powered ATS score, keyword match,
          resume feedback, skill gap analysis, and interview questions.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <UploadSection />

          <JobDescription />
        </div>

        <AIFeaturesCard />
      </div>

      <RecentUploads />
    </div>
  );
};

export default AnalyzeResume;
