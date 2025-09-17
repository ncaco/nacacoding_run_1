import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
};

export function Button({
  className,
  variant = "primary",
  fullWidth = false,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-11 px-4";
  const styles: Record<string, string> = {
    primary:
      "bg-foreground text-background hover:opacity-90 focus-visible:ring-foreground",
    secondary:
      "bg-black/5 dark:bg-white/10 text-foreground hover:bg-black/10 dark:hover:bg-white/15 focus-visible:ring-foreground",
    ghost:
      "bg-transparent text-foreground hover:bg-black/5 dark:hover:bg-white/10 focus-visible:ring-foreground",
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button className={[base, styles[variant], width, className].join(" ")} {...props} />
  );
}

export default Button;


