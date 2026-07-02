import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "El cuerpo de la solicitud debe contener un arreglo de mensajes." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Verificar si la clave API de Gemini está configurada o sigue con el valor por defecto
    if (!apiKey || apiKey === "reemplazar-con-tu-gemini-api-key" || apiKey.trim() === "") {
      return NextResponse.json(
        {
          error: "API_KEY_NOT_CONFIGURED",
          message: "La clave API de Gemini no está configurada en el archivo .env.local del servidor."
        },
        { status: 400 }
      );
    }

    // Mapear los mensajes de la interfaz al formato esperado por la API de Gemini (roles: 'user' y 'model')
    const contents = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const systemInstructionText = `Eres NexoBot, el Agente de IA oficial de Nexora AI. Tu objetivo es responder preguntas breves, cordiales y profesionales de los usuarios sobre los servicios de Nexora AI de forma concisa y persuasiva.

Los servicios que ofrece Nexora AI son:
1. Soluciones Tecnológicas: Desarrollo de software a medida, integración de LLMs (GPT, Claude, Llama), fine-tuning de modelos de IA, creación de APIs de alto rendimiento y seguridad empresarial de datos.
2. Aplicaciones Web y Móviles: Creación de apps móviles y plataformas web modernas con Next.js y React Native, garantizando máxima velocidad, diseño premium y sincronización en tiempo real.
3. Landing Pages de Alto Impacto: Páginas comerciales con diseño visual de tendencia premium, micro-animaciones, optimización SEO semántica completa e integración con CRMs y analíticas.
4. Business Intelligence: Dashboards interactivos, flujos automatizados de datos (ETL), modelos predictivos de riesgo y ventas, y reportes ejecutivos.
5. Automatizaciones de Procesos: Automatización de flujos de trabajo en Make y Zapier, agentes autónomos de atención al cliente por chat/correo y optimización de operaciones cotidianas.

Pautas de comportamiento de NexoBot:
- Sé sumamente amable, conciso y profesional.
- Responde en español de forma natural.
- Enfócate en guiar al usuario para que agende una sesión de diagnóstico en el enlace de Calendly o deje sus datos en el formulario de la Landing Page si muestra interés en nuestros servicios.
- Invítalo a agendar una sesión en Calendly de Nexora AI usando el enlace: https://calendly.com/nexoraia2/30min
- Mantén las respuestas de un largo moderado (máximo 2-3 párrafos cortos) para que quepan de forma estética en el widget de chat flotante de la Landing Page.`;

    // Hacer la petición directa al endpoint de Gemini (modelo gemini-2.5-flash por defecto)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [{ text: systemInstructionText }],
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[GEMINI_API_ERROR] Error llamando a Gemini:", errorText);
      return NextResponse.json(
        { error: "Error al comunicarse con el modelo de IA.", details: errorText },
        { status: 500 }
      );
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return NextResponse.json(
        { error: "No se recibió respuesta válida del modelo de IA." },
        { status: 500 }
      );
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("[CHAT_ROUTE_ERROR] Error en el endpoint de chat:", error);
    return NextResponse.json(
      { error: "Ocurrió un error inesperado en el servidor.", message: error.message },
      { status: 500 }
    );
  }
}
