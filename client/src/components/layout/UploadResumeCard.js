import { FileText, UploadCloud } from "lucide-react";
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
      return setError("Only PDF and DOCX files are allowed.");
    }

    if (file.size > 5 * 1024 * 1024) {
      return setError("Maximum file size is 5MB.");
    }

    setError("");

    setSelectedFile(file);
  };
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Select Resume for Analysis
          </h2>

          <p className="mt-3 text-gray-500 leading-7">
            Upload your resume and receive an AI-powered ATS score, resume
            feedback, skill gap analysis and interview questions.
          </p>

          {/* Upload Card */}
          <label
            htmlFor="resume"
            className="mt-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl bg-white hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer py-8 px-6"
          >
            {selectedFile ? (
              <>
                <FileText className="w-12 h-12 text-blue-600" />

                <h3 className="mt-4 text-lg font-semibold text-center">
                  {selectedFile.name}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>

                <p className="mt-4 text-blue-600 text-sm font-medium">
                  Click to choose another file
                </p>
              </>
            ) : (
              <>
                <UploadCloud className="w-10 h-10 text-gray-500" />

                <h3 className="mt-4 text-lg font-semibold">
                  Click to upload your resume
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  PDF or DOCX (Max 5MB)
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
          {error && (
            <p className="mt-3 text-center text-red-500 text-sm">{error}</p>
          )}

          <p className="text-center text-gray-400 text-sm mt-5">
            or try our sample resumes
          </p>
          {/* Sample Resume 1 */}
          <div className="mt-6 border rounded-xl p-4 flex items-center justify-between hover:border-blue-500 cursor-pointer transition">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">
                  Marketing Manager Resume
                </h4>

                <p className="text-sm text-gray-500">5+ years experience</p>
              </div>
            </div>
          </div>

          {/* Sample Resume 2 */}
          <div className="mt-4 border-2 border-blue-500 rounded-xl p-4 flex items-center justify-between cursor-pointer transition">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">
                  Software Engineer Resume
                </h4>

                <p className="text-sm text-gray-500">8+ years experience</p>
              </div>
            </div>

            <div className="w-7 h-7 rounded-full border-2 border-blue-600 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            </div>
          </div>

          {/* Analyze Button */}
          <button
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2"
            onClick={handleUpload}
          >
            <UploadCloud className="w-5 h-5" />
            {loading ? "Analyzing Resume..." : "Analyze Resume"}
          </button>
        </div>

        {/* Right Section */}
        <div className="lg:col-span-2">
          <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 min-h-[300px] flex flex-col items-center justify-center text-center p-10">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm">
              <FileText className="w-10 h-10 text-gray-500" />
            </div>

            <h3 className="mt-8 text-3xl font-bold text-gray-900">
              Ready to see the magic?
            </h3>

            <p className="mt-4 max-w-xl text-gray-500 leading-7">
              Upload your resume and click <strong>Analyze Resume</strong> to
              receive an ATS score, AI feedback, missing skills, and interview
              questions in seconds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadResumeCard;
