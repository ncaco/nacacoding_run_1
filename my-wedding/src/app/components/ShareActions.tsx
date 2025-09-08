"use client";

type Props = {
  title: string;
  text: string;
  url?: string;
};

export default function ShareActions({ title, text, url }: Props) {
  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");

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
      alert("링크가 복사되었습니다.");
    } catch {
      alert("복사에 실패했습니다. 주소창의 링크를 직접 복사해 주세요.");
    }
  };

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleWebShare}
        className="h-10 px-4 rounded-full bg-black text-white text-sm"
      >
        공유하기
      </button>
      <button
        type="button"
        onClick={handleCopy}
        className="h-10 px-4 rounded-full bg-gray-200 text-black text-sm"
      >
        링크복사
      </button>
    </div>
  );
}


