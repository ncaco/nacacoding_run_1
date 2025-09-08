"use client";

import { useState } from "react";

type Account = {
  label: string;
  bank: string;
  number: string;
};

type Props = {
  title: string;
  accounts: Account[];
};

export default function AccountList({ title, accounts }: Props) {
  const [open, setOpen] = useState(true);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("계좌번호가 복사되었습니다.");
    } catch (e) {
      console.error(e);
      alert("복사에 실패했습니다. 길게 눌러 수동 복사해 주세요.");
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl">
      <button
        type="button"
        className="w-full px-4 py-3 flex items-center justify-between"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-base font-medium">{title}</span>
        <span className="text-gray-500">{open ? "접기" : "펼치기"}</span>
      </button>
      {open && (
        <ul className="px-4 pb-3 space-y-2">
          {accounts.map((a) => (
            <li key={`${a.label}-${a.number}`} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-gray-800">{a.label}</div>
                <div className="text-sm text-gray-500 truncate">{a.bank} {a.number}</div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(`${a.bank} ${a.number}`)}
                className="shrink-0 h-9 px-3 rounded-full bg-black text-white text-sm hover:opacity-90"
              >
                복사
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


