
-- Create the translations table if it doesn't exist
CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  locale TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(locale, key)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_translations_locale_key ON translations(locale, key);

-- Create get_translations function if it doesn't exist
CREATE OR REPLACE FUNCTION get_translations(locale TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  translations JSONB;
BEGIN
  SELECT jsonb_object_agg(key, value)
  INTO translations
  FROM (
    SELECT key, value
    FROM translations
    WHERE translations.locale = get_translations.locale
  ) t;
  
  RETURN COALESCE(translations, '{}'::JSONB);
END;
$$;
