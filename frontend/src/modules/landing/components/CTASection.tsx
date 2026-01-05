const CTASection = () => {
  return (
    <section className="py-28 text-center bg-linear-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-8">
        <h2 className="text-4xl font-bold mb-6 text-gray-900">
          Ready to simplify developer management?
        </h2>
        <p className="text-gray-600 mb-10 text-lg">
          Join thousands of teams who trust DevSync for their development workflow
        </p>

        <div className="flex justify-center gap-4">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg">
            Get Started Free
          </button>
          <button className="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-lg font-medium transition-all duration-300 bg-white hover:bg-gray-50 shadow-sm">
            Schedule a Demo
          </button>
        </div>
        
        <p className="mt-6 text-gray-500 text-sm">
          No credit card required • 14-day free trial
        </p>
      </div>
    </section>
  );
};


export default CTASection;
