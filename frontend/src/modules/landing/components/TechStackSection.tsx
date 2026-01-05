const stack = [
  { name: "React", category: "Frontend", color: "bg-blue-50 text-blue-700" },
  { name: "TypeScript", category: "Language", color: "bg-blue-50 text-blue-700" },
  { name: "Node.js", category: "Backend", color: "bg-green-50 text-green-700" },
  { name: "MongoDB", category: "Database", color: "bg-green-50 text-green-700" },
  { name: "JWT Auth", category: "Security", color: "bg-purple-50 text-purple-700" },
  { name: "Clean Architecture", category: "Pattern", color: "bg-orange-50 text-orange-700" },
];

const TechStackSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-2 inline-block">
            Technology
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Modern Tech Stack
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Built with cutting-edge technologies for performance and scalability
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stack.map((tech) => (
            <div
              key={tech.name}
              className={`${tech.color} border border-transparent rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-md`}
            >
              <div className="text-2xl font-bold mb-2">{tech.name}</div>
              <div className="text-sm opacity-75">{tech.category}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">100% TypeScript</span> • Fully tested • Enterprise-ready
          </p>
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;

