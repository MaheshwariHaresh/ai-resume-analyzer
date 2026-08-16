import {
  BarChart3,
  Briefcase,
  Target,
  FilePenLine,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

const services = [
  {
    id: 1,
    title: "Resume Analysis",
    description:
      "Get an AI-powered ATS score, resume feedback and improvement suggestions.",
    icon: BarChart3,
    active: true,
  },
  {
    id: 2,
    title: "Skill Gap Analysis",
    description:
      "Identify missing skills and discover what you need for your target role.",
    icon: Target,
  },
  {
    id: 3,
    title: "Interview Coach",
    description:
      "Practice AI-generated interview questions based on your resume and skills.",
    icon: Briefcase,
  },
  {
    id: 4,
    title: "Cover Letter Generator",
    description:
      "Create personalized and job-specific cover letters in seconds.",
    icon: FilePenLine,
  },
  {
    id: 5,
    title: "Career Insights",
    description:
      "Track your resume performance and get insights to improve your career profile.",
    icon: TrendingUp,
  },
];

const Services = () => {
  return (
    <section
      id="features"
      className="relative bg-gray-50 py-20 overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-blue-100/40 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-sm font-semibold text-blue-600">
            AI Career Tools
          </span>

          <h2 className="mt-5 text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Everything You Need to{" "}
            <span className="text-blue-600">Advance Your Career</span>
          </h2>

          <p className="mt-4 text-gray-500 leading-7">
            Powerful AI tools designed to help you build a stronger resume,
            prepare for interviews and move closer to your next opportunity.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-2xl border bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
                  item.active
                    ? "border-blue-200 shadow-md"
                    : "border-gray-200 hover:border-blue-200"
                }`}
              >
                {/* Active Card Glow */}
                {item.active && (
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-100/60 blur-2xl rounded-full" />
                )}

                <div className="relative">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      item.active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                    }`}
                  >
                    <Icon size={22} />
                  </div>

                  {/* Content */}
                  <h3 className="mt-5 text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500 leading-6 min-h-[48px]">
                    {item.description}
                  </p>

                  {/* Explore */}
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm font-semibold text-blue-600">
                      Explore
                    </span>

                    <div className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 transition-all duration-300 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600">
                      <ArrowUpRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-400">
            More AI-powered career tools are coming soon.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Services;
