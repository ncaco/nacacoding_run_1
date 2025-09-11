"use client";

import Image from "next/image";
import { useState } from "react";

type GalleryItem = {
  src: string;
  alt?: string;
};

type Props = {
  items: GalleryItem[];
};

export default function Gallery({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = () => setOpenIndex(null);

  return (
    <>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {items.map((it, idx) => (
          <button
            key={`${it.src}-${idx}`}
            type="button"
            className="relative h-24 rounded-xl overflow-hidden bg-gray-100 shadow-sm ring-1 ring-[#f2e6e9] transition-transform hover:scale-[1.02]"
            onClick={() => setOpenIndex(idx)}
          >
            <Image src={it.src} alt={it.alt ?? ""} fill className="object-contain" unoptimized loading="lazy" />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={close}
        >
          <div className="relative w-full max-w-3xl aspect-[4/3] bg-black" onClick={(e) => e.stopPropagation()}>
            <Image
              src={items[openIndex].src}
              alt={items[openIndex].alt ?? ""}
              fill
              className="object-contain"
              unoptimized
              priority
            />
            <button
              type="button"
              className="absolute top-2 right-2 h-10 w-10 rounded-full bg-white/90 text-black"
              onClick={close}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}


