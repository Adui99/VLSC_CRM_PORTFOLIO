import Navbar from "@/components/ui/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import TrustBySection from "@/components/sections/TrustBySection";
import TechStackSection from "@/components/sections/TechStackSection";
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import FAQSection from "@/components/sections/FAQSection";
import ContactSection from "@/components/sections/ContactSection";
import LeadModal from "@/components/ui/LeadModal";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-zinc-950 text-zinc-50 overflow-hidden">
      <ScrollProgressBar />
      <LoadingScreen />
      <LeadModal />
      {/* Navigation */}
      <Navbar />
      
      {/* Content Layers */}
      <div className="relative z-10 flex flex-col">
        <HeroSection />
        <TrustBySection />
        <TechStackSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <FAQSection />
        <ContactSection />
      </div>
    </main>
  );
}
