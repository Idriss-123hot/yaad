-- Add unique constraint on wishlists to prevent duplicates
ALTER TABLE public.wishlists
ADD CONSTRAINT wishlists_user_product_unique 
UNIQUE (user_id, product_id);