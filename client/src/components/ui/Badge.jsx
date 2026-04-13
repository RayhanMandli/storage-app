import { cn } from "../../utils/cn";

export function Badge({ className, children }) {
  return (
    <span
      className={cn(
        "rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-zinc-200",
        className
      )}
    >
      {children}
    </span>
  );
}
