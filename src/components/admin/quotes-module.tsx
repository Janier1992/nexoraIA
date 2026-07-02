"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Plus, 
  Send, 
  Printer, 
  Trash2, 
  Calculator, 
  ChevronRight, 
  DollarSign, 
  Mail,
  CheckCircle,
  X,
  Edit3
} from "lucide-react";

interface QuoteItem {
  description: string;
  hours: number;
  rate: number;
  total: number;
}

interface Cotizacion {
  id: string;
  created_at: string;
  client_name: string;
  client_email: string;
  client_company: string | null;
  service_type: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total_amount: number;
  notes: string;
  sent_at: string | null;
  status: string;
}

interface QuotesModuleProps {
  token: string | null;
  prefilledData: {
    name: string;
    email: string;
    company: string | null;
    service: string;
    message: string;
  } | null;
  onClearPrefilled: () => void;
}

export default function QuotesModule({ token, prefilledData, onClearPrefilled }: QuotesModuleProps) {
  const [quotes, setQuotes] = useState<Cotizacion[]>([]);
  const [fetchingQuotes, setFetchingQuotes] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [selectedPrintQuote, setSelectedPrintQuote] = useState<Cotizacion | null>(null);
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);

  // Formulario Calculadora
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [serviceType, setServiceType] = useState("landing-pages");
  const [notes, setNotes] = useState("");

  // Variables de Cotización
  const [devHours, setDevHours] = useState(40);
  const [archHours, setArchHours] = useState(10);
  const [aiIntegration, setAiIntegration] = useState("none");
  const [supportTier, setSupportTier] = useState("none");

  // Tarifas comerciales (leídas de localStorage si existen)
  const [devRate, setDevRate] = useState(120000); // 120,000 COP/h
  const [archRate, setArchRate] = useState(180000); // 180,000 COP/h
  const [taxPercent, setTaxPercent] = useState(19); // 19% IVA

  const [savingQuote, setSavingQuote] = useState(false);
  const [sendingQuoteId, setSendingQuoteId] = useState<string | null>(null);

  useEffect(() => {
    // Cargar tarifas de configuración si existen
    const savedDevRate = localStorage.getItem("nexora_settings_dev_rate");
    const savedArchRate = localStorage.getItem("nexora_settings_arch_rate");
    const savedTaxPercent = localStorage.getItem("nexora_settings_tax_percent");
    if (savedDevRate) setDevRate(Number(savedDevRate));
    if (savedArchRate) setArchRate(Number(savedArchRate));
    if (savedTaxPercent) setTaxPercent(Number(savedTaxPercent));

    if (token) {
      fetchQuotes();
    }
  }, [token]);

  useEffect(() => {
    if (prefilledData) {
      setClientName(prefilledData.name);
      setClientEmail(prefilledData.email);
      setClientCompany(prefilledData.company || "");
      
      // Mapear servicio
      const service = prefilledData.service.toLowerCase();
      if (service.includes("landing") || service.includes("web") || service.includes("paginas")) {
        setServiceType("landing-pages");
      } else if (service.includes("bi") || service.includes("analytics") || service.includes("intelligence") || service.includes("datos")) {
        setServiceType("bi-consulting");
      } else {
        setServiceType("tech-solutions");
      }

      setNotes(`Propuesta comercial basada en la solicitud:\n"${prefilledData.message}"`);
      setIsCalculatorOpen(true);
      onClearPrefilled();
    }
  }, [prefilledData, onClearPrefilled]);

  const fetchQuotes = async () => {
    setFetchingQuotes(true);
    try {
      const res = await fetch("/api/admin/cotizaciones", {
        headers: { "Authorization": token ? `Bearer ${token}` : "" }
      });
      if (res.status === 401) {
        localStorage.removeItem("nexora_admin_token");
        window.location.reload();
        return;
      }
      const result = await res.json();
      if (result.success) {
        setQuotes(result.data || []);
      }
    } catch (err) {
      console.error("Error al cargar cotizaciones:", err);
    } finally {
      setFetchingQuotes(false);
    }
  };

  // Calcular ítems de la cotización en tiempo real
  const calculateItems = (): QuoteItem[] => {
    const items: QuoteItem[] = [];

    // Ítem Desarrollo
    if (devHours > 0) {
      items.push({
        description: `Desarrollo e Ingeniería de Software (${serviceType === "landing-pages" ? "Frontend & UI" : "Soluciones Core"})`,
        hours: devHours,
        rate: devRate,
        total: devHours * devRate
      });
    }

    // Ítem Arquitectura
    if (archHours > 0) {
      items.push({
        description: "Diseño UX/UI y Arquitectura de Sistemas en la Nube",
        hours: archHours,
        rate: archRate,
        total: archHours * archRate
      });
    }

    // Ítem Integración de IA
    if (aiIntegration !== "none") {
      let aiCost = 0;
      let aiDesc = "";
      if (aiIntegration === "basic") {
        aiCost = 500000;
        aiDesc = "Integración Básica con APIs de Lenguaje (Modelos OpenSource/OpenRouter)";
      } else if (aiIntegration === "advanced") {
        aiCost = 1500000;
        aiDesc = "Integración Avanzada de Modelos Inteligentes y Procesamiento RAG";
      } else if (aiIntegration === "agent") {
        aiCost = 3500000;
        aiDesc = "Desarrollo de Agente Autónomo Especializado (Multi-herramientas y RAG)";
      }

      items.push({
        description: aiDesc,
        hours: 1,
        rate: aiCost,
        total: aiCost
      });
    }

    // Ítem Soporte
    if (supportTier !== "none") {
      let supportCost = 0;
      let supportDesc = "";
      if (supportTier === "standard") {
        supportCost = 400000;
        supportDesc = "Soporte Técnico Mensual Estándar (Actualizaciones y Parches)";
      } else if (supportTier === "premium") {
        supportCost = 1000000;
        supportDesc = "Soporte Técnico Mensual Premium (Monitoreo 24/7 y SLA < 4h)";
      }

      items.push({
        description: supportDesc,
        hours: 1,
        rate: supportCost,
        total: supportCost
      });
    }

    return items;
  };

  const calculatedItems = calculateItems();
  const subtotal = calculatedItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * (taxPercent / 100);
  const totalAmount = subtotal + tax;

  const handleSaveQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail) {
      alert("Por favor completa los datos del cliente.");
      return;
    }

    setSavingQuote(true);
    try {
      const url = "/api/admin/cotizaciones";
      const method = editingQuoteId ? "PUT" : "POST";
      const body = {
        id: editingQuoteId || undefined,
        client_name: clientName,
        client_email: clientEmail,
        client_company: clientCompany || null,
        service_type: serviceType,
        items: calculatedItems,
        subtotal,
        tax,
        total_amount: totalAmount,
        notes,
        status: "Borrador"
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(body)
      });

      if (res.status === 401) {
        localStorage.removeItem("nexora_admin_token");
        window.location.reload();
        return;
      }
      const result = await res.json();
      if (result.success) {
        setIsCalculatorOpen(false);
        // Reset Form
        setClientName("");
        setClientEmail("");
        setClientCompany("");
        setNotes("");
        setDevHours(40);
        setArchHours(10);
        setAiIntegration("none");
        setSupportTier("none");
        setEditingQuoteId(null);
        fetchQuotes();
      } else {
        alert("Error al guardar: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor.");
    } finally {
      setSavingQuote(false);
    }
  };

  const handleEditClick = (quote: Cotizacion) => {
    setEditingQuoteId(quote.id);
    setClientName(quote.client_name);
    setClientEmail(quote.client_email);
    setClientCompany(quote.client_company || "");
    setServiceType(quote.service_type);
    setNotes(quote.notes || "");
    
    // Recuperar horas e integraciones de los ítems existentes
    let recoveredDevHours = 40;
    let recoveredArchHours = 10;
    let recoveredAi = "none";
    let recoveredSupport = "none";

    quote.items.forEach(item => {
      const desc = item.description.toLowerCase();
      if (desc.includes("desarrollo") || desc.includes("ingeniería") || desc.includes("ingenieria")) {
        recoveredDevHours = item.hours;
      } else if (desc.includes("arquitectura") || desc.includes("diseño") || desc.includes("diseno")) {
        recoveredArchHours = item.hours;
      } else if (desc.includes("ia") || desc.includes("inteligente") || desc.includes("agente")) {
        if (desc.includes("básica") || desc.includes("basica")) {
          recoveredAi = "basic";
        } else if (desc.includes("avanzada") || desc.includes("avanzado")) {
          recoveredAi = "advanced";
        } else if (desc.includes("agente")) {
          recoveredAi = "agent";
        }
      } else if (desc.includes("soporte")) {
        if (desc.includes("estándar") || desc.includes("estandar")) {
          recoveredSupport = "standard";
        } else if (desc.includes("premium")) {
          recoveredSupport = "premium";
        }
      }
    });

    setDevHours(recoveredDevHours);
    setArchHours(recoveredArchHours);
    setAiIntegration(recoveredAi);
    setSupportTier(recoveredSupport);
    setIsCalculatorOpen(true);
  };

  const handleSendQuote = async (id: string) => {
    setSendingQuoteId(id);
    try {
      const res = await fetch("/api/admin/cotizaciones/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({ id })
      });

      if (res.status === 401) {
        localStorage.removeItem("nexora_admin_token");
        window.location.reload();
        return;
      }
      const result = await res.json();
      if (result.success) {
        alert("Cotización despachada exitosamente por correo.");
        fetchQuotes();
      } else {
        alert("Fallo al enviar correo: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor.");
    } finally {
      setSendingQuoteId(null);
    }
  };

  const handleDeleteQuote = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta cotización? Esta acción es irreversible.")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/cotizaciones?id=${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": token ? `Bearer ${token}` : ""
        }
      });

      if (res.status === 401) {
        localStorage.removeItem("nexora_admin_token");
        window.location.reload();
        return;
      }
      const result = await res.json();
      if (result.success) {
        alert("Cotización eliminada exitosamente.");
        fetchQuotes();
      } else {
        alert("Fallo al eliminar cotización: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor para eliminar la cotización.");
    }
  };

  return (
    <div className="space-y-8 w-full animate-fade-in">
      
      {/* Encabezado del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Módulo de Cotizaciones</h2>
          <p className="text-xs text-muted mt-1">Genera propuestas y presupuestos de ingeniería para clientes potenciales</p>
        </div>
        <button
          onClick={() => setIsCalculatorOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 font-bold text-white text-xs shadow-lg shadow-violet-500/10 transition-all cursor-pointer w-fit"
        >
          <Plus size={14} />
          Nueva Cotización
        </button>
      </div>

      {/* Tabla de cotizaciones guardadas */}
      <div className="bg-black/30 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] font-bold uppercase tracking-wider text-muted">
                <th className="py-4 px-5">Cliente / Empresa</th>
                <th className="py-4 px-5">Servicio</th>
                <th className="py-4 px-5 text-right">Monto Total</th>
                <th className="py-4 px-5 text-center">Estado</th>
                <th className="py-4 px-5 text-center">Fecha Envío</th>
                <th className="py-4 px-5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {fetchingQuotes ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted text-xs">Cargando registros de cotización...</td>
                </tr>
              ) : quotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted text-xs">No hay cotizaciones registradas en el sistema.</td>
                </tr>
              ) : (
                quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-white">{quote.client_name}</div>
                      <div className="text-xs text-muted mt-0.5">{quote.client_email}</div>
                      {quote.client_company && (
                        <div className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider mt-1">{quote.client_company}</div>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <span className="text-xs font-semibold text-foreground/80">{quote.service_type}</span>
                    </td>
                    <td className="py-4 px-5 text-right font-mono font-bold text-white">
                      ${quote.total_amount.toLocaleString("es-CO")}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        quote.status === "Borrador" ? "bg-white/5 text-muted border border-white/10" :
                        quote.status === "Enviada" ? "bg-violet-500/10 text-violet-400 border border-violet-500/20" :
                        quote.status === "Aceptada" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center text-xs text-muted">
                      {quote.sent_at ? new Date(quote.sent_at).toLocaleDateString("es-CO") : "No enviada"}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleEditClick(quote)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400 border border-white/5 transition-all cursor-pointer"
                          title="Editar Cotización"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          onClick={() => handleSendQuote(quote.id)}
                          disabled={sendingQuoteId === quote.id}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-violet-400 border border-white/5 transition-all cursor-pointer disabled:opacity-50"
                          title="Enviar cotización por correo"
                        >
                          <Send size={12} className={sendingQuoteId === quote.id ? "animate-pulse" : ""} />
                        </button>
                        <button
                          onClick={() => setSelectedPrintQuote(quote)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 border border-white/5 transition-all cursor-pointer"
                          title="Ver / Imprimir Cotización"
                        >
                          <Printer size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteQuote(quote.id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-red-400 border border-white/5 transition-all cursor-pointer"
                          title="Eliminar Cotización"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CALCULADORA / MODAL DE NUEVA COTIZACIÓN */}
      {isCalculatorOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0f19] border border-white/10 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Cabecera */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  <Calculator size={18} />
                </div>
                <div>
                  <h4 className="text-md font-bold text-white">{editingQuoteId ? "Editar Cotización Comercial" : "Calculadora Comercial de Soluciones"}</h4>
                  <p className="text-xs text-muted mt-0.5">{editingQuoteId ? "Modifica los parámetros para actualizar la propuesta" : "Estima los costos de desarrollo y genera una propuesta formal"}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsCalculatorOpen(false);
                  setEditingQuoteId(null);
                  setClientName("");
                  setClientEmail("");
                  setClientCompany("");
                  setNotes("");
                  setDevHours(40);
                  setArchHours(10);
                  setAiIntegration("none");
                  setSupportTier("none");
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-muted hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Cuerpo */}
            <form onSubmit={handleSaveQuote} className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Columna Izquierda: Entradas de Formulario y Cotización */}
              <div className="space-y-5">
                <h5 className="text-xs font-bold uppercase tracking-wider text-cyan-400">1. Datos del Cliente</h5>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Nombre Cliente *</label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Ej. Juan Pérez"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Empresa / Proyecto</label>
                      <input
                        type="text"
                        value={clientCompany}
                        onChange={(e) => setClientCompany(e.target.value)}
                        placeholder="Ej. Innova Soft"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="correo@empresa.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Servicio a Cotizar</label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                    >
                      <option value="landing-pages">Aplicaciones Web y Landing Pages</option>
                      <option value="tech-solutions">Desarrollo a Medida (Tech Solutions)</option>
                      <option value="bi-consulting">Consultoría en BI & Data Analytics</option>
                    </select>
                  </div>
                </div>

                <h5 className="text-xs font-bold uppercase tracking-wider text-cyan-400 pt-3">2. Parámetros de Ingeniería</h5>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Horas de Desarrollo</label>
                      <input
                        type="text"
                        value={devHours === 0 ? "" : devHours}
                        onChange={(e) => {
                          const clean = e.target.value.replace(/\D/g, "");
                          setDevHours(clean === "" ? 0 : parseInt(clean, 10));
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Horas de Arquitectura / UX</label>
                      <input
                        type="text"
                        value={archHours === 0 ? "" : archHours}
                        onChange={(e) => {
                          const clean = e.target.value.replace(/\D/g, "");
                          setArchHours(clean === "" ? 0 : parseInt(clean, 10));
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Nivel de Integración IA</label>
                      <select
                        value={aiIntegration}
                        onChange={(e) => setAiIntegration(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                      >
                        <option value="none">Ninguna</option>
                        <option value="basic">Básica (+ $500k)</option>
                        <option value="advanced">Avanzada (+ $1.5M)</option>
                        <option value="agent">Agente Autónomo (+ $3.5M)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Soporte y Mantenimiento</label>
                      <select
                        value={supportTier}
                        onChange={(e) => setSupportTier(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                      >
                        <option value="none">Sin Soporte</option>
                        <option value="standard">Soporte Estándar (+ $400k/m)</option>
                        <option value="premium">Soporte Premium (+ $1M/m)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Vista Previa y Cálculos */}
              <div className="flex flex-col justify-between bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-6">
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4">Desglose de Cotización</h5>
                  
                  {/* Lista de Ítems */}
                  <div className="divide-y divide-white/5 text-xs">
                    {calculatedItems.map((item, index) => (
                      <div key={index} className="py-2.5 flex justify-between gap-4">
                        <div className="text-foreground/80 max-w-[70%]">
                          <div className="font-semibold text-white">{item.description}</div>
                          {item.hours > 1 && (
                            <div className="text-[10px] text-muted mt-0.5">{item.hours}h x ${item.rate.toLocaleString("es-CO")}/h</div>
                          )}
                        </div>
                        <div className="font-mono font-bold text-white text-right shrink-0">
                          ${item.total.toLocaleString("es-CO")}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Notas comerciales adicionales */}
                  <div className="space-y-1 mt-6">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Notas de la Propuesta</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Validez de la oferta, plazos de entrega..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Subtotales y Totales */}
                <div className="border-t border-white/5 pt-4 space-y-3">
                  <div className="flex justify-between text-xs text-muted">
                    <span>Subtotal:</span>
                    <span className="font-mono">${subtotal.toLocaleString("es-CO")}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted">
                    <span>IVA ({taxPercent}%):</span>
                    <span className="font-mono">${tax.toLocaleString("es-CO")}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white border-t border-white/5 pt-3">
                    <span>Total Estimado:</span>
                    <span className="font-mono text-cyan-400">${totalAmount.toLocaleString("es-CO")}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={savingQuote}
                    className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 font-bold text-white text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {savingQuote ? "Guardando..." : editingQuoteId ? "Actualizar Cotización" : "Guardar Cotización"}
                    <CheckCircle size={14} />
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE VISTA PREVIA E IMPRESIÓN */}
      {selectedPrintQuote && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 w-full max-w-3xl shadow-2xl rounded-2xl overflow-hidden max-h-[95vh] flex flex-col">
            
            {/* Controles del Modal */}
            <div className="bg-slate-100 px-6 py-4 flex items-center justify-between border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Vista de Impresión</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-all cursor-pointer"
                >
                  <Printer size={12} />
                  Imprimir
                </button>
                <button
                  onClick={() => setSelectedPrintQuote(null)}
                  className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Documento Imprimible */}
            <div className="p-8 md:p-12 overflow-y-auto flex-1 bg-white print-area" id="printable-quote">
              
              {/* Cabecera Cotización */}
              <div className="flex justify-between items-start border-b-2 border-slate-200 pb-6 mb-8">
                <div>
                  <h2 className="text-2xl font-black text-violet-700 tracking-tight">NEXORA AI</h2>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-0.5">Soluciones de Automatización e IA</p>
                </div>
                <div className="text-right">
                  <h3 className="text-lg font-bold text-slate-900">COTIZACIÓN COMERCIAL</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">Ref: {selectedPrintQuote.id.substring(0, 8).toUpperCase()}</p>
                </div>
              </div>

              {/* Datos de Cliente e Información general */}
              <div className="grid grid-cols-2 gap-8 mb-8 text-xs">
                <div>
                  <h4 className="font-bold text-slate-500 uppercase tracking-wider mb-2">Preparado Para:</h4>
                  <div className="font-bold text-slate-800 text-sm">{selectedPrintQuote.client_name}</div>
                  {selectedPrintQuote.client_company && <div className="text-slate-600 mt-0.5">{selectedPrintQuote.client_company}</div>}
                  <div className="text-slate-600 mt-0.5">{selectedPrintQuote.client_email}</div>
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-slate-500 uppercase tracking-wider mb-2">Detalles:</h4>
                  <div><span className="text-slate-500">Fecha Emisión:</span> <span className="font-medium text-slate-800">{new Date(selectedPrintQuote.created_at).toLocaleDateString("es-CO")}</span></div>
                  <div><span className="text-slate-500">Proyecto:</span> <span className="font-medium text-slate-800">{selectedPrintQuote.service_type}</span></div>
                </div>
              </div>

              {/* Tabla de Conceptos */}
              <table className="w-full border-collapse text-xs mb-8">
                <thead>
                  <tr className="border-b-2 border-slate-300 bg-slate-50 text-slate-600 font-bold uppercase">
                    <th className="py-2.5 px-3 text-left">Concepto</th>
                    <th className="py-2.5 px-3 text-center w-20">Esfuerzo</th>
                    <th className="py-2.5 px-3 text-right w-24">Tarifa</th>
                    <th className="py-2.5 px-3 text-right w-28">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {selectedPrintQuote.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-3 font-semibold text-slate-800">{item.description}</td>
                      <td className="py-3 px-3 text-center">{item.hours} h</td>
                      <td className="py-3 px-3 text-right">${item.rate.toLocaleString("es-CO")}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">${item.total.toLocaleString("es-CO")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Resumen Financiero */}
              <div className="w-64 ml-auto border-t-2 border-slate-200 pt-4 text-xs space-y-2 mb-8">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-mono">${selectedPrintQuote.subtotal.toLocaleString("es-CO")}</span>
                </div>
                <div className="flex justify-between text-slate-500 border-b border-slate-100 pb-2">
                  <span>IVA ({taxPercent}%):</span>
                  <span className="font-mono">${selectedPrintQuote.tax.toLocaleString("es-CO")}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1">
                  <span>Total General:</span>
                  <span className="font-mono text-violet-700">${selectedPrintQuote.total_amount.toLocaleString("es-CO")}</span>
                </div>
              </div>

              {/* Notas de la Propuesta */}
              {selectedPrintQuote.notes && (
                <div className="border-l-4 border-slate-300 pl-4 text-xs italic text-slate-600 mb-12">
                  <h4 className="font-bold text-slate-700 not-italic uppercase tracking-wide mb-1 text-[10px]">Notas Comerciales:</h4>
                  {selectedPrintQuote.notes.split("\n").map((line, i) => <p key={i} className="margin-0">{line}</p>)}
                </div>
              )}

              {/* Firmas */}
              <div className="grid grid-cols-2 gap-12 text-center text-[10px] text-slate-400 mt-20 pt-8 border-t border-slate-100">
                <div>
                  <div className="w-32 border-b border-slate-200 mx-auto mb-2"></div>
                  <div>Preparado Por: Nexora AI Operations</div>
                </div>
                <div>
                  <div className="w-32 border-b border-slate-200 mx-auto mb-2"></div>
                  <div>Aceptado Por: Cliente Representante</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
