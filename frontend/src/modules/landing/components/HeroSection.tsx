const HeroSection = () => {
  return (
    <section className="bg-linear-to-b from-white to-gray-50">
      <div className="mx-auto max-w-7xl px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left content */}
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium mb-6">
              🚀 Trusted by 500+ development teams
            </div>
            
            <h1 className="text-5xl font-bold leading-tight text-gray-900">
              Manage Teams.
              <span className="text-indigo-600"> Control Access.</span>
              <br />
              Build Faster.
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              DevSync is a developer-first platform to manage companies,
              teams, and roles with clarity, security, and scale. 
              Designed for growing engineering organizations.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg">
                Start Free Trial
              </button>
              <button className="px-8 py-4 rounded-lg border border-gray-300 text-gray-700 hover:text-gray-900 font-medium transition-all duration-300 hover:border-gray-400 bg-white">
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                  </svg>
                  Watch Demo
                </span>
              </button>
            </div>
            
            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-linear-to-r from-indigo-400 to-indigo-600 border-2 border-white"></div>
                ))}
              </div>
              <p className="text-gray-600 text-sm">
                <span className="font-semibold text-gray-900">1,200+ developers</span> onboarded last month
              </p>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative">
            <div className="relative w-full h-[400px] rounded-2xl bg-linear-to-br from-indigo-50 to-white border border-gray-200 shadow-xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Preview</h3>
                  <p className="text-gray-600">Clean, intuitive interface for team management</p>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 left-4 w-24 h-2 bg-gray-200 rounded-full"></div>
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100"></div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-gray-100 rounded-full"></div>
            </div>
            
            {/* Floating cards */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white rounded-xl border border-gray-200 shadow-lg p-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <p className="text-sm font-medium text-gray-900">Real-time Updates</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;

