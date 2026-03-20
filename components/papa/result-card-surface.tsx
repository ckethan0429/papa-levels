import { type ReactNode } from "react";

import { StatusBadge } from "@/components/papa/status-badge";
import { cn } from "@/lib/utils";

type StatusBadgeTone = NonNullable<Parameters<typeof StatusBadge>[0]["tone"]>;
type ResultMetricTone = "accent" | "default" | "muted";

type ResultCardMetric = {
  label: string;
  value: string;
  tone?: ResultMetricTone;
};

type ResultCardSurfaceProps = {
  eyebrow: string;
  eyebrowTone?: StatusBadgeTone;
  title: string;
  body: ReactNode;
  bodyClassName?: string;
  metrics: ResultCardMetric[];
  metricColumns?: 1 | 2 | 3;
  footer?: ReactNode;
};

const metricColumnClass = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3"
} as const;

const metricToneClass: Record<ResultMetricTone, string> = {
  accent: "text-lime",
  default: "text-paper",
  muted: "text-paper/72"
};

export function ResultCardSurface({
  eyebrow,
  eyebrowTone = "lime",
  title,
  body,
  bodyClassName,
  metrics,
  metricColumns,
  footer
}: ResultCardSurfaceProps) {
  const resolvedMetricColumns = metricColumns ?? ((metrics.length >= 3 ? 3 : Math.max(metrics.length, 1)) as 1 | 2 | 3);

  return (
    <section
      aria-label={title}
      className="overflow-hidden rounded-[28px] bg-ink px-5 py-5 text-paper shadow-panel"
    >
      <StatusBadge tone={eyebrowTone}>{eyebrow}</StatusBadge>
      <div className="mt-4 space-y-3">
        <div>
          <h3 className="break-keep text-balance font-display text-2xl leading-tight">{title}</h3>
          <div
            className={cn(
              "mt-2 break-keep text-sm leading-6 text-paper/72 [&_strong]:text-paper [&_strong]:font-semibold",
              bodyClassName
            )}
          >
            {body}
          </div>
        </div>
        {metrics.length > 0 && (
          <div className={cn("grid gap-3", metricColumnClass[resolvedMetricColumns])}>
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="flex h-full min-w-0 flex-col rounded-[22px] bg-white/8 px-3 py-3"
              >
                <p className="line-clamp-2 break-keep text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/45">
                  {metric.label}
                </p>
                <p
                  className={cn(
                    "mt-3 break-keep text-xl font-semibold leading-snug sm:text-2xl",
                    metricToneClass[metric.tone ?? "accent"]
                  )}
                >
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      {footer ? <div className="mt-4">{footer}</div> : null}
    </section>
  );
}
