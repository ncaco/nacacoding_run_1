import * as React from "react";

type HeroProps = {
  src: string;
  alt?: string;
  caption?: string;
};

export function Hero({ src, alt = "커플 사진", caption }: HeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-black/5 dark:bg-white/5">
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(0,0,0,0.5)_100%)]" />
      {caption ? (
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <p className="text-base font-medium" style={{ fontFamily: "var(--font-display)" }}>{caption}</p>
        </div>
      ) : null}
    </div>
  );
}

export default Hero;


