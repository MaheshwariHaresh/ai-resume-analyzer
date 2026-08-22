import { Link } from "react-router-dom";
import { FileText, ArrowLeft, ShieldCheck } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-10">
          {/* Title */}
          <div className="flex items-start gap-4 mb-10">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="text-blue-600" size={23} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Privacy Policy
              </h1>

              <p className="text-sm text-gray-500 mt-2">
                Last updated: August 2026
              </p>
            </div>
          </div>

          <div className="space-y-8 text-sm text-gray-600 leading-7">
            {/* Introduction */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                1. Introduction
              </h2>

              <p>
                AI Resume Analyzer ("we", "our", or "the Service") provides
                AI-powered resume analysis and career preparation tools. This
                Privacy Policy explains what information we collect, how we use
                it, and how we protect your information when you use our
                Service.
              </p>
            </section>

            {/* Information */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                2. Information We Collect
              </h2>

              <p className="mb-3">
                Depending on how you use the Service, we may collect:
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Account information such as your name, email address, and
                  authentication information.
                </li>

                <li>Resume files that you voluntarily upload for analysis.</li>

                <li>
                  Job descriptions that you provide for targeted resume
                  matching.
                </li>

                <li>
                  AI-generated resume analysis, scores, recommendations, skill
                  insights, and interview questions.
                </li>

                <li>
                  Technical information required to operate and secure the
                  Service.
                </li>
              </ul>
            </section>

            {/* Resume Data */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                3. Resume and Job Description Data
              </h2>

              <p>
                When you upload a resume, the Service processes the document to
                generate an AI-powered analysis. If you provide a job
                description, it may be used to compare your resume against the
                requirements, skills, and keywords contained in that job
                description.
              </p>

              <p className="mt-3">
                You should only upload resumes and other information that you
                have the right to provide to the Service.
              </p>
            </section>

            {/* AI */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                4. How We Use Your Information
              </h2>

              <p className="mb-3">Your information may be used to:</p>

              <ul className="list-disc pl-6 space-y-2">
                <li>Provide resume analysis and ATS scoring.</li>
                <li>Compare resumes with provided job descriptions.</li>
                <li>Identify relevant skills and potential skill gaps.</li>
                <li>Generate resume improvement recommendations.</li>
                <li>Generate interview preparation questions.</li>
                <li>Maintain and improve the reliability of the Service.</li>
                <li>Authenticate users and protect accounts from misuse.</li>
              </ul>
            </section>

            {/* AI Processing */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                5. AI Processing
              </h2>

              <p>
                The Service uses artificial intelligence to analyze resume
                content and generate recommendations. AI-generated results are
                provided as guidance and may contain inaccuracies. Users should
                review AI-generated information before relying on it for
                employment decisions.
              </p>
            </section>

            {/* Storage */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                6. Data Storage and Security
              </h2>

              <p>
                We use appropriate technical and organizational measures to
                protect information processed through the Service. Account
                information, resume metadata, and analysis results may be stored
                in our application database.
              </p>

              <p className="mt-3">
                Uploaded resume files may also be stored using third-party
                infrastructure used by the Service for file processing and
                storage.
              </p>
            </section>

            {/* Third Parties */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                7. Third-Party Services
              </h2>

              <p>
                The Service may rely on third-party providers for services such
                as cloud file storage, AI processing, database infrastructure,
                authentication, or application hosting. Information may be
                processed by these providers only as necessary to provide and
                operate the Service.
              </p>
            </section>

            {/* Account */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                8. Account Security
              </h2>

              <p>
                You are responsible for maintaining the confidentiality of your
                account credentials and for activity performed through your
                account. If you believe your account has been compromised, you
                should take appropriate steps to secure it and contact the
                Service administrator.
              </p>
            </section>

            {/* Retention */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                9. Data Retention
              </h2>

              <p>
                We retain information for as long as reasonably necessary to
                provide the Service, maintain application functionality, comply
                with applicable obligations, and protect the security of the
                platform.
              </p>
            </section>

            {/* User Rights */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                10. Your Choices
              </h2>

              <p>
                Depending on the functionality available in your account, you
                may be able to review or remove information associated with your
                account. You may also contact the Service administrator
                regarding questions about your personal information.
              </p>
            </section>

            {/* Children */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                11. Children's Privacy
              </h2>

              <p>
                The Service is not intended for children who are not legally
                permitted to use online services under applicable law. We do not
                knowingly collect personal information from children in
                violation of applicable requirements.
              </p>
            </section>

            {/* Changes */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                12. Changes to This Policy
              </h2>

              <p>
                We may update this Privacy Policy from time to time. When
                changes are made, the updated version will be made available
                through the Service with a revised "Last updated" date.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                13. Contact
              </h2>

              <p>
                If you have questions about this Privacy Policy or how your
                information is handled, please contact the Service administrator
                through the contact method provided by the application.
              </p>
            </section>
          </div>

          {/* Footer Note */}
          <div className="mt-10 pt-6 border-t border-gray-200 flex items-center gap-2 text-xs text-gray-400">
            <FileText size={14} />
            <span>AI Resume Analyzer</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
