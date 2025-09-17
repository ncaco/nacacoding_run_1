"use client";
import * as React from "react";
import { ShareIcon } from "@/components/ui/icons";

type ShareButtonProps = {
  title: string;
  text?: string;
  url?: string;
  className?: string;
};

export function ShareButton({ title, text, url, className }: ShareButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleShare = async () => {
    const shareData: ShareData = {
      title,
      text,
      url: url ?? (typeof window !== "undefined" ? window.location.href : undefined),
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch (e) {
      // fallback to copy
    }

    try {
      const toCopy = shareData.url || "";
      if (toCopy) {
        await navigator.clipboard.writeText(toCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={[
        "inline-flex items-center gap-2 rounded-md bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 px-3 py-2 text-sm",
        className,
      ].join(" ")}
      aria-live="polite"
    >
      <ShareIcon size={18} />
      <span>{copied ? "복사됨" : "공유"}</span>
    </button>
  );
}

export default ShareButton;


