# 10 CONTACT - Nexora AI

Este documento detalla el diseño, campos y flujos interactivos de la sección de Contacto y Agendamiento.

---

## 📐 Layout de la Sección

* **Título**: `Iniciemos el Siguiente Capítulo`
* **Subtítulo**: `Cuéntanos tu idea y diseñaremos la arquitectura de IA que necesitas.`
* **Estructura**: `grid grid-cols-1 lg:grid-cols-2 gap-16`

1. **Columna Izquierda (Detalle e Información)**:
   - Tarjeta de información de contacto: Email (`contacto@nexora.ai`), disponibilidad (Lunes a Viernes, 9:00 AM - 6:00 PM).
   - Acceso rápido a agenda digital: Enlace integrado para agendar directamente una llamada de 15 min por Calendly.
   - Ilustración digital interactiva (SVG abstracto de una interfaz holográfica).
2. **Columna Derecha (Formulario de Captura Premium)**:
   - Formulario de vidrio flotante (`.premium-card p-8`) con campos interactivos y etiquetas flotantes (Floating Labels).

---

## 📝 Especificación del Formulario

| Campo | Tipo | Requerido | Validaciones / Comportamiento |
| :--- | :--- | :--- | :--- |
| **Nombre Completo** | Texto | Sí | Mínimo 3 caracteres. |
| **Correo Electrónico** | Email | Sí | Validación de formato de correo estándar. |
| **Compañía / Proyecto**| Texto | No | Campo opcional de contexto de negocio. |
| **Servicio de Interés** | Dropdown | Sí | Opciones: Desarrollo de IA, Apps Web/Móvil, Landing Pages, BI, Automatizaciones, Otro. |
| **Cuéntanos tu idea** | Textarea | Sí | Mínimo 15 caracteres. |

---

## ⚡ Lógica de Estados del Formulario

El botón de envío debe reaccionar de forma inmediata al estado de la petición (Error-First):

1. **Estado Inactivo (Idle)**:
   - Botón habilitado, muestra el texto `Enviar Mensaje →` con gradiente activo de violeta a cian.
2. **Estado de Envío (Submitting)**:
   - Botón deshabilitado para evitar peticiones duplicadas.
   - Muestra un spinner de carga y el texto `Enviando...`.
3. **Estado de Éxito (Success)**:
   - El formulario se desvanece suavemente y se reemplaza por un contenedor de éxito.
   - Mensaje de confirmación: `¡Mensaje Recibido! Nos pondremos en contacto contigo en menos de 24 horas hábiles.`
4. **Estado de Fallo (Error)**:
   - Muestra un banner sutil con borde rojo: `Ocurrió un error de red. Por favor, intenta de nuevo o escríbenos directamente a contacto@nexora.ai`.
