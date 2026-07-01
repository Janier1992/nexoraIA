# 11 SEO - Nexora AI

Este documento establece las especificaciones de optimización de motores de búsqueda (SEO) y accesibilidad para garantizar un posicionamiento orgánico óptimo.

---

## 🏷️ Metadatos y Estructura Base

### 1. Etiquetas de Encabezado HTML
* **Título (Title Tag)**: `Nexora AI | Soluciones de Inteligencia Artificial y Automatizaciones`
* **Descripción Meta**: `Impulsa tu negocio con Nexora AI. Desarrollamos soluciones tecnológicas a medida, aplicaciones web y móviles, consultoría en Business Intelligence y automatizaciones complejas.`
* **Palabras Clave (Keywords)**: `agencia inteligencia artificial, desarrollo soluciones tecnologicas, consultoria business intelligence, automatizacion de procesos, aplicaciones nextjs`

### 2. Open Graph (Redes Sociales)
* `og:title`: `Nexora AI | Soluciones de Inteligencia Artificial y Automatizaciones`
* `og:description`: `Desarrollo de software de vanguardia, aplicaciones móviles, dashboards de BI e integración de agentes de IA.`
* `og:image`: `/assets/images/og-image.jpg` (Imagen representativa que muestra la interfaz premium del cerebro de IA).
* `og:type`: `website`

---

## 🧩 Semántica HTML5 Estricta

Para facilitar la indexación y la lectura por lectores de pantalla, el marcado HTML debe seguir esta jerarquía:

```html
<header id="site-header">
  <!-- Barra de navegación con logo y enlaces semánticos <nav> -->
</header>

<main id="site-main">
  <section id="hero-section" aria-labelledby="hero-title">
    <h1 id="hero-title">...</h1>
  </section>

  <section id="services-section" aria-labelledby="services-title">
    <h2 id="services-title">...</h2>
  </section>
  
  <!-- Otras secciones estructuradas con <section> y H2 -->
</main>

<footer id="site-footer">
  <!-- Mapa del sitio simplificado, enlaces legales y copyright -->
</footer>
```

---

## 🎯 IDs Únicos para Automatización y Pruebas

Para facilitar pruebas automatizadas (Playwright, Cypress), los elementos de interacción clave deben poseer IDs únicos y descriptivos:

* Botón CTA Hero Primario: `btn-hero-cta-primary`
* Botón CTA Hero Secundario: `btn-hero-cta-secondary`
* Tarjetas de Servicio: `card-service-[servicio-id]`
* Inputs del Formulario: `input-contact-name`, `input-contact-email`, `select-contact-service`, `input-contact-message`
* Botón de Enviar Formulario: `btn-contact-submit`
