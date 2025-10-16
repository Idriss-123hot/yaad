-- Add trigger to automatically update updated_at on cart_items
CREATE OR REPLACE FUNCTION public.update_cart_items_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_cart_items_updated_at
BEFORE UPDATE ON public.cart_items
FOR EACH ROW
EXECUTE FUNCTION public.update_cart_items_timestamp();

-- Function to clean expired cart items (older than 24 hours)
CREATE OR REPLACE FUNCTION public.clean_expired_cart_items()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.cart_items
  WHERE updated_at < NOW() - INTERVAL '24 hours';
END;
$$;