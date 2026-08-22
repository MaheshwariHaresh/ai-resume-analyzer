import { Link } from "react-router-dom";
import { FileText, ArrowLeft, Scale } from "lucide-react";

const TermsOfService = () => {
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
              <Scale className="text-blue-600" size={23} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Terms of Service
              </h1>

              <p className="text-sm text-gray-500 mt-2">
                Last updated: August 2026
              </p>
            </div>
          </div>

          <div className="space-y-8 text-sm text-gray-600 leading-7">
            {/* Acceptance */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                1. Acceptance of Terms
              </h2>

              <p>
                By accessing or using AI Resume Analyzer ("the Service"), you
                agree to these Terms of Service. If you do not agree with these
                terms, you should not use the Service.
              </p>
            </section>

            {/* Service */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                2. Description of the Service
              </h2>

              <p>
                AI Resume Analyzer provides tools for resume analysis, applicant
                tracking system (ATS) insights, skill analysis, job-description
                matching, resume recommendations, and interview preparation.
              </p>
            </section>

            {/* Account */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                3. User Accounts
              </h2>

              <p>
                Some features require an account. You are responsible for
                providing accurate information and maintaining the security of
                your account credentials.
              </p>

              <p className="mt-3">
                You are responsible for activities performed through your
                account and should notify the Service administrator if you
                believe unauthorized access has occurred.
              </p>
            </section>

            {/* Uploads */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                4. Resume Uploads
              </h2>

              <p>
                You may upload resumes and other permitted documents for
                analysis. You represent that you have the necessary rights and
                permissions to upload and process the information contained in
                those documents.
              </p>

              <p className="mt-3">
                You must not upload files containing unlawful, malicious,
                fraudulent, or intentionally harmful content.
              </p>
            </section>

            {/* JD */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                5. Job Descriptions
              </h2>

              <p>
                Users may provide job descriptions to receive targeted resume
                analysis. You are responsible for ensuring that the information
                you provide is lawful and that you have the right to use it for
                this purpose.
              </p>
            </section>

            {/* AI Results */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                6. AI-Generated Results
              </h2>

              <p>
                Resume scores, recommendations, skill analysis, job match
                scores, and interview questions are generated using AI and are
                intended to provide guidance.
              </p>

              <p className="mt-3">
                AI-generated results are not guaranteed to be accurate,
                complete, or suitable for every employment opportunity. You are
                responsible for reviewing and verifying information before using
                it in applications, interviews, or other professional decisions.
              </p>
            </section>

            {/* No Guarantee */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                7. No Employment Guarantee
              </h2>

              <p>
                The Service does not guarantee interviews, employment,
                promotions, job offers, ATS scores, or any particular career
                outcome. Results depend on many factors outside the control of
                the Service.
              </p>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                8. Acceptable Use
              </h2>

              <p className="mb-3">You agree not to:</p>

              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Service for unlawful purposes.</li>
                <li>Attempt to gain unauthorized access to the platform.</li>
                <li>Upload malicious software or harmful files.</li>
                <li>Abuse, disrupt, or overload the Service.</li>
                <li>
                  Attempt to reverse engineer protected parts of the Service.
                </li>
                <li>Use the Service to violate another person's rights.</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                9. Intellectual Property
              </h2>

              <p>
                The Service, including its software, interface, branding,
                design, and original content, is owned by or licensed to the
                Service operator and is protected by applicable intellectual
                property laws.
              </p>

              <p className="mt-3">
                You retain ownership of the resume and other content that you
                submit, subject to the rights necessary for us to provide the
                Service.
              </p>
            </section>

            {/* Availability */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                10. Service Availability
              </h2>

              <p>
                We aim to keep the Service available and reliable but do not
                guarantee uninterrupted or error-free operation. The Service may
                occasionally be unavailable due to maintenance, technical
                issues, or circumstances outside our control.
              </p>
            </section>

            {/* Third Party */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                11. Third-Party Services
              </h2>

              <p>
                The Service may use third-party infrastructure and services,
                including cloud storage, AI processing, hosting, and other
                technical providers. Their services may be subject to their own
                terms and policies.
              </p>
            </section>

            {/* Disclaimer */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                12. Disclaimer
              </h2>

              <p>
                The Service is provided on an "as available" basis. To the
                extent permitted by applicable law, we do not guarantee that the
                Service or AI-generated results will always be accurate,
                complete, secure, or suitable for a particular purpose.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                13. Termination
              </h2>

              <p>
                Access to the Service may be suspended or terminated if a user
                violates these Terms, abuses the platform, or engages in
                activity that may harm the Service or other users.
              </p>
            </section>

            {/* Changes */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                14. Changes to These Terms
              </h2>

              <p>
                These Terms may be updated from time to time. Updated terms will
                be made available through the Service and will include a revised
                "Last updated" date.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                15. Contact
              </h2>

              <p>
                If you have questions regarding these Terms of Service, please
                contact the Service administrator through the contact method
                provided by the application.
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

export default TermsOfService;
