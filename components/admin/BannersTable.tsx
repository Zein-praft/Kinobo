"use client";

/**
 * Tabel daftar banner admin — menampilkan pratinjau banner, status, urutan, serta modal edit & hapus.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteBanner } from "@/lib/actions/banners";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { BannerForm } from "@/components/admin/BannerForm";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import type { SiteBanner } from "@/lib/types/database.types";

interface BannersTableProps {
  banners: SiteBanner[];
}

export function BannersTable({ banners }: BannersTableProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<SiteBanner | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setLoading(true);
    setErrorMessage(null);

    const res = await deleteBanner(deleteId);
    setLoading(false);
    setDeleteId(null);

    if (!res.success) {
      setErrorMessage(res.error ?? "Gagal menghapus banner");
    } else {
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
          {errorMessage}
        </div>
      )}

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Total banner: <span className="font-semibold">{banners.length}</span>
        </p>
        <Button
          onClick={() => {
            setSelectedBanner(null);
            setModalOpen(true);
          }}
        >
          + Tambah Banner Baru
        </Button>
      </div>

      {banners.length === 0 ? (
        <div className="bg-white border rounded-lg p-8 text-center text-gray-500">
          Belum ada banner. Klik "+ Tambah Banner Baru" untuk mengunggah banner pertama.
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
                <tr>
                  <th className="px-4 py-3">Banner</th>
                  <th className="px-4 py-3">Judul & Subjudul</th>
                  <th className="px-4 py-3">Link Target</th>
                  <th className="px-4 py-3">Urutan</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {banners.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img
                        src={b.image_url}
                        alt={b.title ?? "Banner"}
                        className="h-14 w-28 object-cover rounded border"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {b.title || <span className="italic text-gray-400">Tanpa Judul</span>}
                      </div>
                      {b.subtitle && (
                        <div className="text-xs text-gray-500">{b.subtitle}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-600">
                      {b.link_url || "-"}
                    </td>
                    <td className="px-4 py-3 font-semibold">{b.sort_order}</td>
                    <td className="px-4 py-3">
                      {b.is_active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Non-aktif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right space-x-3">
                      <button
                        type="button"
                        className="text-xs font-medium text-blue-600 hover:underline"
                        onClick={() => {
                          setSelectedBanner(b);
                          setModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-xs font-medium text-red-600 hover:underline"
                        onClick={() => setDeleteId(b.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Banner Form Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedBanner ? "Edit Banner" : "Tambah Banner"}
      >
        <BannerForm
          banner={selectedBanner}
          onSuccess={() => setModalOpen(false)}
        />
      </Modal>

      {/* Delete Banner Confirm Modal */}
      <DeleteConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Banner"
        description="Apakah Anda yakin ingin menghapus banner ini dari halaman depan?"
        loading={loading}
      />
    </div>
  );
}
