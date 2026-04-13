import { cn } from "../../utils/cn";

export function Card({ className, children }) {
  return <div className={cn("glass soft-shadow rounded-2xl", className)}>{children}</div>;
}
