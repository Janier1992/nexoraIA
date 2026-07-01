-- ========================================================
-- SCRIPT DE ACTUALIZACIÓN DE POLÍTICAS RLS - NEXORA AI
-- Habilita operaciones CRUD para Administradores
-- ========================================================

-- Habilitar RLS en las tablas principales
ALTER TABLE public.consultas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cotizaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonios ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------
-- 1. POLÍTICAS PARA LA TABLA 'consultas'
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Permitir inserción pública anónima" ON public.consultas;
DROP POLICY IF EXISTS "Permitir lectura solo a administradores" ON public.consultas;
DROP POLICY IF EXISTS "Permitir actualización solo a administradores" ON public.consultas;
DROP POLICY IF EXISTS "Permitir eliminación solo a administradores" ON public.consultas;

-- Permitir inserción pública a cualquiera (para el formulario de contacto)
CREATE POLICY "Permitir inserción a todos" 
ON public.consultas FOR INSERT 
WITH CHECK (true);

-- Permitir lectura, actualización y eliminación a usuarios autenticados
CREATE POLICY "Permitir SELECT a autenticados" ON public.consultas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir UPDATE a autenticados" ON public.consultas FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Permitir DELETE a autenticados" ON public.consultas FOR DELETE TO authenticated USING (true);

-- Permitir lectura, actualización y eliminación al rol anon (para soporte de administrador fallback)
CREATE POLICY "Permitir SELECT a anon" ON public.consultas FOR SELECT TO anon USING (true);
CREATE POLICY "Permitir UPDATE a anon" ON public.consultas FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Permitir DELETE a anon" ON public.consultas FOR DELETE TO anon USING (true);


-- --------------------------------------------------------
-- 2. POLÍTICAS PARA LA TABLA 'cotizaciones'
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Permitir todo a administradores sobre cotizaciones" ON public.cotizaciones;
DROP POLICY IF EXISTS "Permitir todo a autenticados sobre cotizaciones" ON public.cotizaciones;
DROP POLICY IF EXISTS "Permitir todo a anon sobre cotizaciones" ON public.cotizaciones;

-- Permitir todo a autenticados
CREATE POLICY "Permitir todo a autenticados sobre cotizaciones" 
ON public.cotizaciones FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Permitir todo a anon (para soporte de administrador fallback)
CREATE POLICY "Permitir todo a anon sobre cotizaciones" 
ON public.cotizaciones FOR ALL TO anon USING (true) WITH CHECK (true);


-- --------------------------------------------------------
-- 3. POLÍTICAS PARA LA TABLA 'testimonios'
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Permitir lectura pública de testimonios aprobados" ON public.testimonios;
DROP POLICY IF EXISTS "Permitir inserción pública de testimonios" ON public.testimonios;
DROP POLICY IF EXISTS "Permitir todo a administradores sobre testimonios" ON public.testimonios;
DROP POLICY IF EXISTS "Permitir SELECT a todos" ON public.testimonios;
DROP POLICY IF EXISTS "Permitir INSERT a todos" ON public.testimonios;
DROP POLICY IF EXISTS "Permitir todo a autenticados sobre testimonios" ON public.testimonios;
DROP POLICY IF EXISTS "Permitir todo a anon sobre testimonios" ON public.testimonios;

-- Permitir lectura pública a cualquiera
CREATE POLICY "Permitir SELECT a todos" 
ON public.testimonios FOR SELECT 
USING (true);

-- Permitir inserción pública a cualquiera
CREATE POLICY "Permitir INSERT a todos" 
ON public.testimonios FOR INSERT 
WITH CHECK (true);

-- Permitir todo a autenticados
CREATE POLICY "Permitir todo a autenticados sobre testimonios" 
ON public.testimonios FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Permitir todo a anon (para soporte de administrador fallback)
CREATE POLICY "Permitir todo a anon sobre testimonios" 
ON public.testimonios FOR ALL TO anon USING (true) WITH CHECK (true);
