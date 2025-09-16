"use client";
import { PropsWithChildren, useState } from "react";

export function Accordion({ children }: PropsWithChildren) {
  return <div className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">{children}</div>;
}

export function AccordionItem({ title, children }: PropsWithChildren<{ title: string }>) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button className="w-full text-left px-5 py-4 flex items-center justify-between" onClick={() => setOpen((v) => !v)}>
        <span className="font-medium">{title}</span>
        <span className="text-neutral-500">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-5 pb-4 text-neutral-700 text-sm leading-relaxed">{children}</div>}
    </div>
  );
}


