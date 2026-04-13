import { ChevronRight } from "lucide-react";

export function DirectoryBreadcrumbs({ path = [], onNavigate }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-zinc-300">
      {path.map((segment, index) => {
        const isLast = index === path.length - 1;
        return (
          <button
            key={segment._id || segment.name || index}
            className={`inline-flex items-center gap-2 rounded-lg px-2 py-1 ${
              isLast ? "bg-white/10 text-white" : "hover:bg-white/5"
            }`}
            onClick={() => onNavigate?.(segment._id)}
            disabled={isLast}
          >
            {segment.name || "Folder"}
            {!isLast && <ChevronRight size={14} className="text-zinc-500" />}
          </button>
        );
      })}
    </div>
  );
}
