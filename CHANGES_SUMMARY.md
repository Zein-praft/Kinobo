# Laporan Ringkasan Perubahan Kode — Server Actions CRUD & Admin UI (Kinobo)

Dokumen ini mencatat seluruh file yang ditambahkan (**[NEW]**) dan diperbarui (**[MODIFY]**) dalam implementasi Server Actions CRUD dan Antarmuka Pengguna (UI) Panel Admin Kinobo.

---

## 📁 1. File Server Actions Baru (`lib/actions/`)

1. **[NEW] [lib/actions/products.ts](file:///d:/Website/ALL%20WEBSITE/Kinobo/lib/actions/products.ts)**
   - `createProduct(data)`: Validasi Zod `productFormSchema`, memverifikasi keunikan `slug`, melakukan insert ke `products`, dan mere-revalidate rute terkait.
   - `updateProduct(id, data)`: Memperbarui data produk, memverifikasi `slug` tidak dipakai produk lain.
   - `deleteProduct(id)`: Mengecek keberadaan varian di `product_variants`. Jika masih ada varian, hapus ditolak. Jika kosong, menghapus produk.

2. **[NEW] [lib/actions/variants.ts](file:///d:/Website/ALL%20WEBSITE/Kinobo/lib/actions/variants.ts)**
   - `createVariant(data)`: Insert varian produk dengan validasi Zod `variantFormSchema` dan verifikasi `sku` unik.
   - `updateVariant(id, data)`: Memperbarui varian produk dengan verifikasi `sku` unik.
   - `deleteVariant(id)`: Menghapus varian dari `product_variants`.
   - `adjustStock(variantId, delta)`: Fungsi atomik untuk menyesuaikan stok secara reusable (dapat digunakan kembali untuk sistem checkout/payment gateway).

3. **[NEW] [lib/actions/media.ts](file:///d:/Website/ALL%20WEBSITE/Kinobo/lib/actions/media.ts)**
   - `attachMedia(productId, media)`: Menyimpan record media baru ke tabel `product_media`.
   - `deleteMedia(mediaId)`: Menghapus baris record di DB dan mencoba menghapus file fisik di Supabase Storage bucket.
   - `reorderMedia(updates)`: Mengubah urutan `sort_order` galeri media secara batch.

4. **[NEW] [lib/actions/banners.ts](file:///d:/Website/ALL%20WEBSITE/Kinobo/lib/actions/banners.ts)**
   - `createBanner(data)`: Membuat banner baru dengan validasi Zod `bannerFormSchema` & mere-revalidate rute `/`.
   - `updateBanner(id, data)`: Memperbarui data banner.
   - `deleteBanner(id)`: Menghapus banner.

5. **[NEW] [lib/actions/settings.ts](file:///d:/Website/ALL%20WEBSITE/Kinobo/lib/actions/settings.ts)**
   - `updateSiteSettings(data)`: Mengubah pengaturan situs (footer info, sosmed, WhatsApp) dengan operasi upsert batch ke `site_settings`.

---

## 🔍 2. File Queries (`lib/queries/`)

6. **[MODIFY] [lib/queries/products.ts](file:///d:/Website/ALL%20WEBSITE/Kinobo/lib/queries/products.ts)**
   - Menambahkan query `getAllProductsForAdmin()` (mengambil seluruh produk aktif & non-aktif beserta kategori, varian, dan media untuk daftar admin).
   - Menambahkan query `getProductByIdForAdmin(id)` (mengambil satu produk beserta varian & media untuk form edit admin).

7. **[MODIFY] [lib/queries/banners.ts](file:///d:/Website/ALL%20WEBSITE/Kinobo/lib/queries/banners.ts)**
   - Menambahkan query `getAllBannersForAdmin()` (mengambil seluruh banner aktif & non-aktif untuk admin).

---

## 🎨 3. File Komponen UI Admin (`components/admin/`)

8. **[NEW] [components/admin/DeleteConfirmModal.tsx](file:///d:/Website/ALL%20WEBSITE/Kinobo/components/admin/DeleteConfirmModal.tsx)**
   - Modal konfirmasi hapus data reusable untuk produk, varian, media, dan banner.

9. **[NEW] [components/admin/VariantModal.tsx](file:///d:/Website/ALL%20WEBSITE/Kinobo/components/admin/VariantModal.tsx)**
   - Modal form berbasis `react-hook-form` + `zod` untuk menambah atau mengedit varian produk (ukuran, warna, SKU, stok, harga override).

10. **[NEW] [components/admin/ProductsTable.tsx](file:///d:/Website/ALL%20WEBSITE/Kinobo/components/admin/ProductsTable.tsx)**
    - Komponen tabel daftar produk admin yang menampilkan thumbnail gambar, kategori, harga, jumlah varian, status aktif, serta tombol Edit dan Hapus.

11. **[NEW] [components/admin/BannersTable.tsx](file:///d:/Website/ALL%20WEBSITE/Kinobo/components/admin/BannersTable.tsx)**
    - Komponen tabel daftar banner admin dengan pratinjau gambar, judul, urutan, status, modal form edit, dan hapus.

12. **[MODIFY] [components/admin/ProductForm.tsx](file:///d:/Website/ALL%20WEBSITE/Kinobo/components/admin/ProductForm.tsx)**
    - Mengintegrasikan form informasi dasar produk dengan Server Actions `createProduct`/`updateProduct`.
    - Menambahkan **Sub-section Varian Produk**: menampilkan tabel varian, tombol `+ Tambah Varian Baru`, edit varian via `VariantModal`, dan hapus varian via `DeleteConfirmModal`.
    - Menambahkan **Sub-section Media Galeri**: integrasi `MediaUploader` -> `attachMedia`, pratinjau gambar/video galeri, dan tombol hapus media.

13. **[MODIFY] [components/admin/BannerForm.tsx](file:///d:/Website/ALL%20WEBSITE/Kinobo/components/admin/BannerForm.tsx)**
    - Terhubung dengan Server Actions `createBanner`/`updateBanner`, mendukung mode tambah dan edit, serta pratinjau gambar.

14. **[MODIFY] [components/admin/SettingsForm.tsx](file:///d:/Website/ALL%20WEBSITE/Kinobo/components/admin/SettingsForm.tsx)**
    - Terhubung dengan Server Action `updateSiteSettings` dan mendukung `defaultValues` ter-prefill.

---

## 🌐 4. File Halaman Admin (`app/(admin)/admin/`)

15. **[MODIFY] [app/(admin)/admin/produk/page.tsx](file:///d:/Website/ALL%20WEBSITE/Kinobo/app/%28admin%29/admin/produk/page.tsx)**
    - Mengambil data dari `getAllProductsForAdmin()` dan menampilkan `ProductsTable`.

16. **[NEW] [app/(admin)/admin/produk/baru/page.tsx](file:///d:/Website/ALL%20WEBSITE/Kinobo/app/%28admin%29/admin/produk/baru/page.tsx)**
    - Halaman form pembuatan produk baru di `/admin/produk/baru`.

17. **[NEW] [app/(admin)/admin/produk/[id]/edit/page.tsx](file:///d:/Website/ALL%20WEBSITE/Kinobo/app/%28admin%29/admin/produk/%5Bid%5D/edit/page.tsx)**
    - Halaman edit produk di `/admin/produk/[id]/edit` lengkap dengan pengelolaan varian & media.

18. **[MODIFY] [app/(admin)/admin/banner/page.tsx](file:///d:/Website/ALL%20WEBSITE/Kinobo/app/%28admin%29/admin/banner/page.tsx)**
    - Mengambil data dari `getAllBannersForAdmin()` dan menampilkan `BannersTable`.

19. **[MODIFY] [app/(admin)/admin/pengaturan/page.tsx](file:///d:/Website/ALL%20WEBSITE/Kinobo/app/%28admin%29/admin/pengaturan/page.tsx)**
    - Mengambil data dari `getSiteSettings()` dan menampilkan `SettingsForm` ter-prefill.
