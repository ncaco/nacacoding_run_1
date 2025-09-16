"use client";
import { useState } from "react";

export default function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  async function onCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div className="flex items-center gap-3 bg-cream border border-sand rounded-xl p-3">
      <div className="text-sm">
        <div className="text-neutral-500">{label}</div>
        <div className="font-medium text-ink">{value}</div>
      </div>
      <button onClick={onCopy} className="ml-auto px-3 py-1.5 rounded-full bg-ink text-cream text-xs">
        {copied ? "복사됨" : "복사"}
      </button>
    </div>
  );
}


