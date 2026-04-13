import { cn } from "../../utils/cn";

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-white/10 bg-zinc-900/70 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-300/20",
        className
      )}
      {...props}
    />
  );
}
