import { ReactNode } from "react";

import { StatusBadge } from "@/components/papa/status-badge";

export function ActionCard({
  eyebrow,
  title,
  description,
  bullets,
  footer
}: {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  footer: ReactNode;
}) {
  return (
    <article className="rounded-[28px] border border-ink/10 bg-white px-5 py-5 shadow-card">
      <StatusBadge tone="ember">{eyebrow}</StatusBadge>
      <div className="mt-4 space-y-3">
        <div>
          <h3 className="font-display text-2xl leading-tight text-ink">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-ink/65">{description}</p>
        </div>
        <ol className="space-y-2">
          {bullets.map((bullet, index) => (
            <li
              key={bullet}
              className="flex gap-3 rounded-2xl bg-mist px-3 py-3 text-sm leading-6 text-ink"
            >
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper">
                {index + 1}
              </span>
              <span className="min-w-0">{bullet}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-4">{footer}</div>
    </article>
  );
}
