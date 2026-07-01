"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote, Plus, Star, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TestimonialItem {
  id?: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  service: string;
  avatarColor?: string;
  rating?: number;
}

const staticTestimonials: TestimonialItem[] = [
  {
    name: "Carlos Mendoza",
    role: "Director de Operaciones",
    company: "LogiGlobal Inc.",
    quote: "El equipo de Nexora AI transformó por completo nuestra logística diaria. Lograron automatizar el flujo de trabajo de clasificación en tiempo récord. El retorno de inversión fue inmediato y el soporte post-lanzamiento ha sido intachable.",
    service: "Automatizaciones e Integraciones de IA",
    avatarColor: "from-cyan-400 to-blue-500"
  },
  {
    name: "Dra. Elena Rostova",
    role: "CTO",
    company: "FinVanguard",
    quote: "Nuestra base de datos transaccionales era inmensa e indescifrable. Gracias a la consultoría de BI de Nexora AI, ahora tenemos tableros interactivos que nos permiten predecir el comportamiento de pagos con total precisión.",
    service: "Consultoría en Business Intelligence (BI)",
    avatarColor: "from-violet-400 to-fuchsia-500"
  },
  {
    name: "Mateo Silva",
    role: "Fundador",
    company: "LaunchPad AI",
    quote: "No solo programaron nuestra aplicación web, sino que diseñaron una landing page que elevó nuestra tasa de conversión al 12%. El diseño premium fue clave para levantar nuestra ronda semilla de financiamiento.",
    service: "Aplicaciones Web y Landing Pages",
    avatarColor: "from-cyan-400 to-violet-500"
  }
];

const gradients = [
  "from-cyan-400 to-blue-500",
  "from-violet-400 to-fuchsia-500",
  "from-cyan-400 to-violet-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500"
];

const getRandomGradient = (name: string) => {
  const code = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
  return gradients[code % gradients.length];
};

export default function Testimonials() {
  const [dbTestimonials, setDbTestimonials] = useState<TestimonialItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 left, 1 right
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formService, setFormService] = useState("Aplicaciones Web y Landing Pages");
  const [formQuote, setFormQuote] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchApprovedTestimonials();
  }, []);

  const fetchApprovedTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonios");
      const result = await res.json();
      if (result.success && result.data) {
        setDbTestimonials(result.data);
      }
    } catch (err) {
      console.error("Error al cargar testimonios públicos:", err);
    }
  };

  const allTestimonials = [...dbTestimonials, ...staticTestimonials];

  useEffect(() => {
    if (allTestimonials.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % allTestimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex, allTestimonials.length]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 80 : -80,
      opacity: 0
    })
  };

  const handleNext = () => {
    if (allTestimonials.length <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % allTestimonials.length);
  };

  const handlePrev = () => {
    if (allTestimonials.length <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + allTestimonials.length) % allTestimonials.length);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formRole || !formCompany || !formQuote) {
      alert("Por favor completa todos los campos del formulario.");
      return;
    }

    setSubmitting(true);
    setSuccessMessage("");
    try {
      const res = await fetch("/api/testimonios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          role: formRole,
          company: formCompany,
          quote: formQuote,
          rating: formRating,
          service: formService
        })
      });

      const result = await res.json();
      if (result.success) {
        setSuccessMessage("¡Gracias! Tu calificación ha sido enviada para moderación por parte de nuestro equipo administrativo.");
        setFormName("");
        setFormRole("");
        setFormCompany("");
        setFormQuote("");
        setFormRating(5);
        setTimeout(() => {
          setShowForm(false);
          setSuccessMessage("");
        }, 5000);
      } else {
        alert("Fallo al enviar testimonio: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión al enviar el formulario.");
    } finally {
      setSubmitting(false);
    }
  };

  const activeTestimonial = allTestimonials[currentIndex] || staticTestimonials[0];
  const avatarGradient = activeTestimonial.avatarColor || getRandomGradient(activeTestimonial.name);

  return (
    <section 
      id="testimonials-section" 
      className="relative py-24 lg:py-32 z-10 border-t border-white/5 bg-background/5"
    >
      <div className="max-w-4xl mx-auto px-6 text-center relative">
        
        {/* Quote symbol */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-8 text-cyan-400">
          <Quote size={28} className="filter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
        </div>

        {/* Title */}
        <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4">
          Confianza Respaldada por Resultados
        </h2>
        <p className="text-sm text-muted mb-10 max-w-lg mx-auto">
          Descubre cómo ayudamos a startups y empresas consolidadas a automatizar y optimizar sus flujos de trabajo con IA.
        </p>

        {/* Botón para abrir el formulario */}
        <button
          onClick={() => {
            setShowForm(!showForm);
            setSuccessMessage("");
          }}
          className="mb-12 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-cyan-500/30 hover:border-cyan-500/50 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? "Cerrar Formulario" : "Dejar mi Calificación"}
        </button>

        {/* Formulario de Calificaciones (Ocultable) */}
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-left bg-black/40 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md max-w-xl mx-auto space-y-5"
          >
            <h3 className="text-md font-bold text-white tracking-wide">Calificar Nexora AI</h3>
            <p className="text-xs text-muted">Tu testimonio será verificado por el administrador antes de ser listado públicamente.</p>
            
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ej. Carlos Mendoza"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Cargo / Rol *</label>
                  <input
                    type="text"
                    required
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="Ej. Director de Operaciones"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Empresa *</label>
                  <input
                    type="text"
                    required
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="Ej. LogiGlobal Inc."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Servicio Recibido</label>
                  <select
                    value={formService}
                    onChange={(e) => setFormService(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Aplicaciones Web y Landing Pages">Aplicaciones Web y Landing Pages</option>
                    <option value="Automatizaciones e Integraciones de IA">Automatizaciones e Integraciones de IA</option>
                    <option value="Consultoría en Business Intelligence (BI)">Consultoría en Business Intelligence (BI)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted block">Calificación *</label>
                <div className="flex items-center gap-1.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      className="p-0.5 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star 
                        size={20} 
                        fill={star <= formRating ? "currentColor" : "none"} 
                        className={star <= formRating ? "text-amber-400" : "text-muted/30"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Reseña / Comentario *</label>
                <textarea
                  rows={3}
                  required
                  value={formQuote}
                  onChange={(e) => setFormQuote(e.target.value)}
                  placeholder="Describe brevemente tu experiencia con nuestro servicio..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              {successMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold text-center leading-relaxed">
                  {successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 font-bold text-white text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Enviando..." : "Enviar Calificación"}
              </button>
            </form>
          </motion.div>
        )}

        {/* Carousel Container */}
        <div className="relative min-h-[340px] sm:min-h-[260px] flex items-center justify-center overflow-hidden w-full">
          
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="premium-card p-8 sm:p-10 w-full"
            >
              {/* Quote text */}
              <p className="text-base sm:text-lg text-foreground/90 font-medium italic leading-relaxed mb-8">
                "{activeTestimonial.quote}"
              </p>

              {/* Author details */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-white/5 pt-6">
                
                {/* Generative Avatar SVG */}
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center font-heading font-bold text-white text-base shadow-[0_0_15px_rgba(0,0,0,0.3)] shrink-0`}>
                  {activeTestimonial.name.split(" ").map(n => n[0]).join("")}
                </div>

                <div className="text-center sm:text-left">
                  <div className="font-heading font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                    {activeTestimonial.name}
                    {activeTestimonial.rating && (
                      <span className="flex items-center text-amber-400 text-xs gap-0.5">
                        <Star size={10} fill="currentColor" />
                        {activeTestimonial.rating}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted mt-0.5">
                    {activeTestimonial.role} • <span className="text-white/60">{activeTestimonial.company}</span>
                  </div>
                </div>

                <div className="sm:ml-auto mt-2 sm:mt-0 shrink-0">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-cyan-300">
                    {activeTestimonial.service}
                  </span>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Slider Controls */}
        {allTestimonials.length > 1 && (
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={handlePrev}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-muted hover:text-white transition-all cursor-pointer"
              aria-label="Testimonio anterior"
            >
              <ChevronLeft size={20} />
            </button>
            
            {/* Slider Dots */}
            <div className="flex gap-2">
              {allTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-cyan-400 w-6" : "bg-white/20"
                  }`}
                  aria-label={`Ir al testimonio ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-muted hover:text-white transition-all cursor-pointer"
              aria-label="Testimonio siguiente"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
