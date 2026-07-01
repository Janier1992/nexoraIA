# 12 PERFORMANCE - Nexora AI

Este documento detalla las directrices de optimización de rendimiento técnico para asegurar una velocidad de carga instantánea y una experiencia fluida (Core Web Vitals excelentes).

---

## ⚡ Objetivos de Rendimiento (KPIs)

* **LCP (Largest Contentful Paint)**: < 1.5 segundos.
* **INP (Interaction to Next Paint)**: < 100 milisegundos.
* **CLS (Cumulative Layout Shift)**: 0 (Cero saltos de diseño).
* **Calificación Lighthouse**: > 95% en Rendimiento, Accesibilidad y SEO.

---

## 🖼️ Optimización de Assets y Fondo Animado

### 1. El Fondo Holográfico (Cerebro de IA)
* **Formato de la Imagen**: Convertir la imagen base del cerebro de IA a formatos modernos comprimidos: **AVIF** (preferido) o **WebP**, reduciendo el tamaño a menos de `150KB`.
* **Carga Prioritaria (LCP)**: El cerebro del Hero debe cargarse con la propiedad `priority` de Next.js para evitar retrasos en el despliegue del contenido principal.
* **Hardware Acceleration**: Asegurar que las animaciones de rotación en 180° del cerebro usen propiedades aceleradas por GPU (`transform: translate3d()` o `will-change: transform`), previniendo caídas de frames (lag) en dispositivos de gama baja.

### 2. Lazy Loading y Dynamic Imports
* **Carga diferida**: Los componentes pesados de interacción que no son visibles de inmediato (como el Carrusel de Testimonios y el Calendario de Calendly) deben importarse dinámicamente:

```javascript
import dynamic from 'next/dynamic';

const ContactCalendar = dynamic(() => import('@/components/ContactCalendar'), {
  loading: () => <div className="animate-pulse h-96 bg-white/5 rounded-2xl" />,
  ssr: false // No es necesario en el renderizado del servidor
});
```

---

## 🔤 Fuentes y Scripts de Terceros

* **Optimización de Fuentes (Next.js)**: Utilizar `next/font/google` para descargar las fuentes Outfit e Inter en tiempo de compilación y servirlas localmente desde el mismo dominio, eliminando peticiones externas de bloqueo de renderizado.
* **Scripts Asíncronos**: Las librerías de analíticas o rastreo de marketing deben cargarse utilizando el componente `<Script>` de Next.js con la estrategia `lazyOnload` o `worker` para no interrumpir el hilo principal del navegador.
