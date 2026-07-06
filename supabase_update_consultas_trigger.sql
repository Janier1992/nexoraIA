-- =========================================================================
-- SCRIPT DE ACTUALIZACIÓN DE BASE DE DATOS - NEXORA AI
-- Vincula cotizaciones con consultas y las elimina automáticamente al guardar
-- =========================================================================

-- 1. Agregar columna de referencia de consulta a la tabla cotizaciones (si no existe)
ALTER TABLE public.cotizaciones ADD COLUMN IF NOT EXISTS consulta_id UUID;

-- 2. Crear función para eliminar la consulta asociada automáticamente al guardar la cotización
CREATE OR REPLACE FUNCTION public.eliminar_consulta_asociada()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.consulta_id IS NOT NULL THEN
        DELETE FROM public.consultas
        WHERE id = NEW.consulta_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Crear el Trigger en la tabla cotizaciones
DROP TRIGGER IF EXISTS trg_eliminar_consulta_asociada ON public.cotizaciones;
CREATE TRIGGER trg_eliminar_consulta_asociada
AFTER INSERT ON public.cotizaciones
FOR EACH ROW
EXECUTE FUNCTION public.eliminar_consulta_asociada();
