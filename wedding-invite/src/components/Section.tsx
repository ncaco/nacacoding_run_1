import * as React from "react";
import { Reveal } from "@/components/ui/Reveal";

type SectionProps = {
  title?: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
  fullBleed?: boolean;
};

export function Section({ title, subtitle, className, children, fullBleed = false }: SectionProps) {
  return (
    <section className={["mt-10 sm:mt-16 first:mt-0", className].join(" ") }>
      <Reveal>
        {title ? (
          <div className="mb-4">
            <h2 className="title-gradient text-[22px] sm:text-2xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>{title}</h2>
            {subtitle ? <p className="text-[13px] sm:text-sm text-foreground/70 mt-1.5">{subtitle}</p> : null}
          </div>
        ) : null}
        {fullBleed ? (
          <div className="-mx-5">{children}</div>
        ) : (
          children
        )}
      </Reveal>
    </section>
  );
}

export default Section;


