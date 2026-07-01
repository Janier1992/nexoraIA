"use client";

import { 
  LayoutDashboard, 
  FileText, 
  Star, 
  Settings, 
  LogOut,
  Globe
} from "lucide-react";
import NexoraLogo from "@/components/ui/nexora-logo";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, handleLogout }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Panel", icon: LayoutDashboard },
    { id: "quotes", label: "Cotizaciones", icon: FileText },
    { id: "testimonials", label: "Testimonios", icon: Star },
    { id: "settings", label: "Configuración", icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 bg-black/40 border-b md:border-b-0 md:border-r border-white/10 backdrop-blur-xl flex flex-col justify-between py-6 px-4 shrink-0">
      <div className="space-y-8">
        {/* Enlace para volver a la landing page */}
        <div className="px-3">
          <a
            href="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all cursor-pointer"
          >
            <Globe size={12} />
            Ir al Sitio Web
          </a>
        </div>

        {/* Branding header */}
        <div className="px-3 py-2 flex items-center gap-2.5">
          <NexoraLogo className="w-6 h-6" />
          <div>
            <div className="bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent font-black text-lg tracking-wider">
              NEXORA AI
            </div>
            <div className="text-[9px] text-muted font-bold uppercase tracking-widest mt-0.5">
              Panel de Operaciones
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/30 text-white shadow-lg shadow-violet-500/5"
                    : "text-muted hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon 
                  size={16} 
                  className={isActive ? "text-cyan-400" : "text-muted"} 
                />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="pt-6 border-t border-white/5 px-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400/80 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 transition-all cursor-pointer"
        >
          <LogOut size={14} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
