"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { Settings, Lightbulb, BarChart3, FlaskConical, Cpu } from "lucide-react";

export default function HologramBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Capturar movimiento del ratón para efecto de paralaje 3D (Tilt)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 35,
        y: (e.clientY - window.innerHeight / 2) / 35,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Físicas de resorte para suavizar el movimiento del mouse
  const springConfig = { stiffness: 100, damping: 22 };
  const mouseX = useSpring(mousePosition.x, springConfig);
  const mouseY = useSpring(mousePosition.y, springConfig);

  useEffect(() => {
    mouseX.set(mousePosition.x);
    mouseY.set(mousePosition.y);
  }, [mousePosition, mouseX, mouseY]);

  return (
    <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
      {/* Fondo de imagen base con máscara radial */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: "url('/assets/images/ai_hologram_bg.png')",
          maskImage: "radial-gradient(circle at 65% 50%, black 30%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle at 65% 50%, black 30%, transparent 70%)"
        }}
      />

      {/* Degradado general para integrar el espacio profundo */}
      <div className="absolute inset-0 bg-radial-[circle_at_65%_50%] from-primary/10 via-background/40 to-background" />

      {/* Contenedor Holográfico Principal con Tilt 3D (Oculto en móvil por rendimiento y legibilidad) */}
      <motion.div 
        style={{
          x: mouseX,
          y: mouseY,
          perspective: 1200
        }}
        className="absolute w-full h-full hidden lg:flex items-center justify-end lg:pr-24"
      >
        <div className="relative w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
          
          {/* 🧠 CEREBRO VECTORIAL (Red Neuronal) con Giro Horizontal Automático y Constante */}
          <motion.div
            animate={{ 
              y: [-8, 8, -8],
              rotate: [-1.5, 1.5, -1.5]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="absolute w-full h-full flex items-center justify-center"
          >
            <svg 
              viewBox="0 0 200 200" 
              className="w-4/5 h-4/5 filter drop-shadow-[0_0_20px_rgba(6,182,212,0.65)] text-cyan-400"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.8"
            >
              {/* Central glowing background circle (breathing effect under the chip) */}
              <motion.circle 
                cx="100" 
                cy="100" 
                r="32" 
                fill="url(#brain-glow)"
                stroke="none"
                animate={{ 
                  scale: [0.9, 1.2, 0.9],
                  opacity: [0.25, 0.6, 0.25]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />

              <defs>
                <radialGradient id="brain-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgb(6, 182, 212)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="rgb(6, 182, 212)" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Base neural pathways */}
              <path d="M100,40 C60,40 40,70 40,100 C40,130 60,160 100,160 C100,160 110,135 100,120 C90,105 110,95 100,80 C90,65 100,40 100,40 Z" opacity="0.3" />
              <path d="M100,40 C140,40 160,70 160,100 C160,130 140,160 100,160 C100,160 90,135 100,120 C110,105 90,95 100,80 C110,65 100,40 100,40 Z" opacity="0.3" />
              <path d="M70,80 Q100,70 130,80" opacity="0.4" />
              <path d="M60,100 Q100,90 140,100" opacity="0.4" />
              <path d="M70,120 Q100,130 130,120" opacity="0.4" />
              <path d="M100,40 L100,160" opacity="0.4" />

              {/* ⚡ IMPULSOS ELÉCTRICOS EN MOVIMIENTO (Pinchazos de red) */}
              
              {/* Impulso 1: Contorno Izquierdo */}
              <motion.path 
                d="M100,40 C60,40 40,70 40,100 C40,130 60,160 100,160 C100,160 110,135 100,120 C90,105 110,95 100,80 C90,65 100,40 100,40 Z" 
                stroke="white"
                strokeWidth="1.2"
                strokeDasharray="15 80"
                animate={{ strokeDashoffset: [0, -95] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              />

              {/* Impulso 2: Contorno Derecho */}
              <motion.path 
                d="M100,40 C140,40 160,70 160,100 C160,130 140,160 100,160 C100,160 90,135 100,120 C110,105 90,95 100,80 C110,65 100,40 100,40 Z" 
                stroke="#a855f7"
                strokeWidth="1.2"
                strokeDasharray="20 100"
                animate={{ strokeDashoffset: [0, 120] }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              />

              {/* Impulso 3: Eje Vertical Central */}
              <motion.path 
                d="M100,40 L100,160" 
                stroke="#06b6d4"
                strokeWidth="1.4"
                strokeDasharray="10 40"
                animate={{ strokeDashoffset: [0, -50] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />

              {/* Impulso 4: Transversales horizontales */}
              <motion.path 
                d="M60,100 Q100,90 140,100" 
                stroke="white"
                strokeWidth="1.2"
                strokeDasharray="10 60"
                animate={{ strokeDashoffset: [0, 70] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              />

              {/* 🧠 NODOS SINÁPTICOS ANIMADOS (Efecto disparo de neuronas) */}
              <motion.circle 
                cx="100" cy="40" r="4.5" fill="currentColor" 
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.circle 
                cx="40" cy="100" r="4.5" fill="currentColor" 
                animate={{ scale: [1, 1.35, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              />
              <motion.circle 
                cx="160" cy="100" r="4.5" fill="currentColor" 
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              />
              <motion.circle 
                cx="100" cy="160" r="4.5" fill="currentColor" 
                animate={{ scale: [1, 1.45, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
              />
              <motion.circle 
                cx="70" cy="80" r="3.5" fill="currentColor" 
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              />
              <motion.circle 
                cx="130" cy="80" r="3.5" fill="currentColor" 
                animate={{ scale: [1, 1.35, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
              <motion.circle 
                cx="60" cy="100" r="3.5" fill="currentColor" 
                animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              />
              <motion.circle 
                cx="140" cy="100" r="3.5" fill="currentColor" 
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
              />
              <motion.circle 
                cx="70" cy="120" r="3.5" fill="currentColor" 
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              />
              <motion.circle 
                cx="130" cy="120" r="3.5" fill="currentColor" 
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              />
              
              {/* Chip central de IA */}
              <rect x="85" y="85" width="30" height="30" rx="6" fill="#02040a" stroke="currentColor" strokeWidth="1.5" />
            </svg>

            {/* Texto AI Central */}
            <div className="absolute font-heading font-black text-cyan-400 text-xl tracking-wider select-none filter drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse">
              AI
            </div>
          </motion.div>

          {/* ⚙️ ICONOS FLOTANTES ALREDEDOR (Cambian de posición, escala y rotan) */}
          
          {/* Icono 1: Engranaje (Settings) - Superior Izquierda */}
          <motion.div
            animate={{
              x: [-18, 18, -18],
              y: [-12, 18, -12],
              scale: [0.85, 1.15, 0.85],
              rotate: 360
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-8 left-8 p-3.5 bg-card/60 backdrop-blur-md border border-white/10 rounded-2xl text-violet-400 filter drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]"
          >
            <Settings size={28} />
          </motion.div>

          {/* Icono 2: Bombilla (Lightbulb) - Superior Derecha */}
          <motion.div
            animate={{
              x: [18, -18, 18],
              y: [-18, 12, -18],
              scale: [1.15, 0.85, 1.15],
              rotate: -360
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-12 right-6 p-3.5 bg-card/60 backdrop-blur-md border border-white/10 rounded-2xl text-cyan-400 filter drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]"
          >
            <Lightbulb size={28} />
          </motion.div>

          {/* Icono 3: Analítica (BarChart) - Inferior Izquierda */}
          <motion.div
            animate={{
              x: [-22, 22, -22],
              y: [18, -12, 18],
              scale: [0.9, 1.2, 0.9],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-10 left-6 p-3.5 bg-card/60 backdrop-blur-md border border-white/10 rounded-2xl text-cyan-300 filter drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]"
          >
            <BarChart3 size={28} />
          </motion.div>

          {/* Icono 4: Ciencia (FlaskConical) - Inferior Derecha */}
          <motion.div
            animate={{
              x: [22, -18, 22],
              y: [12, -22, 12],
              scale: [0.8, 1.1, 0.8],
              rotate: 30
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-14 right-8 p-3.5 bg-card/60 backdrop-blur-md border border-white/10 rounded-2xl text-violet-300 filter drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]"
          >
            <FlaskConical size={28} />
          </motion.div>

          {/* Icono 5: Microprocesador (Cpu) - Centro Inferior */}
          <motion.div
            animate={{
              x: [-8, 8, -8],
              y: [-15, 5, -15],
              scale: [0.9, 1.1, 0.9],
              rotate: 90
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-0 left-[43%] p-3 bg-card/60 backdrop-blur-md border border-white/10 rounded-2xl text-cyan-400 filter drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]"
          >
            <Cpu size={24} />
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
