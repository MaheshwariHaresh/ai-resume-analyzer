import { useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "../../apis/resumeApi";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const UploadSection = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // ==========================================
  // Validate File
  // ==========================================

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError("Only PDF or DOCX files are allowed.");
      return false;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size should be less than 5MB.");
      return false;
    }

    setError("");
    return true;
  };

  // ==========================================
  // Process File
  // ==========================================

  const processFile = (selectedFile) => {
    if (!validateFile(selectedFile)) return;

    setFile(selectedFile);
    setError("");
  };

  // ==========================================
  // File Input
  // ==========================================

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      processFile(selectedFile);
    }

    // Allow selecting the same file again
    e.target.value = "";
  };

  // ==========================================
  // Drag & Drop
  // ==========================================

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!loading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);

    if (loading) return;

    const droppedFile = e.dataTransfer.files?.[0];

    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  // ==========================================
  // Remove File
  // ==========================================

  const removeFile = () => {
    if (loading) return;

    setFile(null);
    setError("");
  };

  // ==========================================
  // Open File Picker
  // ==========================================

  const openFilePicker = () => {
    if (loading) return;

    fileInputRef.current?.click();
  };

  // ==========================================
  // Analyze Resume
  // ==========================================

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload a resume first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await uploadResume(file);

      console.log("Resume Upload Response:", response);

      const resumeId = response.data?._id;

      if (!resumeId) {
        throw new Error("Resume ID was not returned by the server.");
      }

      navigate(`/dashboard/resume/${resumeId}`);
    } catch (error) {
      console.error("Resume Upload Error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to analyze resume. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isPdf = file?.type === "application/pdf";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
      {/* ==========================================
          Header
      ========================================== */}

      <div className="mb-7">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Upload Resume
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Upload your resume and let AI analyze it for ATS compatibility.
            </p>
          </div>
        </div>
      </div>

      {/* ==========================================
          Error
      ========================================== */}

      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
          <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
            <X size={15} className="text-red-600" />
          </div>

          <div>
            <p className="text-sm font-semibold text-red-700">Upload failed</p>

            <p className="text-xs text-red-600 mt-0.5 leading-5">{error}</p>
          </div>
        </div>
      )}

      {/* ==========================================
          Upload Area
      ========================================== */}

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFilePicker}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              openFilePicker();
            }
          }}
          className={`group relative overflow-hidden border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-blue-500 bg-blue-50/70 scale-[1.01]"
              : "border-gray-200 bg-gray-50/60 hover:border-blue-400 hover:bg-blue-50/40"
          }`}
        >
          {/* Decorative Background */}

          <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col items-center justify-center py-14 sm:py-16 px-6 text-center">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-sm transition ${
                isDragging
                  ? "bg-blue-600 border-blue-600"
                  : "bg-white border-gray-200 group-hover:border-blue-200 group-hover:bg-blue-50"
              }`}
            >
              <UploadCloud
                size={30}
                className={
                  isDragging
                    ? "text-white"
                    : "text-blue-600 group-hover:scale-105 transition"
                }
              />
            </div>

            <h3 className="mt-5 text-base sm:text-lg font-semibold text-gray-900">
              {isDragging
                ? "Drop your resume here"
                : "Drag & drop your resume here"}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              or{" "}
              <span className="font-semibold text-blue-600">
                browse your files
              </span>
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-500">
                PDF
              </span>

              <span className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-500">
                DOCX
              </span>

              <span className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-500">
                Max 5MB
              </span>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            className="hidden"
            disabled={loading}
          />
        </div>
      ) : loading ? (
        /* ==========================================
           AI ANALYSIS PROGRESS
        ========================================== */

        <div className="rounded-2xl border border-purple-100 bg-purple-50/40 overflow-hidden">
          {/* File Information */}

          <div className="px-5 py-4 border-b border-purple-100 bg-white/80">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {file.name}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>

                  <span className="w-1 h-1 rounded-full bg-gray-300" />

                  <span className="text-xs font-medium text-gray-500">
                    {isPdf ? "PDF" : "DOCX"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Content */}

          <div className="p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              {/* Animated Icon */}

              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-purple-200 animate-ping opacity-30" />

                <div className="relative w-16 h-16 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/20">
                  <Sparkles className="text-white" size={30} />
                </div>
              </div>

              <h3 className="mt-6 text-xl font-bold text-gray-900">
                Analyzing Your Resume
              </h3>

              <p className="mt-2 text-sm text-gray-500 max-w-md leading-6">
                Our AI is reviewing your resume for ATS compatibility, skills,
                experience, and improvement opportunities.
              </p>

              {/* Progress Bar */}

              <div className="w-full max-w-lg mt-7">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-purple-700">
                    AI Analysis in Progress
                  </span>

                  <Loader2 size={16} className="text-purple-600 animate-spin" />
                </div>

                <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-purple-600 rounded-full animate-[progress_1.8s_ease-in-out_infinite]" />
                </div>

                <p className="text-xs text-gray-400 mt-3">
                  This may take a few moments. Please don't close or refresh the
                  page.
                </p>
              </div>

              {/* Processing Steps */}

              <div className="w-full max-w-lg mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center justify-center gap-2 rounded-xl bg-white border border-purple-100 px-3 py-3">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />

                  <span className="text-xs font-medium text-gray-600">
                    Resume Uploaded
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2 rounded-xl bg-white border border-purple-100 px-3 py-3">
                  <Loader2
                    size={16}
                    className="text-purple-600 animate-spin shrink-0"
                  />

                  <span className="text-xs font-medium text-gray-600">
                    AI Analyzing
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-100 px-3 py-3">
                  <Sparkles size={16} className="text-gray-300 shrink-0" />

                  <span className="text-xs font-medium text-gray-400">
                    Generating Results
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hidden File Input */}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            className="hidden"
            disabled={loading}
          />
        </div>
      ) : (
        /* ==========================================
           SELECTED FILE
        ========================================== */

        <div className="rounded-2xl border border-blue-100 bg-blue-50/40 overflow-hidden">
          {/* Selected File Header */}

          <div className="px-5 py-4 border-b border-blue-100 bg-white/80">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {file.name}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>

                    <span className="w-1 h-1 rounded-full bg-gray-300" />

                    <span className="text-xs font-medium text-gray-500">
                      {isPdf ? "PDF" : "DOCX"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={removeFile}
                disabled={loading}
                className="w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                aria-label="Remove resume"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Ready State */}

          <div className="p-5">
            <div className="flex items-center gap-3 rounded-xl bg-white border border-gray-100 px-4 py-3.5">
              <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} className="text-green-600" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  Resume ready for analysis
                </p>

                <p className="text-xs text-gray-500 mt-0.5">
                  Your file passed the format and size checks.
                </p>
              </div>
            </div>

            {/* Actions */}

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={openFilePicker}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText size={17} />
                Replace Resume
              </button>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl text-sm font-semibold transition shadow-sm shadow-blue-600/20"
              >
                <Sparkles size={18} />
                Analyze Resume
              </button>
            </div>
          </div>

          {/* Hidden File Input */}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            className="hidden"
            disabled={loading}
          />
        </div>
      )}

      {/* ==========================================
          Information Cards
      ========================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
        <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-blue-600" />

            <p className="text-xs font-semibold text-gray-900">
              Supported Formats
            </p>
          </div>

          <p className="text-xs text-gray-500 mt-2">PDF and DOCX documents</p>
        </div>

        <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
          <div className="flex items-center gap-2">
            <UploadCloud size={16} className="text-blue-600" />

            <p className="text-xs font-semibold text-gray-900">Maximum Size</p>
          </div>

          <p className="text-xs text-gray-500 mt-2">Up to 5MB per resume</p>
        </div>

        <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-green-600" />

            <p className="text-xs font-semibold text-gray-900">
              Secure Processing
            </p>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Your resume is securely processed
          </p>
        </div>
      </div>

      {/* ==========================================
          Bottom Note
      ========================================== */}

      <div className="flex items-center justify-center gap-2 mt-5 text-xs text-gray-400">
        <Sparkles size={13} />

        <span>
          AI analysis evaluates your resume for ATS compatibility and
          improvement opportunities.
        </span>
      </div>

      {/* ==========================================
          Progress Animation
      ========================================== */}

      <style>
        {`
          @keyframes progress {
            0% {
              transform: translateX(-100%);
            }

            50% {
              transform: translateX(100%);
            }

            100% {
              transform: translateX(200%);
            }
          }
        `}
      </style>
    </div>
  );
};

export default UploadSection;
