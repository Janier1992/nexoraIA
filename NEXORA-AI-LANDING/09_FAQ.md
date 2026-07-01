# 09 FAQ - Nexora AI

Este documento detalla el contenido y la interacción de la sección de Preguntas Frecuentes (FAQs).

---

## 📐 Layout de la Sección

* **Título**: `Respuestas Claras a tus Dudas`
* **Subtítulo**: `Todo lo que necesitas saber sobre nuestro proceso de trabajo y tecnología.`
* **Estructura**: Una lista vertical de acordeones colapsables de ancho centrado (`max-w-3xl mx-auto`).
* **Estilo**: Bordes inferiores difuminados y un indicador visual (icono Chevron `v`) que gira **180 grados** cuando el panel se expande.

---

## ❓ Preguntas y Respuestas

### 1. ¿Qué tipo de soluciones ofrece Nexora AI?
* **Respuesta**: Ofrecemos servicios que van desde el diseño y desarrollo de landing pages de alta conversión y aplicaciones web/móviles multiplataforma, hasta tableros de consultoría en Business Intelligence y flujos de automatización integrados con Inteligencia Artificial avanzada.

### 2. ¿Cómo se calcula el tiempo de entrega de un proyecto?
* **Respuesta**: El tiempo depende de la complejidad:
  - **Landing Pages**: 1 a 2 semanas.
  - **Automatizaciones Simples**: 2 a 3 semanas.
  - **Plataformas Web/Móviles o Sistemas de IA a medida**: 6 a 12 semanas.
  Definimos un cronograma claro con entregables semanales antes de iniciar.

### 3. ¿Tienen planes de soporte y mantenimiento tras el lanzamiento?
* **Respuesta**: Sí, ofrecemos contratos de soporte mensual (SLA) que garantizan monitoreo continuo, actualización de dependencias de IA, optimización de velocidad de carga y resolución inmediata de incidencias.

### 4. ¿Pueden integrar IA en nuestros sistemas de software actuales?
* **Respuesta**: Por supuesto. Desarrollamos integraciones nativas mediante APIs o conectores personalizados para plataformas heredadas (Legacy), CRM corporativos o bases de datos relacionales, garantizando la seguridad e integridad de la información.

### 5. ¿Cómo funciona la consultoría inicial gratuita?
* **Respuesta**: Es una llamada de diagnóstico de 30 minutos donde analizamos tus cuellos de botella operativos y objetivos de negocio. Te entregamos una propuesta conceptual inicial de la arquitectura recomendada sin ningún costo.

---

## ↕️ Animación del Acordeón

Para lograr una apertura fluida, controlaremos dinámicamente la altura máxima (`max-height` o `height` en Framer Motion) y la rotación del indicador:

```javascript
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function AccordionItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex justify-between items-center w-full text-left font-semibold text-lg py-2"
      >
        <span>{question}</span>
        <motion.span 
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-cyan-400"
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden text-gray-400 mt-2 leading-relaxed"
          >
            <p>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```
