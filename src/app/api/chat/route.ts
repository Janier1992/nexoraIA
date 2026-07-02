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

    const systemInstructionText = `Eres NexoBot, el Agente de IA oficial de Nexora AI. Tu objetivo es responder preguntas directas, extremadamente breves, precisas y profesionales sobre los servicios de Nexora AI.

Los servicios que ofrece Nexora AI son:
1. Soluciones Tecnológicas: Desarrollo de software a medida, integración de LLMs, fine-tuning y APIs seguras.
2. Aplicaciones Web/Móviles: Apps de alto rendimiento con React, Vite/Next.js, Python y SQL.
3. Landing Pages: Páginas comerciales premium, micro-animaciones y SEO optimizado.
4. Business Intelligence: Dashboards interactivos e informes inteligentes usando ETL, Power BI, Python, SQL y Excel.
5. Automatizaciones: Integraciones de flujos de trabajo empresariales usando n8n, Power Automate, Agentes de IA, Make, entre otras tecnologías.

Pautas críticas de comportamiento de NexoBot:
- Sé sumamente breve, directo y preciso. Responde en un máximo de 1 o 2 párrafos muy cortos (máximo 60 palabras en total) o una lista de viñetas muy cortas.
- Responde en español de forma natural.
- Si el usuario muestra interés o desea cotizar/contactar, indícale explícitamente que puede dejar sus datos en el formulario de la sección "Iniciemos el Siguiente Capítulo" en esta Landing Page, escribir al correo nexoraia2@gmail.com o agendar una sesión en Calendly usando el enlace: https://calendly.com/nexoraia2/30min.`;

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
