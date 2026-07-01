import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: Obtener testimonios aprobados para mostrar en la landing page
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("testimonios")
      .select("*")
      .eq("status", "aprobado")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("[SUPABASE_SELECT_TESTIMONIOS_WARN] Posiblemente la tabla 'testimonios' no existe o RLS denegó la consulta:", error.message);
      // Retornar vacío de forma graceful si la tabla no existe en la base de datos
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: data || [] }, { status: 200 });
  } catch (error) {
    console.error("[API_TESTIMONIOS_GET_ERROR]", error);
    return NextResponse.json({ success: false, error: "Error al recuperar testimonios." }, { status: 500 });
  }
}

// POST: Registrar un nuevo testimonio (desde la landing page, queda en estado 'pendiente')
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, company, quote, rating, service } = body;

    // Validación
    if (!name || !role || !company || !quote || !rating || !service) {
      return NextResponse.json({ success: false, error: "Todos los campos son requeridos." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("testimonios")
      .insert([
        {
          name,
          role,
          company,
          quote,
          rating: Number(rating),
          service,
          status: "pendiente"
        }
      ])
      .select();

    if (error) {
      console.error("[SUPABASE_INSERT_TESTIMONIO_ERROR]", error);
      return NextResponse.json(
        { success: false, error: "No se pudo registrar la calificación en la base de datos. Por favor asegúrate de haber ejecutado el script SQL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("[API_TESTIMONIOS_POST_ERROR]", error);
    return NextResponse.json({ success: false, error: "Error interno del servidor al registrar testimonio." }, { status: 500 });
  }
}
