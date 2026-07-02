import { NextResponse } from "next/server";
import { supabase, supabaseUrlClean, supabaseAnonKey, hasValidServiceKey } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

// GET: Listar todos los testimonios (para moderación)
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    let supabaseClient = supabase;

    // Si se pasa un token de usuario y no hay service key válida, usar el token del usuario
    if (!hasValidServiceKey && token && token !== "nexora-admin-session-active-2026") {
      supabaseClient = createClient(supabaseUrlClean, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        auth: { persistSession: false }
      });
    }

    const { data, error } = await supabaseClient
      .from("testimonios")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[SUPABASE_SELECT_ADMIN_TESTIMONIOS_ERROR]", error);
      if (error.message?.includes("JWT") || error.code === "PGRST303") {
        return NextResponse.json(
          { success: false, error: "La sesión ha expirado (JWT expired). Por favor inicia sesión nuevamente.", code: "SESSION_EXPIRED" },
          { status: 401 }
        );
      }
      return NextResponse.json({ success: false, error: "Error al consultar los testimonios en la base de datos." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || [] }, { status: 200 });
  } catch (error) {
    console.error("[API_ADMIN_TESTIMONIOS_GET_ERROR]", error);
    return NextResponse.json({ success: false, error: "Error interno del servidor." }, { status: 500 });
  }
}

// POST: Actualizar el estado de moderación de un testimonio
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "El ID y el estado son requeridos." }, { status: 400 });
    }

    if (!["pendiente", "aprobado", "rechazado"].includes(status)) {
      return NextResponse.json({ success: false, error: "Estado no válido." }, { status: 400 });
    }

    let supabaseClient = supabase;

    if (!hasValidServiceKey && token && token !== "nexora-admin-session-active-2026") {
      supabaseClient = createClient(supabaseUrlClean, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        auth: { persistSession: false }
      });
    }

    const { data, error } = await supabaseClient
      .from("testimonios")
      .update({ status })
      .eq("id", id)
      .select();

    if (error) {
      console.error("[SUPABASE_UPDATE_ADMIN_TESTIMONIOS_ERROR]", error);
      return NextResponse.json({ success: false, error: "Error al actualizar el estado del testimonio en Supabase." }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ success: false, error: "No se pudo actualizar el testimonio. Verifica tus permisos RLS en Supabase o si el testimonio existe." }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("[API_ADMIN_TESTIMONIOS_POST_ERROR]", error);
    return NextResponse.json({ success: false, error: "Error interno del servidor." }, { status: 500 });
  }
}

// DELETE: Eliminar un testimonio permanentemente
export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "El ID del testimonio es requerido para eliminar." },
        { status: 400 }
      );
    }

    let supabaseClient = supabase;

    if (!hasValidServiceKey && token && token !== "nexora-admin-session-active-2026") {
      supabaseClient = createClient(supabaseUrlClean, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        auth: { persistSession: false }
      });
    }

    const { data, error } = await supabaseClient
      .from("testimonios")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      console.error("[SUPABASE_DELETE_TESTIMONIO_ERROR]", error);
      return NextResponse.json(
        { success: false, error: "Error al eliminar el testimonio en Supabase." },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: "No se pudo eliminar el testimonio. Verifica tus permisos RLS en Supabase o si el registro existe." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Testimonio eliminado exitosamente.", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API_ADMIN_TESTIMONIOS_DELETE_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}

