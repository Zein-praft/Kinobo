/**
 * Layout admin — wrapper untuk panel administrasi Kinobo.
 * Diproteksi oleh guard `requireAdmin()` di level Server Component.
 */
import { requireAdmin } from "@/lib/supabase/auth";
import { LogoutButton } from "@/components/admin/LogoutButton";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div>
            <h1 className="font-serif text-lg font-bold text-black flex items-center gap-2">
              kinobo.id
              <span className="font-sans text-[10px] font-bold px-2 py-0.5 rounded bg-black text-white uppercase tracking-wider">
                Admin
              </span>
            </h1>
            {user?.email && (
              <p className="text-[10px] text-gray-400 font-sans mt-0.5">{user.email}</p>
            )}
          </div>

          {/* Navigation Links for Admin Panel */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold tracking-wider font-sans text-gray-500">
            <Link href="/admin/produk" className="hover:text-black transition-colors">
              PRODUK
            </Link>
            <Link href="/admin/banner" className="hover:text-black transition-colors">
              BANNER
            </Link>
            <Link href="/admin/pengaturan" className="hover:text-black transition-colors">
              PENGATURAN
            </Link>
            <Link href="/" className="hover:text-black transition-colors border-l pl-6 border-gray-200">
              LIHAT TOKO ↗
            </Link>
          </nav>
        </div>
        <LogoutButton />
      </header>
      <div className="p-6">{children}</div>
    </div>
  );
}
