"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import Modal from "./Modal";

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
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<string | number>("auto");
  const [modal, setModal] = useState<{ open: boolean; message: string }>({ open: false, message: "" });

  // 첫 렌더 시 상태에 맞게 높이 세팅
  useLayoutEffect(() => {
    if (!contentRef.current) return;
    if (open) {
      setHeight("auto");
    } else {
      setHeight(0);
    }
  }, []);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (open) {
      // 0 -> content height
      const target = el.scrollHeight;
      if (prefersReduced) {
        setHeight("auto");
        return;
      }
      // 애니메이션을 위해 우선 0으로
      el.style.height = "0px";
      // 다음 프레임에서 실제 높이로 전환
      requestAnimationFrame(() => {
        setHeight(target);
      });
    } else {
      // auto -> 픽셀 값으로 고정 후 0으로 애니메이트
      if (prefersReduced) {
        setHeight(0);
        return;
      }
      const current = el.scrollHeight;
      setHeight(current);
      requestAnimationFrame(() => setHeight(0));
    }
  }, [open]);

  // 트랜지션 종료 후 open 상태일 때에만 auto로 되돌림
  const handleTransitionEnd = () => {
    if (open) {
      setHeight("auto");
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setModal({ open: true, message: "계좌번호가 복사되었습니다." });
    } catch (e) {
      console.error(e);
      setModal({ open: true, message: "복사에 실패했습니다. 길게 눌러 수동 복사해 주세요." });
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <Modal
        open={modal.open}
        message={modal.message}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
      />
      <div className="w-full px-4 py-3 flex items-center justify-between">
        <span className="text-base font-medium">{title}</span>
      </div>
      <div
        id={`${title}-content`}
        ref={contentRef}
        onTransitionEnd={handleTransitionEnd}
        style={{ height, overflow: "hidden", transition: "height 250ms ease", willChange: "height" }}
        aria-hidden={false}
      >
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
                className="shrink-0 h-9 w-9 rounded-full bg-black text-white text-sm hover:opacity-90 grid place-items-center"
                aria-label="계좌 복사"
                title="계좌 복사"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <rect x="3" y="3" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


