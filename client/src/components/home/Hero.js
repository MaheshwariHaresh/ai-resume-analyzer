import { ArrowRight, Play, Sparkles, CheckCircle } from "lucide-react";

const Hero = () => {
  const scrollToUpload = () => {
    document
      .getElementById("upload-resume")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToHowItWorks = () => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-100/40 blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-16 lg:pt-14 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium">
              <Sparkles size={15} />
              AI-Powered Resume Analysis
            </div>

            {/* Heading */}
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.08]">
              Turn Your Resume Into Your{" "}
              <span className="text-blue-600">Next Opportunity.</span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg text-gray-500 leading-8 max-w-xl">
              Get an AI-powered ATS score, identify skill gaps, improve your
              resume and prepare for interviews — all in one place.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={scrollToUpload}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-semibold transition shadow-lg shadow-blue-600/20"
              >
                Analyze My Resume
                <ArrowRight size={18} />
              </button>

              <button
                onClick={scrollToHowItWorks}
                className="inline-flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3.5 rounded-xl font-semibold transition"
              >
                <Play size={17} />
                See How It Works
              </button>
            </div>

            {/* Trust */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-7 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                No signup required
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                PDF & DOCX supported
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                AI-powered feedback
              </div>
            </div>
          </div>

          {/* Right - Product Preview */}
          <div className="relative">
            <div className="relative max-w-xl mx-auto">
              {/* Glow */}
              <div className="absolute inset-8 bg-blue-500/10 blur-3xl rounded-full" />

              {/* Video / Preview Container */}
              <div className="relative rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/70 overflow-hidden">
                {/* Top Bar */}
                <div className="flex items-center justify-between px-5 py-3 border-b bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>

                  <span className="text-xs text-gray-400">Resume Analysis</span>
                </div>

                {/* Preview */}
                <div className="p-6 sm:p-8 bg-gray-50">
                  <div className="bg-white rounded-xl border shadow-sm p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">ATS SCORE</p>

                        <p className="mt-1 text-4xl font-bold text-gray-900">
                          86<span className="text-lg text-gray-400">/100</span>
                        </p>
                      </div>

                      <div className="w-20 h-20 rounded-full border-8 border-blue-100 flex items-center justify-center">
                        <span className="font-bold text-blue-600">86%</span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-6 space-y-4">
                      <ScoreBar label="Skills" value="92%" width="92%" />
                      <ScoreBar label="Experience" value="84%" width="84%" />
                      <ScoreBar label="Keywords" value="88%" width="88%" />
                      <ScoreBar label="Formatting" value="91%" width="91%" />
                    </div>

                    {/* AI Feedback */}
                    <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100">
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-blue-600" />

                        <span className="text-sm font-semibold text-gray-900">
                          AI Recommendation
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-gray-500 leading-5">
                        Add measurable achievements and strengthen your
                        professional experience section.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-5 -left-5 sm:-left-8 bg-white border shadow-xl rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle size={19} className="text-green-600" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">AI Analysis</p>

                    <p className="text-sm font-semibold text-gray-900">
                      Complete
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating AI Badge */}
              <div className="absolute -top-4 -right-4 bg-white border shadow-xl rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={17} className="text-blue-600" />

                  <span className="text-sm font-semibold text-gray-800">
                    AI Powered
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ScoreBar = ({ label, value, width }) => {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-gray-500">{label}</span>

        <span className="font-medium text-gray-700">{value}</span>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 rounded-full" style={{ width }} />
      </div>
    </div>
  );
};

export default Hero;
