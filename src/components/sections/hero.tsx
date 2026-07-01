"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import NexoraLogo from "@/components/ui/nexora-logo";

export default function Hero() {
  return (
    <section 
      id="hero-section" 
      className="relative min-h-screen flex items-center pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden z-10"
    >
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column - Content */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left">
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-cyan-300 tracking-wide mb-6 backdrop-blur-sm"
          >
            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            <span>NEXORA AI • INGENIERÍA DEL MAÑANA</span>
          </motion.div>

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-white mb-6"
          >
            Automatiza tu Éxito con{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent filter drop-shadow-[0_2px_10px_rgba(168,85,247,0.25)]">
              Inteligencia Artificial
            </span>{" "}
            Avanzada
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg text-muted leading-relaxed mb-10 max-w-2xl"
          >
            Diseñamos e integramos soluciones tecnológicas a medida: desde aplicaciones web y móviles de alto rendimiento hasta tableros de Business Intelligence y automatizaciones complejas que liberan el potencial de tu negocio.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-14"
          >
            <a 
              id="btn-hero-cta-primary"
              href="#contact-section" 
              className="btn-primary flex items-center justify-center gap-2 group"
            >
              <span>Agendar Consulta Gratuita</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              id="btn-hero-cta-secondary"
              href="#services-section" 
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-semibold border border-white/10 hover:bg-white/5 hover:border-white/20 text-white transition-all text-center"
            >
              Conocer Servicios
            </a>
          </motion.div>

          {/* Trust stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="grid grid-cols-3 gap-6 sm:gap-10 border-t border-white/10 pt-8 max-w-xl"
          >
            <div>
              <div className="font-heading font-extrabold text-2xl sm:text-3xl text-cyan-400">-75%</div>
              <div className="text-xs text-muted mt-1 leading-snug">Tiempo Operativo</div>
            </div>
            <div>
              <div className="font-heading font-extrabold text-2xl sm:text-3xl text-violet-400">+90%</div>
              <div className="text-xs text-muted mt-1 leading-snug">Velocidad Reportes</div>
            </div>
            <div>
              <div className="font-heading font-extrabold text-2xl sm:text-3xl text-fuchsia-400">12%</div>
              <div className="text-xs text-muted mt-1 leading-snug">Tasa Conversión</div>
            </div>
          </motion.div>

        </div>

        {/* Right Column - Large Animated Logo */}
        <div className="lg:col-span-5 flex items-center justify-center pointer-events-none select-none py-10 lg:py-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -15, 0]
            }}
            transition={{ 
              opacity: { duration: 1, delay: 0.5 },
              scale: { duration: 1, delay: 0.5 },
              y: { 
                repeat: Infinity, 
                duration: 6, 
                ease: "easeInOut" 
              }
            }}
            className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80"
          >
            <NexoraLogo className="w-full h-full" glow={true} />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
