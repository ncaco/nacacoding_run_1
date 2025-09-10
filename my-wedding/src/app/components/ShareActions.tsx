"use client";

import { useState } from "react";
import Modal from "./Modal";

type Props = {
  title: string;
  text: string;
  url?: string;
};

export default function ShareActions({ title, text, url }: Props) {
  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
  const [modal, setModal] = useState<{ open: boolean; message: string }>({ open: false, message: "" });

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
      } catch {}
    } else {
      await handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setModal({ open: true, message: "링크가 복사되었습니다." });
    } catch {
      setModal({ open: true, message: "복사에 실패했습니다. 주소창의 링크를 직접 복사해 주세요." });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Modal open={modal.open} message={modal.message} onClose={() => setModal((m) => ({ ...m, open: false }))} />
      <button
        type="button"
        onClick={handleWebShare}
        className="h-9 sm:h-10 px-3 sm:px-4 rounded-full bg-black text-white text-xs sm:text-sm"
      >
        공유하기
      </button>
      <button
        type="button"
        onClick={handleCopy}
        className="h-9 sm:h-10 px-3 sm:px-4 rounded-full bg-gray-200 text-black text-xs sm:text-sm"
      >
        링크복사
      </button>
    </div>
  );
}


