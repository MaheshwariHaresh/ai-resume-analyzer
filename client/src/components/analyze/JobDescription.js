import { BriefcaseBusiness, Sparkles } from "lucide-react";

const JobDescription = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-8">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <BriefcaseBusiness className="text-blue-600" size={28} />

            <h2 className="text-2xl font-bold text-gray-900">
              Job Description
            </h2>
          </div>

          <p className="text-gray-500 mt-2">
            Paste the job description to receive a more accurate ATS match,
            keyword analysis and personalized suggestions.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
          Optional
        </span>
      </div>

      {/* Textarea */}

      <div className="mt-8">
        <textarea
          rows={10}
          placeholder="Paste the complete job description here...

Example:

We are looking for a Backend Developer with experience in Node.js, Express.js, MongoDB, REST APIs, JWT Authentication, Docker, Redis and AWS..."
          className="w-full border border-gray-300 rounded-xl p-5 resize-none outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      {/* Info Card */}

      <div className="mt-8 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-600 text-white rounded-xl p-3">
            <Sparkles size={22} />
          </div>

          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              Why add a Job Description?
            </h3>

            <p className="text-gray-600 mt-2 leading-7">
              Our AI compares your resume against the job requirements and
              provides deeper insights to improve your chances of getting
              shortlisted.
            </p>

            {/* Features */}

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3">
                <span className="text-green-600 font-bold">✓</span>

                <span>ATS Match Percentage</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-green-600 font-bold">✓</span>

                <span>Keyword Match Analysis</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-green-600 font-bold">✓</span>

                <span>Missing Skills Detection</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-green-600 font-bold">✓</span>

                <span>Resume Improvement Tips</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
