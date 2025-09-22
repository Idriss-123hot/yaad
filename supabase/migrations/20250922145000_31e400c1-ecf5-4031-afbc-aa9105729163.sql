-- Fix remaining functions that don't have search_path set properly
-- These are the remaining functions identified by the linter

-- Fix log_artisan_changes function
CREATE OR REPLACE FUNCTION public.log_artisan_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.modification_logs (
    table_name,
    row_id,
    old_values,
    new_values,
    user_id,
    user_role
  )
  VALUES (
    'artisans',
    NEW.id,
    CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD)::jsonb ELSE NULL END,
    row_to_json(NEW)::jsonb,
    auth.uid(),
    (SELECT role FROM public.profiles WHERE id = auth.uid())
  );
  RETURN NEW;
END;
$function$;

-- Fix log_product_changes function  
CREATE OR REPLACE FUNCTION public.log_product_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.modification_logs (
    table_name,
    row_id,
    old_values,
    new_values,
    user_id,
    user_role
  )
  VALUES (
    'products',
    NEW.id,
    CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD)::jsonb ELSE NULL END,
    row_to_json(NEW)::jsonb,
    auth.uid(),
    (SELECT role FROM public.profiles WHERE id = auth.uid())
  );
  RETURN NEW;
END;
$function$;

-- Fix log_profile_changes function
CREATE OR REPLACE FUNCTION public.log_profile_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.modification_logs (
    table_name,
    row_id,
    old_values,
    new_values,
    user_id,
    user_role
  )
  VALUES (
    'profiles',
    NEW.id,
    CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD)::jsonb ELSE NULL END,
    row_to_json(NEW)::jsonb,
    auth.uid(),
    (SELECT role FROM public.profiles WHERE id = auth.uid())
  );
  RETURN NEW;
END;
$function$;

-- Fix update_admin_message_timestamp function
CREATE OR REPLACE FUNCTION public.update_admin_message_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Fix update_blog_posts_updated_at function
CREATE OR REPLACE FUNCTION public.update_blog_posts_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix update_product_search_vector function
CREATE OR REPLACE FUNCTION public.update_product_search_vector()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.search_vector = 
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.material, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW.origin, '')), 'C');
  RETURN NEW;
END;
$function$;

-- Fix update_subcategories_timestamp function
CREATE OR REPLACE FUNCTION public.update_subcategories_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Fix update_timestamp function
CREATE OR REPLACE FUNCTION public.update_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;