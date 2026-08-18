import {
  FileText,
  UploadCloud,
  Sparkles,
  ShieldCheck,
  Eye,
  CheckCircle2,
  X,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { analyzePublicResume } from "../../apis/resumeApi";
import { useNavigate } from "react-router-dom";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const UploadResumeCard = () => {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [pdfError, setPdfError] = useState("");

  const [previewWidth, setPreviewWidth] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const previewContainerRef = useRef(null);

  /*
   * Create and clean object URL
   */
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }

    if (!(selectedFile instanceof File)) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  /*
   * Responsive PDF width
   */
  useEffect(() => {
    const updatePreviewWidth = () => {
      if (!previewContainerRef.current) return;

      const containerWidth =
        previewContainerRef.current.getBoundingClientRect().width;

      const horizontalPadding = 32;

      const availableWidth = Math.max(containerWidth - horizontalPadding, 280);

      setPreviewWidth(Math.min(availableWidth, 680));
    };

    updatePreviewWidth();

    window.addEventListener("resize", updatePreviewWidth);

    return () => {
      window.removeEventListener("resize", updatePreviewWidth);
    };
  }, []);

  /*
   * Also update width when preview becomes visible
   */
  useEffect(() => {
    if (!selectedFile) return;

    const timer = setTimeout(() => {
      if (!previewContainerRef.current) return;

      const containerWidth =
        previewContainerRef.current.getBoundingClientRect().width;

      const horizontalPadding = 32;

      const availableWidth = Math.max(containerWidth - horizontalPadding, 280);

      setPreviewWidth(Math.min(availableWidth, 680));
    }, 50);

    return () => clearTimeout(timer);
  }, [selectedFile]);

  /*
   * File validation
   */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");
    setPdfError("");
    setNumPages(null);

    const isPdf = file.type === "application/pdf";

    const isDocx =
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.toLowerCase().endsWith(".docx");

    if (!isPdf && !isDocx) {
      setError("Only PDF and DOCX files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Maximum file size is 5MB.");
      return;
    }

    setSelectedFile(file);
  };

  /*
   * Remove selected file
   */
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setNumPages(null);
    setPdfError("");
    setError("");
  };

  /*
   * PDF loaded successfully
   */
  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPdfError("");
  };

  /*
   * PDF loading error
   */
  const handleDocumentLoadError = () => {
    setPdfError(
      "Unable to preview this PDF. You can still upload it for analysis.",
    );
  };

  /*
   * Analyze resume
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a resume.");
      return;
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

  const isPdf = selectedFile?.type === "application/pdf";

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
          {/* =========================================================
              UPLOAD CARD
          ========================================================== */}
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
                <Sparkles size={17} />

                {loading ? "Analyzing Resume..." : "Analyze Resume"}
              </button>

              {/* Security Note */}
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                <ShieldCheck size={14} />
                Your resume is securely processed
              </div>
            </div>
          </div>

          {/* =========================================================
              RESUME PREVIEW
          ========================================================== */}
          <div className="lg:col-span-3 min-w-0">
            <div className="relative h-[620px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col">
              {/* Preview Header */}
              <div className="px-6 py-5 border-b border-gray-100 bg-white shrink-0">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                      <Eye size={19} className="text-blue-600" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-gray-900">
                        Resume Preview
                      </h3>

                      <p className="text-xs text-gray-500 mt-0.5">
                        Review your resume before analysis
                      </p>
                    </div>
                  </div>

                  {selectedFile && (
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 border border-green-100">
                        <CheckCircle2 size={14} className="text-green-600" />

                        <span className="text-xs font-semibold text-green-700">
                          Ready
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition"
                        aria-label="Remove resume"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* =====================================================
                  PREVIEW BODY
              ====================================================== */}
              <div
                ref={previewContainerRef}
                className="relative flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-gray-100/70"
              >
                {!selectedFile ? (
                  /* Empty State */
                  <div className="min-h-full flex items-center justify-center p-8">
                    <div className="text-center max-w-sm">
                      <div className="mx-auto w-16 h-16 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                        <FileText size={28} className="text-blue-500" />
                      </div>

                      <h4 className="mt-5 text-base font-semibold text-gray-900">
                        Your resume preview will appear here
                      </h4>

                      <p className="mt-2 text-sm text-gray-500 leading-6">
                        Upload your resume to review the document before
                        starting the AI analysis.
                      </p>
                    </div>
                  </div>
                ) : isPdf && previewUrl ? (
                  /* =================================================
                     PDF PREVIEW
                  ================================================== */
                  <div className="w-full px-4 py-5 sm:px-5">
                    <div className="w-full max-w-[720px] mx-auto">
                      {/* File Info */}
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">
                            {selectedFile.name}
                          </p>

                          <p className="text-[11px] text-gray-500 mt-0.5">
                            {numPages
                              ? `${numPages} ${
                                  numPages === 1 ? "page" : "pages"
                                }`
                              : "Preparing preview..."}
                          </p>
                        </div>

                        <div className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-[11px] font-medium text-gray-500">
                          PDF
                        </div>
                      </div>

                      {/* PDF Document */}
                      <div className="w-full overflow-hidden">
                        {pdfError ? (
                          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
                            <FileText
                              size={30}
                              className="mx-auto text-gray-400"
                            />

                            <p className="mt-3 text-sm font-medium text-gray-700">
                              {pdfError}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              Please try uploading the PDF again.
                            </p>
                          </div>
                        ) : (
                          <Document
                            file={previewUrl}
                            onLoadSuccess={handleDocumentLoadSuccess}
                            onLoadError={handleDocumentLoadError}
                            loading={
                              <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[420px] flex items-center justify-center">
                                <div className="text-center">
                                  <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />

                                  <p className="mt-3 text-xs text-gray-500">
                                    Preparing resume preview...
                                  </p>
                                </div>
                              </div>
                            }
                          >
                            {numPages &&
                              Array.from(new Array(numPages), (_, index) => (
                                <div
                                  key={`page_${index + 1}`}
                                  className="mb-5 last:mb-0 flex justify-center"
                                >
                                  {/* White Resume Page */}
                                  <div className="bg-white border border-gray-200 shadow-md overflow-hidden max-w-full">
                                    <Page
                                      pageNumber={index + 1}
                                      width={
                                        previewWidth > 0 ? previewWidth : 600
                                      }
                                      renderTextLayer
                                      renderAnnotationLayer
                                    />
                                  </div>
                                </div>
                              ))}
                          </Document>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* =================================================
                     DOCX PREVIEW
                  ================================================== */
                  <div className="min-h-full flex items-center justify-center p-6">
                    <div className="w-full max-w-md">
                      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                          <FileText size={30} className="text-blue-600" />
                        </div>

                        <h4 className="mt-5 text-base font-semibold text-gray-900">
                          DOCX resume selected
                        </h4>

                        <p className="mt-2 text-sm text-gray-500 leading-6">
                          Your DOCX file is ready for analysis. Document preview
                          is currently available for PDF resumes.
                        </p>

                        <div className="mt-5 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-left">
                          <p className="text-xs font-semibold text-gray-900 truncate">
                            {selectedFile.name}
                          </p>

                          <p className="text-[11px] text-gray-500 mt-1">
                            {(selectedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* =====================================================
                  PREVIEW FOOTER
              ====================================================== */}
              {selectedFile && (
                <div className="shrink-0 px-6 py-3 border-t border-gray-100 bg-white">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>
                      {isPdf
                        ? "Scroll to review all pages"
                        : "Ready for analysis"}
                    </span>

                    <span>Maximum 5MB</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ================================================================
   SAMPLE RESUME
================================================================ */

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

export default UploadResumeCard;
