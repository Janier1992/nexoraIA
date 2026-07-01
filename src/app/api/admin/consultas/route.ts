import { NextResponse } from "next/server";
import { supabase, supabaseUrlClean, supabaseAnonKey, hasValidServiceKey } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    let supabaseClient = supabase;

    // Si se pasa un token de Supabase (JWT), instanciamos un cliente dinámico
    // que use ese token para que la base de datos valide las políticas RLS.
    if (token && token !== "nexora-admin-session-active-2026") {
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

    // Consultar todos los registros de la tabla 'consultas' ordenados por fecha
    const { data, error } = await supabaseClient
      .from("consultas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[SUPABASE_SELECT_ERROR]", error);
      return NextResponse.json(
        { success: false, message: "Error al consultar los registros en la base de datos." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API_ADMIN_CONSULTAS_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Error interno en el servidor." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "El ID del registro es requerido para eliminar." },
        { status: 400 }
      );
    }

    let supabaseClient = supabase;

    // Usar cliente dinámico con el token del usuario si el service role es inválido
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

    const { error } = await supabaseClient
      .from("consultas")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[SUPABASE_DELETE_ERROR]", error);
      return NextResponse.json(
        { success: false, error: "Error al eliminar el registro en Supabase." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Registro eliminado exitosamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API_ADMIN_CONSULTAS_DELETE_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}


