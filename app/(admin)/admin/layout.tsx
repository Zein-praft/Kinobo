/**
 * Layout admin — wrapper untuk panel administrasi Kinobo.
 * Diproteksi oleh guard `requireAdmin()` di level Server Component.
 */
import { requireAdmin } from "@/lib/supabase/auth";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Kinobo Admin</h1>
          {user?.email && (
            <p className="text-xs text-gray-500">{user.email}</p>
          )}
        </div>
        <LogoutButton />
      </header>
      <div className="p-6">{children}</div>
    </div>
  );
}
