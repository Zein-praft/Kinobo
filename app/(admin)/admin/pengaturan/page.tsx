/**
 * Halaman admin — pengaturan situs (footer info, sosmed, WhatsApp).
 */
import { getSiteSettings } from "@/lib/queries/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Pengaturan Situs</h2>
        <p className="text-sm text-gray-500">
          Kelola informasi alamat footer, kontak telepon, email, Instagram, dan WhatsApp toko.
        </p>
      </div>

      <SettingsForm defaultValues={settings} />
    </div>
  );
}
