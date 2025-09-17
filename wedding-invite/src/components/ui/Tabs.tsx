"use client";
import * as React from "react";

type TabsProps<T extends string> = {
  tabs: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
};

export function Tabs<T extends string>({ tabs, value, onChange, className }: TabsProps<T>) {
  return (
    <div className={["inline-flex rounded-lg border border-black/10 dark:border-white/10 p-1 bg-black/5 dark:bg-white/10", className].join(" ")}>
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={[
              "px-3 py-1.5 text-xs rounded-md",
              active ? "bg-white dark:bg-black shadow-sm" : "text-foreground/70",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;


