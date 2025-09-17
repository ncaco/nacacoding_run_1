"use client";
import * as React from "react";
import { createPortal } from "react-dom";
import { XIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ open, onClose, children }: ModalProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Body scroll lock while modal is open
  React.useEffect(() => {
    if (!mounted) return;
    if (!open) return;
    const htmlStyle = document.documentElement.style;
    const bodyStyle = document.body.style;
    const prevHtmlOverflow = htmlStyle.overflow;
    const prevBodyOverflow = bodyStyle.overflow;
    htmlStyle.overflow = "hidden";
    bodyStyle.overflow = "hidden";
    return () => {
      htmlStyle.overflow = prevHtmlOverflow;
      bodyStyle.overflow = prevBodyOverflow;
    };
  }, [mounted, open]);

  if (!open || !mounted) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 flex items-center justify-center p-4" onClick={handleBackdropClick}>
        <div className="relative w-full max-w-md sm:max-w-lg" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
          <button aria-label="닫기" className="absolute -top-10 right-0 text-white" onClick={onClose}>
            <XIcon size={24} />
          </button>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

type ImageViewerProps = {
  images: string[];
  index: number;
  onChange: (nextIndex: number) => void;
};

export function ImageViewer({ images, index, onChange }: ImageViewerProps) {
  const prev = () => onChange((index - 1 + images.length) % images.length);
  const next = () => onChange((index + 1) % images.length);
  return (
    <div className="relative">
      <img src={images[index]} alt={`이미지 ${index + 1}`} className="w-full h-auto rounded-xl" />
      <button className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/40 rounded-full p-2 focus-ring" onClick={prev} aria-label="이전">
        <ChevronLeftIcon size={22} />
      </button>
      <button className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/40 rounded-full p-2 focus-ring" onClick={next} aria-label="다음">
        <ChevronRightIcon size={22} />
      </button>
    </div>
  );
}

export default Modal;


