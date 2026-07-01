# 06 SERVICES SECTION - Nexora AI

Este documento especifica el diseño, el contenido y los elementos de interactividad de la sección de Servicios.

---

## 📐 Layout de la Sección

La sección de servicios se estructurará en una cuadrícula de tarjetas de vidrio flotante (Glassmorphism), destacando la diversidad de soluciones que ofrece Nexora AI.

* **Título de la Sección**: `Nuestras Soluciones de Inteligencia y Desarrollo`
* **Subtítulo**: `Impulsamos tu negocio con tecnología de punta y automatizaciones eficientes.`
* **Estructura**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`

---

## 💼 Catálogo de Servicios Detallado

### 1. Desarrollo de Soluciones Tecnológicas
* **Icono**: SVG de Red Neuronal / Conexiones.
* **Título**: `Desarrollo de Soluciones Tecnológicas`
* **Copy**: Creación de software robusto a medida integrado con modelos fundacionales de Inteligencia Artificial (GPT, Claude, Llama). Diseñamos el backend y frontend de tu infraestructura con escalabilidad garantizada.
* **Características Clave**:
  - Modelos de IA personalizados y fine-tuning.
  - APIs propietarias de alto rendimiento.
  - Integración segura de bases de datos.

### 2. Aplicaciones Web y Móviles
* **Icono**: SVG de Dispositivos Móviles / Navegador.
* **Título**: `Aplicaciones Web y Móviles`
* **Copy**: Interfaces de usuario dinámicas que enamoran a primera vista. Desarrollamos aplicaciones con React/Next.js y React Native para entregar la misma fluidez y rendimiento en web, iOS y Android.
* **Características Clave**:
  - Arquitectura moderna basada en componentes.
  - Compatibilidad nativa multiplataforma.
  - Sincronización de datos en tiempo real.

### 3. Landing Pages de Alto Impacto
* **Icono**: SVG de Cohete / Conversión.
* **Título**: `Landing Pages de Alto Impacto`
* **Copy**: Páginas de aterrizaje optimizadas para la conversión y la velocidad. Aplicamos las mejores pautas de SEO y UI/UX modernas para convertir visitas frías en clientes potenciales recurrentes.
* **Características Clave**:
  - Estética premium animada (Vibe Coding).
  - Tiempos de carga menores a 1 segundo.
  - Integración con analíticas de marketing.

### 4. Consultoría en Business Intelligence (BI)
* **Icono**: SVG de Gráfico de Barras / Inteligencia.
* **Título**: `Consultoría en Business Intelligence`
* **Copy**: Convierte datos crudos en decisiones estratégicas. Diseñamos tableros e infraestructuras de análisis predictivo y descriptivo que exponen el estado real de tu negocio en tiempo real.
* **Características Clave**:
  - ETLs y almacenes de datos optimizados.
  - Reportes interactivos de alta definición.
  - Automatización de reportes de negocio.

### 5. Automatizaciones
* **Icono**: SVG de Engranajes / Agentes.
* **Título**: `Automatizaciones de Procesos`
* **Copy**: Eliminamos las tareas repetitivas conectando tus plataformas diarias (CRM, Email, ERP) mediante flujos automatizados estables y agentes autónomos inteligentes.
* **Características Clave**:
  - Flujos Make, Zapier e integraciones nativas.
  - Agentes autónomos para atención al cliente.
  - Reducción del error operativo al 0%.

---

## ✨ Comportamiento Interactivo

* **Hover de Tarjeta**: La tarjeta seleccionada se eleva (`translateY(-8px)`) y proyecta un brillo cian en el borde inferior.
* **Detalle Expandible**: Al hacer click en una tarjeta de servicio, se abrirá un panel lateral (Drawer) o una ventana flotante (Modal) con la descripción detallada del flujo de trabajo de ese servicio.
