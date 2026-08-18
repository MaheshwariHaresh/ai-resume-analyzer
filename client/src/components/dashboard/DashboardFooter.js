const DashboardFooter = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-5 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          {/* Copyright */}
          <p className="text-gray-500">
            © {new Date().getFullYear()} AI Resume Analyzer
          </p>

          {/* Links */}
          <div className="flex items-center gap-5">
            <a
              href="/privacy-policy"
              className="text-gray-500 hover:text-blue-600 transition"
            >
              Privacy Policy
            </a>

            <a
              href="/terms"
              className="text-gray-500 hover:text-blue-600 transition"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
