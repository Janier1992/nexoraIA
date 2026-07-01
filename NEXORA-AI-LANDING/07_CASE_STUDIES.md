# 07 CASE STUDIES - Nexora AI

Este documento especifica la estructura y contenido de la sección de Casos de Estudio (Casos de Éxito) y cómo exponer las métricas de impacto de Nexora AI.

---

## 📐 Layout de la Sección

* **Título**: `Impacto Real: Proyectos que Redefinen Industrias`
* **Subtítulo**: `Demostramos nuestro valor con resultados medibles y tecnología en producción.`
* **Estructura**: Un diseño de alternancia horizontal (`flex flex-col lg:flex-row gap-12`) o tarjetas asimétricas interactivas de gran formato.

---

## 📊 Casos de Éxito Seleccionados

### Caso 1: OptimaFlow (Automatización Logística)
* **Cliente**: Corporación de Distribución Multiorigen.
* **Problema**: Tiempos excesivos en la clasificación y asignación manual de rutas de entrega.
* **Solución**: Un pipeline de agentes autónomos de IA que interpretan correos, facturas y asignan rutas optimizadas en tiempo real.
* **Métrica Clave**: **-75% de Tiempo Operativo** (Reducción de 8 horas a menos de 2 horas de planificación diaria).
* **Elemento Visual**: Panel interactivo con gráfico SVG que simula el flujo de clasificación y las rutas generadas.

### Caso 2: FinBI Dashboard (Business Intelligence Financiero)
* **Cliente**: Fintech de Préstamos Digitales.
* **Problema**: Dispersión de datos de transacciones en múltiples bases de datos sin visualización centralizada.
* **Solución**: ETL optimizada y tablero de BI interactivo en tiempo real con capacidades predictivas de riesgo de impago.
* **Métrica Clave**: **+90% en Velocidad de Reportes** (Informes ejecutivos listos en un click, antes demoraban 5 días hábiles).
* **Elemento Visual**: Mockup del dashboard interactivo con gráficos circulares y de líneas con animaciones al pasar el cursor.

### Caso 3: LaunchPad SaaS (Aplicación Web & Landing Page)
* **Cliente**: Startup de IA Generativa para Copywriting.
* **Problema**: Baja conversión en su web inicial y falta de un flujo de onboarding intuitivo.
* **Solución**: Rediseño completo de la landing page con estética premium y desarrollo de la aplicación web interna con pasarela de pagos integrada.
* **Métrica Clave**: **12% Tasa de Conversión** (Superando el promedio de la industria del 3%).
* **Elemento Visual**: Simulación de la aplicación web y captura de la landing page con animaciones de paralaje.

---

## 🔢 Lógica de Contadores Dinámicos

Para las métricas (`75%`, `90%`, `12%`), implementaremos un efecto de cuenta progresiva (CountUp) cuando la sección entre en el viewport del usuario:

```javascript
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export function Counter({ targetValue, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = parseInt(targetValue, 10);
      const incrementTime = Math.abs(Math.floor(duration / end));
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);
      
      return () => clearInterval(timer);
    }
  }, [inView, targetValue, duration]);

  return <span ref={ref}>{count}</span>;
}
```
