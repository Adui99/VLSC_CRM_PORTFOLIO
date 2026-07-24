import Navbar from "@/features/landing/ui/Navbar";
import HeroSection from "@/features/landing/components/HeroSection";
import TrustBySection from "@/features/landing/components/TrustBySection";
import TechStackSection from "@/features/landing/components/TechStackSection";
import AboutSection from "@/features/landing/components/AboutSection";
import StatsSection from "@/features/landing/components/StatsSection";
import ExperienceSection from "@/features/landing/components/ExperienceSection";
import ProjectsSection from "@/features/landing/components/ProjectsSection";
import TestimonialsSection from "@/features/landing/components/TestimonialsSection";
import FAQSection from "@/features/landing/components/FAQSection";
import ContactSection from "@/features/landing/components/ContactSection";
import LeadModal from "@/features/landing/ui/LeadModal";
import LoadingScreen from "@/features/landing/ui/LoadingScreen";
import ScrollProgressBar from "@/features/landing/ui/ScrollProgressBar";

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
        <StatsSection />
        <ExperienceSection />
        <ProjectsSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
      </div>
    </main>
  );
}
