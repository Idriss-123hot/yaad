-- Create tables for dynamic content translations

-- Table for artisan translations
CREATE TABLE public.artisan_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artisan_id UUID NOT NULL REFERENCES public.artisans(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('fr', 'en', 'ar', 'ar-MA')),
  name TEXT,
  bio TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (artisan_id, locale)
);

-- Table for product translations
CREATE TABLE public.product_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('fr', 'en', 'ar', 'ar-MA')),
  title TEXT,
  description TEXT,
  material TEXT,
  origin TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (product_id, locale)
);

-- Enable RLS on both tables
ALTER TABLE public.artisan_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_translations ENABLE ROW LEVEL SECURITY;

-- RLS policies for artisan_translations
CREATE POLICY "Public can view artisan translations" 
ON public.artisan_translations 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can modify all artisan translations" 
ON public.artisan_translations 
FOR ALL 
USING (is_admin());

CREATE POLICY "Artisans can modify their own translations" 
ON public.artisan_translations 
FOR ALL 
USING (artisan_id = get_artisan_id())
WITH CHECK (artisan_id = get_artisan_id());

-- RLS policies for product_translations
CREATE POLICY "Public can view product translations" 
ON public.product_translations 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can modify all product translations" 
ON public.product_translations 
FOR ALL 
USING (is_admin());

CREATE POLICY "Artisans can modify their product translations" 
ON public.product_translations 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.products 
  WHERE products.id = product_translations.product_id 
  AND products.artisan_id = get_artisan_id()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.products 
  WHERE products.id = product_translations.product_id 
  AND products.artisan_id = get_artisan_id()
));

-- Triggers for updated_at timestamps
CREATE TRIGGER update_artisan_translations_updated_at
  BEFORE UPDATE ON public.artisan_translations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_product_translations_updated_at
  BEFORE UPDATE ON public.product_translations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_timestamp();

-- Functions to get translated content
CREATE OR REPLACE FUNCTION public.get_artisan_translation(artisan_uuid UUID, locale_param TEXT DEFAULT 'fr')
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.get_product_translation(product_uuid UUID, locale_param TEXT DEFAULT 'fr')
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;