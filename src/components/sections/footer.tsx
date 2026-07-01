import NexoraLogo from "@/components/ui/nexora-logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="site-footer" className="relative py-12 border-t border-white/5 bg-background z-10 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left - Branding */}
        <div className="flex items-center gap-2">
          <NexoraLogo className="w-7 h-7" />
          <span className="font-heading font-black text-base tracking-tight text-white">
            Nexora<span className="text-accent">AI</span>
          </span>
        </div>

        {/* Center - Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6 text-muted font-medium">
          <a href="#services-section" className="hover:text-white transition-colors">Servicios</a>
          <a href="#case-studies-section" className="hover:text-white transition-colors">Casos de Éxito</a>
          <a href="#testimonials-section" className="hover:text-white transition-colors">Testimonios</a>
          <a href="#faq-section" className="hover:text-white transition-colors">FAQs</a>
          <a href="#contact-section" className="hover:text-white transition-colors">Contacto</a>
        </nav>

        {/* Right - Copyright */}
        <div className="text-muted text-center md:text-right">
          © {currentYear} Nexora AI. Todos los derechos reservados.
        </div>

      </div>
    </footer>
  );
}
