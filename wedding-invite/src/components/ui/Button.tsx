import Link from "next/link";
import { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonProps = Omit<ComponentPropsWithoutRef<"button">, "color"> & {
  href?: string;
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
};

export default function Button({ href, variant = "primary", size = "md", className = "", children, ...rest }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-full transition-colors duration-200";
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  } as const;
  const variants = {
    primary: "bg-[#2b2a2a] text-[#f7f1ea] hover:opacity-90",
    ghost: "bg-transparent text-neutral-900 hover:bg-black/5",
    outline: "border border-[#e8d8c8] text-neutral-900 hover:bg-[#f7f1ea]",
  } as const;
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button className={cls} {...rest}>{children}</button>;
}


