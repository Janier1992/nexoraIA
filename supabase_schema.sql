-- Script de Creación de Base de Datos para Supabase
-- Nexora AI - Tabla de Consultas y Solicitudes

-- 1. Crear la tabla de consultas
CREATE TABLE IF NOT EXISTS public.consultas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    service TEXT NOT NULL,
    message TEXT NOT NULL
);

-- 2. Habilitar la seguridad a nivel de fila (Row Level Security - RLS)
ALTER TABLE public.consultas ENABLE ROW LEVEL SECURITY;

-- 3. Crear política para permitir la inserción pública (desde el formulario de la landing page)
CREATE POLICY "Permitir inserción pública anónima" 
ON public.consultas 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- 4. Crear política para permitir la lectura únicamente a usuarios autenticados (administradores)
CREATE POLICY "Permitir lectura solo a administradores" 
ON public.consultas 
FOR SELECT 
TO authenticated 
USING (true);

-- 5. Crear índices de búsqueda rápida por correo y servicio
CREATE INDEX IF NOT EXISTS consultas_email_idx ON public.consultas (email);
CREATE INDEX IF NOT EXISTS consultas_service_idx ON public.consultas (service);
