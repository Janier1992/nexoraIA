# 03 DESIGN SYSTEM - Nexora AI

Este documento define las variables CSS, tokens de diseño y clases de utilidad base que implementan el estilo premium de **Nexora AI**.

---

## 🎨 Paleta de Colores (Formato HSL)

La paleta se define en CSS utilizando HSL para facilitar la transparencia dinámica en las capas y bordes.

```css
:root {
  /* Temática Espacial Premium (Dark Mode por Defecto) */
  --background: 224 71% 4%;        /* Azul espacial muy oscuro */
  --foreground: 213 31% 91%;       /* Blanco azulado suave */
  
  /* Componentes y Paneles (Glassmorphism) */
  --card: 224 71% 7%;              /* Fondo de tarjetas ligeramente más claro */
  --card-border: 220 20% 15%;      /* Bordes sutiles y elegantes */
  
  /* Colores Principales de Marca */
  --primary: 263 90% 50%;          /* Violeta vibrante (Inteligencia Artificial) */
  --primary-foreground: 210 20% 98%;
  
  --accent: 190 95% 45%;           /* Cian/Turquesa eléctrico (Automatizaciones/BI) */
  --accent-foreground: 224 71% 4%;
  
  /* Estados e Indicadores */
  --muted: 215 20% 65%;            /* Texto secundario */
  --success: 142 76% 45%;          /* Verde de éxito */
  --error: 346 84% 61%;            /* Rojo de error */
}
```

---

## ✍️ Tipografía

Importar desde Google Fonts las fuentes **Outfit** (para títulos modernos) e **Inter** (para cuerpo de texto de alta legibilidad).

* **Títulos (Headings)**: Font Family: `'Outfit', sans-serif;`
  - `h1`: `font-size: 3.5rem` (mínimo), `font-weight: 800`, `letter-spacing: -0.04em`.
  - `h2`: `font-size: 2.25rem`, `font-weight: 700`, `letter-spacing: -0.02em`.
  - `h3`: `font-size: 1.5rem`, `font-weight: 600`, `letter-spacing: -0.01em`.
* **Cuerpo de texto (Body)**: Font Family: `'Inter', sans-serif;`
  - `body`: `font-size: 1rem`, `font-weight: 400`, `line-height: 1.6`.

---

## ✨ Estilo Glassmorphism (Efecto Cristal)

Para dar sensación de profundidad y tecnología, los paneles flotarán sobre el fondo animado con la clase `.premium-card`:

```css
.premium-card {
  background: rgba(hsl(var(--card)), 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
  border-radius: 20px;
}
```

---

## 🔘 Botones y Controles de Formulario

```css
/* Botón Principal */
.btn-primary {
  background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%);
  color: white;
  padding: 14px 28px;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(124, 58, 237, 0.5);
  filter: brightness(1.15);
}

/* Inputs Premium */
.input-premium {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: hsl(var(--foreground));
  padding: 12px 16px;
  border-radius: 10px;
  outline: none;
  transition: all 0.2s ease;
}

.input-premium:focus {
  border-color: hsl(var(--accent));
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.25);
  background: rgba(255, 255, 255, 0.06);
}
```
