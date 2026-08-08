-- Kinobo Fashion Brand — initial schema, RLS, storage, and seed data
-- Jalankan via Supabase CLI: supabase db push
-- atau paste ke SQL Editor di Supabase Dashboard

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helper: auto-update updated_at
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- Admin users (pendekatan role check via tabel terpisah)
-- Alasan: lebih mudah dikelola tanpa Auth Hook / custom JWT claim,
-- auditable, dan bisa ditambah/hapus admin langsung dari database.
-- ---------------------------------------------------------------------------
CREATE TABLE admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = puc,blic;

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  base_price NUMERIC(12, 2) NOT NULL CHECK (base_price >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Product variants (size / color / stock)
-- ---------------------------------------------------------------------------
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  price_override NUMERIC(12, 2) CHECK (price_override IS NULL OR price_override >= 0),
  sku TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);

CREATE TRIGGER product_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Product media (images / videos)
-- ---------------------------------------------------------------------------
CREATE TABLE product_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_media_product_id ON product_media(product_id);
CREATE INDEX idx_product_media_variant_id ON product_media(variant_id);
CREATE INDEX idx_product_media_sort_order ON product_media(product_id, sort_order);

-- ---------------------------------------------------------------------------
-- Site banners (homepage carousel)
-- ---------------------------------------------------------------------------
CREATE TABLE site_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  link_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_site_banners_is_active ON site_banners(is_active);
CREATE INDEX idx_site_banners_sort_order ON site_banners(sort_order);

-- ---------------------------------------------------------------------------
-- Site settings (key-value store untuk footer info, sosmed, dll)
-- ---------------------------------------------------------------------------
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Seed default settings
INSERT INTO site_settings (key, value) VALUES
  ('footer_address', 'Jl. Contoh No. 123, Jakarta'),
  ('footer_phone', '+62 812-3456-7890'),
  ('footer_email', 'hello@kinobo.id'),
  ('instagram_url', 'https://instagram.com/kinobo'),
  ('whatsapp_number', '6281234567890');

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- admin_users: hanya admin yang bisa baca (untuk verifikasi internal)
CREATE POLICY "admin_users_select_admin"
  ON admin_users FOR SELECT
  TO authenticated
  USING (is_admin());

-- categories: public read, admin write
CREATE POLICY "categories_select_public"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "categories_insert_admin"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "categories_update_admin"
  ON categories FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "categories_delete_admin"
  ON categories FOR DELETE
  TO authenticated
  USING (is_admin());

-- products: public read active only, admin full access
CREATE POLICY "products_select_public"
  ON products FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR is_admin());

CREATE POLICY "products_insert_admin"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "products_update_admin"
  ON products FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "products_delete_admin"
  ON products FOR DELETE
  TO authenticated
  USING (is_admin());

-- product_variants: public read (via active product), admin write
CREATE POLICY "product_variants_select_public"
  ON product_variants FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_variants.product_id
        AND (p.is_active = true OR is_admin())
    )
  );

CREATE POLICY "product_variants_insert_admin"
  ON product_variants FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "product_variants_update_admin"
  ON product_variants FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "product_variants_delete_admin"
  ON product_variants FOR DELETE
  TO authenticated
  USING (is_admin());

-- product_media: public read (via active product), admin write
CREATE POLICY "product_media_select_public"
  ON product_media FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_media.product_id
        AND (p.is_active = true OR is_admin())
    )
  );

CREATE POLICY "product_media_insert_admin"
  ON product_media FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "product_media_update_admin"
  ON product_media FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "product_media_delete_admin"
  ON product_media FOR DELETE
  TO authenticated
  USING (is_admin());

-- site_banners: public read active, admin write
CREATE POLICY "site_banners_select_public"
  ON site_banners FOR SELECT
  TO anon, authenticated
  USING (
    (is_active = true
      AND (start_date IS NULL OR start_date <= NOW())
      AND (end_date IS NULL OR end_date >= NOW()))
    OR is_admin()
  );

CREATE POLICY "site_banners_insert_admin"
  ON site_banners FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "site_banners_update_admin"
  ON site_banners FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "site_banners_delete_admin"
  ON site_banners FOR DELETE
  TO authenticated
  USING (is_admin());

-- site_settings: public read, admin write
CREATE POLICY "site_settings_select_public"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "site_settings_insert_admin"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "site_settings_update_admin"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "site_settings_delete_admin"
  ON site_settings FOR DELETE
  TO authenticated
  USING (is_admin());

-- ---------------------------------------------------------------------------
-- Storage buckets
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('product-images', 'product-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('product-videos', 'product-videos', true, 52428800, ARRAY['video/mp4', 'video/webm']),
  ('banners', 'banners', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, admin write
CREATE POLICY "product_images_public_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "product_images_admin_write"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "product_images_admin_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "product_images_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "product_videos_public_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-videos');

CREATE POLICY "product_videos_admin_write"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-videos' AND is_admin());

CREATE POLICY "product_videos_admin_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-videos' AND is_admin());

CREATE POLICY "product_videos_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-videos' AND is_admin());

CREATE POLICY "banners_public_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'banners');

CREATE POLICY "banners_admin_write"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'banners' AND is_admin());

CREATE POLICY "banners_admin_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'banners' AND is_admin());

CREATE POLICY "banners_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'banners' AND is_admin());
