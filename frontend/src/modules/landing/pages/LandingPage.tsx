import LandingLayout from "../layout/LandingLayout";
import HeroSection from '../components/HeroSection'

import RolesSection from "../components/RolesSection";
import FeaturesSection from '../components/FeaturesSection';
import HowItWorksSection from "../components/HowItWorksSection";
import TechStackSection from "../components/TechStackSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <LandingLayout>
      <HeroSection />
      <RolesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TechStackSection />
      <CTASection />
      <Footer />
    </LandingLayout>
  );
};

export default LandingPage;
