import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContextSummaryTone = "default" | "accent";

export type ContextSummaryBarItem = {
  label: string;
  value: string;
  tone?: ContextSummaryTone;
};

const itemGridClass = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4"
} as const;

const valueToneClass: Record<ContextSummaryTone, string> = {
  default: "text-ink",
  accent: "text-ember"
};

export function ContextSummaryBar({
  items,
  action,
  ariaLabel = "현재 컨텍스트",
  className
}: {
  items: ContextSummaryBarItem[];
  action?: ReactNode;
  ariaLabel?: string;
  className?: string;
}) {
  const resolvedColumns = (items.length >= 4 ? 4 : Math.max(items.length, 1)) as 1 | 2 | 3 | 4;

  return (
    <section
      aria-label={ariaLabel}
      className={cn("rounded-[24px] border border-ink/10 bg-white/90 p-4 shadow-card", className)}
    >
      {action ? (
        <div className="mb-3 flex items-start justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">현재 컨텍스트</p>
          <div className="shrink-0">{action}</div>
        </div>
      ) : null}
      <div className={cn("grid grid-cols-2 gap-3", itemGridClass[resolvedColumns])}>
        {items.map((item) => (
          <div key={item.label} className="min-w-0 rounded-2xl bg-mist px-3 py-3">
            <p className="line-clamp-2 break-keep text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">
              {item.label}
            </p>
            <p
              className={cn(
                "mt-2 line-clamp-2 break-keep text-sm font-medium leading-5",
                valueToneClass[item.tone ?? "default"]
              )}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
