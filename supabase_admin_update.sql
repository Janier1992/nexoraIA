-- Script de Actualización de Base de Datos para Supabase
-- Nexora AI - Módulo de Administración

-- 1. Añadir columnas de administración a la tabla consultas
ALTER TABLE public.consultas 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Nueva',
ADD COLUMN IF NOT EXISTS qualification INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS quote_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS admin_notes TEXT DEFAULT '';

-- 2. Asegurarse de que el índice para búsquedas por estado esté creado
CREATE INDEX IF NOT EXISTS consultas_status_idx ON public.consultas (status);

-- 3. Crear política para permitir la actualización únicamente a usuarios autenticados (administradores)
-- Opcional pero recomendado si no se ha configurado la clave privada service_role_key en el backend.
CREATE POLICY "Permitir actualización solo a administradores" 
ON public.consultas 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 4. Crear política para permitir la eliminación únicamente a usuarios autenticados (administradores)
CREATE POLICY "Permitir eliminación solo a administradores" 
ON public.consultas 
FOR DELETE 
TO authenticated 
USING (true);


-- Nota: RLS ya permite SELECT a usuarios autenticados.
-- En el backend preferiremos utilizar la clave service_role para operaciones de escritura administrativa
-- si está disponible en .env.local, lo cual omite RLS. Si no está disponible, se usará el token del usuario
-- y se requerirá la política de UPDATE descrita arriba.

