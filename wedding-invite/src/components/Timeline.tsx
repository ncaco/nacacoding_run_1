import * as React from "react";

type Item = { time: string; label: string; };
type TimelineProps = { items: Item[] };

export function Timeline({ items }: TimelineProps) {
  return (
    <ol className="relative border-s border-black/10 dark:border-white/10 ps-4">
      {items.map((it, i) => (
        <li key={i} className="mb-4">
          <div className="absolute -ms-[9px] mt-1 size-2 rounded-full bg-foreground" />
          <div className="text-xs text-foreground/60">{it.time}</div>
          <div className="text-sm font-medium">{it.label}</div>
        </li>
      ))}
    </ol>
  );
}

export default Timeline;


