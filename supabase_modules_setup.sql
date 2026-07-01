-- Script de Creación de Tablas para Módulos de Administración y Calificaciones
-- Nexora AI - Módulo de Cotizaciones y Testimonios

-- ==========================================
-- 1. TABLA DE TESTIMONIOS (CALIFICACIONES)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.testimonios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    quote TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    service TEXT NOT NULL,
    status TEXT DEFAULT 'pendiente' NOT NULL CHECK (status IN ('pendiente', 'aprobado', 'rechazado'))
);

-- Habilitar seguridad a nivel de fila (RLS)
ALTER TABLE public.testimonios ENABLE ROW LEVEL SECURITY;

-- Política 1: Permitir inserción pública de testimonios (desde la landing page)
CREATE POLICY "Permitir inserción pública de testimonios" 
ON public.testimonios 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Política 2: Permitir lectura pública de testimonios únicamente si están aprobados
CREATE POLICY "Permitir lectura pública de testimonios aprobados" 
ON public.testimonios 
FOR SELECT 
TO anon, authenticated
USING (status = 'aprobado');

-- Política 3: Permitir control total a administradores autenticados
CREATE POLICY "Permitir todo a administradores sobre testimonios" 
ON public.testimonios 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Índices de búsqueda
CREATE INDEX IF NOT EXISTS testimonios_status_idx ON public.testimonios (status);


-- ==========================================
-- 2. TABLA DE COTIZACIONES
-- ==========================================

CREATE TABLE IF NOT EXISTS public.cotizaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_company TEXT,
    service_type TEXT NOT NULL,
    items JSONB NOT NULL, -- Estructura: [{description: string, hours: number, rate: number, total: number}]
    subtotal NUMERIC NOT NULL DEFAULT 0,
    tax NUMERIC NOT NULL DEFAULT 0,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    notes TEXT DEFAULT '',
    sent_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'Borrador' NOT NULL CHECK (status IN ('Borrador', 'Enviada', 'Aceptada', 'Rechazada'))
);

-- Habilitar seguridad a nivel de fila (RLS)
ALTER TABLE public.cotizaciones ENABLE ROW LEVEL SECURITY;

-- Política 1: Permitir control total únicamente a administradores autenticados
CREATE POLICY "Permitir todo a administradores sobre cotizaciones" 
ON public.cotizaciones 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Índices de búsqueda
CREATE INDEX IF NOT EXISTS cotizaciones_client_email_idx ON public.cotizaciones (client_email);
CREATE INDEX IF NOT EXISTS cotizaciones_status_idx ON public.cotizaciones (status);
