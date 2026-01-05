const features = [
  "Role-based Access Control",
  "Secure Invite System",
  "Multi-tenant Architecture",
  "Clean & Scalable Backend",
  "Modern UI Experience",
  "Built for Growth",
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-2 inline-block">
            Platform Features
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything you need to scale
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Built with enterprise-grade security and developer productivity in mind
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature}
              className="p-8 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-6">
                <span className="text-indigo-600 font-bold text-xl">{index + 1}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature}
              </h3>
              <p className="text-gray-600">
                Streamline your development workflow with robust access controls and secure collaboration.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


export default FeaturesSection;
