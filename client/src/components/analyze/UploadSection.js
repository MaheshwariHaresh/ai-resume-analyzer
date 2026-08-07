import { useState } from "react";
import { UploadCloud, FileText, X, Sparkles } from "lucide-react";

const UploadSection = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    // Max 5MB
    if (selected.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB.");
      return;
    }

    // Allowed Types
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(selected.type)) {
      alert("Only PDF or DOCX files are allowed.");
      return;
    }

    setFile(selected);
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleAnalyze = () => {
    if (!file) {
      alert("Please upload a resume first.");
      return;
    }

    // Backend API call here
    console.log(file);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-8">
      {/* Heading */}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Upload Resume</h2>

        <p className="text-gray-500 mt-2">
          Upload your resume in PDF or DOCX format to begin AI analysis.
        </p>
      </div>

      {/* Upload Box */}

      {!file ? (
        <label
          htmlFor="resume"
          className="border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center py-16 px-6"
        >
          <UploadCloud size={70} className="text-blue-600" />

          <h3 className="text-xl font-semibold mt-6">
            Drag & Drop your Resume
          </h3>

          <p className="text-gray-500 mt-3 text-center">
            Click to browse or drag your resume here
          </p>

          <span className="mt-4 text-sm text-gray-400">
            PDF • DOCX • Max 5MB
          </span>

          <input
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="border rounded-2xl p-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                <FileText className="text-blue-600" />
              </div>

              <div>
                <h3 className="font-semibold">{file.name}</h3>

                <p className="text-gray-500 text-sm">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button
              onClick={removeFile}
              className="text-red-500 hover:text-red-700"
            >
              <X />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-green-600 font-medium">
              ✓ Ready for AI Analysis
            </span>

            <button
              onClick={handleAnalyze}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              <Sparkles size={18} />
              Analyze Resume
            </button>
          </div>
        </div>
      )}

      {/* Supported Formats */}

      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <div className="bg-gray-50 rounded-xl p-4 border">
          <h4 className="font-semibold">Supported Formats</h4>

          <p className="text-gray-500 mt-2">PDF & DOCX</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border">
          <h4 className="font-semibold">Maximum Size</h4>

          <p className="text-gray-500 mt-2">5 MB</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border">
          <h4 className="font-semibold">AI Processing</h4>

          <p className="text-gray-500 mt-2">Usually takes 5–15 seconds</p>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
