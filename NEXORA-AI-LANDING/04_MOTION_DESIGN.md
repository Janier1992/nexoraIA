# 04 MOTION DESIGN - Nexora AI

Este documento establece las especificaciones de animación, transiciones e interactividad visual que harán sentir la landing page dinámica e inmersiva.

---

## 🧠 Efecto y Movimiento del Cerebro Holográfico (Fondo Principal)

El fondo de la landing page estará protagonizado por la imagen del cerebro de IA holográfico. Para lograr la atracción inicial del usuario, implementaremos las siguientes animaciones:

### 1. Animación de Entrada (Al Cargar la Página)
* **Acción**: Al cargar la página, el contenedor del cerebro holográfico se desvanece de opacidad 0 a 1 y realiza un **giro en el eje Y de 180 grados** (de `-180deg` a `0deg` o de `0deg` a `180deg`), simulando el encendido e inicialización de un holograma cuántico.
* **Curva de Tiempo**: `cubic-bezier(0.16, 1, 0.3, 1)` (Out Quint) para un inicio rápido y desaceleración suave.
* **Duración**: `2.5 segundos`.

### 2. Interacción con el Cursor (Efecto Tilt 3D / Paralaje)
* **Acción**: El cerebro responderá de forma suave a la posición del mouse del usuario en la pantalla.
* **Comportamiento**: Si el cursor se desplaza a la derecha, el cerebro rota levemente en el eje Y (hasta `15deg`). Si sube o baja, rota en el eje X (hasta `10deg`).
* **Suavizado (Smoothing)**: Utilizar un resorte dinámico (Spring physics) en Framer Motion (`stiffness: 150`, `damping: 20`) para evitar saltos toscos y dar una sensación de peso tridimensional.

### 3. Rotación en Scroll (Eje Y)
* **Acción**: A medida que el usuario realiza scroll hacia abajo, el cerebro continúa rotando sobre su propio eje Y en ángulos de 180 grados proporcionales al scroll.
* **Lógica**: Vincular `scrollYProgress` al valor de `rotateY` de 0 a 180 (o 360) grados.

---

## ⚡ Animaciones de Componentes

### 1. Entrada de Tarjetas (Framer Motion)
Las tarjetas de servicios aparecerán secuencialmente al ingresar en el viewport (Staggered Children):

```javascript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};
```

### 2. Micro-interacciones Hover (CSS)
* **Hover en Tarjetas**: Escala a `1.03`, incremento de intensidad del borde (aumento de opacidad del borde blanco) y un resplandor (glow) sutil con sombra difuminada en el color principal.
* **Hover en Botones**: Desplazamiento vertical hacia arriba (`translateY(-3px)`), transición de brillo y estiramiento del gradiente mediante `background-position`.
