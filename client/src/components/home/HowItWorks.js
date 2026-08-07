import { UploadCloud, Brain, BarChart3, MessageSquare } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Upload Resume",
    description:
      "Upload your resume in PDF or DOCX format. No sign-up required.",
    icon: UploadCloud,
  },
  {
    id: 2,
    title: "AI Analysis",
    description:
      "Our AI scans your resume and compares it against ATS standards.",
    icon: Brain,
  },
  {
    id: 3,
    title: "Get ATS Score",
    description:
      "Receive your ATS score, strengths, weaknesses, and improvement tips.",
    icon: BarChart3,
  },
  {
    id: 4,
    title: "Practice Interview",
    description:
      "Generate AI-powered interview questions based on your resume.",
    icon: MessageSquare,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900">How It Works</h2>

          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Get detailed resume feedback in just four simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-20 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className="relative rounded-2xl border border-gray-200 p-8 bg-white shadow-sm hover:shadow-lg transition duration-300"
              >
                {/* Step Number */}
                <div className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {step.id}
                </div>

                {/* Icon */}
                <div className="mt-6 flex items-center justify-center w-16 h-16 rounded-xl bg-blue-100">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>

                {/* Title */}
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-4 text-gray-500 leading-7">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
