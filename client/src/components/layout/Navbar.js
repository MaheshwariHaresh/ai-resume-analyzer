import { Link } from "react-router-dom";
import { FileText, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  {
    id: "home",
    label: "Home",
  },
  {
    id: "features",
    label: "AI Tools",
  },
  {
    id: "how-it-works",
    label: "How It Works",
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0.1, 0.25, 0.5],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <nav className="w-full bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={closeMenu} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="text-white" size={22} />
            </div>

            <span className="text-xl font-bold text-gray-900">
              Resume<span className="text-blue-600">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;

              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className={`relative py-2 text-sm font-medium transition ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {link.label}

                  {/* Active Indicator */}
                  <span
                    className={`absolute left-0 right-0 -bottom-1 h-0.5 rounded-full bg-blue-600 transition-all duration-300 ${
                      isActive
                        ? "opacity-100 scale-x-100"
                        : "opacity-0 scale-x-0"
                    }`}
                  />
                </a>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Login
            </Link>

            <a
              href="#upload-resume"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition"
            >
              Analyze Resume
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;

                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={closeMenu}
                    className={`px-3 py-2.5 rounded-lg font-medium transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}

              <Link
                to="/login"
                onClick={closeMenu}
                className="px-3 py-2.5 text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Login
              </Link>

              <a
                href="#upload-resume"
                onClick={closeMenu}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold text-center transition mt-1"
              >
                Analyze Resume
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
