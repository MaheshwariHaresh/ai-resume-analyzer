import {
  UploadCloud,
  Brain,
  BarChart3,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Upload Resume",
    description:
      "Upload your resume in PDF or DOCX format. No sign-up required.",
    icon: UploadCloud,
  },
  {
    id: "02",
    title: "AI Analysis",
    description:
      "Our AI scans your resume against important ATS and recruitment factors.",
    icon: Brain,
  },
  {
    id: "03",
    title: "Get Your Score",
    description:
      "Receive your ATS score, strengths, weaknesses, and actionable tips.",
    icon: BarChart3,
  },
  {
    id: "04",
    title: "Prepare & Improve",
    description:
      "Practice AI-generated interview questions based on your resume.",
    icon: MessageSquare,
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-gray-50 py-20 lg:py-24"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-blue-100/40 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-blue-600 text-xs font-semibold shadow-sm">
            Simple & Powerful
          </div>

          <h2 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            How It Works
          </h2>

          <p className="mt-4 text-gray-500 leading-7">
            Go from resume upload to actionable career insights in just a few
            simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-14">
          {/* Connecting Line - Desktop */}
          <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-px bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.id} className="relative group">
                  {/* Step */}
                  <div className="h-full bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    {/* Icon */}
                    <div className="relative z-10 w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-300">
                      <Icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                    </div>

                    {/* Step Number */}
                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-xs font-bold tracking-widest text-blue-600">
                        STEP {step.id}
                      </span>

                      {index < steps.length - 1 && (
                        <ArrowRight className="hidden lg:block w-4 h-4 text-gray-300" />
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="mt-3 text-lg font-semibold text-gray-900">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-sm text-gray-500 leading-6">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400">Ready to improve your resume?</p>

          <button
            type="button"
            onClick={() =>
              document
                .getElementById("upload-resume")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            Analyze your resume
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
