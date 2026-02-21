import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProtocolsSection from "@/components/ProtocolsSection";
import ArchitectureSection from "@/components/ArchitectureSection";
import SimulationSection from "@/components/SimulationSection";
import ComparisonSection from "@/components/ComparisonSection";
import ResultsSection from "@/components/ResultsSection";
import TeamSection from "@/components/TeamSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProtocolsSection />
      <ArchitectureSection />
      <SimulationSection />
      <ComparisonSection />
      <ResultsSection />
      <TeamSection />
      <Footer />
    </div>
  );
};

export default Index;
