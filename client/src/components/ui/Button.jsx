import { cn } from "../../utils/cn";

const variants = {
  primary: "bg-sky-400 text-zinc-900 hover:bg-sky-300",
  ghost: "bg-white/5 text-white hover:bg-white/10",
  danger: "bg-rose-400 text-zinc-900 hover:bg-rose-300",
  subtle: "bg-zinc-800/80 text-zinc-100 hover:bg-zinc-700",
};

export function Button({ className, variant = "primary", asChild = false, ...props }) {
  const Component = asChild ? "span" : "button";

  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
