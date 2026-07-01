# 15 DEPLOYMENT - Nexora AI

Este documento detalla la estrategia de despliegue, configuración de entorno y el pipeline de CI/CD para producción.

---

## 🚀 Plataforma de Despliegue (Recomendada)

* **Servicio**: Vercel (Optimizado nativamente para Next.js).
* **Flujo de Integración Continua (CI/CD)**:
  - Cada push a la rama `main` activa un despliegue automático a producción.
  - Los Pull Requests generan despliegues de previsualización (Preview Deployments).

---

## 🔑 Variables de Entorno (.env)

El proyecto requiere las siguientes variables de configuración en producción:

```bash
# Integración de Agendamientos
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/nexora-ai/consultoria-llamada

# Analíticas y Métricas
NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX

# Configuración del Formulario (Si se utiliza un backend proxy)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
CONTACT_EMAIL_TARGET=contacto@nexora.ai
```

---

## 🛠️ Comandos de Build y Despliegue

La compilación y optimización estática se realiza en la plataforma con:

* **Build Command**: `npm run build`
* **Install Command**: `npm install`
* **Output Directory**: `.next`

---

## 📋 Lista de Verificación Pre-Lanzamiento (Production Checklist)

Antes de fusionar cambios a `main`, se deben pasar los siguientes controles de calidad:

1. **Compilación Limpia**: Ejecutar `npm run build` localmente y validar que no existan errores de TypeScript o Linting.
2. **Prueba de Responsividad**: Validar el diseño en breakpoints móviles (`320px`, `375px`, `414px`) y de tablet (`768px`).
3. **Control de Peso de Assets**: Asegurar que ninguna imagen en `public/` supere los `200KB`.
4. **Verificación de Enlaces**: Garantizar que todos los hipervínculos internos con scroll funcionen y no existan enlaces rotos.
5. **Funcionamiento del Formulario**: Realizar un envío de prueba y verificar el registro de errores en consola ante caídas de red simuladas.
