import { createClient } from "@supabase/supabase-js";

export const supabaseUrlClean = (() => {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  if (url.endsWith("/rest/v1/")) {
    url = url.slice(0, -9);
  } else if (url.endsWith("/rest/v1")) {
    url = url.slice(0, -8);
  }
  return url;
})();

export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const isServer = typeof window === "undefined";
export const hasValidServiceKey = 
  supabaseServiceKey && 
  !supabaseServiceKey.includes("reemplazar-con-tu-service-role");

const keyToUse = isServer && hasValidServiceKey ? supabaseServiceKey : supabaseAnonKey;

if (!supabaseUrlClean) {
  console.warn("[SUPABASE_WARNING] La variable NEXT_PUBLIC_SUPABASE_URL no está definida.");
}

export const supabase = createClient(supabaseUrlClean, keyToUse, {
  auth: {
    persistSession: !isServer // Permite persistencia en el cliente, evita memory leaks en el backend
  }
});

