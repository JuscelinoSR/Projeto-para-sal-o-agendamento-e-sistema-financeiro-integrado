-- Configurações editáveis da tela pública do salão.
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  brand_name TEXT NOT NULL DEFAULT 'Salão Larissa',
  hero_badge TEXT NOT NULL DEFAULT 'Salão feminino',
  hero_title TEXT NOT NULL DEFAULT 'Seu momento de cuidado.',
  hero_subtitle TEXT NOT NULL DEFAULT 'Cabelos, beleza e autoestima em um ambiente acolhedor, elegante e preparado para transformar sua rotina.',
  cta_text TEXT NOT NULL DEFAULT 'Agendar com Ana',
  background_image_url TEXT NOT NULL DEFAULT 'assets/salao-cores.jpeg',
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT site_settings_singleton CHECK (id = 'default')
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

INSERT INTO site_settings (id)
VALUES ('default')
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "site_settings_public_read" ON site_settings;
CREATE POLICY "site_settings_public_read"
ON site_settings
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "site_settings_admin_update" ON site_settings;
CREATE POLICY "site_settings_admin_update"
ON site_settings
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM admin_profiles ap
    WHERE ap.id = auth.uid()
      AND ap.active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM admin_profiles ap
    WHERE ap.id = auth.uid()
      AND ap.active = true
  )
);

DROP POLICY IF EXISTS "site_settings_admin_insert" ON site_settings;
CREATE POLICY "site_settings_admin_insert"
ON site_settings
FOR INSERT
WITH CHECK (
  id = 'default'
  AND EXISTS (
    SELECT 1
    FROM admin_profiles ap
    WHERE ap.id = auth.uid()
      AND ap.active = true
  )
);

-- Bucket público para imagens do site.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('site-assets', 'site-assets', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "site_assets_public_read" ON storage.objects;
CREATE POLICY "site_assets_public_read"
ON storage.objects
FOR SELECT
USING (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "site_assets_admin_write" ON storage.objects;
CREATE POLICY "site_assets_admin_write"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'site-assets'
  AND EXISTS (
    SELECT 1
    FROM admin_profiles ap
    WHERE ap.id = auth.uid()
      AND ap.active = true
  )
);

DROP POLICY IF EXISTS "site_assets_admin_update" ON storage.objects;
CREATE POLICY "site_assets_admin_update"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'site-assets'
  AND EXISTS (
    SELECT 1
    FROM admin_profiles ap
    WHERE ap.id = auth.uid()
      AND ap.active = true
  )
)
WITH CHECK (bucket_id = 'site-assets');