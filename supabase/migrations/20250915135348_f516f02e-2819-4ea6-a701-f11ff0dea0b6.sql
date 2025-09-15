-- Clean up duplicate RLS policies on profiles table and ensure strict access control

-- Drop duplicate policies first
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Keep the more descriptive policy names and ensure they're correctly defined
-- Users can only view their own profile data
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Users can only update their own profile data
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admins can view all profiles (already exists but ensuring it's correct)
-- This policy already exists: "Admins can view all profiles"

-- Admins can update all profiles (already exists but ensuring it's correct)  
-- This policy already exists: "Admins can update all profiles"

-- Ensure no INSERT or DELETE policies exist for regular users (profiles should only be created via triggers)
-- Profiles table should not allow direct INSERT/DELETE from users