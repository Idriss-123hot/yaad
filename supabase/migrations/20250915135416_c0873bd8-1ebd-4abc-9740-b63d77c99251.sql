-- Clean up only the duplicate policies on profiles table
-- The "Users can view their own profile" and "Users can update their own profile" already exist and are correct
-- We just need to remove the duplicates with shorter names

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;