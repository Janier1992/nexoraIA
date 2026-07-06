"use client";

import { useState, useEffect } from "react";
import { Settings, User, Lock, ChevronRight, Globe } from "lucide-react";
import Sidebar from "@/components/admin/sidebar";
import DashboardModule from "@/components/admin/dashboard-module";
import QuotesModule from "@/components/admin/quotes-module";
import TestimonialsModule from "@/components/admin/testimonials-module";
import SettingsModule from "@/components/admin/settings-module";

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [prefilledQuote, setPrefilledQuote] = useState<{
    id: string;
    name: string;
    email: string;
    company: string | null;
    service: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    // Recuperar sesión si existe
    const savedToken = localStorage.getItem("nexora_admin_token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        localStorage.setItem("nexora_admin_token", result.token);
        setToken(result.token);
      } else {
        setLoginError(result.message || "Credenciales incorrectas.");
      }
    } catch (err) {
      setLoginError("Ocurrió un error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("nexora_admin_token");
    setToken(null);
    setEmailInput("");
    setPasswordInput("");
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-[#030712] text-foreground font-sans relative overflow-hidden flex flex-col justify-between">
      {/* Luces de fondo decorativas */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none" />

      {!token ? (
        /* FORMULARIO DE LOGIN */
        <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
          <div className="max-w-md w-full bg-black/40 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/25">
                <Settings size={22} className="text-white animate-[spin_6s_linear_infinite]" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide">Acceso Administrativo</h2>
              <p className="text-xs text-muted mt-2">Ingresa tus credenciales de Nexora AI para continuar</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted">Correo Electrónico</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted">
                    <User size={16} />
                  </span>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="nombre@empresa.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-violet-500 focus:outline-none transition-all placeholder:text-muted/60"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted">Contraseña</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-violet-500 focus:outline-none transition-all placeholder:text-muted/60"
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 font-bold text-white text-sm shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? "Iniciando..." : "Acceder al Panel"}
                <ChevronRight size={16} />
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 flex flex-col items-center">
              <a
                href="/"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all cursor-pointer"
              >
                <Globe size={14} />
                Volver a la Landing Page
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* DASHBOARD CON MENÚ LATERAL MODULAR */
        <div className="flex-1 flex flex-col md:flex-row relative z-10 w-full">
          {/* Menú Lateral */}
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            handleLogout={handleLogout} 
          />

          {/* Área de Contenido del Módulo */}
          <div className="flex-1 p-6 md:p-10 overflow-y-auto md:max-h-[100vh] pb-24 md:pb-10">
            {activeTab === "dashboard" && (
              <DashboardModule 
                token={token} 
                onQuoteLead={(leadData) => {
                  setPrefilledQuote({
                    id: leadData.id,
                    name: leadData.name,
                    email: leadData.email,
                    company: leadData.company,
                    service: leadData.service,
                    message: leadData.message
                  });
                  setActiveTab("quotes");
                }}
              />
            )}
            {activeTab === "quotes" && (
              <QuotesModule 
                token={token} 
                prefilledData={prefilledQuote}
                onClearPrefilled={() => setPrefilledQuote(null)}
              />
            )}
            {activeTab === "testimonials" && <TestimonialsModule token={token} />}
            {activeTab === "settings" && <SettingsModule />}
          </div>
        </div>
      )}


    </main>
  );
}
