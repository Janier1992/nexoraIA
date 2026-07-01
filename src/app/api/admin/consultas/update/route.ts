import { NextResponse } from "next/server";
import { supabase, supabaseUrlClean, supabaseAnonKey, hasValidServiceKey } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, status, qualification, quote_amount, admin_notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "El ID del registro es requerido para realizar la actualización." },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    let supabaseClient = supabase;

    // Si el service role key es inválido (no está configurado aún) y tenemos un token de usuario,
    // usamos el token del usuario para intentar actualizar (requerirá política de UPDATE para authenticated en Supabase).
    // Si el service role key es válido, lo preferimos para omitir RLS.
    if (!hasValidServiceKey && token && token !== "nexora-admin-session-active-2026") {
      supabaseClient = createClient(supabaseUrlClean, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        auth: {
          persistSession: false,
        },
      });
    }

    // Actualizar el registro en Supabase con los nuevos campos de administración
    const { error } = await supabaseClient
      .from("consultas")
      .update({
        status,
        qualification: Number(qualification),
        quote_amount: Number(quote_amount),
        admin_notes
      })
      .eq("id", id);


    if (error) {
      console.error("[SUPABASE_UPDATE_ERROR]", error);
      return NextResponse.json(
        { success: false, message: "Error al actualizar los datos en Supabase." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Registro actualizado exitosamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API_ADMIN_CONSULTAS_UPDATE_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
