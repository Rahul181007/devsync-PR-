import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../../../assets/DevSync.png";
import { Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      setIsMobileMenuOpen(false);
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const navItems = [
    { id: "features", label: "Features" },
    { id: "roles", label: "Roles" },
    { id: "tech", label: "Tech Stack" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
          : "bg-white py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo with hover effect */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <img
                src={logo}
                alt="DevSync Logo"
                className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-indigo-600/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent">
              DevSync
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative px-4 py-2 text-gray-600 font-medium group"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-indigo-600">
                  {item.label}
                </span>
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/company/login")}
              className="px-5 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 hover:text-indigo-600"
            >
              Sign In
            </button>

            <button
              onClick={() => navigate("/company/signup")}
              className="relative px-6 py-2 bg-linear-to-r from-indigo-600 to-indigo-500 text-white font-medium rounded-lg overflow-hidden group"
            >
              <span className="absolute inset-0 bg-linear-to-r from-indigo-700 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                Get Started
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="px-4 py-3 text-left text-gray-700 font-medium rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300"
                >
                  {item.label}
                </button>
              ))}
              <div className="h-px bg-gray-200 my-2" />
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate("/company/login");
                }}
                className="px-4 py-3 text-left text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all duration-300"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate("/company/signup");
                }}
                className="px-4 py-3 text-left bg-linear-to-r from-indigo-600 to-indigo-500 text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
              >
                Get Started
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;