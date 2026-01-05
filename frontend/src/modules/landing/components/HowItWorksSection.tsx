const steps = [
  {
    title: "Company Approval",
    description: "Super Admin approves companies and sets up governance",
    icon: "✓"
  },
  {
    title: "Team Invitation",
    description: "Company Admin invites team members with secure links",
    icon: "👥"
  },
  {
    title: "Start Building",
    description: "Developers collaborate with proper access controls",
    icon: "🚀"
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-2 inline-block">
            Simple Process
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How DevSync Works
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-linear-to-r from-indigo-200 via-indigo-300 to-indigo-200"></div>
          
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-16 h-16 bg-linear-to-br from-indigo-100 to-indigo-50 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <div className="text-center mb-4">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
