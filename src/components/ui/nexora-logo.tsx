"use client";

interface NexoraLogoProps {
  className?: string;
  glow?: boolean;
}

export default function NexoraLogo({ className = "w-10 h-10", glow = true }: NexoraLogoProps) {
  return (
    <div className={`relative ${className} select-none`}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_8px_rgba(6,182,212,0.3)] hover:scale-105 transition-transform duration-300"
      >
        <defs>
          {/* Degradado principal Violeta a Cian */}
          <linearGradient id="nexoraGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" /> {/* Violeta */}
            <stop offset="50%" stopColor="#3b82f6" /> {/* Azul */}
            <stop offset="100%" stopColor="#06b6d4" /> {/* Cian */}
          </linearGradient>

          {/* Degradado secundario Cian a Rosa */}
          <linearGradient id="nexoraGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>

          {/* Filtro de Resplandor Neon */}
          {glow && (
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>

        {/* Líneas de Red y Conectividad de Fondo (Sutiles) */}
        <path 
          d="M 25,20 L 75,20 M 25,80 L 75,80 M 35,38 L 65,62 M 35,80 L 65,20" 
          stroke="rgba(255,255,255,0.06)" 
          strokeWidth="1" 
          strokeDasharray="2 2"
        />

        {/* Polígono estilizado de la letra N */}
        <path 
          d="M 25,22 L 25,78 C 25,80 26.5,80 28,78 L 36,68 L 64,22 C 65.5,20 67,20 67,22 L 67,78 C 67,80 68.5,80 70,78 L 75,72 M 25,22 L 32,28 C 33.5,30 35,30 35,32 L 35,78" 
          stroke="url(#nexoraGrad1)" 
          strokeWidth="6.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          filter={glow ? "url(#neonGlow)" : undefined}
        />

        {/* Conexión Diagonal Activa */}
        <path 
          d="M 25,22 L 75,78" 
          stroke="url(#nexoraGrad2)" 
          strokeWidth="5" 
          strokeLinecap="round"
          filter={glow ? "url(#neonGlow)" : undefined}
          className="animate-pulse"
        />

        {/* Nodos de la Red Neuronal (Círculos) */}
        <circle cx="25" cy="22" r="4.5" fill="#06b6d4" className="animate-[ping_3s_ease-in-out_infinite]" />
        <circle cx="25" cy="22" r="3.5" fill="#ffffff" />
        
        <circle cx="75" cy="78" r="4.5" fill="#7c3aed" className="animate-[ping_4s_ease-in-out_infinite]" />
        <circle cx="75" cy="78" r="3.5" fill="#ffffff" />

        <circle cx="35" cy="32" r="3" fill="#d946ef" />
        <circle cx="65" cy="68" r="3" fill="#06b6d4" />
      </svg>
    </div>
  );
}
