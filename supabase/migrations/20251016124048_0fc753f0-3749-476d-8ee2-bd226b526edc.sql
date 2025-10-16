-- Add unique constraint on cart_items for upsert operations
-- This allows us to use upsert instead of delete+insert
ALTER TABLE public.cart_items
ADD CONSTRAINT cart_items_user_product_unique 
UNIQUE (user_id, product_id);