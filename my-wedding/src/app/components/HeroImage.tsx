"use client";

import { useState } from "react";
import Modal from "./Modal";

type Props = {
  src: string;
  alt?: string;
};

export default function HeroImage({ src, alt = "" }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="block w-full"
        onClick={() => setOpen(true)}
        aria-label="이미지 크게 보기"
      >
        <img src={src} alt={alt} className="w-full h-[42vh] object-cover" />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} message="" autoCloseMs={0}>
        <img src={src} alt={alt} className="w-full h-auto max-h-[60vh] object-contain rounded" />
      </Modal>
    </>
  );
}


