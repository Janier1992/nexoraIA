# 08 TESTIMONIALS - Nexora AI

Este documento detalla la estructura visual y lógica interactiva de la sección de Testimonios y Prueba Social.

---

## 📐 Layout de la Sección

* **Título**: `Confianza Respaldada por Resultados`
* **Subtítulo**: `Qué dicen nuestros socios estratégicos sobre trabajar con Nexora AI.`
* **Estructura**: Carrusel interactivo horizontal deslizable (`swipeable`) con botones de navegación (anterior/siguiente) e indicadores de posición inferiores (dots).
* **Estilo**: Tarjetas de cristal sutiles (`.premium-card`) con fondos de desenfoque de fondo medio y bordes degradados.

---

## 👥 Contenido de los Testimonios

### Testimonio 1
* **Nombre**: `Carlos Mendoza`
* **Puesto**: `Director de Operaciones en LogiGlobal`
* **Testimonio**: *"El equipo de Nexora AI transformó por completo nuestra logística diaria. Lograron automatizar el flujo de trabajo de clasificación en tiempo récord. El retorno de inversión fue inmediato y el soporte post-lanzamiento ha sido intachable."*
* **Servicio recibido**: `Automatizaciones e Integraciones de IA`
* **Avatar**: Patrón geométrico generativo cian/violeta de alta definición.

### Testimonio 2
* **Nombre**: `Dra. Elena Rostova`
* **Puesto**: `CTO de FinVanguard`
* **Testimonio**: *"Nuestra base de datos transaccionales era inmensa e indescifrable. Gracias a la consultoría de BI de Nexora AI, ahora tenemos tableros interactivos que nos permiten predecir el comportamiento de pagos con total precisión."*
* **Servicio recibido**: `Consultoría en Business Intelligence (BI)`
* **Avatar**: Patrón geométrico generativo violeta/rosa de alta definición.

### Testimonio 3
* **Nombre**: `Mateo Silva`
* **Puesto**: `Fundador de LaunchPad AI`
* **Testimonio**: *"No solo programaron nuestra aplicación web, sino que diseñaron una landing page que elevó nuestra tasa de conversión al 12%. El diseño premium fue clave para levantar nuestra ronda semilla de financiamiento."*
* **Servicio recibido**: `Aplicaciones Web y Landing Pages`
* **Avatar**: Patrón geométrico generativo cian/esmeralda de alta definición.

---

## 🔄 Transiciones Dinámicas (Framer Motion)

Para el carrusel, utilizaremos `AnimatePresence` para animar las tarjetas de testimonios al cambiar con una transición de desplazamiento y desvanecimiento cruzado (fade-slide):

```javascript
import { motion, AnimatePresence } from "framer-motion";

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
};
```
