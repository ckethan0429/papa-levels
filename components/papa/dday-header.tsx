import { StatusBadge } from "@/components/papa/status-badge";

export function DdayHeader({
  dday,
  title,
  detail,
  progressLabel = "42%"
}: {
  dday: string;
  title: string;
  detail: string;
  progressLabel?: string;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] bg-ink px-5 py-5 text-paper shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <StatusBadge tone="lime">{dday}</StatusBadge>
          <div>
            <h2 className="font-display text-2xl leading-tight sm:text-[2rem]">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-paper/72">{detail}</p>
          </div>
        </div>
        <div className="hidden rounded-[24px] bg-white/8 px-4 py-3 text-right sm:block">
          <p className="text-xs uppercase tracking-[0.28em] text-paper/45">Progress</p>
          <p className="mt-2 text-3xl font-semibold text-lime">{progressLabel}</p>
        </div>
      </div>
    </section>
  );
}
