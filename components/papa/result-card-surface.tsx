import { ReactNode } from "react";

import { StatusBadge } from "@/components/papa/status-badge";

export function ResultCardSurface({
  eyebrow,
  title,
  body,
  metrics,
  footer
}: {
  eyebrow: string;
  title: string;
  body: string;
  metrics: Array<{ label: string; value: string }>;
  footer: ReactNode;
}) {
  return (
    <section
      aria-label={title}
      className="rounded-[28px] bg-ink px-5 py-5 text-paper shadow-panel"
    >
      <StatusBadge tone="lime">{eyebrow}</StatusBadge>
      <div className="mt-4 space-y-3">
        <div>
          <h3 className="line-clamp-3 font-display text-2xl leading-tight">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-paper/72">{body}</p>
        </div>
        {metrics.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="min-w-0 rounded-[22px] bg-white/8 px-3 py-3">
                <p className="truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/45">
                  {metric.label}
                </p>
                <p className="mt-3 truncate text-xl font-semibold text-lime">{metric.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4">{footer}</div>
    </section>
  );
}
