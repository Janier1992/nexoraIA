"use client";

import { useState } from "react";
import NexoraLogo from "@/components/ui/nexora-logo";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [modalType, setModalType] = useState<"terms" | "privacy" | null>(null);

  const closeModal = () => setModalType(null);

  return (
    <>
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
          <div className="text-muted text-center md:text-right space-y-1">
            <div>© {currentYear} Nexora AI. Todos los derechos reservados.</div>
            <div className="flex flex-wrap md:justify-end justify-center gap-3 text-[11px] text-muted/60 font-medium">
              <button 
                onClick={() => setModalType("terms")}
                className="hover:text-cyan-400 transition-colors bg-transparent border-none cursor-pointer p-0 font-medium text-[11px] text-muted/60"
              >
                Términos y Condiciones
              </button>
              <span>•</span>
              <button 
                onClick={() => setModalType("privacy")}
                className="hover:text-cyan-400 transition-colors bg-transparent border-none cursor-pointer p-0 font-medium text-[11px] text-muted/60"
              >
                Política de Protección de Datos
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* Modal Overlay */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative bg-slate-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 md:p-8 shadow-2xl z-10 scrollbar-thin scrollbar-thumb-white/10"
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {modalType === "terms" ? (
                <div className="text-left">
                  <h3 className="font-heading font-extrabold text-2xl text-white mb-6 pr-8 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                    Términos y Condiciones de Uso
                  </h3>
                  <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                    <p>
                      Bienvenido a <strong>Nexora AI</strong>. Al acceder y utilizar nuestro sitio web y servicios, aceptas cumplir y estar sujeto a los siguientes términos y condiciones de uso.
                    </p>
                    <div>
                      <h4 className="font-bold text-white mb-1">1. Servicios Ofrecidos</h4>
                      <p>
                        Nexora AI se especializa en consultoría tecnológica, desarrollo de software a medida, integración de inteligencia artificial y automatización de procesos de negocio.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">2. Propiedad Intelectual</h4>
                      <p>
                        Todo el contenido, diseños, logotipos, código fuente y materiales presentes en este sitio son propiedad exclusiva de Nexora AI o cuentan con las licencias correspondientes. Queda prohibida su reproducción o distribución sin autorización previa.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">3. Limitación de Responsabilidad</h4>
                      <p>
                        Trabajamos arduamente para garantizar que nuestras soluciones tecnológicas y estimaciones comerciales sean correctas. Sin embargo, Nexora AI no se hace responsable por pérdidas financieras, interrupciones operativas o fallas de terceros derivadas del uso o imposibilidad de uso de los servicios.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">4. Modificaciones en el Servicio</h4>
                      <p>
                        Nos reservamos el derecho de modificar, actualizar o discontinuar cualquier aspecto de nuestro sitio o términos de servicio en cualquier momento sin previo aviso.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">5. Contacto Legal</h4>
                      <p>
                        Para cualquier consulta relacionada con estos términos, puedes escribirnos al correo <a href="mailto:nexoraia2@gmail.com" className="text-cyan-400 hover:underline">nexoraia2@gmail.com</a>.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-left">
                  <h3 className="font-heading font-extrabold text-2xl text-white mb-6 pr-8 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                    Política de Protección de Datos Personales
                  </h3>
                  <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                    <p>
                      En <strong>Nexora AI</strong>, valoramos tu privacidad y estamos firmemente comprometidos con la protección de tus datos personales, de acuerdo con la legislación de protección de datos vigente.
                    </p>
                    <div>
                      <h4 className="font-bold text-white mb-1">1. Responsable del Tratamiento</h4>
                      <p>
                        El responsable de recopilar y tratar tus datos es el equipo de Nexora AI, con canal de soporte en <a href="mailto:nexoraia2@gmail.com" className="text-cyan-400 hover:underline">nexoraia2@gmail.com</a>.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">2. Datos Recopilados</h4>
                      <p>
                        Recopilamos la información que nos proporcionas voluntariamente en nuestro formulario de contacto (Nombre, Correo Electrónico, Empresa, Servicio de Interés y Mensaje) y durante las conversaciones interactivas con nuestro Agente de IA.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">3. Finalidad del Tratamiento</h4>
                      <p>
                        Tus datos personales serán tratados exclusivamente para responder a tus consultas, procesar solicitudes de cotización formalizada, agendar consultorías de diagnóstico técnico en Calendly y mejorar el entrenamiento de nuestro asistente virtual.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">4. Confidencialidad y Seguridad</h4>
                      <p>
                        Tus datos se procesan con total confidencialidad. Implementamos estrictas medidas de seguridad lógicas para evitar pérdidas, alteraciones o accesos no autorizados. No transferimos ni vendemos tus datos a terceros con fines publicitarios.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">5. Derechos del Titular</h4>
                      <p>
                        Tienes derecho a acceder, rectificar, cancelar u oponerte al uso de tus datos personales. Puedes solicitar el ejercicio de estos derechos enviando una solicitud formal a <a href="mailto:nexoraia2@gmail.com" className="text-cyan-400 hover:underline">nexoraia2@gmail.com</a>.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
