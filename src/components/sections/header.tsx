"use client";

import { useState, useEffect } from "react";
import { Menu, X, Settings } from "lucide-react";
import NexoraLogo from "@/components/ui/nexora-logo";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAdminLink, setShowAdminLink] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === "q" || e.key === "Q")) {
        e.preventDefault();
        setShowAdminLink(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header 
      id="site-header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-background/70 backdrop-blur-lg border-b border-white/5 py-4" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <NexoraLogo className="w-9 h-9" />
          <span className="font-heading font-black text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
            Nexora<span className="text-accent">AI</span>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#services-section" className="text-sm font-medium text-foreground/80 hover:text-white transition-colors">Servicios</a>
          <a href="#case-studies-section" className="text-sm font-medium text-foreground/80 hover:text-white transition-colors">Casos de Éxito</a>
          <a href="#testimonials-section" className="text-sm font-medium text-foreground/80 hover:text-white transition-colors">Testimonios</a>
          <a href="#faq-section" className="text-sm font-medium text-foreground/80 hover:text-white transition-colors">FAQs</a>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <div className="flex items-center gap-3">
            {showAdminLink && (
              <a 
                href="/admin" 
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium text-foreground/80 hover:text-white bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all cursor-pointer"
              >
                <Settings size={14} className="animate-[spin_4s_linear_infinite]" />
                <span>Administración</span>
              </a>
            )}
            <a 
              id="btn-header-cta"
              href="#contact-section" 
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.02)] cursor-pointer"
            >
              Agendar Consulta
            </a>
          </div>
        </div>

        {/* Mobile Admin Icon & Toggle */}
        <div className="flex items-center gap-1.5 md:hidden">
          <a 
            href="/admin" 
            className="p-2 text-foreground/80 hover:text-white transition-colors"
            title="Administración"
          >
            <Settings size={20} className="animate-[spin_4s_linear_infinite]" />
          </a>
          <button 
            onClick={toggleMenu} 
            className="p-2 text-foreground hover:text-white transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-white/5 py-6 px-6 flex flex-col gap-6 shadow-xl animate-fade-in">
          <nav className="flex flex-col gap-4">
            <a 
              href="#services-section" 
              onClick={toggleMenu}
              className="text-lg font-medium text-foreground/80 hover:text-white transition-colors"
            >
              Servicios
            </a>
            <a 
              href="#case-studies-section" 
              onClick={toggleMenu}
              className="text-lg font-medium text-foreground/80 hover:text-white transition-colors"
            >
              Casos de Éxito
            </a>
            <a 
              href="#testimonials-section" 
              onClick={toggleMenu}
              className="text-lg font-medium text-foreground/80 hover:text-white transition-colors"
            >
              Testimonios
            </a>
            <a 
              href="#faq-section" 
              onClick={toggleMenu}
              className="text-lg font-medium text-foreground/80 hover:text-white transition-colors"
            >
              FAQs
            </a>
          </nav>
          <div className="flex flex-col gap-3 w-full">
            <a 
              href="/admin"
              onClick={toggleMenu}
              className="w-full text-center py-3 rounded-xl bg-white/5 border border-white/10 font-semibold text-white text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Settings size={16} />
              Administración
            </a>
            <a 
              href="#contact-section" 
              onClick={toggleMenu}
              className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-primary to-accent font-semibold text-white text-sm cursor-pointer"
            >
              Agendar Consulta
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
