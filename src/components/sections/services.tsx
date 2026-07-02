"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Cpu, Smartphone, Rocket, BarChart3, Zap, CheckCircle2, X } from "lucide-react";

interface ServiceItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  shortDesc: string;
  longDesc: string;
  features: string[];
  workflow: string[];
}

const servicesData: ServiceItem[] = [
  {
    id: "tech-solutions",
    icon: <Cpu className="w-8 h-8 text-violet-400" />,
    title: "Soluciones Tecnológicas",
    shortDesc: "Software a medida integrado con modelos fundacionales de Inteligencia Artificial.",
    longDesc: "Desarrollamos soluciones de software complejas integrando modelos avanzados de lenguaje y procesamiento. Diseñamos tanto el backend como el frontend, asegurando que tu infraestructura técnica soporte cargas de trabajo intensivas y sea escalable.",
    features: [
      "Integración de LLMs (GPT, Claude, Llama)",
      "Modelos de IA adaptados a tu negocio (Fine-tuning)",
      "APIs propietarias de alto rendimiento",
      "Seguridad de datos de grado empresarial"
    ],
    workflow: [
      "Fase 1: Diagnóstico técnico y diseño de arquitectura",
      "Fase 2: Entrenamiento / Ajuste de los modelos de IA",
      "Fase 3: Desarrollo de API y backend escalable",
      "Fase 4: Pruebas de carga e integración final"
    ]
  },
  {
    id: "web-mobile",
    icon: <Smartphone className="w-8 h-8 text-cyan-400" />,
    title: "Aplicaciones Web y Móviles",
    shortDesc: "Experiencias multiplataforma dinámicas, fluidas y de alto rendimiento.",
    longDesc: "Creamos aplicaciones móviles y plataformas web modernas utilizando tecnologías líderes como Next.js y React Native. Garantizamos una interfaz intuitiva con la máxima velocidad de respuesta en cualquier pantalla (iOS, Android y navegadores desktop).",
    features: [
      "Desarrollo multiplataforma (React Native)",
      "Arquitectura web moderna (Vite / Next.js)",
      "Sincronización de bases de datos en tiempo real",
      "Experiencia de usuario premium y fluida"
    ],
    workflow: [
      "Fase 1: Prototipado UX/UI y flujos de pantalla",
      "Fase 2: Maquetación frontend e integración de APIs",
      "Fase 3: Sincronización offline y notificaciones push",
      "Fase 4: Publicación en App Store, Google Play y Vercel"
    ]
  },
  {
    id: "landing-pages",
    icon: <Rocket className="w-8 h-8 text-fuchsia-400" />,
    title: "Landing Pages de Alto Impacto",
    shortDesc: "Páginas comerciales diseñadas para convertir visitas en clientes recurrentes.",
    longDesc: "Desarrollamos landing pages corporativas de tendencia visual con animaciones interactivas premium. Optimizamos cada línea de código para lograr tiempos de carga por debajo de un segundo y una estructura SEO perfecta para potenciar tus campañas de marketing.",
    features: [
      "Aesthetics Premium y Micro-animaciones",
      "Tiempos de carga inferiores a 1 segundo",
      "Optimización SEO semántica completa",
      "Integración con CRMs y analíticas"
    ],
    workflow: [
      "Fase 1: Análisis de buyer persona y objetivos de conversión",
      "Fase 2: Redacción persuasiva (Copywriting) y diseño visual",
      "Fase 3: Codificación optimizada para carga ultra-rápida",
      "Fase 4: Conexión de píxeles y analíticas de marketing"
    ]
  },
  {
    id: "bi-consulting",
    icon: <BarChart3 className="w-8 h-8 text-cyan-300" />,
    title: "Business Intelligence",
    shortDesc: "Tableros de análisis predictivo para la toma de decisiones basada en datos.",
    longDesc: "Transformamos tus bases de datos dispersas en paneles interactivos e intuitivos. Diseñamos almacenes de datos y flujos de análisis que exponen el estado financiero y operativo de tu negocio en tiempo real, permitiendo predecir tendencias clave.",
    features: [
      "Flujos de datos automatizados (ETL)",
      "Tableros interactivos e intuitivos",
      "Modelos predictivos de riesgo y ventas",
      "Reportes ejecutivos automáticos por email"
    ],
    workflow: [
      "Fase 1: Auditoría de fuentes de datos y modelado relacional",
      "Fase 2: Diseño de pipelines de extracción (ETL)",
      "Fase 3: Configuración de visualizaciones e indicadores clave (KPIs)",
      "Fase 4: Capacitación al equipo de toma de decisiones"
    ]
  },
  {
    id: "automations",
    icon: <Zap className="w-8 h-8 text-violet-300" />,
    title: "Automatizaciones de Procesos",
    shortDesc: "Eliminamos tareas repetitivas mediante flujos de trabajo inteligentes.",
    longDesc: "Conectamos las aplicaciones comerciales de tu empresa (CRM, ERP, correos, hojas de cálculo) a través de integraciones nativas y flujos automatizados estables. Desplegamos agentes autónomos de IA para atención al cliente y operaciones rutinarias.",
    features: [
      "Flujos de trabajo estables en Make, Zapier, Power Automate y N8N",
      "Conexión de APIs de plataformas cotidianas",
      "Agentes autónomos de atención por chat y mail",
      "Reducción a cero del error humano operativo"
    ],
    workflow: [
      "Fase 1: Auditoría de cuellos de botella operativos",
      "Fase 2: Mapeo y modelado lógico de los flujos de trabajo",
      "Fase 3: Implementación técnica y validación de fallos",
      "Fase 4: Puesta en marcha y monitorización de logs de error"
    ]
  }
];

export default function Services() {
  const [activeService, setActiveService] = useState<ServiceItem | null>(null);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 90, damping: 15 }
    }
  };

  return (
    <section 
      id="services-section" 
      className="relative py-24 lg:py-32 z-10"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4">
            Nuestras Soluciones de Inteligencia y Desarrollo
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            Impulsa tu negocio con tecnología de punta y automatizaciones eficientes.
          </p>
        </div>

        {/* Services Grid (3 columns desktop, centered 2 on bottom) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
        >
          {servicesData.map((service, index) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              onClick={() => setActiveService(service)}
              className={`premium-card p-8 flex flex-col justify-between cursor-pointer group ${
                index >= 3 ? "lg:col-span-1 lg:max-w-md lg:mx-auto w-full" : ""
              }`}
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-accent/40 transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="font-heading font-bold text-xl text-white mb-3 group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-6">
                  {service.shortDesc}
                </p>
              </div>
              <div className="text-xs font-semibold text-accent flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-300">
                <span>Ver detalles del flujo</span>
                <span>→</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Interactive Detailed Modal */}
        <AnimatePresence>
          {activeService && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-6 py-6">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveService(null)}
                className="absolute inset-0 bg-background/80 backdrop-blur-md"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
                className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-card border border-white/10 shadow-2xl rounded-3xl p-8 sm:p-10 z-10 text-left"
              >
                {/* Close Button */}
                <button
                  onClick={() => setActiveService(null)}
                  className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-muted hover:text-white transition-all"
                  aria-label="Cerrar"
                >
                  <X size={18} />
                </button>

                {/* Modal Header */}
                <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {activeService.icon}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-2xl text-white">
                      {activeService.title}
                    </h3>
                    <p className="text-xs text-accent font-semibold tracking-wider uppercase mt-1">
                      Servicio Nexora AI
                    </p>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Description & Features */}
                  <div>
                    <h4 className="font-heading font-semibold text-white mb-3">Descripción General</h4>
                    <p className="text-sm text-muted leading-relaxed mb-6">
                      {activeService.longDesc}
                    </p>
                    <h4 className="font-heading font-semibold text-white mb-3">Características</h4>
                    <ul className="flex flex-col gap-2.5">
                      {activeService.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2 text-sm text-muted">
                          <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Implementation Workflow */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center">
                    <h4 className="font-heading font-semibold text-white mb-4">Flujo de Trabajo del Proyecto</h4>
                    <div className="relative border-l-2 border-primary/30 pl-4 flex flex-col gap-5">
                      {activeService.workflow.map((flow) => {
                        const [fase, title] = flow.split(": ");
                        return (
                          <div key={flow} className="relative">
                            {/* Glow indicator dot */}
                            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                            <div className="text-xs font-bold text-primary tracking-wide uppercase">{fase}</div>
                            <div className="text-sm text-white font-medium mt-0.5">{title}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
