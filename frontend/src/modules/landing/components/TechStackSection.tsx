import { useState, useEffect, useRef } from "react";
import { 
  Code2, 
  Database, 

  Box, 
  Server, 
  Lock,
  Sparkles,

  CheckCircle2,
  Hexagon,

} from "lucide-react";

const stack = [
  { name: "React", category: "Frontend", color: "from-blue-500 to-cyan-500", bgColor: "from-blue-50 to-cyan-50", icon: Code2, description: "UI Library" },
  { name: "TypeScript", category: "Language", color: "from-blue-600 to-indigo-600", bgColor: "from-blue-50 to-indigo-50", icon: Box, description: "Type Safety" },
  { name: "Node.js", category: "Backend", color: "from-green-500 to-emerald-500", bgColor: "from-green-50 to-emerald-50", icon: Server, description: "Runtime" },
  { name: "MongoDB", category: "Database", color: "from-green-600 to-teal-600", bgColor: "from-green-50 to-teal-50", icon: Database, description: "NoSQL" },
  { name: "JWT Auth", category: "Security", color: "from-purple-500 to-pink-500", bgColor: "from-purple-50 to-pink-50", icon: Lock, description: "Authentication" },
  { name: "CleanArchitecture", category: "Pattern", color: "from-orange-500 to-red-500", bgColor: "from-orange-50 to-red-50", icon: Hexagon, description: "Design Pattern" },
];

const TechStackSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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
      id="tech" 
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-linear-to-b from-white via-indigo-50/20 to-white"
    >
      {/* Animated Background - Matching HowItWorksSection */}
      <div className="absolute inset-0">
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
        {/* Section Header - Matching HowItWorksSection */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-full mb-6 shadow-sm">
            <Code2 className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold bg-linear-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
              Technology Stack
            </span>
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>

          {/* Headline with Gradient */}
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Modern 
            </span>
            <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent bg-size-[200%] animate-gradient">
              {" "}Tech Stack
            </span>
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Built with cutting-edge technologies for 
            <span className="block mt-1 text-indigo-600 font-medium">
              performance, security, and scalability
            </span>
          </p>
        </div>

        {/* Tech Grid - Matching card style from HowItWorksSection */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {stack.map((tech, index) => {
            const Icon = tech.icon;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={tech.name}
                className={`group relative transition-all duration-700 transform ${
                  isVisible 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Glow Effect */}
                <div className={`absolute -inset-0.5 bg-linear-to-r ${tech.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

                {/* Main Card */}
                <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  
                  {/* Decorative Corner */}
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-linear-to-br ${tech.bgColor} rounded-full transform translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-700 opacity-50`} />

                  {/* Icon Container with Animation */}
                  <div className="relative mb-4 flex justify-center">
                    <div className={`absolute inset-0 bg-linear-to-r ${tech.color} rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                    <div className={`relative w-14 h-14 bg-linear-to-br ${tech.color} rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Live Indicator */}
                    <div className="absolute -top-1 -right-1">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          index === 0 ? 'bg-blue-400' : 
                          index === 1 ? 'bg-indigo-400' : 
                          index === 2 ? 'bg-green-400' : 
                          index === 3 ? 'bg-teal-400' : 
                          index === 4 ? 'bg-purple-400' : 'bg-orange-400'
                        }`} />
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                          index === 0 ? 'bg-blue-500' : 
                          index === 1 ? 'bg-indigo-500' : 
                          index === 2 ? 'bg-green-500' : 
                          index === 3 ? 'bg-teal-500' : 
                          index === 4 ? 'bg-purple-500' : 'bg-orange-500'
                        }`} />
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    {/* Name with Gradient on Hover */}
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
                      {tech.name}
                    </h3>

                    {/* Category Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-linear-to-r from-gray-50 to-white border border-gray-200 rounded-full">
                      <div className={`w-1.5 h-1.5 rounded-full bg-linear-to-r ${tech.color}`} />
                      <span className="text-xs font-medium text-gray-600">{tech.category}</span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-500 mt-3">
                      {tech.description}
                    </p>
                  </div>

                  {/* Hover Overlay with Check */}
                  {isHovered && (
                    <div className="absolute -top-1 -right-1">
                      <div className="w-5 h-5 bg-linear-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Stats Bar - Matching HowItWorksSection style */}
        <div className={`mt-16 transition-all duration-1000 delay-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-sm font-medium text-gray-700">100% TypeScript</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-300" />
                <span className="text-sm font-medium text-gray-700">Fully Tested</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-700" />
                <span className="text-sm font-medium text-gray-700">Enterprise-ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default TechStackSection;