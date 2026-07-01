# 05 HERO SECTION - Nexora AI

Este documento detalla la estructura, el diseño visual y la especificación del contenido para la sección Hero de la landing page.

---

## 📐 Estructura de Diseño (Layout)

La sección Hero utiliza una cuadrícula de dos columnas (`grid grid-cols-1 lg:grid-cols-12`) optimizada para computadoras de escritorio y adaptada verticalmente para dispositivos móviles:

1. **Columna Izquierda (lg:col-span-7)**: Contenedor de contenido de texto.
   - Badge promocional superior: "Vanguardia en Inteligencia Artificial".
   - Título principal (`h1`) con degradado de color (Violeta a Cian).
   - Párrafo descriptivo centrado en soluciones tecnológicas y automatizaciones.
   - Fila de botones de llamada a la acción (CTA) dinámicos.
   - Datos rápidos de confianza (e.g. "Procesos optimizados", "Proyectos listos").
2. **Columna Derecha (lg:col-span-5)**: Contenedor interactivo del cerebro holográfico.
   - Este contenedor albergará la imagen animada del cerebro de IA con giros de 180° y profundidad 3D.
   - Gráficos flotantes que reaccionan sutilmente al mouse en diferentes capas (paralaje).

---

## ✍️ Textos y Copywriting

* **Badge superior**: `✨ Nexora AI • Ingeniería del Mañana`
* **Título Principal (Gradient)**:
  `Automatiza tu Éxito con Inteligencia Artificial Avanzada`
* **Subtítulo**:
  `Diseñamos e integramos soluciones tecnológicas a medida: desde aplicaciones web y móviles de alto rendimiento hasta tableros de Business Intelligence y automatizaciones complejas que liberan el potencial de tu negocio.`
* **CTA Primario**: `Agendar Consulta Gratuita` (Redirige al formulario de contacto o Calendly).
* **CTA Secundario**: `Conocer Servicios` (Desplazamiento suave a la Sección 2).

---

## 🎨 Especificación Visual del Contenedor de Fondo Holográfico

Para que la imagen cargada por el usuario (o generada) funcione como el fondo dinámico del Hero:
* **Contenedor**: Posición absoluta (`absolute inset-0`), con índice z bajo (`z-0`) para servir como fondo general o relativo a la columna derecha con índice z superior si es interactivo.
* **Máscaras de Degradado**: Se aplicarán máscaras radiales en CSS (`mask-image: radial-gradient(circle, black, transparent)`) para que los bordes de la imagen se difuminen perfectamente con el azul de espacio profundo del fondo del sitio, evitando bordes rectos.
* **Profundidad**: Sombra interna cian y violeta difuminada alrededor de la imagen para simular la proyección holográfica flotando sobre un escritorio tecnológico.
