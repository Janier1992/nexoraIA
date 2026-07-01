# Nexora AI - Landing Page y Portal de Administración Modular

Esta es la plataforma web comercial y el panel de administración modular de **Nexora AI**, una compañía tecnológica orientada al desarrollo de integraciones de Inteligencia Artificial (IA), consultoría en Business Intelligence (BI) y soluciones de software a medida.

El proyecto está diseñado bajo estándares modernos de alto impacto visual, animaciones interactivas fluidas, y un panel de control modular seguro e integrado con Supabase.

---

## 🛠️ Stack Tecnológico

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/), [Framer Motion](https://www.framer.com/motion/) (animaciones), [Lucide React](https://lucide.dev/) (iconos) y CSS puro (Vanilla CSS).
- **Backend**: API Routes nativas de Next.js (Route Handlers).
- **Base de Datos**: [Supabase](https://supabase.com/) (PostgreSQL) con políticas de seguridad de nivel de fila (Row Level Security - RLS).
- **Envío de Correos**: Integración con Nodemailer (SMTP Gmail/Servidor personalizado) y Resend API.

---

## 📦 Características Principales

### 1. Landing Page Comercial
- **Estética Premium**: Fondo holográfico animado con partículas en suspensión ([hologram-background.tsx](file:///c:/wamp64/www/Nexora%20AI/src/components/ui/hologram-background.tsx)), tipografías modernas, degradados neón y efectos hover.
- **Logotipo Vectorial Nexora Logo ([nexora-logo.tsx](file:///c:/wamp64/www/Nexora%20AI/src/components/ui/nexora-logo.tsx))**: Icono tridimensional animado que simula una red neuronal artificial y resplandece en el Hero.
- **Formulario de Contacto y Leads**: Registro directo de consultas comerciales en la base de datos de Supabase.
- **Carrusel de Testimonios Dinámicos**: Combina valoraciones estáticas por defecto con valoraciones aprobadas en vivo desde el panel de control.
- **Formulario de Valoraciones**: Permite a clientes reales dejar calificaciones (1-5 estrellas), empresa, cargo y reseña, ingresando de forma directa al flujo de moderación.
- **Acceso Oculto de Administración**: Activado mediante la combinación de teclas `Ctrl + Q` en la landing page para alternar la visibilidad de los accesos a `/admin`.

### 2. Panel Administrativo Modular (`/admin`)
- **Control de Acceso Híbrido**: Permite el inicio de sesión a través de cuentas configuradas en Supabase Auth o mediante la cuenta estática administrativa declarada en variables de entorno.
- **Botón "Ir al Sitio Web"**: Enlace directo en el sidebar para volver a la landing page en cualquier momento sin cerrar la sesión.
- **Navegación Modular**:
  - **Panel (Dashboard)**: Visualización y administración de leads, filtros rápidos, estadísticas clave (Total leads, leads nuevos, promedio de calificaciones), y botón directo de **"Cotizar"** para convertir un lead a propuesta comercial.
  - **Cotizaciones**: Calculadora avanzada e interactiva de presupuestos. Permite estimar horas de desarrollo, complejidad de arquitectura, integraciones de IA (Básica, Avanzada, Agente) y soporte técnico. Ofrece previsualización imprimible y envío de la cotización formateada en HTML al email del cliente de forma automatizada.
  - **Testimonios**: Tabla de moderación para revisar opiniones recibidas. Permite aprobarlas para hacerlas públicas en el carrusel de la landing page o rechazarlas. Muestra también los testimonios fijos del sistema en modo de solo lectura.
  - **Configuración**: Permite ajustar la tarifa de desarrollo/arquitectura por hora y la tasa impositiva (IVA), persistiendo estos parámetros en `localStorage` para alimentar la calculadora comercial.

---

## 📂 Estructura del Proyecto

```
Nexora AI/
├── public/                       # Activos estáticos (imágenes, SVG, iconos)
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── admin/                # Página del portal administrativo
│   │   ├── api/                  # Rutas de la API (Login, Consultas, Testimonios, Cotizaciones)
│   │   ├── globals.css           # Estilos generales y tokens de diseño
│   │   └── page.tsx              # Página principal (Landing Page)
│   ├── components/
│   │   ├── admin/                # Módulos y componentes del panel (Sidebar, Dashboard, Quotes, Testimonials, Settings)
│   │   ├── sections/             # Secciones de la Landing Page (Hero, Services, Case Studies, Testimonials, FAQ, Contact, Footer, Header)
│   │   └── ui/                   # Componentes atómicos de UI (NexoraLogo, HologramBackground)
│   └── lib/
│       └── supabase.ts           # Cliente de inicialización de Supabase
├── supabase_schema.sql           # Script SQL inicial de tablas y políticas
├── supabase_modules_setup.sql    # Script SQL de tablas e índices para testimonios y cotizaciones
├── supabase_admin_update.sql     # Script SQL con las políticas RLS para edición y eliminación de leads
├── package.json
└── README.md                     # Este manual técnico
```

---

## ⚙️ Configuración del Entorno (`.env.local`)

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Supabase Conexión
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-publica
SUPABASE_SERVICE_ROLE_KEY=tu-clave-secreta-service-role # Opcional pero recomendada para evadir RLS en el backend

# Credenciales de Respaldo del Administrador (Fallback)
ADMIN_EMAIL=admin@nexora.ai
ADMIN_PASSWORD=ContraseñaSegura123

# Configuración SMTP para Envío de Cotizaciones (Gmail u otro)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=tu-correo@gmail.com
SMTP_PASS=tu-contraseña-de-aplicación-de-gmail
SMTP_FROM="Nexora AI <tu-correo@gmail.com>"
```

---

## 💾 Inicialización de la Base de Datos en Supabase

Ejecuta los siguientes scripts en el **SQL Editor** de tu consola de Supabase en este orden para estructurar la base de datos:

1. [supabase_schema.sql](file:///c:/wamp64/www/Nexora%20AI/supabase_schema.sql): Crea la tabla principal `consultas` y habilita RLS para lecturas/escrituras públicas.
2. [supabase_modules_setup.sql](file:///c:/wamp64/www/Nexora%20AI/supabase_modules_setup.sql): Crea las tablas de `testimonios` y `cotizaciones`, agregando índices y configurando políticas RLS diferenciadas para accesos públicos y de administradores.
3. [supabase_admin_update.sql](file:///c:/wamp64/www/Nexora%20AI/supabase_admin_update.sql): Habilita las políticas RLS adicionales de `UPDATE` y `DELETE` para usuarios autenticados en el backend en caso de que no se utilice el `service_role_key`.

---

## 🚀 Instalación y Ejecución Local

1. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

2. Ejecuta el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

3. Compila el proyecto para producción:
   ```bash
   npm run build
   ```
