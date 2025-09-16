import { PropsWithChildren } from "react";

export function Card({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <div className={`bg-white rounded-2xl shadow p-6 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}

export function CardMuted({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <p className={`text-sm text-neutral-600 ${className}`}>{children}</p>;
}


