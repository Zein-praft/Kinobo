/**
 * Navbar storefront — navigasi utama website Kinobo.
 */
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-transparent mix-blend-difference">
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="font-serif text-2xl text-white hover:opacity-80 transition-opacity">
          kinobo.id
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-[0.15em] text-white/60 font-sans">
          <Link href="/kategori/new-drops" className="text-white hover:text-white transition-colors">
            NEW DROPS
          </Link>
          <Link href="/kategori/collection" className="hover:text-white transition-colors">
            COLLECTION
          </Link>
          <Link href="/kategori/browse" className="hover:text-white transition-colors">
            BROWSE
          </Link>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-6 text-white">
          {/* Search Icon */}
          <button className="hover:opacity-60 transition-opacity aria-label='Search'">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z" />
            </svg>
          </button>

          {/* Wishlist / Heart Icon */}
          <button className="hover:opacity-60 transition-opacity aria-label='Wishlist'">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>

          {/* Cart Icon */}
          <Link href="/keranjang" className="relative hover:opacity-60 transition-opacity flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span className="text-[10px] font-bold absolute -top-1 -right-1 bg-white text-black w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
