/**
 * Layout admin — wrapper untuk panel administrasi Kinobo.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <h1 className="text-lg font-semibold">Kinobo Admin</h1>
      </header>
      <div className="p-6">{children}</div>
    </div>
  );
}
