import { FileText, ArrowUpRight } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <FileText size={21} className="text-white" />
              </div>

              <span className="text-xl font-bold text-white">
                Resume<span className="text-blue-500">AI</span>
              </span>
            </Link>

            <p className="mt-4 max-w-md text-sm text-gray-400 leading-6">
              AI-powered resume analysis to help you improve your ATS score,
              identify skill gaps and prepare for your next opportunity.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-lg border border-gray-800 flex items-center justify-center hover:bg-gray-800 hover:text-white transition"
              >
                <FaGithub size={18} />
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg border border-gray-800 flex items-center justify-center hover:bg-gray-800 hover:text-white transition"
              >
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white">Quick Links</h3>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href="#features" className="hover:text-white transition">
                  Features
                </a>
              </li>

              <li>
                <a
                  href="#upload-resume"
                  className="hover:text-white transition"
                >
                  Analyze Resume
                </a>
              </li>

              <li>
                <a href="#how-it-works" className="hover:text-white transition">
                  How It Works
                </a>
              </li>

              <li>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 hover:text-white transition"
                >
                  Get Started
                  <ArrowUpRight size={14} />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-10 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} ResumeAI. All rights reserved.</p>

            <p>Built with AI to help you build a better career.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
