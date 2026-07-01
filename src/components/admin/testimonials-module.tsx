"use client";

import { useState, useEffect } from "react";
import { 
  Star, 
  Check, 
  X, 
  Clock, 
  ThumbsUp, 
  ThumbsDown 
} from "lucide-react";

interface Testimonial {
  id: string;
  created_at: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  service: string;
  status: string;
}

const staticTestimonials: Testimonial[] = [
  {
    id: "static-1",
    created_at: new Date().toISOString(),
    name: "Carlos Mendoza",
    role: "Director de Operaciones",
    company: "LogiGlobal Inc.",
    quote: "El equipo de Nexora AI transformó por completo nuestra logística diaria. Lograron automatizar el flujo de trabajo de clasificación en tiempo récord. El retorno de inversión fue inmediato y el soporte post-lanzamiento ha sido intachable.",
    service: "Automatizaciones e Integraciones de IA",
    rating: 5,
    status: "aprobado (sistema)"
  },
  {
    id: "static-2",
    created_at: new Date().toISOString(),
    name: "Dra. Elena Rostova",
    role: "CTO",
    company: "FinVanguard",
    quote: "Nuestra base de datos transaccionales era inmensa e indescifrable. Gracias a la consultoría de BI de Nexora AI, ahora tenemos tableros interactivos que nos permiten predecir el comportamiento de pagos con total precisión.",
    service: "Consultoría en Business Intelligence (BI)",
    rating: 5,
    status: "aprobado (sistema)"
  },
  {
    id: "static-3",
    created_at: new Date().toISOString(),
    name: "Mateo Silva",
    role: "Fundador",
    company: "LaunchPad AI",
    quote: "No solo programaron nuestra aplicación web, sino que diseñaron una landing page que elevó nuestra tasa de conversión al 12%. El diseño premium fue clave para levantar nuestra ronda semilla de financiamiento.",
    service: "Aplicaciones Web y Landing Pages",
    rating: 5,
    status: "aprobado (sistema)"
  }
];

interface TestimonialsModuleProps {
  token: string | null;
}

export default function TestimonialsModule({ token }: TestimonialsModuleProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [fetching, setFetching] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchTestimonials();
    }
  }, [token]);

  const fetchTestimonials = async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/admin/testimonios", {
        headers: { "Authorization": token ? `Bearer ${token}` : "" }
      });
      const result = await res.json();
      if (result.success) {
        setTestimonials(result.data || []);
      }
    } catch (err) {
      console.error("Error al cargar testimonios:", err);
    } finally {
      setFetching(false);
    }
  };

  const handleModerate = async (id: string, status: "aprobado" | "rechazado") => {
    setActionLoadingId(id);
    try {
      const res = await fetch("/api/admin/testimonios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({ id, status })
      });

      const result = await res.json();
      if (result.success) {
        setTestimonials(prev => 
          prev.map(item => item.id === id ? { ...item, status } : item)
        );
      } else {
        alert("Fallo al actualizar: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const allTestimonials = [...staticTestimonials, ...testimonials];

  return (
    <div className="space-y-8 w-full animate-fade-in">
      
      {/* Encabezado */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">Moderación de Testimonios</h2>
        <p className="text-xs text-muted mt-1">Valida, aprueba o rechaza los comentarios y valoraciones dejadas por los usuarios</p>
      </div>

      {/* Tabla/Listado */}
      <div className="bg-black/30 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] font-bold uppercase tracking-wider text-muted">
                <th className="py-4 px-5">Cliente</th>
                <th className="py-4 px-5">Servicio</th>
                <th className="py-4 px-5">Comentario / Opinión</th>
                <th className="py-4 px-5 text-center">Calificación</th>
                <th className="py-4 px-5 text-center">Estado</th>
                <th className="py-4 px-5 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {fetching ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted text-xs">Cargando comentarios...</td>
                </tr>
              ) : allTestimonials.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted text-xs">No hay testimonios registrados en el sistema.</td>
                </tr>
              ) : (
                allTestimonials.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 px-5 w-48 shrink-0">
                      <div className="font-bold text-white">{item.name}</div>
                      <div className="text-xs text-muted mt-0.5">{item.role}</div>
                      <div className="text-[10px] text-cyan-400 font-semibold uppercase mt-0.5">{item.company}</div>
                    </td>
                    <td className="py-4 px-5 w-40 shrink-0">
                      <span className="text-xs font-semibold text-foreground/80">{item.service}</span>
                    </td>
                    <td className="py-4 px-5 max-w-xs md:max-w-md">
                      <div className="text-xs text-foreground/90 italic leading-relaxed whitespace-pre-wrap">"{item.quote}"</div>
                    </td>
                    <td className="py-4 px-5 text-center w-28">
                      <div className="flex items-center justify-center gap-0.5 text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={12} 
                            fill={star <= item.rating ? "currentColor" : "none"} 
                            className={star <= item.rating ? "text-amber-400" : "text-muted/20"}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-center w-24">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === "pendiente" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                        item.status.includes("aprobado") ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {item.status === "pendiente" && <Clock size={10} />}
                        {item.status.includes("aprobado") && <Check size={10} />}
                        {item.status === "rechazado" && <X size={10} />}
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center w-32">
                      {item.id.startsWith("static-") ? (
                        <span className="text-[10px] text-muted/60 font-bold uppercase tracking-wider">Sistema</span>
                      ) : (
                        <div className="flex justify-center items-center gap-2">
                          {item.status !== "aprobado" && (
                            <button
                              onClick={() => handleModerate(item.id, "aprobado")}
                              disabled={actionLoadingId === item.id}
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 transition-all cursor-pointer"
                              title="Aprobar testimonio"
                            >
                              <ThumbsUp size={12} />
                            </button>
                          )}
                          {item.status !== "rechazado" && (
                            <button
                              onClick={() => handleModerate(item.id, "rechazado")}
                              disabled={actionLoadingId === item.id}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all cursor-pointer"
                              title="Rechazar testimonio"
                            >
                              <ThumbsDown size={12} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
