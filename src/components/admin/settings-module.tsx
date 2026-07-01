"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  DollarSign, 
  Percent, 
  Mail, 
  Save, 
  Check 
} from "lucide-react";

export default function SettingsModule() {
  const [devRate, setDevRate] = useState(120000);
  const [archRate, setArchRate] = useState(180000);
  const [taxPercent, setTaxPercent] = useState(19);
  const [targetEmail, setTargetEmail] = useState("nexoraia2@gmail.com");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Cargar configuraciones de localStorage si existen
    const savedDevRate = localStorage.getItem("nexora_settings_dev_rate");
    const savedArchRate = localStorage.getItem("nexora_settings_arch_rate");
    const savedTaxPercent = localStorage.getItem("nexora_settings_tax_percent");
    const savedTargetEmail = localStorage.getItem("nexora_settings_target_email");

    if (savedDevRate) setDevRate(Number(savedDevRate));
    if (savedArchRate) setArchRate(Number(savedArchRate));
    if (savedTaxPercent) setTaxPercent(Number(savedTaxPercent));
    if (savedTargetEmail) setTargetEmail(savedTargetEmail);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("nexora_settings_dev_rate", String(devRate));
    localStorage.setItem("nexora_settings_arch_rate", String(archRate));
    localStorage.setItem("nexora_settings_tax_percent", String(taxPercent));
    localStorage.setItem("nexora_settings_target_email", targetEmail);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 w-full animate-fade-in">
      
      {/* Encabezado */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">Configuración del Sistema</h2>
        <p className="text-xs text-muted mt-1">Modifica las tarifas por hora, impuestos y parámetros por defecto de tus servicios</p>
      </div>

      <form onSubmit={handleSave} className="max-w-2xl bg-black/30 border border-white/5 p-6 md:p-8 rounded-3xl backdrop-blur-sm space-y-6">
        
        {/* Tarifas de Ingeniería */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <DollarSign size={16} /> Tarifas por Hora de Ingeniería
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Tarifa de Desarrollo (COP/h)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted">$</span>
                <input
                  type="number"
                  min="0"
                  value={devRate}
                  onChange={(e) => setDevRate(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-7 pr-3 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Tarifa de Arquitectura & UX (COP/h)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted">$</span>
                <input
                  type="number"
                  min="0"
                  value={archRate}
                  onChange={(e) => setArchRate(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-7 pr-3 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Impuestos e IVA */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Percent size={16} /> Impuestos & Tributación
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted">IVA Comercial (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={taxPercent}
                onChange={(e) => setTaxPercent(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </div>

        {/* Notificaciones & SMTP */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Mail size={16} /> Notificaciones de Contacto
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Correo Receptor de Leads</label>
              <input
                type="email"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Estado del Servidor de Correo</label>
              <div className="py-2.5 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Activo (Gmail SMTP Transaccional)
              </div>
            </div>
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="flex gap-4 pt-6 border-t border-white/5">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 font-bold text-white text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            {isSaved ? (
              <>
                <Check size={14} className="text-emerald-300" />
                Configuración Guardada
              </>
            ) : (
              <>
                <Save size={14} />
                Guardar Configuración
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
