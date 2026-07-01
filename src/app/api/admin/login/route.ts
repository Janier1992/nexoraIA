import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Intentar autenticar contra Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!authError && authData?.session) {
      return NextResponse.json(
        { 
          success: true, 
          token: authData.session.access_token,
          user: authData.user 
        },
        { status: 200 }
      );
    }

    // 2. Fallback a credenciales estáticas de .env.local
    const adminEmail = process.env.ADMIN_EMAIL || "nexoraia2@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "nexora2026";

    if (email === adminEmail && password === adminPassword) {
      return NextResponse.json(
        { success: true, token: "nexora-admin-session-active-2026" },
        { status: 200 }
      );
    }

    const errorMessage = authError ? authError.message : "Credenciales de administrador incorrectas.";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 401 }
    );
  } catch (error) {
    console.error("[API_ADMIN_LOGIN_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor al procesar el inicio de sesión." },
      { status: 500 }
    );
  }
}

