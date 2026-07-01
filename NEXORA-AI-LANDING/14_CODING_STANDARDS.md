# 14 CODING STANDARDS - Nexora AI

Este documento recopila las reglas de codificación y convenciones obligatorias para el desarrollo en el espacio de trabajo de Nexora AI.

---

## 📝 Convenciones de Nomenclatura

* **Variables y Funciones**: `camelCase` (ej: `isMenuOpen`, `handleSubmitForm`).
* **Componentes y Clases**: `PascalCase` (ej: `HeroSection`, `ServiceCard`).
* **Constantes**: `UPPER_SNAKE_CASE` (ej: `MAX_UPLOAD_SIZE_MB`, `API_RETRY_LIMIT`).
* **Archivos y Carpetas**: `kebab-case` (ej: `contact-form.tsx`, `components/sections/`).

---

## 📏 Límites de Código (Mantenibilidad)

* **Límite de Archivos**: Ningún archivo de código debe superar las **500 líneas**. Si un archivo crece más, debe refactorizarse y dividirse en subcomponentes o utilidades helper.
* **Límite de Funciones/Métodos**: Ninguna función debe exceder las **50 líneas**.
* **Responsabilidad Única**: Cada componente de React debe encargarse de una única pieza lógica o visual identificable.

---

## 🛡️ Tipado Estricto (TypeScript)

* **Prohibido el uso de `any`**: Todo elemento debe tener su tipo explícito. Si un tipo es desconocido o genérico, utilizar `unknown` y realizar validación de tipos (Type Guards).
* **Interfaces y Types**: Definir estructuras de datos explícitas para las propiedades (Props) de los componentes.

```typescript
// Ejemplo de Props Tipadas
interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  tags?: string[];
}
```

---

## 🔌 Protocolo Error-First (Manejo de Errores)

Cualquier operación de red, carga de assets o envío de formularios debe estar envuelta en bloques de control de errores y proveer fallbacks visuales de contingencia:

```typescript
const submitData = async (payload: ContactPayload) => {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("Server response error");
    
    // Éxito: Modificar estado visual
  } catch (error) {
    // Registro claro de errores con etiqueta contextual
    console.error("[CONTACT_SUBMIT_ERROR]", error);
    // Fallback: Mostrar banner de error amigable al usuario
  }
};
```
