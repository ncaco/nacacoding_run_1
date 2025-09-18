"use client";
import * as React from "react";
import { CopyIcon, CheckIcon } from "@/components/ui/icons";
import { useToast } from "@/components/ui/toast";

type CopyFieldProps = {
  label?: string;
  value: string;
  onCopied?: () => void;
  rightExtra?: React.ReactNode;
};

export function CopyField({ label, value, onCopied, rightExtra }: CopyFieldProps) {
  const [copied, setCopied] = React.useState(false);

  const { push } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 1400);
      push("계좌번호가 복사되었습니다");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full">
      {label ? (
        <div className="text-xs text-foreground/70 mb-1">{label}</div>
      ) : null}
      <div className="field-grid rounded-lg border border-black/10 dark:border-white/10 px-3 py-2">
        <div className="text-sm truncate" title={value} aria-label={label || "복사할 값"}>
          {value}
        </div>
        <div className="ml-auto flex items-center gap-1">
          {rightExtra}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15"
            aria-live="polite"
          >
            {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
            <span>{copied ? "복사됨" : "복사"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CopyField;


