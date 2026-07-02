"use client";

import React, { useState } from "react";
import { Mail, Calendar, CheckCircle2, AlertCircle, Send, Clock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Contact() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error al escribir
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ""
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El formato de correo no es válido.";
    }
    if (!formData.service) {
      newErrors.service = "Selecciona un servicio de interés.";
    }
    if (!formData.message.trim() || formData.message.length < 15) {
      newErrors.message = "Cuéntanos más (mínimo 15 caracteres).";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("API submission failed");
      }

      setStatus("success");
      setFormData({ name: "", email: "", company: "", service: "", message: "" });
    } catch (err) {
      console.error("[CONTACT_SUBMIT_ERROR]", err);
      setStatus("error");
    }
  };

  return (
    <section 
      id="contact-section" 
      className="relative py-24 lg:py-32 z-10 border-t border-white/5 bg-background/5"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4">
            Iniciemos el Siguiente Capítulo
          </h2>
          <p className="text-muted text-base sm:text-lg leading-relaxed">
            Cuéntanos tu idea y diseñaremos la arquitectura de IA que necesitas.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Info & Calendar */}
          <div className="flex flex-col gap-8 text-left">
            <div>
              <h3 className="font-heading font-bold text-2xl text-white mb-4">
                ¿Listo para automatizar?
              </h3>
              <p className="text-muted leading-relaxed mb-6">
                Si prefieres saltarte el formulario, puedes escribirnos por correo o programar una llamada de diagnóstico gratuita directamente en nuestro calendario digital.
              </p>
            </div>

            {/* Info Cards */}
            <div className="flex flex-col gap-4">
              
              {/* Mail */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-xs text-muted uppercase font-bold tracking-wider">Correo Directo</div>
                  <a href="mailto:nexoraia2@gmail.com" className="text-sm sm:text-base font-semibold text-white hover:text-cyan-400 transition-colors">
                    nexoraia2@gmail.com
                  </a>
                </div>
              </div>

              {/* Work Hours */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="text-xs text-muted uppercase font-bold tracking-wider">Disponibilidad</div>
                  <div className="text-sm sm:text-base font-semibold text-white">
                    Lunes a Viernes, 9:00 AM - 6:00 PM
                  </div>
                </div>
              </div>

            </div>

            {/* Calendly button card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-900/20 to-cyan-900/20 border border-white/10 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-cyan-300">
                <Calendar size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Llamada de Diagnóstico</span>
              </div>
              <h4 className="font-heading font-semibold text-white text-lg">
                Agenda una sesión gratuita de 15 minutos
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                Evaluaremos tus cuellos de botella operativos y te propondremos un plan conceptual sin costo.
              </p>
              <button 
                type="button"
                onClick={() => setShowCalendar(true)}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-background font-semibold text-sm transition-all duration-300 self-start shadow-[0_0_15px_rgba(34,211,238,0.3)] cursor-pointer border-none"
              >
                <span>Ver Fechas Disponibles</span>
              </button>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="premium-card p-8 sm:p-10 text-left">
            
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center text-center py-12 animate-fade-in">
                <CheckCircle2 size={56} className="text-green-400 mb-4 filter drop-shadow-[0_0_10px_rgba(74,222,128,0.4)] animate-bounce" />
                <h3 className="font-heading font-bold text-2xl text-white mb-2">¡Mensaje Recibido!</h3>
                <p className="text-muted text-sm leading-relaxed max-w-sm">
                  Gracias por escribirnos. Nuestro equipo revisará la información y te contactará en menos de 24 horas hábiles.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                
                {status === "error" && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 animate-fade-in">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>Ocurrió un error de red. Intenta nuevamente o contáctanos por email.</span>
                  </div>
                )}

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="input-contact-name" className="text-xs font-bold text-white/80 uppercase tracking-wider">Nombre Completo *</label>
                  <input
                    type="text"
                    id="input-contact-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input-premium text-sm ${errors.name ? "border-red-500/50 focus:border-red-500" : ""}`}
                    placeholder="Ej. Juan Pérez"
                  />
                  {errors.name && <span className="text-[11px] text-red-400 mt-0.5">{errors.name}</span>}
                </div>

                {/* Email & Company */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="input-contact-email" className="text-xs font-bold text-white/80 uppercase tracking-wider">Correo Electrónico *</label>
                    <input
                      type="email"
                      id="input-contact-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`input-premium text-sm ${errors.email ? "border-red-500/50 focus:border-red-500" : ""}`}
                      placeholder="juan@empresa.com"
                    />
                    {errors.email && <span className="text-[11px] text-red-400 mt-0.5">{errors.email}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="input-contact-company" className="text-xs font-bold text-white/80 uppercase tracking-wider">Compañía / Proyecto</label>
                    <input
                      type="text"
                      id="input-contact-company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="input-premium text-sm"
                      placeholder="Ej. Nexora SA"
                    />
                  </div>
                </div>

                {/* Service Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="select-contact-service" className="text-xs font-bold text-white/80 uppercase tracking-wider">Servicio de Interés *</label>
                  <select
                    id="select-contact-service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className={`input-premium text-sm appearance-none bg-no-repeat ${
                      errors.service ? "border-red-500/50 focus:border-red-500" : ""
                    }`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                      backgroundPosition: 'right 16px center',
                      backgroundSize: '16px'
                    }}
                  >
                    <option value="" className="bg-card">Selecciona un servicio...</option>
                    <option value="tech-solutions" className="bg-card">Desarrollo de Soluciones de IA</option>
                    <option value="web-mobile" className="bg-card">Aplicaciones Web y Móviles</option>
                    <option value="landing-pages" className="bg-card">Landing Pages de Alto Impacto</option>
                    <option value="bi-consulting" className="bg-card">Consultoría en BI</option>
                    <option value="automations" className="bg-card">Automatizaciones de Procesos</option>
                    <option value="other" className="bg-card">Otro Requerimiento</option>
                  </select>
                  {errors.service && <span className="text-[11px] text-red-400 mt-0.5">{errors.service}</span>}
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="input-contact-message" className="text-xs font-bold text-white/80 uppercase tracking-wider">Cuéntanos tu idea *</label>
                  <textarea
                    id="input-contact-message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className={`input-premium text-sm resize-none ${errors.message ? "border-red-500/50 focus:border-red-500" : ""}`}
                    placeholder="Describe los objetivos de tu proyecto o los procesos que deseas automatizar..."
                  />
                  {errors.message && <span className="text-[11px] text-red-400 mt-0.5">{errors.message}</span>}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  id="btn-contact-submit"
                  disabled={status === "submitting"}
                  className="btn-primary flex items-center justify-center gap-2 mt-2 w-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {status === "submitting" ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Enviando consulta...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Enviar Mensaje</span>
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

        </div>

      </div>

      {/* Calendly Modal */}
      <AnimatePresence>
        {showCalendar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCalendar(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
              className="relative w-full max-w-4xl h-[80vh] bg-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/2">
                <div className="flex items-center gap-2 text-cyan-300">
                  <Calendar size={18} />
                  <span className="text-sm font-bold uppercase tracking-wider">Llamada de Diagnóstico</span>
                </div>
                <button
                  onClick={() => setShowCalendar(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-muted hover:text-white transition-all cursor-pointer"
                  aria-label="Cerrar"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Iframe container */}
              <div className="flex-1 w-full h-full bg-white/[0.01]">
                <iframe
                  src={`${process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/nexoraia2"}?hide_landing_page_details=1&hide_gdpr_banner=1`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="Calendly Scheduler"
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
