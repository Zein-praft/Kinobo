/**
 * Footer storefront — menampilkan info kontak dari site_settings.
 */
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Logo & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-serif text-xl font-bold tracking-[0.2em] text-black">
            KINOBO
          </span>
          <span className="text-[10px] tracking-wider text-gray-400">
            © 2026 KINOBO. ALL RIGHTS RESERVED.
          </span>
        </div>

        {/* Right: Info Links */}
        <div className="flex flex-wrap justify-center gap-6 text-[10px] font-semibold tracking-widest text-gray-500">
          <Link href="/sustainability" className="hover:text-black transition-colors">
            SUSTAINABILITY
          </Link>
          <Link href="/contact" className="hover:text-black transition-colors">
            CONTACT
          </Link>
          <Link href="/shipping" className="hover:text-black transition-colors">
            SHIPPING
          </Link>
          <Link href="/terms" className="hover:text-black transition-colors">
            TERMS
          </Link>
          <Link href="/privacy" className="hover:text-black transition-colors">
            PRIVACY
          </Link>
        </div>
      </div>
    </footer>
  );
}
