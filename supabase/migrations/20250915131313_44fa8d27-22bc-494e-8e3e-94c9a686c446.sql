-- Enable RLS on tables missing row level security
ALTER TABLE public.admin_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currency_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations_duplicate08052025 ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_messages
CREATE POLICY "Admins can manage admin messages" 
ON public.admin_messages 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Create policies for currency_rates (public read, admin write)
CREATE POLICY "Public can view currency rates" 
ON public.currency_rates 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage currency rates" 
ON public.currency_rates 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Create policies for translations (public read, admin write)
CREATE POLICY "Public can view translations" 
ON public.translations 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage translations" 
ON public.translations 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Create policies for translations_backup (admin only)
CREATE POLICY "Admins can manage translations backup" 
ON public.translations_backup 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Create policies for translations_duplicate08052025 (admin only)
CREATE POLICY "Admins can manage translations duplicate" 
ON public.translations_duplicate08052025 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());