import * as React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  muted?: boolean;
};

export function Card({ className, children, muted = false, ...props }: CardProps) {
  const base = "rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/30 backdrop-blur p-5";
  const tone = muted ? "opacity-90" : "";
  return (
    <div className={[base, tone, className].join(" ")} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold tracking-tight">{children}</h3>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="mt-3 text-sm leading-6">{children}</div>;
}

export default Card;


