
CREATE OR REPLACE FUNCTION public.get_subcategories()
RETURNS SETOF public.subcategories
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.subcategories;
$$;
