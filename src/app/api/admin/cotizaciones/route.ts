import { NextResponse } from "next/server";
import { supabase, supabaseUrlClean, supabaseAnonKey, hasValidServiceKey } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

// GET: Listar todas las cotizaciones
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

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
      .from("cotizaciones")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[SUPABASE_SELECT_COTIZACIONES_ERROR]", error);
      if (error.message?.includes("JWT") || error.code === "PGRST303") {
        return NextResponse.json(
          { success: false, error: "La sesión ha expirado (JWT expired). Por favor inicia sesión nuevamente.", code: "SESSION_EXPIRED" },
          { status: 401 }
        );
      }
      return NextResponse.json({ success: false, error: "Error al consultar las cotizaciones en la base de datos." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || [] }, { status: 200 });
  } catch (error) {
    console.error("[API_ADMIN_COTIZACIONES_GET_ERROR]", error);
    return NextResponse.json({ success: false, error: "Error interno del servidor." }, { status: 500 });
  }
}

// POST: Registrar una nueva cotización
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const body = await request.json();
    const { 
      client_name, 
      client_email, 
      client_company, 
      service_type, 
      items, 
      subtotal, 
      tax, 
      total_amount, 
      notes,
      status 
    } = body;

    if (!client_name || !client_email || !service_type || !items || !total_amount) {
      return NextResponse.json({ success: false, error: "Campos requeridos faltantes." }, { status: 400 });
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
      .from("cotizaciones")
      .insert([
        {
          client_name,
          client_email,
          client_company,
          service_type,
          items, // array de objetos desglosados
          subtotal: Number(subtotal),
          tax: Number(tax),
          total_amount: Number(total_amount),
          notes,
          status: status || "Borrador"
        }
      ])
      .select();

    if (error) {
      console.error("[SUPABASE_INSERT_COTIZACION_ERROR]", error);
      return NextResponse.json({ success: false, error: "Error al registrar la cotización en Supabase." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data[0] }, { status: 200 });
  } catch (error) {
    console.error("[API_ADMIN_COTIZACIONES_POST_ERROR]", error);
    return NextResponse.json({ success: false, error: "Error interno del servidor." }, { status: 500 });
  }
}

// PUT: Actualizar una cotización existente
export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const body = await request.json();
    const { 
      id,
      client_name, 
      client_email, 
      client_company, 
      service_type, 
      items, 
      subtotal, 
      tax, 
      total_amount, 
      notes,
      status 
    } = body;

    if (!id || !client_name || !client_email || !service_type || !items || !total_amount) {
      return NextResponse.json({ success: false, error: "ID y campos requeridos faltantes." }, { status: 400 });
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
      .from("cotizaciones")
      .update({
        client_name,
        client_email,
        client_company,
        service_type,
        items,
        subtotal: Number(subtotal),
        tax: Number(tax),
        total_amount: Number(total_amount),
        notes,
        status: status || "Borrador"
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("[SUPABASE_UPDATE_COTIZACION_ERROR]", error);
      return NextResponse.json({ success: false, error: "Error al actualizar la cotización en Supabase." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data[0] }, { status: 200 });
  } catch (error) {
    console.error("[API_ADMIN_COTIZACIONES_PUT_ERROR]", error);
    return NextResponse.json({ success: false, error: "Error interno del servidor." }, { status: 500 });
  }
}

// DELETE: Eliminar una cotización
export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "El ID de la cotización es requerido para eliminar." },
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
      .from("cotizaciones")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      console.error("[SUPABASE_DELETE_COTIZACION_ERROR]", error);
      return NextResponse.json(
        { success: false, error: "Error al eliminar la cotización en Supabase." },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: "No se pudo eliminar la cotización. Verifica tus permisos RLS en Supabase o si el registro existe." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Cotización eliminada exitosamente.", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API_ADMIN_COTIZACIONES_DELETE_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
