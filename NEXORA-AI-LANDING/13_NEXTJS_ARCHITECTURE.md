# 13 NEXTJS ARCHITECTURE - Nexora AI

Este documento define la estructura de directorios, la configuración del framework y la distribución de componentes para el desarrollo en **Next.js**.

---

## 📂 Estructura de Directorios del Proyecto

El andamiaje del proyecto seguirá el estándar de la carpeta `src/` y el App Router de Next.js:

```
NEXORA-AI-LANDING-CODE/
├── public/                    # Assets estáticos (imágenes, iconos, AVIF del cerebro)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Configuración global, fuentes y metadata base
│   │   ├── page.tsx           # Página principal (Une todas las secciones)
│   │   └── globals.css        # Configuración de variables HSL y clases base
│   ├── components/
│   │   ├── ui/                # Componentes atómicos reutilizables (glassmorphism)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── input.tsx
│   │   └── sections/          # Secciones independientes de la landing page
│   │       ├── header.tsx
│   │       ├── hero.tsx
│   │       ├── services.tsx
│   │       ├── case-studies.tsx
│   │       ├── testimonials.tsx
│   │       ├── faq.tsx
│   │       ├── contact.tsx
│   │       └── footer.tsx
│   ├── hooks/
│   │   └── use-mouse-position.ts # Captura la posición del cursor para el efecto tilt 3D
│   └── lib/
│       └── utils.ts           # Utilidades compartidas (cn para merge de Tailwind clases)
├── tailwind.config.ts         # Configuración de los tokens de color HSL
├── package.json
└── tsconfig.json
```

---

## ⚖️ Distribución de Componentes: Servidor vs. Cliente

Aprovechando la arquitectura híbrida de Next.js, clasificaremos los componentes de la siguiente manera para un rendimiento óptimo:

### 1. Server Components (Por Defecto)
* **globals.css**, **layout.tsx**: Cargan las fuentes y configuran la estructura HTML básica sin JavaScript en el cliente.
* **Header / Footer**: Totalmente estáticos y pre-renderizados en el servidor.
* **Services Section**: Estática en su renderizado inicial para mejorar el SEO y tiempo de carga.

### 2. Client Components (`'use client'`)
* **Hero Section**: Reequiere `'use client'` para manejar el estado del cursor, las físicas de resorte en Framer Motion y los giros de 180° del cerebro holográfico.
* **Testimonials Section**: Para el control del carrusel y las transiciones dinámicas de diapositivas.
* **FAQ Section**: Para gestionar el estado de apertura/cierre de los acordeones individuales.
* **Contact Section**: Para gestionar el estado del formulario de contacto y agendamientos.
