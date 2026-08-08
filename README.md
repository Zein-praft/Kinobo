# Kinobo — Fashion Brand Website

Website brand fashion **Kinobo** dibangun dengan Next.js (App Router), TypeScript, Tailwind CSS, dan Supabase sebagai backend (Postgres, Auth, Storage).

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Postgres + Storage + Auth)
- **Validasi**: Zod + React Hook Form

## Struktur Folder

```
app/
  (storefront)/     → Halaman publik (beranda, produk, kategori)
  (admin)/admin/    → Panel admin (produk, banner, pengaturan)
components/
  ui/               → Primitif UI reusable (Button, Input, Card, dll)
  product/          → Komponen produk (ProductCard, Gallery, VariantPicker)
  layout/           → Navbar, Footer, BannerCarousel
  admin/            → Form admin (ProductForm, MediaUploader, dll)
lib/
  supabase/         → Client, server, middleware, storage helpers
  queries/          → Server-side query functions
  validations/      → Schema Zod untuk form
  types/            → TypeScript types database
supabase/migrations/ → SQL schema, RLS, storage policies
```

## Setup Lokal

### 1. Clone & install dependencies

```bash
npm install
```

### 2. Buat project Supabase

1. Buka [supabase.com](https://supabase.com) dan buat project baru.
2. Di **Settings → API**, salin:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Environment variables

```bash
cp .env.local.example .env.local
```

Isi nilai di `.env.local` dengan credential Supabase project Anda.

### 4. Jalankan migration database

**Opsi A — SQL Editor (cepat):**

Salin isi `supabase/migrations/0001_init.sql` ke **SQL Editor** di Supabase Dashboard, lalu jalankan.

**Opsi B — Supabase CLI:**

```bash
npx supabase login
npx supabase link --project-ref <project-id>
npx supabase db push
```

Migration ini membuat:
- Tabel: `categories`, `products`, `product_variants`, `product_media`, `site_banners`, `site_settings`, `admin_users`
- RLS policies (public read, admin write)
- Storage buckets: `product-images`, `product-videos`, `banners`
- Seed data default untuk `site_settings`

### 5. Tambahkan admin user

Setelah user mendaftar/login via Supabase Auth, tambahkan UUID-nya ke tabel `admin_users`:

```sql
INSERT INTO admin_users (user_id) VALUES ('<uuid-dari-auth-users>');
```

> **Mengapa `admin_users` table?**  
> Pendekatan ini lebih mudah dikelola daripada custom JWT claim — tidak perlu Auth Hook, admin bisa ditambah/hapus langsung dari database, dan auditable.

### 6. Generate types (opsional)

Setelah schema berjalan di Supabase:

```bash
npx supabase gen types typescript --project-id <project-id> > lib/types/database.types.ts
```

### 7. Jalankan dev server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Halaman

| Route | Deskripsi |
|-------|-----------|
| `/` | Beranda — banner + produk terbaru |
| `/produk/[slug]` | Detail produk dengan varian |
| `/kategori/[slug]` | Produk per kategori |
| `/admin/produk` | Manajemen produk |
| `/admin/banner` | Manajemen banner |
| `/admin/pengaturan` | Pengaturan footer & sosmed |

## Query Functions

Semua query di `lib/queries/` dijalankan server-side:

- `getProducts({ categorySlug?, page?, limit? })`
- `getProductBySlug(slug)` — include variants & media
- `getCategories()`
- `getActiveBanners()`
- `getSiteSettings()` — return object key-value

## Storage Upload

Helper di `lib/supabase/storage.ts`:

```typescript
import { uploadFile, getPublicUrl } from "@/lib/supabase/storage";

const { path, publicUrl } = await uploadFile("product-images", file, "folder-name");
```

Bucket tersedia: `product-images`, `product-videos`, `banners` (public read, admin write).

## Langkah Selanjutnya

- [ ] Implementasi Server Actions untuk CRUD admin
- [ ] Auth guard di route `/admin/*`
- [ ] Styling & UI polish
- [ ] Carousel banner dengan swipe/autoplay
