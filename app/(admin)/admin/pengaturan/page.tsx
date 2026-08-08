/**
 * Halaman admin — pengaturan situs (footer info, sosmed).
 */
import { SettingsForm } from "@/components/admin/SettingsForm";

export default function AdminSettingsPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pengaturan Situs</h2>
      <SettingsForm />
    </div>
  );
}
