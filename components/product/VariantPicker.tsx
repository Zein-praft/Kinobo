"use client";

/**
 * Pemilih varian — kombinasi ukuran & warna dengan info stok/harga.
 */
import { useMemo, useState } from "react";
import type { ProductVariant } from "@/lib/types/database.types";
import { SizeSelector } from "@/components/product/SizeSelector";
import { Badge } from "@/components/ui/badge";

interface VariantPickerProps {
  variants: ProductVariant[];
  basePrice: number;
}

export function VariantPicker({ variants, basePrice }: VariantPickerProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const sizes = useMemo(
    () => [...new Set(variants.map((v) => v.size))],
    [variants]
  );
  const colors = useMemo(
    () => [...new Set(variants.map((v) => v.color))],
    [variants]
  );

  const selectedVariant = variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const displayPrice = selectedVariant?.price_override ?? basePrice;

  return (
    <div className="mt-6 space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">Ukuran</p>
        <SizeSelector
          sizes={sizes}
          selected={selectedSize}
          onSelect={setSelectedSize}
        />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Warna</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={`px-3 py-1 border rounded text-sm ${
                selectedColor === color
                  ? "border-black bg-black text-white"
                  : "border-gray-300 hover:border-black"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {selectedVariant && (
        <div className="flex items-center gap-3">
          <p className="font-semibold">
            Rp {Number(displayPrice).toLocaleString("id-ID")}
          </p>
          <Badge variant={selectedVariant.stock > 0 ? "success" : "warning"}>
            {selectedVariant.stock > 0
              ? `${selectedVariant.stock} tersedia`
              : "Habis"}
          </Badge>
        </div>
      )}
    </div>
  );
}
