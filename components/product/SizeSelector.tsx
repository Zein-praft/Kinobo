"use client";

/**
 * Pemilih ukuran — Client Component interaktif untuk pilih size varian.
 */
interface SizeSelectorProps {
  sizes: string[];
  selected: string | null;
  onSelect: (size: string) => void;
}

export function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => onSelect(size)}
          className={`px-3 py-1 border rounded text-sm ${
            selected === size
              ? "border-black bg-black text-white"
              : "border-gray-300 hover:border-black"
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
