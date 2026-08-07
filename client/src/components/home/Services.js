import {
  BarChart3,
  Briefcase,
  Target,
  FilePenLine,
  DollarSign,
} from "lucide-react";

const services = [
  {
    id: 1,
    title: "Resume Analysis",
    description: "Get an AI-powered ATS score and resume feedback",
    icon: BarChart3,
    active: true,
  },
  {
    id: 2,
    title: "Skill Gap Analysis",
    description: "Identify missing skills for your target role",
    icon: Target,
  },
  {
    id: 3,
    title: "Interview Coach",
    description: "Practice AI-generated interview questions",
    icon: Briefcase,
  },
  {
    id: 4,
    title: "Cover Letter Generator",
    description: "Generate tailored cover letters instantly",
    icon: FilePenLine,
  },
  {
    id: 5,
    title: "Career Insights",
    description: "Track your progress and improve your profile",
    icon: DollarSign,
  },
];

const Services = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900">AI Career Tools</h2>

          <p className="mt-4 text-lg text-gray-500">
            Everything you need to improve your resume and career.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mt-16">
          {/* Horizontal Line */}
          <div className="absolute top-8 left-0 w-full h-[2px] bg-gray-200" />

          <div className="relative grid grid-cols-1 md:grid-cols-5 gap-10">
            {services.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  className="flex flex-col items-center text-center"
                >
                  {/* Circle */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border transition
                    ${
                      item.active
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-gray-300 text-gray-500"
                    }`}
                  >
                    <Icon size={24} />
                  </div>

                  {/* Title */}
                  <h3 className="mt-6 text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-sm text-gray-500 leading-6 max-w-[180px]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
