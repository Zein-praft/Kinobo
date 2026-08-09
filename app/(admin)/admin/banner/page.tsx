/**
 * Halaman admin — manajemen banner halaman depan.
 */
import { getAllBannersForAdmin } from "@/lib/queries/banners";
import { BannersTable } from "@/components/admin/BannersTable";

export default async function AdminBannerPage() {
  const banners = await getAllBannersForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Manajemen Banner</h2>
        <p className="text-sm text-gray-500">
          Kelola banner promosi dan carousel yang tampil di beranda toko.
        </p>
      </div>

      <BannersTable banners={banners} />
    </div>
  );
}
