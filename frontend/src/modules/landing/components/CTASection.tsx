import { useState, useEffect, useRef } from "react";
import { ArrowRight, Calendar, Sparkles, Zap, CheckCircle2, Star, Users, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: Users, value: "10k+", label: "Developers" },
    { icon: Shield, value: "500+", label: "Companies" },
    { icon: Star, value: "4.9", label: "Rating" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-28 overflow-hidden bg-linear-to-b from-white via-indigo-50/30 to-white"
    >
      {/* Animated Background - Matching other sections */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-indigo-300/20 rounded-full animate-float-particle"
              style={{
                top: `${(i * 10) % 100}%`,
                left: `${(i * 15) % 100}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${8 + (i % 5)}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Bar - Above CTA */}
        <div className={`mb-12 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Icon className="w-5 h-5 text-indigo-600" />
                      <span className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {stat.value}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main CTA Card */}
        <div className={`relative transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-linear-to-r from-indigo-600 to-purple-600 rounded-3xl blur-xl opacity-20 animate-pulse" />

          {/* Main Card */}
          <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200 rounded-3xl p-12 shadow-2xl overflow-hidden">

            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-indigo-100 to-purple-100 rounded-full transform translate-x-32 -translate-y-32 opacity-50" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-linear-to-tr from-blue-100 to-indigo-100 rounded-full transform -translate-x-32 translate-y-32 opacity-50" />

            {/* Sparkle Icons */}
            <Sparkles className="absolute top-8 left-8 w-6 h-6 text-indigo-200 rotate-12" />
            <Sparkles className="absolute bottom-8 right-8 w-8 h-8 text-purple-200 -rotate-12" />

            {/* Content */}
            <div className="relative text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-full mb-8 shadow-sm">
                <Zap className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-semibold bg-linear-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
                  Limited Time Offer
                </span>
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
              </div>

              {/* Main Heading with Gradient */}
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Ready to simplify
                </span>
                <br />
                <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent bg-size-[200%] animate-gradient">
                  developer management?
                </span>
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-lg lg:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of teams who trust DevSync for their
                <span className="block mt-1 text-indigo-600 font-medium">
                  development workflow
                </span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <button className="group relative px-8 py-4 bg-linear-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-100 overflow-hidden">
                  <span className="absolute inset-0 bg-linear-to-r from-indigo-700 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center gap-2">

                    <button
                      onClick={() => navigate("/company/signup")}>Get Started Free</button>

                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>

                <button className="group px-8 py-4 rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 transition-all duration-300 hover:scale-105 active:scale-100">
                  <span className="flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    
                     <button
                      onClick={() => navigate("/company/login")}>Schedule a Demo</button>
                  </span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col items-center gap-4">
                {/* Features List */}
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600">No credit card required</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600">14-day free trial</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600">Cancel anytime</span>
                  </div>
                </div>

                {/* Social Proof */}
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-linear-to-b from-indigo-400 to-purple-600 border-2 border-white shadow-lg"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-900">1,200+</span> developers joined this month
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className={`mt-8 text-center transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
          <p className="text-sm text-gray-400">
            ⚡️ Join the growing DevSync community today
          </p>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
          25% { opacity: 0.5; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.3; }
          75% { opacity: 0.5; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 4s ease infinite;
        }
        .animate-float-particle {
          animation: float-particle 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default CTASection;
