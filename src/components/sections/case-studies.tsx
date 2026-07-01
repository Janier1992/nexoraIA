"use client";

import { useEffect, useState, useRef } from "react";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface CaseStudyItem {
  id: string;
  metric: number;
  metricPrefix?: string;
  metricSuffix: string;
  metricTitle: string;
  client: string;
  niche: string;
  title: string;
  problem: string;
  solution: string;
}

const caseStudiesData: CaseStudyItem[] = [
  {
    id: "optimaflow",
    metric: 75,
    metricPrefix: "-",
    metricSuffix: "%",
    metricTitle: "Tiempo Operativo",
    client: "LogiGlobal Inc.",
    niche: "Automatización Logística",
    title: "Pipeline de Agentes de IA para Clasificación de Carga",
    problem: "Clasificación y asignación manual de rutas de entrega demoraba más de 8 horas diarias de planificación operativa.",
    solution: "Despliegue de un flujo lógico de agentes inteligentes que procesan correos y facturas en tiempo real y asignan rutas optimizadas a conductores."
  },
  {
    id: "finbi",
    metric: 90,
    metricPrefix: "+",
    metricSuffix: "%",
    metricTitle: "Velocidad de Reportes",
    client: "FinVanguard",
    niche: "Business Intelligence Financiero",
    title: "Almacén de Datos y Tablero Predictivo en Tiempo Real",
    problem: "Dispersión de registros contables en múltiples bases de datos sin visualización ejecutiva centralizada.",
    solution: "Implementación de procesos ETL automatizados y paneles interactivos integrados con analítica predictiva de riesgo de impago."
  },
  {
    id: "launchpad",
    metric: 12,
    metricSuffix: "%",
    metricTitle: "Tasa de Conversión",
    client: "LaunchPad AI",
    niche: "Aplicación Web & Landing Page",
    title: "Rediseño Premium y Onboarding en Next.js",
    problem: "Bajo ratio de registro en landing page corporativa de herramientas de redacción inteligente por IA.",
    solution: "Rediseño completo de la interfaz con animaciones interactivas premium y optimización de velocidad de carga menor a 1 segundo."
  }
];

function Counter({ 
  targetValue, 
  prefix = "", 
  suffix = "" 
}: { 
  targetValue: number; 
  prefix?: string; 
  suffix?: string; 
}) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const currentRef = elementRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const end = targetValue;
    const duration = 1500; // 1.5 seconds
    const steps = 30;
    const increment = Math.ceil(end / steps);
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [hasStarted, targetValue]);

  return (
    <span ref={elementRef} className="tabular-nums">
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

export default function CaseStudies() {
  return (
    <section 
      id="case-studies-section" 
      className="relative py-24 lg:py-32 z-10 border-t border-white/5 bg-background/20"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4">
            Impacto Real: Proyectos que Redefinen Industrias
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            Demostramos nuestro valor con resultados medibles y tecnología en producción.
          </p>
        </div>

        {/* Case Studies Stack */}
        <div className="flex flex-col gap-12">
          {caseStudiesData.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="premium-card p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              
              {/* Metric Column (lg:col-span-4) */}
              <div className="lg:col-span-4 flex flex-col justify-center items-center lg:items-start text-center lg:text-left border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
                <div className="font-heading font-black text-6xl sm:text-7xl text-cyan-400 filter drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                  <Counter 
                    targetValue={project.metric} 
                    prefix={project.metricPrefix} 
                    suffix={project.metricSuffix} 
                  />
                </div>
                <div className="text-sm font-semibold tracking-wider text-white uppercase mt-2">
                  {project.metricTitle}
                </div>
                <div className="text-xs text-muted mt-1 uppercase">
                  {project.client}
                </div>
              </div>

              {/* Copy Column (lg:col-span-8) */}
              <div className="lg:col-span-8 flex flex-col gap-4 text-left">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-violet-300">
                    {project.niche}
                  </span>
                </div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                  {project.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 text-sm leading-relaxed">
                  <div>
                    <h4 className="font-bold text-white/80 mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      El Reto / Problema
                    </h4>
                    <p className="text-muted">{project.problem}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white/80 mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      Nuestra Solución
                    </h4>
                    <p className="text-muted">{project.solution}</p>
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
