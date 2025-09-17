"use client";
import * as React from "react";
import { Modal, ImageViewer } from "@/components/ui/Modal";

type GalleryItem = {
  src: string;
  alt?: string;
};

type GalleryProps = {
  items: GalleryItem[];
};

export function Gallery({ items }: GalleryProps) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-3">
        {items.map((it, idx) => (
          <button key={idx} onClick={() => openAt(idx)} className="relative overflow-hidden rounded-xl aspect-square bg-black/5 dark:bg-white/5 focus-ring">
            <img src={it.src} alt={it.alt ?? "사진"} className="h-full w-full object-cover image-zoom" loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="max-h-[80vh] overflow-hidden">
          <ImageViewer images={items.map((i) => i.src)} index={index} onChange={setIndex} />
        </div>
      </Modal>
    </>
  );
}

export default Gallery;


