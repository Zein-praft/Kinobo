/**
 * Footer storefront — menampilkan info kontak dari site_settings.
 */
import { getSiteSettings } from "@/lib/queries/settings";

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-8 text-sm text-gray-600 space-y-1">
        <p className="font-semibold text-black">Kinobo</p>
        {settings.footer_address && <p>{settings.footer_address}</p>}
        {settings.footer_phone && <p>Telp: {settings.footer_phone}</p>}
        {settings.footer_email && <p>Email: {settings.footer_email}</p>}
        {settings.instagram_url && (
          <a
            href={settings.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Instagram
          </a>
        )}
      </div>
    </footer>
  );
}
