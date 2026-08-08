/**
 * Navbar storefront — navigasi utama website Kinobo.
 */
import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Kinobo
        </Link>
        <div className="flex gap-6 text-sm">
          <Link href="/" className="hover:underline">
            Beranda
          </Link>
          <Link href="/admin/produk" className="hover:underline text-gray-500">
            Admin
          </Link>
        </div>
      </nav>
    </header>
  );
}
