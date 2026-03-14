import { useState, useEffect, useRef } from "react";
import {  Users, Rocket, ArrowRight, Sparkles, Clock, Shield, Zap } from "lucide-react";

const steps = [
  {
    title: "Company Approval",
    description: "Super Admin approves companies and sets up governance",
    icon: "✓",
    lucideIcon: Shield,
    color: "from-purple-500 to-indigo-500",
    bgColor: "from-purple-50 to-indigo-50",
    lightColor: "bg-purple-100",
    gradient: "from-purple-600 to-indigo-600",
    stats: "24h approval"
  },
  {
    title: "Team Invitation",
    description: "Company Admin invites team members with secure links",
    icon: "👥",
    lucideIcon: Users,
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-50 to-cyan-50",
    lightColor: "bg-blue-100",
    gradient: "from-blue-600 to-cyan-600",
    stats: "Secure invites"
  },
  {
    title: "Start Building",
    description: "Developers collaborate with proper access controls",
    icon: "🚀",
    lucideIcon: Rocket,
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-50 to-emerald-50",
    lightColor: "bg-green-100",
    gradient: "from-green-600 to-emerald-600",
    stats: "Instant access"
  },
];

const HowItWorksSection = () => {

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-linear-to-b from-white via-indigo-50/20 to-white"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-40 left-20 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-indigo-100/10 via-transparent to-transparent" />
        
        {/* Dot Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Animation */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-full mb-6 shadow-sm">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold bg-linear-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
              Simple 3-Step Process
            </span>
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>

          {/* Headline with Gradient */}
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              How 
            </span>
            <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent bg-size-[200%] animate-gradient">
              {" "}DevSync{" "}
            </span>
            <span className="bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Works
            </span>
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Get your team up and running in 
            <span className="block mt-1 text-indigo-600 font-medium">
              three simple steps
            </span>
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Animated Connecting Line - Desktop Only */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 transform -translate-y-1/2">
            <div className="relative h-1 mx-16">
              {/* Base Line */}
              <div className="absolute inset-0 bg-linear-to-r from-indigo-200 via-indigo-300 to-indigo-200 rounded-full" />
              
              {/* Animated Progress Line */}
              <div 
                className="absolute inset-0 bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-full animate-progress"
                style={{
                  width: isVisible ? '100%' : '0%',
                  transition: 'width 2s ease-in-out'
                }}
              />
              
              {/* Floating Dots */}
              <div className="absolute -top-1 left-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-ping" />
              <div className="absolute -top-1 left-2/4 w-2 h-2 bg-purple-400 rounded-full animate-ping delay-300" />
              <div className="absolute -top-1 left-3/4 w-2 h-2 bg-indigo-400 rounded-full animate-ping delay-700" />
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
            {steps.map((step, index) => {


              return (
                <div
                  key={step.title}
                  className={`group relative transition-all duration-700 transform ${
                    isVisible 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-20 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}

                >
                  {/* Glow Effect */}
                  <div className={`absolute -inset-0.5 bg-linear-to-r ${step.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

                  {/* Main Card */}
                  <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                    
                    {/* Decorative Corner */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${step.bgColor} rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700 opacity-50`} />

                    {/* Step Number - Large Background */}
                    <div className="absolute -bottom-8 -right-8 text-8xl font-bold text-gray-100/50 select-none">
                      {index + 1}
                    </div>

                    {/* Icon Container with Animation */}
                    <div className="relative mb-8">
                      {/* Pulse Ring */}
                      <div className={`absolute inset-0 bg-linear-to-r ${step.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                      
                      {/* Icon */}
                      <div className={`relative w-20 h-20 bg-linear-to-br ${step.color} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl`}>
                        <span className="text-3xl filter drop-shadow-lg">{step.icon}</span>
                      </div>

                      {/* Live Indicator */}
                      <div className="absolute -top-1 -right-1">
                        <span className="relative flex h-3 w-3">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            index === 0 ? 'bg-purple-400' : index === 1 ? 'bg-blue-400' : 'bg-green-400'
                          }`} />
                          <span className={`relative inline-flex rounded-full h-3 w-3 ${
                            index === 0 ? 'bg-purple-500' : index === 1 ? 'bg-blue-500' : 'bg-green-500'
                          }`} />
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center relative z-10">
                      {/* Step Badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-linear-to-r from-gray-50 to-white border border-gray-200 rounded-full mb-4">
                        <div className={`w-2 h-2 rounded-full bg-linear-to-r ${step.color}`} />
                        <span className="text-xs font-semibold text-gray-600">
                          Step {index + 1}
                        </span>
                      </div>

                      {/* Title with Gradient on Hover */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Stats Tag */}
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-gray-50 to-white border border-gray-200 rounded-full shadow-sm">
                        <Zap className={`w-4 h-4 ${
                          index === 0 ? 'text-purple-500' : index === 1 ? 'text-blue-500' : 'text-green-500'
                        }`} />
                        <span className="text-xs font-medium text-gray-700">{step.stats}</span>
                      </div>
                    </div>

                    {/* Hover Overlay with More Details */}
                    <div className={`absolute inset-0 bg-linear-to-t from-white/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`mt-16 text-center transition-all duration-1000 delay-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <button className="group inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <p className="mt-4 text-sm text-gray-500">
            Takes less than 2 minutes to set up
          </p>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 4s ease infinite;
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HowItWorksSection;
