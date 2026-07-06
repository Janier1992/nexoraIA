"use client";

import { useState, useEffect } from "react";
import { 
  Database, 
  Calendar, 
  DollarSign, 
  Star, 
  Search, 
  Briefcase, 
  Edit3, 
  X, 
  CheckCircle,
  Trash2
} from "lucide-react";

interface Consulta {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  service: string;
  message: string;
  status: string;
  qualification: number;
  quote_amount: number;
  admin_notes: string;
}

interface DashboardModuleProps {
  token: string | null;
  onQuoteLead: (lead: { id: string; name: string; email: string; company: string | null; service: string; message: string }) => void;
}

export default function DashboardModule({ token, onQuoteLead }: DashboardModuleProps) {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [filteredConsultas, setFilteredConsultas] = useState<Consulta[]>([]);
  const [selectedConsulta, setSelectedConsulta] = useState<Consulta | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fetchingLeads, setFetchingLeads] = useState(false);

  // Campos de edición
  const [editStatus, setEditStatus] = useState("Nueva");
  const [editQualification, setEditQualification] = useState(1);
  const [editQuoteAmount, setEditQuoteAmount] = useState(0);
  const [editAdminNotes, setEditAdminNotes] = useState("");
  const [savingChanges, setSavingChanges] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [serviceFilter, setServiceFilter] = useState("todos");

  useEffect(() => {
    if (token) {
      fetchLeads();
    }
  }, [token]);

  useEffect(() => {
    let result = consultas;

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        c => 
          c.name.toLowerCase().includes(term) || 
          c.email.toLowerCase().includes(term) || 
          (c.company && c.company.toLowerCase().includes(term))
      );
    }

    if (statusFilter !== "todos") {
      result = result.filter(c => c.status === statusFilter);
    }

    if (serviceFilter !== "todos") {
      result = result.filter(c => c.service === serviceFilter);
    }

    setFilteredConsultas(result);
  }, [consultas, searchTerm, statusFilter, serviceFilter]);

  const fetchLeads = async () => {
    setFetchingLeads(true);
    try {
      const res = await fetch("/api/admin/consultas", {
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
        },
      });
      if (res.status === 401) {
        localStorage.removeItem("nexora_admin_token");
        window.location.reload();
        return;
      }
      const result = await res.json();
      if (result.success) {
        setConsultas(result.data || []);
      } else {
        console.error("Fallo al obtener solicitudes:", result.message);
      }
    } catch (err) {
      console.error("Error cargando solicitudes de la API:", err);
    } finally {
      setFetchingLeads(false);
    }
  };

  const openEditModal = (consulta: Consulta) => {
    setSelectedConsulta(consulta);
    setEditStatus(consulta.status);
    setEditQualification(consulta.qualification);
    setEditQuoteAmount(consulta.quote_amount);
    setEditAdminNotes(consulta.admin_notes || "");
    setIsEditModalOpen(true);
  };

  const handleUpdateConsulta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsulta) return;

    setSavingChanges(true);
    try {
      const res = await fetch("/api/admin/consultas/update", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          id: selectedConsulta.id,
          status: editStatus,
          qualification: editQualification,
          quote_amount: editQuoteAmount,
          admin_notes: editAdminNotes
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem("nexora_admin_token");
        window.location.reload();
        return;
      }
      const result = await res.json();
      if (result.success) {
        setIsEditModalOpen(false);
        fetchLeads();
      } else {
        alert("Fallo al actualizar: " + result.message);
      }
    } catch (err) {
      console.error("Error al actualizar la consulta:", err);
      alert("Error al conectar con el servidor.");
    } finally {
      setSavingChanges(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este registro permanentemente?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/consultas?id=${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
        }
      });

      if (res.status === 401) {
        localStorage.removeItem("nexora_admin_token");
        window.location.reload();
        return;
      }
      const result = await res.json();
      if (res.ok && result.success) {
        setConsultas(prev => prev.filter(c => c.id !== id));
      } else {
        alert("Fallo al eliminar: " + (result.error || result.message || "Error desconocido"));
      }
    } catch (err) {
      console.error("Error al eliminar la consulta:", err);
      alert("Error al conectar con el servidor.");
    }
  };

  // Cálculos estadísticos
  const totalLeads = consultas.length;
  const pendingLeads = consultas.filter(c => c.status === "Nueva").length;
  const totalQuotedValue = consultas.reduce((acc, c) => acc + (c.quote_amount || 0), 0);
  const avgQualification = totalLeads > 0 
    ? (consultas.reduce((acc, c) => acc + (c.qualification || 0), 0) / totalLeads).toFixed(1) 
    : "0.0";

  return (
    <div className="space-y-8 w-full animate-fade-in">
      {/* 1. Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-black/30 border border-white/5 rounded-2xl p-5 backdrop-blur-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Total Consultas</span>
            <h3 className="text-3xl font-extrabold text-white">{totalLeads}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center border border-violet-500/20">
            <Database size={18} />
          </div>
        </div>

        <div className="bg-black/30 border border-white/5 rounded-2xl p-5 backdrop-blur-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Leads Nuevos</span>
            <h3 className="text-3xl font-extrabold text-cyan-400">{pendingLeads}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
            <Calendar size={18} />
          </div>
        </div>

        <div className="bg-black/30 border border-white/5 rounded-2xl p-5 backdrop-blur-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Monto Cotizado</span>
            <h3 className="text-3xl font-extrabold text-emerald-400">
              ${totalQuotedValue.toLocaleString("es-CO")}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <DollarSign size={18} />
          </div>
        </div>

        <div className="bg-black/30 border border-white/5 rounded-2xl p-5 backdrop-blur-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Calificación Promedio</span>
            <h3 className="text-3xl font-extrabold text-amber-400">{avgQualification}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Star size={18} />
          </div>
        </div>
      </div>

      {/* 2. Barra de Filtros y Búsqueda */}
      <div className="bg-black/30 border border-white/5 p-5 rounded-2xl backdrop-blur-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Buscar por cliente, correo o empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-violet-500 transition-all placeholder:text-muted/50"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-violet-500"
            >
              <option value="todos">Todos</option>
              <option value="Nueva">Nueva</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Cotizada">Cotizada</option>
              <option value="Completada">Completada</option>
              <option value="Rechazada">Rechazada</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Servicio:</span>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-violet-500"
            >
              <option value="todos">Todos</option>
              <option value="tech-solutions">Tech Solutions</option>
              <option value="bi-consulting">BI Consulting</option>
              <option value="landing-pages">Landing Pages</option>
            </select>
          </div>

          <button 
            onClick={fetchLeads}
            disabled={fetchingLeads}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            {fetchingLeads ? "Actualizando..." : "Refrescar"}
          </button>
        </div>
      </div>

      {/* 3. Tabla de Resultados */}
      <div className="bg-black/30 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] font-bold uppercase tracking-wider text-muted">
                <th className="py-4 px-5">Cliente / Empresa</th>
                <th className="py-4 px-5">Servicio</th>
                <th className="py-4 px-5">Estado</th>
                <th className="py-4 px-5 text-center">Calificación</th>
                <th className="py-4 px-5 text-right">Cotización</th>
                <th className="py-4 px-5 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredConsultas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted text-xs">
                    {fetchingLeads ? "Cargando registros..." : "No se encontraron consultas registradas."}
                  </td>
                </tr>
              ) : (
                filteredConsultas.map((consulta) => (
                  <tr key={consulta.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-white">{consulta.name}</div>
                      <div className="text-xs text-muted mt-0.5">{consulta.email}</div>
                      {consulta.company && (
                        <div className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider mt-1">
                          {consulta.company}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1.5 text-xs text-foreground/80 font-medium">
                        <Briefcase size={12} className="text-violet-400" />
                        {consulta.service}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        consulta.status === "Nueva" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" :
                        consulta.status === "En Proceso" ? "bg-violet-500/10 text-violet-400 border border-violet-500/20" :
                        consulta.status === "Cotizada" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                        consulta.status === "Completada" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {consulta.status}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-center gap-0.5 text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={12} 
                            fill={star <= (consulta.qualification || 0) ? "currentColor" : "none"} 
                            className={star <= (consulta.qualification || 0) ? "text-amber-400" : "text-muted/30"}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right font-mono font-bold text-white">
                      ${(consulta.quote_amount || 0).toLocaleString("es-CO")}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => openEditModal(consulta)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-muted hover:text-white transition-all cursor-pointer"
                          title="Editar Calificación y Cotización"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => onQuoteLead({
                            id: consulta.id,
                            name: consulta.name,
                            email: consulta.email,
                            company: consulta.company,
                            service: consulta.service,
                            message: consulta.message
                          })}
                          className="p-2 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 text-violet-400 hover:text-white transition-all cursor-pointer"
                          title="Generar Cotización"
                        >
                          <DollarSign size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteLead(consulta.id)}
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-white transition-all cursor-pointer"
                          title="Eliminar Registro"
                        >
                          <Trash2 size={14} />
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

      {/* MODAL DE EDICIÓN Y GESTIÓN */}
      {isEditModalOpen && selectedConsulta && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0f19] border border-white/10 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/2">
              <div>
                <h4 className="text-md font-bold text-white">Administrar Oportunidad</h4>
                <p className="text-xs text-muted mt-0.5">Cliente: {selectedConsulta.name}</p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-muted hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdateConsulta} className="p-6 space-y-6 overflow-y-auto flex-1">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs space-y-2 relative">
                <button
                  type="button"
                  onClick={() => {
                    onQuoteLead({
                      id: selectedConsulta.id,
                      name: selectedConsulta.name,
                      email: selectedConsulta.email,
                      company: selectedConsulta.company,
                      service: selectedConsulta.service,
                      message: selectedConsulta.message
                    });
                    setIsEditModalOpen(false);
                  }}
                  className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 text-violet-300 font-bold text-[9px] uppercase tracking-wider transition-all cursor-pointer"
                  title="Crear Cotización"
                >
                  <DollarSign size={10} />
                  Cotizar
                </button>
                <div><span className="text-muted font-semibold">Correo:</span> <span className="text-white font-mono">{selectedConsulta.email}</span></div>
                {selectedConsulta.company && <div><span className="text-muted font-semibold">Empresa:</span> <span className="text-white font-bold">{selectedConsulta.company}</span></div>}
                <div><span className="text-muted font-semibold">Servicio solicitado:</span> <span className="text-violet-400 font-bold">{selectedConsulta.service}</span></div>
                <div className="pr-20"><span className="text-muted font-semibold">Mensaje:</span> <p className="text-foreground/80 mt-1 italic whitespace-pre-wrap">"{selectedConsulta.message}"</p></div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted">Estado del Lead</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-violet-500"
                >
                  <option value="Nueva">Nueva</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Cotizada">Cotizada</option>
                  <option value="Completada">Completada</option>
                  <option value="Rechazada">Rechazada</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted block">Calificación de Interés</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditQualification(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star 
                        size={22} 
                        fill={star <= editQualification ? "currentColor" : "none"} 
                        className={star <= editQualification ? "text-amber-400" : "text-muted/30"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted">Monto de Cotización Comercial ($ COP)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted">
                    <DollarSign size={16} />
                  </span>
                  <input
                    type="text"
                    value={editQuoteAmount === 0 ? "" : editQuoteAmount.toLocaleString("es-CO")}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, "");
                      setEditQuoteAmount(clean === "" ? 0 : parseInt(clean, 10));
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted">Notas de Seguimiento</label>
                <textarea
                  rows={4}
                  value={editAdminNotes}
                  onChange={(e) => setEditAdminNotes(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-violet-500 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-semibold text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingChanges}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 font-bold text-white text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savingChanges ? "Guardando..." : "Guardar Cambios"}
                  <CheckCircle size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
