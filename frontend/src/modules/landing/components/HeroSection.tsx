import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative bg-linear-to-b from-white via-indigo-50/30 to-gray-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        />
        <div 
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"
          style={{
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.8)_100%)]" />
      </div>

      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, gray 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left content with enhanced typography */}
          <div className="space-y-8">
            {/* Enhanced Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-50 to-indigo-100/50 border border-indigo-200 rounded-full shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-sm font-semibold bg-linear-to-r from-indigo-700 to-indigo-600 bg-clip-text text-transparent">
                🚀 Trusted by 500+ development teams
              </span>
            </div>

            {/* Enhanced Heading with Gradient */}
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gray-900">Manage Teams.</span>
              <br />
              <span className="bg-linear-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Control Access.
              </span>
              <br />
              <span className="text-gray-900">Build Faster.</span>
            </h1>

            {/* Enhanced Description */}
            <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
              DevSync is a developer-first platform to manage companies,
              teams, and roles with clarity, security, and scale.
              <span className="block mt-2 text-indigo-600 font-medium">
                Designed for growing engineering organizations.
              </span>
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => navigate("/company/signup")}
                className="group relative px-8 py-4 bg-linear-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-100"
              >
                <span className="absolute inset-0 bg-linear-to-r from-indigo-700 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center justify-center gap-2">
                  Start Free Trial
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>

              <button
                onClick={() => navigate("/company/login")}
                className="group px-8 py-4 rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 transition-all duration-300"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                  </svg>
                  Watch Demo
                </span>
              </button>
            </div>

            {/* Enhanced Social Proof */}
            <div className="flex items-center gap-8 pt-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="relative w-10 h-10 rounded-full bg-linear-to-br from-indigo-400 to-indigo-600 border-2 border-white shadow-lg hover:scale-110 hover:z-10 transition-all duration-300 cursor-pointer"
                  >
                    <div className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-20 transition-opacity duration-300" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center shadow-lg">
                  <span className="text-xs font-bold text-indigo-600">+2k</span>
                </div>
              </div>
              <div className="border-l-2 border-gray-200 pl-6">
                <p className="text-gray-600">
                  <span className="font-bold text-gray-900 text-lg">1,200+</span>
                  <span className="text-sm ml-1">developers</span>
                  <br />
                  <span className="text-sm text-indigo-600 font-medium">onboarded last month</span>
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Right visual */}
          <div className="relative">
            {/* Main Card with 3D Effect */}
            <div className="relative group perspective">
              <div className="absolute -inset-1 bg-linear-to-r from-indigo-600 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              
              <div className="relative w-full h-[400px] rounded-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden transform transition-transform duration-500 group-hover:scale-[1.02] group-hover:rotate-1">
                {/* Card Header */}
                <div className="absolute top-0 inset-x-0 h-12 bg-linear-to-r from-gray-50 to-white border-b border-gray-100 flex items-center px-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="ml-4 text-xs text-gray-400 font-mono">dashboard.dev</div>
                </div>

                {/* Card Content */}
                <div className="absolute inset-0 top-12 flex items-center justify-center">
                  <div className="text-center p-8">
                    {/* Animated Icon */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-indigo-400/20 rounded-xl blur-xl animate-pulse" />
                      <div className="relative w-20 h-20 mx-auto rounded-xl bg-linear-to-br from-indigo-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Preview</h3>
                    <p className="text-gray-600">Clean, intuitive interface for team management</p>

                    {/* Mini Stats */}
                    <div className="mt-6 flex justify-center gap-4">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-xs text-gray-500">Live</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-indigo-400" />
                        <span className="text-xs text-gray-500">24 active</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 left-4 w-24 h-1.5 bg-linear-to-r from-indigo-200 to-indigo-400 rounded-full"></div>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-linear-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-indigo-400/50" />
                </div>
                
                {/* Animated Loading Bar */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-linear-to-r from-indigo-400 to-indigo-600 rounded-full animate-loading" />
                </div>
              </div>
            </div>

            {/* Enhanced Floating Card */}
            <div className="absolute -bottom-6 -left-6 w-36 h-36 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-xl p-4 animate-float">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400/10 rounded-lg blur-sm" />
                <div className="relative w-10 h-10 bg-linear-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mb-2 shadow-lg">
                  <span className="text-white font-bold text-lg">✓</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-900">Real-time Updates</p>
              <p className="text-xs text-green-600 mt-1">Live now</p>
              <div className="absolute -top-1 -right-1 w-3 h-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </div>
            </div>

            {/* Additional Decorative Card */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 shadow-lg p-3 animate-float-delayed hidden lg:block">
              <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center mb-1">
                <span className="text-indigo-600 font-bold text-xs">⚡</span>
              </div>
              <p className="text-xs font-medium text-gray-600">99.9%</p>
              <p className="text-xs text-gray-400">uptime</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite;
        }
        .animate-loading {
          animation: loading 2s ease-in-out infinite;
        }
        .perspective {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
