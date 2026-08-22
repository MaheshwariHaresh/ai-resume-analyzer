import {
  BriefcaseBusiness,
  Sparkles,
  CheckCircle2,
  FileText,
  X,
} from "lucide-react";

const JobDescription = ({ jobDescript, setJobDescript }) => {
  const maxCharacters = 10000;

  const handleChange = (e) => {
    const value = e.target.value;

    if (value.length <= maxCharacters) {
      setJobDescript(value);
    }
  };

  const handleClear = () => {
    setJobDescript("");
  };

  const characterCount = jobDescript.length;

  const features = [
    {
      title: "ATS Match Score",
      description: "See how closely your resume matches the role.",
    },
    {
      title: "Keyword Analysis",
      description: "Identify important keywords recruiters expect.",
    },
    {
      title: "Missing Skills",
      description: "Discover skills and requirements missing from your resume.",
    },
    {
      title: "Improvement Tips",
      description: "Get practical suggestions tailored to the job.",
    },
  ];

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
      {/* Background Decoration */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-indigo-50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <BriefcaseBusiness size={21} className="text-blue-600" />
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Job Description
                </h2>

                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-semibold">
                  Optional
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-1.5 max-w-2xl leading-6">
                Add the job description to get a more targeted ATS match,
                keyword analysis, missing skills and personalized suggestions.
              </p>
            </div>
          </div>
        </div>

        {/* Textarea Section */}
        <div className="mt-7">
          <div className="flex items-center justify-between mb-2.5">
            <label
              htmlFor="job-description"
              className="text-sm font-semibold text-gray-800"
            >
              Job Description
            </label>

            <span
              className={`text-xs ${
                characterCount > maxCharacters * 0.9
                  ? "text-orange-500"
                  : "text-gray-400"
              }`}
            >
              {characterCount.toLocaleString()} /{" "}
              {maxCharacters.toLocaleString()}
            </span>
          </div>

          <div className="relative">
            <textarea
              id="job-description"
              value={jobDescript}
              onChange={handleChange}
              rows={11}
              placeholder={`Paste the complete job description here...

Example:

We are looking for a Backend Developer with experience in Node.js, Express.js, MongoDB, REST APIs, JWT Authentication, Docker, Redis and AWS...`}
              className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-5 py-4 pr-12 text-sm text-gray-700 placeholder:text-gray-400 leading-6 resize-none outline-none transition-all duration-200 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
            />

            {jobDescript && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 flex items-center justify-center transition"
                aria-label="Clear job description"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between mt-2.5">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <FileText size={13} />
              <span>
                Paste the job posting exactly as provided by the employer.
              </span>
            </div>

            {jobDescript && (
              <span className="hidden sm:block text-xs font-medium text-green-600">
                Job description added
              </span>
            )}
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="relative mt-7 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/70">
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

          <div className="relative p-5 sm:p-6">
            {/* Card Header */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-600/20">
                <Sparkles size={19} />
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Get a more targeted analysis
                </h3>

                <p className="text-sm text-gray-500 mt-1 leading-6">
                  When you provide the job description, our AI can compare your
                  resume directly against the role requirements.
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group flex items-start gap-3 rounded-xl bg-white/80 border border-gray-100 p-4 hover:border-blue-100 hover:bg-white transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} className="text-green-600" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {feature.title}
                    </p>

                    <p className="text-xs text-gray-500 mt-1 leading-5">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="flex items-center justify-center gap-2 mt-5 text-xs text-gray-400">
          <Sparkles size={13} />

          <span>
            Adding a job description helps generate more relevant resume
            recommendations.
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
