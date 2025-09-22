-- Security Fix: Add proper search path to all security definer functions to prevent search path attacks
-- This prevents malicious users from creating objects in other schemas to hijack function behavior

-- Fix get_artisan_id function
CREATE OR REPLACE FUNCTION public.get_artisan_id()
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  artisan_id UUID;
BEGIN
  SELECT id INTO artisan_id FROM public.artisans
  WHERE user_id = auth.uid();
  
  RETURN artisan_id;
END;
$function$;

-- Fix is_admin function
CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$function$;

-- Fix is_artisan function
CREATE OR REPLACE FUNCTION public.is_artisan()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'artisan'
  );
END;
$function$;

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'customer')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$function$;

-- Fix get_translations function
CREATE OR REPLACE FUNCTION public.get_translations(locale text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  translations JSONB;
BEGIN
  SELECT jsonb_object_agg(key, value)
  INTO translations
  FROM (
    SELECT key, value
    FROM public.translations
    WHERE translations.locale = get_translations.locale
  ) t;
  
  RETURN COALESCE(translations, '{}'::JSONB);
END;
$function$;

-- Fix get_artisan_translation function
CREATE OR REPLACE FUNCTION public.get_artisan_translation(artisan_uuid uuid, locale_param text DEFAULT 'fr'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  translation_data JSONB;
  fallback_data JSONB;
BEGIN
  -- Try to get translation for the requested locale
  SELECT jsonb_build_object(
    'name', name,
    'bio', bio,
    'description', description
  )
  INTO translation_data
  FROM public.artisan_translations
  WHERE artisan_id = artisan_uuid AND locale = locale_param;
  
  -- If no translation found for the requested locale, try French as fallback
  IF translation_data IS NULL AND locale_param != 'fr' THEN
    SELECT jsonb_build_object(
      'name', name,
      'bio', bio,
      'description', description
    )
    INTO fallback_data
    FROM public.artisan_translations
    WHERE artisan_id = artisan_uuid AND locale = 'fr';
    
    translation_data := fallback_data;
  END IF;
  
  -- If still no translation, get from main artisan table
  IF translation_data IS NULL THEN
    SELECT jsonb_build_object(
      'name', name,
      'bio', bio,
      'description', description
    )
    INTO translation_data
    FROM public.artisans
    WHERE id = artisan_uuid;
  END IF;
  
  RETURN COALESCE(translation_data, '{}'::JSONB);
END;
$function$;

-- Fix get_product_translation function
CREATE OR REPLACE FUNCTION public.get_product_translation(product_uuid uuid, locale_param text DEFAULT 'fr'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  translation_data JSONB;
  fallback_data JSONB;
BEGIN
  -- Try to get translation for the requested locale
  SELECT jsonb_build_object(
    'title', title,
    'description', description,
    'material', material,
    'origin', origin
  )
  INTO translation_data
  FROM public.product_translations
  WHERE product_id = product_uuid AND locale = locale_param;
  
  -- If no translation found for the requested locale, try French as fallback
  IF translation_data IS NULL AND locale_param != 'fr' THEN
    SELECT jsonb_build_object(
      'title', title,
      'description', description,
      'material', material,
      'origin', origin
    )
    INTO fallback_data
    FROM public.product_translations
    WHERE product_id = product_uuid AND locale = 'fr';
    
    translation_data := fallback_data;
  END IF;
  
  -- If still no translation, get from main product table
  IF translation_data IS NULL THEN
    SELECT jsonb_build_object(
      'title', title,
      'description', description,
      'material', material,
      'origin', origin
    )
    INTO translation_data
    FROM public.products
    WHERE id = product_uuid;
  END IF;
  
  RETURN COALESCE(translation_data, '{}'::JSONB);
END;
$function$;