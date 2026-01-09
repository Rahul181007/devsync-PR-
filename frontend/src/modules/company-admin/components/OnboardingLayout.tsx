import type { ReactNode } from "react";

interface Props {
  step: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const OnboardingLayout = ({ step, title, subtitle, children }: Props) => {
  const steps = [
    { number: 1, label: "Create Workspace" },
    { number: 2, label: "Branding" },
    { number: 3, label: "Create First Project" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Modern Sidebar */}
          <div className="md:w-2/5 bg-linear-to-b from-indigo-600 to-indigo-700 p-8 md:p-10 text-white">
            <div className="mb-10">
              <div className="text-2xl font-bold mb-2">DevSync</div>
              <div className="text-indigo-200 font-medium">Onboarding</div>
            </div>

            <div className="space-y-6">
              {steps.map((s) => (
                <div key={s.number} className="flex items-center space-x-4">
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      step >= s.number
                        ? "bg-white border-white text-indigo-600"
                        : "border-indigo-400 text-indigo-200"
                    } font-semibold`}
                  >
                    {s.number}
                  </div>
                  <div>
                    <div
                      className={`font-medium ${
                        step >= s.number ? "text-white" : "text-indigo-200"
                      }`}
                    >
                      {s.label}
                    </div>
                    {step >= s.number && (
                      <div className="text-xs text-indigo-200 mt-1">
                        {s.number === step ? "In progress" : "Completed"}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:w-3/5 p-8 md:p-10">
            {/* Progress Header - Mobile/Compact */}
            <div className="mb-8 md:hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">
                  Step {step} of 3
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {title}
              </h1>
              {subtitle && (
                <p className="text-gray-600">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="space-y-6">
              {children}
            </div>

            {/* Footer Note */}
            <p className="text-center text-gray-400 text-sm mt-12 pt-6 border-t border-gray-100">
              You can update these settings anytime in your workspace preferences
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;