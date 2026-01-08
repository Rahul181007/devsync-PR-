import type { ReactNode } from "react";

interface Props{
    step:number;
    title:string;
    children:ReactNode
}

const OnboardingLayout = ({ step, title, children }: Props) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-xl bg-white rounded shadow p-8">
        <p className="text-sm text-gray-500 mb-2">
          Step {step} of 3
        </p>
        <h1 className="text-2xl font-semibold mb-6">
          {title}
        </h1>

        {children}
      </div>
    </div>
  );
};

export default OnboardingLayout;