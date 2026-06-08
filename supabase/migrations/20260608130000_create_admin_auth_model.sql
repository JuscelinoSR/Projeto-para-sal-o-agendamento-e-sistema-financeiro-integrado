-- Modelo de autenticação admin BeautyJSR
-- Requer Supabase Auth. Crie o usuário em Authentication > Users e depois libere o perfil admin.

CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'owner')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin profile can read own access" ON admin_profiles;
CREATE POLICY "Admin profile can read own access"
ON admin_profiles
FOR SELECT
TO authenticated
USING (id = auth.uid() AND active = TRUE);

DROP POLICY IF EXISTS "Owners can manage admin profiles" ON admin_profiles;
CREATE POLICY "Owners can manage admin profiles"
ON admin_profiles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_profiles owner_profile
    WHERE owner_profile.id = auth.uid()
      AND owner_profile.role = 'owner'
      AND owner_profile.active = TRUE
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_profiles owner_profile
    WHERE owner_profile.id = auth.uid()
      AND owner_profile.role = 'owner'
      AND owner_profile.active = TRUE
  )
);

CREATE OR REPLACE FUNCTION set_admin_profiles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_admin_profiles_set_updated_at ON admin_profiles;
CREATE TRIGGER trg_admin_profiles_set_updated_at
BEFORE UPDATE ON admin_profiles
FOR EACH ROW
EXECUTE FUNCTION set_admin_profiles_updated_at();

-- Exemplo para liberar um admin depois de criar o usuário no Supabase Auth:
-- INSERT INTO admin_profiles (id, email, full_name, role)
-- SELECT id, email, 'Larissa Admin', 'owner'
-- FROM auth.users
-- WHERE email = 'admin@salaolarissa.com'
-- ON CONFLICT (id) DO UPDATE SET active = TRUE, role = EXCLUDED.role;