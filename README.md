# Kinobo — Fashion Brand Website

Website brand fashion **Kinobo** dibangun dengan Next.js (App Router), TypeScript, Tailwind CSS, dan Supabase sebagai backend (Postgres, Auth, Storage).

---

## 📌 Update Terbaru (Staging Release)

Berikut adalah daftar perubahan dan fitur baru yang telah ditambahkan pada cabang/staging terbaru:

### 🔐 1. Auth Guard & Sistem Login Admin (`/admin/*`)
<!-- login: admin@gmail.com pw: password -->
* **Halaman Login Admin (`/login`)**:
  * Dibuat rute `app/(auth)/login/page.tsx` menggunakan `react-hook-form` + `zod` untuk validasi email & password.
* **Server Actions (`app/(auth)/login/actions.ts`)**:
  * `loginAction`: Memproses autentikasi via Supabase Auth (`signInWithPassword`) dan memverifikasi status admin melalui RPC `is_admin()`.
  * `logoutAction`: Memproses logout dan mengarahkan kembali ke `/login`.
* **Helper Otorisasi (`lib/supabase/auth.ts`)**:
  * `requireAdmin()`: Helper Server Component/Action yang menjamin hanya user terdaftar di tabel `admin_users` yang dapat mengakses halaman admin. Menggunakan `createClient()` demi menjaga keamanan RLS.
* **Layout Guard & Logout Button**:
  * Layout `app/(admin)/admin/layout.tsx` kini diproteksi dengan `await requireAdmin()`.
  * Header admin dilengkapi dengan informasi email user & `LogoutButton`.
* **Middleware Protection (Defense-in-depth)**:
  * `lib/supabase/middleware.ts` secara otomatis mere-redirect pengakses tanpa session pada rute `/admin/*` langsung ke `/login`.

### 🎨 2. Redesign Storefront & Komponen UI
* Integrasi tampilan storefront baru berbasis foto referensi:
  * Redesign komponen layout: `BannerCarousel.tsx`, `Navbar.tsx`, `Footer.tsx`.
  * Redesign komponen produk: `ProductCard.tsx`.
  * Penambahan aset gambar produk dan banner di `public/images/`.

---

## 🔑 Panduan Login Admin

1. **Akses Halaman Login**:
   Buka `http://localhost:3000/login` atau coba akses `http://localhost:3000/admin/produk` (akan otomatis di-redirect ke `/login` jika belum masuk).

2. **Membuat Akun Admin (Di Supabase Dashboard)**:
   * Buka Dashboard Supabase Anda -> **Authentication** -> **Users** -> **Add User** -> **Create User**.
   * Salin **User UID** dari user yang baru dibuat.
   * Masuk ke **SQL Editor** Supabase dan jalankan perintah:
     ```sql
     INSERT INTO admin_users (user_id) VALUES ('<USER_UID_ANDA>');
     ```

3. **Login**:
   * Gunakan email & password yang dibuat di Supabase Auth untuk masuk melalui `/login`.
   * Jika akun terdaftar sebagai admin, Anda akan langsung diarahkan ke `/admin/produk`.
   * Jika akun bukan admin, sistem akan menolak akses, melakukan sign out otomatis, dan menampilkan pesan *"Akun tidak memiliki akses admin"*.

---

## 📁 Struktur Folder

```
app/
  (auth)/login/     → Halaman & server actions login admin
  (storefront)/     → Halaman publik (beranda, produk, kategori)
  (admin)/admin/    → Panel admin diproteksi requireAdmin() (produk, banner, pengaturan)
components/
  ui/               → Primitif UI reusable (Button, Input, Card, Modal, Badge)
  auth/             → Form autentikasi (LoginForm)
  product/          → Komponen produk (ProductCard)
  layout/           → Navbar, Footer, BannerCarousel
  admin/            → Form & komponen admin (ProductForm, MediaUploader, LogoutButton)
lib/
  supabase/         → Client, server, middleware, auth helpers (requireAdmin)
  queries/          → Server-side query functions
  validations/      → Schema Zod untuk form (auth, product, banner, settings)
  types/            → TypeScript types database
supabase/migrations/ → SQL schema, RLS, storage policies, fungsi is_admin()
```

---

## 🛠️ Setup Lokal

### 1. Clone & install dependencies

```bash
npm install
```

### 2. Environment Variables (`.env.local`)

```bash
cp .env.local.example .env.local
```

Isi nilai di `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

### 3. Migration Database

Jalankan isi `supabase/migrations/0001_init.sql` di **SQL Editor** Supabase Dashboard. Migration ini membuat:
- Tabel: `admin_users`, `categories`, `products`, `product_variants`, `product_media`, `site_banners`, `site_settings`
- Fungsi RPC: `is_admin()`
- RLS Policies (Public Read, Admin Write)
- Storage buckets: `product-images`, `product-videos`, `banners`

### 4. Jalankan Dev Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

---

## 🛣️ Rute Aplikasi

| Route | Akses | Deskripsi |
|-------|-------|-----------|
| `/` | Publik | Beranda — banner carousel + katalog produk |
| `/produk/[slug]` | Publik | Detail produk dengan pilihan varian |
| `/kategori/[slug]` | Publik | Daftar produk per kategori |
| `/login` | Publik | Form login khusus administrator toko |
| `/admin/produk` | **Admin Only** | Manajemen produk & varian |
| `/admin/banner` | **Admin Only** | Manajemen banner & promo |
| `/admin/pengaturan` | **Admin Only** | Pengaturan informasi toko & kontak |

---

## 📝 Roadmap Progress

- [x] Merge & redesign UI storefront
- [x] Auth guard & proteksi rute `/admin/*` via `requireAdmin()` dan Middleware
- [x] Form login admin dengan `react-hook-form` + `zod` + Server Actions
- [ ] Implementasi Server Actions untuk CRUD produk & banner di admin panel
