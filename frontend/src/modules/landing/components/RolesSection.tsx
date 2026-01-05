const roles = [
  {
    title: "Super Admin",
    desc: "Approve companies, manage platform governance, and control access.",
    icon: "👑",
    color: "from-purple-100 to-purple-50"
  },
  {
    title: "Company Admin",
    desc: "Invite developers, manage teams, and monitor permissions.",
    icon: "💼",
    color: "from-blue-100 to-blue-50"
  },
  {
    title: "Developer",
    desc: "Join teams securely and focus on building products.",
    icon: "👨‍💻",
    color: "from-green-100 to-green-50"
  },
];

const RolesSection = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-2 inline-block">
            Role-Based Access
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Built for Every Role
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Customized experience for different team members with appropriate permissions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role) => (
            <div
              key={role.title}
              className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-16 h-16 bg-linear-to-br ${role.color} rounded-xl flex items-center justify-center mb-6`}>
                <span className="text-2xl">{role.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {role.title}
              </h3>
              <p className="text-gray-600">
                {role.desc}
              </p>
              <button className="mt-6 text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1">
                Learn more
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RolesSection;
