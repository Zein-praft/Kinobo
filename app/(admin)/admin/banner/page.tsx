/**
 * Halaman admin — manajemen banner halaman depan.
 */
import { BannerForm } from "@/components/admin/BannerForm";

export default function AdminBannerPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manajemen Banner</h2>
      <BannerForm />
    </div>
  );
}
