"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Sparkles, AlertTriangle, Calendar, RefreshCw } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AiAgentChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "¡Hola! Soy **NexoBot**, el agente de Inteligencia Artificial de **Nexora AI**. Estoy aquí para ayudarte a resolver tus dudas sobre nuestros servicios de desarrollo de software, IA y automatizaciones. ¿En qué te puedo asesorar hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(true);
  const [showConfigAlert, setShowConfigAlert] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final cuando llegan mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Preguntas sugeridas para facilitar la interacción
  const suggestedQuestions = [
    "¿Qué servicios ofrecen?",
    "¿Cómo agendar un diagnóstico?",
    "¿Qué tecnologías usan?",
    "¿Hacen automatizaciones?",
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setShowConfigAlert(false);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "API_KEY_NOT_CONFIGURED") {
          setApiKeyConfigured(false);
          setShowConfigAlert(true);
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "⚠️ **Configuración Requerida**: La clave de API de Gemini no está configurada o posee el valor predeterminado en el archivo `.env.local` del servidor.",
            },
          ]);
        } else {
          throw new Error(data.error || "Ocurrió un error al procesar el mensaje.");
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      }
    } catch (error) {
      console.error("[CHAT_ERROR]", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Disculpa, ha ocurrido un error al conectar con mis sistemas. Por favor, inténtalo nuevamente más tarde o ponte en contacto directo con nuestro equipo.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  // Función para renderizar markdown básico en el chat (negritas, enlaces)
  const formatMessageContent = (text: string) => {
    // Reemplaza **texto** con <strong>texto</strong>
    let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    
    // Reemplaza enlaces [texto](url)
    formatted = formatted.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank" class="text-cyan-400 hover:text-cyan-300 underline font-semibold transition-colors">$1</a>'
    );

    // Reemplaza saltos de línea con <br />
    formatted = formatted.replace(/\n/g, "<br />");

    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  return (
    <>
      {/* Botón Flotante */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-[0_4px_20px_rgba(124,58,237,0.4)] hover:shadow-[0_4px_30px_rgba(124,58,237,0.7)] hover:border-white/20 border border-transparent transition-shadow duration-300 focus:outline-none cursor-pointer"
          aria-label="Abrir chat de soporte de IA"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close-icon"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat-icon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <Sparkles className="w-6 h-6 animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
          {/* Indicador de notificación inicial */}
          {!isOpen && messages.length === 1 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full animate-bounce" />
          )}
        </motion.button>
      </div>

      {/* Ventana de Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 w-[400px] max-w-[calc(100vw-2rem)] h-[550px] z-50 rounded-2xl flex flex-col overflow-hidden bg-slate-950/95 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          >
            {/* Cabecera del Chat */}
            <div className="p-4 bg-gradient-to-r from-violet-950/40 to-cyan-950/40 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-inner">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-white tracking-wide flex items-center gap-1.5">
                    NexoBot
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
                  </h4>
                  <span className="text-[11px] text-slate-400">Asistente Virtual IA</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Listado de Mensajes */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-violet-600 text-white rounded-tr-none"
                        : "bg-white/5 border border-white/10 text-slate-100 rounded-tl-none"
                    }`}
                  >
                    {formatMessageContent(msg.content)}
                  </div>
                </div>
              ))}

              {/* Indicador de Carga */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  </div>
                </div>
              )}

              {/* Alerta de Clave de API no Configurada */}
              {showConfigAlert && !apiKeyConfigured && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex gap-3 text-amber-200 text-xs">
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                  <div className="space-y-1">
                    <span className="font-bold">Acción Requerida en Servidor:</span>
                    <p className="leading-relaxed">
                      Asegúrate de agregar la variable de entorno <code className="bg-amber-500/20 px-1 py-0.5 rounded text-white font-mono">GEMINI_API_KEY</code> en tu archivo <code className="bg-amber-500/20 px-1 py-0.5 rounded text-white font-mono">.env.local</code> y reiniciar tu servidor de desarrollo con <code className="bg-amber-500/20 px-1 py-0.5 rounded text-white font-mono">npm run dev</code> para comenzar a usar el chat.
                    </p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Sugerencias Rápidas */}
            {messages.length === 1 && !isLoading && (
              <div className="px-4 py-2 bg-slate-950/20 border-t border-white/5">
                <span className="text-[11px] text-slate-500 block mb-2 font-semibold uppercase tracking-wider">Preguntas Sugeridas:</span>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(q)}
                      className="text-xs bg-white/5 hover:bg-violet-600/20 border border-white/10 hover:border-violet-500/40 text-slate-300 hover:text-white px-3 py-1.5 rounded-full transition-all duration-200 text-left cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Formulario de Entrada */}
            <form
              onSubmit={handleFormSubmit}
              className="p-3 bg-slate-950 border-t border-white/10 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white hover:shadow-[0_0_12px_rgba(124,58,237,0.5)] transition-all duration-200 disabled:opacity-40 disabled:hover:shadow-none cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Calendly / Footer rápido */}
            <div className="bg-slate-950 px-4 pb-2 pt-0.5 border-t border-white/5 text-[10px] text-center text-slate-500 flex justify-between items-center">
              <span>NexoBot v1.0 • Nexora AI</span>
              <a
                href="https://calendly.com/nexoraia2/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300 flex items-center gap-1 font-semibold transition-colors"
              >
                <Calendar className="w-3 h-3" />
                Agendar Diagnóstico
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
