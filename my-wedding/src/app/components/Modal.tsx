"use client";

import { useEffect, ReactNode } from "react";

type Props = {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  autoCloseMs?: number;
  children?: ReactNode;
};

export default function Modal({ open, title, message, onClose, autoCloseMs = 1400, children }: Props) {
  useEffect(() => {
    if (!open) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    if (typeof autoCloseMs === "number" && autoCloseMs > 0) {
      t = setTimeout(onClose, autoCloseMs);
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      if (t) clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, autoCloseMs]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div
        className="relative w-[min(92vw,720px)] max-h-[80vh] overflow-auto rounded-2xl bg-white shadow-lg border border-[#f2e6e9] p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {children ? (
          <>
            {title && <div className="text-base font-semibold mb-3">{title}</div>}
            {children}
            <button
              type="button"
              onClick={onClose}
              className="mt-4 inline-flex h-9 px-4 items-center rounded-full bg-black text-white text-sm hover:opacity-90"
            >
              닫기
            </button>
          </>
        ) : (
          <>
            {title && <div className="text-base font-semibold mb-1">{title}</div>}
            <div className="text-sm text-gray-700">{message}</div>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 inline-flex h-9 px-4 items-center rounded-full bg-black text-white text-sm hover:opacity-90"
            >
              확인
            </button>
          </>
        )}
      </div>
    </div>
  );
}


