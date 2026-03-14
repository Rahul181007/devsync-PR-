import { useState, useEffect, useRef } from "react";
import { 
  Shield, 
  Lock, 
  Building2, 

  Rocket, 

  ArrowRight,
  Zap,

  Server,
  Layout
} from "lucide-react";

const features = [
  {
    name: "Role-based Access Control",
    description: "Fine-grained permissions for every team member with custom roles and policies",
    icon: Shield,
    color: "from-purple-500 to-indigo-500",
    bgColor: "from-purple-50 to-indigo-50",
    lightColor: "bg-purple-100",
    stats: "99.9% accuracy"
  },
  {
    name: "Secure Invite System",
    description: "Cryptographically signed invites with expiration and single-use tokens",
    icon: Lock,
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-50 to-cyan-50",
    lightColor: "bg-blue-100",
    stats: "256-bit encryption"
  },
  {
    name: "Multi-tenant Architecture",
    description: "Isolated environments for each organization with shared infrastructure",
    icon: Building2,
    color: "from-amber-500 to-orange-500",
    bgColor: "from-amber-50 to-orange-50",
    lightColor: "bg-amber-100",
    stats: "100% isolation"
  },
  {
    name: "Clean & Scalable Backend",
    description: "Microservices-based architecture that grows with your team",
    icon: Server,
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-50 to-emerald-50",
    lightColor: "bg-green-100",
    stats: "<100ms latency"
  },
  {
    name: "Modern UI Experience",
    description: "Intuitive interface with real-time updates and dark mode support",
    icon: Layout,
    color: "from-pink-500 to-rose-500",
    bgColor: "from-pink-50 to-rose-50",
    lightColor: "bg-pink-100",
    stats: "4.9/5 rating"
  },
  {
    name: "Built for Growth",
    description: "Designed to scale from startups to enterprise organizations",
    icon: Rocket,
    color: "from-indigo-500 to-purple-500",
    bgColor: "from-indigo-50 to-purple-50",
    lightColor: "bg-indigo-100",
    stats: "∞ scalable"
  },
];

// Predefined positions for particles (deterministic)
const particlePositions = [
  { top: '10%', left: '5%', delay: '0s', duration: '12s' },
  { top: '20%', left: '15%', delay: '2s', duration: '15s' },
  { top: '30%', left: '25%', delay: '4s', duration: '10s' },
  { top: '40%', left: '35%', delay: '1s', duration: '14s' },
  { top: '50%', left: '45%', delay: '3s', duration: '11s' },
  { top: '60%', left: '55%', delay: '5s', duration: '13s' },
  { top: '70%', left: '65%', delay: '2.5s', duration: '16s' },
  { top: '80%', left: '75%', delay: '4.5s', duration: '12s' },
  { top: '90%', left: '85%', delay: '1.5s', duration: '14s' },
  { top: '15%', left: '95%', delay: '3.5s', duration: '11s' },
  { top: '25%', left: '8%', delay: '5.5s', duration: '13s' },
  { top: '35%', left: '18%', delay: '0.5s', duration: '15s' },
  { top: '45%', left: '28%', delay: '2.2s', duration: '12s' },
  { top: '55%', left: '38%', delay: '4.2s', duration: '14s' },
  { top: '65%', left: '48%', delay: '1.8s', duration: '16s' },
  { top: '75%', left: '58%', delay: '3.8s', duration: '11s' },
  { top: '85%', left: '68%', delay: '5.2s', duration: '13s' },
  { top: '95%', left: '78%', delay: '0.8s', duration: '15s' },
  { top: '5%', left: '88%', delay: '2.8s', duration: '12s' },
  { top: '45%', left: '98%', delay: '4.8s', duration: '14s' },
];

const FeaturesSection = () => {
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
      id="features" 
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-linear-to-b from-white via-indigo-50/20 to-white"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Floating Particles - Now with predefined positions */}
        <div className="absolute inset-0">
          {particlePositions.map((pos, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-indigo-300/30 rounded-full animate-float-particle"
              style={{
                top: pos.top,
                left: pos.left,
                animationDelay: pos.delay,
                animationDuration: pos.duration
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Enhanced Animation */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-full mb-6 shadow-sm">
            <Zap className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold bg-linear-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
              Platform Features
            </span>
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          </div>

          {/* Headline with Gradient */}
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Everything you need 
            </span>
            <br />
            <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent bg-size-[200%] animate-gradient">
              to scale
            </span>
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Built with enterprise-grade security and 
            <span className="block mt-1 text-indigo-600 font-medium">
              developer productivity in mind
            </span>
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={feature.name}
                className={`group relative transition-all duration-700 transform ${
                  isVisible 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Glow Effect */}
                <div className={`absolute -inset-0.5 bg-linear-to-r ${feature.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

                {/* Main Card */}
                <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  
                  {/* Decorative Background Pattern */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${feature.bgColor} rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700 opacity-50`} />
                  
                  {/* Number Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`text-4xl font-bold bg-linear-to-r ${feature.color} bg-clip-text text-transparent opacity-20 group-hover:opacity-40 transition-opacity duration-500`}>
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                  </div>

                  {/* Icon with Animation */}
                  <div className="relative mb-6">
                    <div className={`absolute inset-0 bg-linear-to-r ${feature.color} rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                    <div className={`relative w-16 h-16 bg-linear-to-br ${feature.color} rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Animated Ring */}
                    {isHovered && (
                      <div className="absolute -inset-1 border-2 border-indigo-400/30 rounded-xl animate-ping" />
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
                    {feature.name}
                  </h3>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Stats Tag */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-gray-50 to-white border border-gray-200 rounded-full">
                    <div className={`w-2 h-2 rounded-full bg-linear-to-r ${feature.color}`} />
                    <span className="text-xs font-medium text-gray-600">{feature.stats}</span>
                  </div>

                  {/* Hover Overlay with More Details */}
                  <div className={`absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Stats Bar */}
        <div className={`mt-16 transition-all duration-1000 delay-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center border-r border-gray-200 last:border-0">
                <div className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">500+</div>
                <div className="text-sm text-gray-500">Teams</div>
              </div>
              <div className="text-center border-r border-gray-200 last:border-0">
                <div className="text-2xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">10k+</div>
                <div className="text-sm text-gray-500">Developers</div>
              </div>
              <div className="text-center border-r border-gray-200 last:border-0">
                <div className="text-2xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">50k+</div>
                <div className="text-sm text-gray-500">Roles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">99.9%</div>
                <div className="text-sm text-gray-500">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Explore More Link */}
        <div className="mt-12 text-center">
          <button className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium group transition-colors duration-300">
            <span>Explore all features</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
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
          25% { opacity: 1; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
          75% { opacity: 1; }
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

export default FeaturesSection;
