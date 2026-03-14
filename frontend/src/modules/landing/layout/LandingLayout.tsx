import type { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface LandingLayoutProps {
  children: ReactNode;
}

const LandingLayout = ({ children }: LandingLayoutProps) => {
  return (
    <div className="bg-gray-950 text-white min-h-screen flex flex-col">
      
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />

    </div>
  );
};

export default LandingLayout;
