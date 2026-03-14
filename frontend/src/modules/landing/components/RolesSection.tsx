import { useState, useEffect, useRef } from "react";
import { Shield, ArrowRight, ChevronRight, Sparkles, CheckCircle2 } from "lucide-react";

const roles = [
  {
    title: "Super Admin",
    desc: "Approve companies, manage platform governance, and control access.",
    icon: "👑",
    color: "from-purple-600 to-indigo-600",
    bgColor: "from-purple-50 to-indigo-50",
    lightColor: "from-purple-100 to-indigo-100",
    features: ["Platform governance", "Company approvals", "Access control", "Audit logs"],
    gradient: "bg-gradient-to-br from-purple-600 to-indigo-600"
  },
  {
    title: "Company Admin",
    desc: "Invite developers, manage teams, and monitor permissions.",
    icon: "💼",
    color: "from-blue-600 to-cyan-600",
    bgColor: "from-blue-50 to-cyan-50",
    lightColor: "from-blue-100 to-cyan-100",
    features: ["Team management", "Permission monitoring", "Developer invites", "Role assignments"],
    gradient: "bg-gradient-to-br from-blue-600 to-cyan-600"
  },
  {
    title: "Developer",
    desc: "Join teams securely and focus on building products.",
    icon: "👨‍💻",
    color: "from-green-600 to-emerald-600",
    bgColor: "from-green-50 to-emerald-50",
    lightColor: "from-green-100 to-emerald-100",
    features: ["Secure team access", "Code repositories", "Collaboration tools", "Project tracking"],
    gradient: "bg-gradient-to-br from-green-600 to-emerald-600"
  },
];

const RolesSection = () => {
  
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
      id="roles" 
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-linear-to-b from-white via-gray-50 to-white"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-indigo-100/20 via-transparent to-transparent" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #6366f1 1px, transparent 1px),
                            linear-gradient(to bottom, #6366f1 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Animation */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold bg-linear-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
              Role-Based Access Control
            </span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Built for 
            </span>
            <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent bg-size-[200%] animate-gradient">
              {" "}Every Role
            </span>
          </h2>
          
          <p className="text-gray-600 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Customized experience for different team members with 
            <span className="block mt-1 text-indigo-600 font-medium">
              appropriate permissions and tools
            </span>
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {roles.map((role, index) => (
            <div
              key={role.title}
              className={`group relative transition-all duration-700 transform ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
              
              
            >
              {/* Glow Effect */}
              <div className={`absolute -inset-0.5               
 ${role.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
              
              {/* Card */}
              <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                  <div className={`absolute top-0 right-0 w-20 h-20  ${role.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
{` ${role.lightColor} transform rotate-45 translate-x-10 -translate-y-10 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500`} 
                </div>

                {/* Icon with Animation */}
                <div className="relative mb-8">
                  <div className={`absolute inset-0 bg-linear-to-r ${role.color} rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                  <div className={`relative w-20 h-20 bg-linear-to-br ${role.color} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl`}>
                    <span className="text-3xl filter drop-shadow-lg">{role.icon}</span>
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
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
                  {role.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {role.desc}
                </p>

                {/* Feature List */}
                <div className="space-y-3 mb-8">
                  {role.features.map((feature, i) => (
                    <div 
                      key={i}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className={`w-5 h-5 rounded-full bg-linear-to-r ${role.lightColor} flex items-center justify-center shrink-0`}>
                        <CheckCircle2 className={`w-3 h-3 ${
                          index === 0 ? 'text-purple-600' : index === 1 ? 'text-blue-600' : 'text-green-600'
                        }`} />
                      </div>
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Learn More Button with Animation */}
                <button className="group/btn relative inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm transition-all duration-300">
                  <span className="relative">
                    Learn more
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-indigo-600 to-purple-600 group-hover/btn:w-full transition-all duration-300" />
                  </span>
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  
                  {/* Shine Effect */}
                  <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                </button>

                {/* Stats Badge */}
                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-400">
                    <Shield className="w-3 h-3" />
                    <span>RBAC</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`mt-16 text-center transition-all duration-1000 delay-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
            <span className="text-gray-700 font-medium">Ready to set up your team?</span>
            <button className="flex items-center gap-2 bg-linear-to-r from-indigo-600 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition-all duration-300">
              View all roles
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
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

export default RolesSection;
