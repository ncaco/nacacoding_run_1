"use client";
import * as React from "react";

type CopyFieldProps = {
  label?: string;
  value: string;
  onCopied?: () => void;
};

export function CopyField({ label, value, onCopied }: CopyFieldProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 1400);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full">
      {label ? (
        <div className="text-xs text-foreground/70 mb-1">{label}</div>
      ) : null}
      <div className="flex items-center gap-2 rounded-lg border border-black/10 dark:border-white/10 px-3 py-2">
        <div className="text-sm truncate" title={value} aria-label={label || "복사할 값"}>
          {value}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="ml-auto text-xs px-2 py-1 rounded-md bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15"
          aria-live="polite"
        >
          {copied ? "복사됨" : "복사"}
        </button>
      </div>
    </div>
  );
}

export default CopyField;


