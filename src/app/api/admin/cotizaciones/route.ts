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
