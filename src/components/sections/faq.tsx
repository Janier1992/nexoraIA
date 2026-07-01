"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "¿Qué tipo de soluciones ofrece Nexora AI?",
    answer: "Ofrecemos servicios que van desde el diseño y desarrollo de landing pages de alta conversión y aplicaciones web/móviles multiplataforma, hasta tableros de consultoría en Business Intelligence y flujos de automatización integrados con Inteligencia Artificial avanzada."
  },
  {
    question: "¿Cómo se calcula el tiempo de entrega de un proyecto?",
    answer: "El tiempo depende de la complejidad de la solución: las Landing Pages demoran entre 1 a 2 semanas; las Automatizaciones Simples toman de 2 a 3 semanas; y las Plataformas Web/Móviles o Sistemas de IA a medida se desarrollan en un plazo de 6 a 12 semanas. Siempre acordamos un cronograma de entregables antes de iniciar."
  },
  {
    question: "¿Tienen planes de soporte y mantenimiento tras el lanzamiento?",
    answer: "Sí, ofrecemos contratos de soporte mensual (SLA) que garantizan monitoreo continuo, actualización de dependencias de IA, optimización de velocidad de carga y resolución inmediata de incidencias."
  },
  {
    question: "¿Pueden integrar IA en nuestros sistemas de software actuales?",
    answer: "Por supuesto. Desarrollamos integraciones nativas mediante APIs o conectores personalizados para plataformas heredadas (Legacy), CRM corporativos o bases de datos relacionales, garantizando la seguridad e integridad de la información."
  },
  {
    question: "¿Cómo funciona la consultoría inicial gratuita?",
    answer: "Es una llamada de diagnóstico de 30 minutos donde analizamos tus cuellos de botella operativos y objetivos de negocio. Te entregamos una propuesta conceptual inicial de la arquitectura recomendada sin ningún costo."
  }
];

function Accordion({ question, answer }: FAQItem) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left font-heading font-semibold text-base sm:text-lg text-white/95 hover:text-white transition-colors py-2 cursor-pointer group"
      >
        <span>{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-cyan-400 p-1.5 rounded-lg bg-white/5 border border-white/5 group-hover:border-cyan-500/20 group-hover:bg-cyan-500/5 transition-colors shrink-0"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-sm sm:text-base text-muted leading-relaxed pt-3 pb-2 pr-6">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <section 
      id="faq-section" 
      className="relative py-24 lg:py-32 z-10 border-t border-white/5 bg-background/20"
    >
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4">
            Respuestas Claras a tus Dudas
          </h2>
          <p className="text-muted text-base sm:text-lg leading-relaxed">
            Todo lo que necesitas saber sobre nuestro proceso de trabajo y tecnología.
          </p>
        </div>

        {/* Accordions List */}
        <div className="flex flex-col border-t border-white/10">
          {faqData.map((faq, index) => (
            <Accordion 
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
