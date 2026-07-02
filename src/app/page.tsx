import Header from "@/components/sections/header";
import Hero from "@/components/sections/hero";
import Services from "@/components/sections/services";
import CaseStudies from "@/components/sections/case-studies";
import Testimonials from "@/components/sections/testimonials";
import FAQ from "@/components/sections/faq";
import Contact from "@/components/sections/contact";
import Footer from "@/components/sections/footer";
import HologramBackground from "@/components/ui/hologram-background";
import AiAgentChat from "@/components/ui/ai-agent-chat";

export default function Home() {
  return (
    <>
      {/* Absolute Hologram Background */}
      <HologramBackground />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main id="site-main" className="flex-1 w-full relative z-10">
        <Hero />
        <Services />
        <CaseStudies />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Agente de IA Flotante */}
      <AiAgentChat />
    </>
  );
}
