

interface AuthIntroPanelProps {
    userType?: "superadmin" | "companyadmin" | "developer";
}

const AuthIntroPanel = ({ userType = "superadmin" }: AuthIntroPanelProps) => {
    const getContent = () => {
        switch (userType) {
            case "superadmin":
                return {
                    title: "DevSync",
                    subtitle: "Enterprise Platform Management",
                    description: "Complete control over your DevSync ecosystem",
                    features: [
                        {
                            icon: "🏢",
                            title: "Global Tenant Management",
                            description: "Create, monitor, and manage all organizations"
                        },
                        {
                            icon: "🔐",
                            title: "Advanced Security Controls",
                            description: "Centralized authentication & authorization policies"
                        },
                        {
                            icon: "📊",
                            title: "Platform Analytics",
                            description: "Real-time insights across all tenants"
                        }
                    ],
                    gradient: "from-purple-600 to-blue-600",
                    badge: "Super Admin Access"
                };
            
            case "companyadmin":
                return {
                    title: "DevSync",
                    subtitle: "Organization Administration",
                    description: "Manage your company's development ecosystem",
                    features: [
                        {
                            icon: "👥",
                            title: "Team Management",
                            description: "Invite and manage developers & roles"
                        },
                        {
                            icon: "📁",
                            title: "Project Oversight",
                            description: "Monitor all projects and resource allocation"
                        },
                        {
                            icon: "📈",
                            title: "Performance Analytics",
                            description: "Track team productivity and metrics"
                        }
                    ],
                    gradient: "from-blue-600 to-cyan-600",
                    badge: "Company Admin"
                };
            
            case "developer":
                return {
                    title: "DevSync",
                    subtitle: "Developer Workspace",
                    description: "Your hub for seamless collaboration",
                    features: [
                        {
                            icon: "💻",
                            title: "Code Collaboration",
                            description: "Real-time code reviews and pair programming"
                        },
                        {
                            icon: "🔧",
                            title: "Development Tools",
                            description: "Integrated CI/CD and debugging tools"
                        },
                        {
                            icon: "🤝",
                            title: "Team Integration",
                            description: "Connect with teammates and track progress"
                        }
                    ],
                    gradient: "from-green-600 to-teal-600",
                    badge: "Developer Access"
                };
            
            default:
                return getContent();
        }
    };

    const content = getContent();

    return (
        <div className="w-full max-w-md px-8 py-12">
            {/* Logo and Brand Section */}
            <div className="mb-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-r from-blue-500 to-blue-600 shadow-lg mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {content.title}
                </h1>
                <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-medium text-gray-300 mb-3">
                    {content.badge}
                </div>
                <p className="text-gray-300 text-lg">
                    {content.subtitle}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                    {content.description}
                </p>
            </div>

            {/* Features Grid */}
            <div className="space-y-4">
                {content.features.map((feature, index) => (
                    <div
                        key={index}
                        className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                    >
                        <div className="flex items-start gap-4">
                            <div className="text-3xl">{feature.icon}</div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {feature.description}
                                </p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Stats */}
            <div className="mt-12 pt-6 border-t border-white/10">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-2xl font-bold text-blue-400">24/7</div>
                        <div className="text-xs text-gray-400">Support</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-2xl font-bold text-blue-400">99.9%</div>
                        <div className="text-xs text-gray-400">Uptime</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthIntroPanel;