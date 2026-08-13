/**
 * Footer storefront — menampilkan info kontak dan link navigasi dengan gaya Bold Editorial.
 */
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black text-white py-24 mt-20 border-t border-neutral-900 select-none">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Column: Massive Brand Name & Copyright */}
        <div className="flex flex-col justify-between h-full space-y-12">
          <div>
            <span className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-none block">
              kinobo.id
            </span>
          </div>
          <div className="text-[10px] tracking-widest text-neutral-500 font-sans">
            © 2026 KINOBO.ID. ALL RIGHTS RESERVED.
          </div>
        </div>

        {/* Right Column: Nested Grid (2 rows x 2 columns) */}
        <div className="grid grid-rows-2 gap-y-12">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-x-8">
            {/* Col 1: Shop Links */}
            <div>
              <h4 className="text-neutral-500 text-[10px] font-bold tracking-widest uppercase mb-4 font-sans">
                SHOP
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-300 font-sans">
                <li>
                  <Link href="/kategori/new-drops" className="hover:text-white transition-colors">
                    NEW DROPS
                  </Link>
                </li>
                <li>
                  <Link href="/kategori/collection" className="hover:text-white transition-colors">
                    COLLECTION
                  </Link>
                </li>
                <li>
                  <Link href="/kategori/browse" className="hover:text-white transition-colors">
                    BROWSE ALL
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 2: Info Links */}
            <div>
              <h4 className="text-neutral-500 text-[10px] font-bold tracking-widest uppercase mb-4 font-sans">
                INFORMATION
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-300 font-sans">
                <li>
                  <Link href="/sustainability" className="hover:text-white transition-colors">
                    SUSTAINABILITY
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-white transition-colors">
                    SHIPPING INFO
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-x-8">
            {/* Col 1: Contact Details */}
            <div>
              <h4 className="text-neutral-500 text-[10px] font-bold tracking-widest uppercase mb-4 font-sans">
                CONTACT
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-300 font-sans">
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    GET IN TOUCH
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@kinobo.id" className="hover:text-white transition-colors">
                    SUPPORT@KINOBO.ID
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 2: Legal Links */}
            <div>
              <h4 className="text-neutral-500 text-[10px] font-bold tracking-widest uppercase mb-4 font-sans">
                LEGAL
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-300 font-sans">
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    TERMS & CONDITIONS
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    PRIVACY POLICY
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
