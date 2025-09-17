"use client";
import * as React from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
};

export function Reveal({ children, className, once = true }: RevealProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div ref={ref} className={["reveal", visible ? "reveal--visible" : "", className].join(" ")}>{children}</div>
  );
}

export default Reveal;


