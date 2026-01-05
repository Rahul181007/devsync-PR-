import type { ReactNode } from "react";

interface LandingLayoutProps {
  children: ReactNode;
}

const LandingLayout = ({ children }: LandingLayoutProps) => {
  return (
    <div className="bg-gray-950 text-white min-h-screen">
      {children}
    </div>
  );
};

export default LandingLayout;
