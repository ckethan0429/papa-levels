import { DeadlineItem } from "@/lib/papa-data";

import { StatusBadge } from "@/components/papa/status-badge";

const stateTone = {
  today: { tone: "ember" as const, label: "D-Day" },
  soon: { tone: "ember" as const, label: "D-7" },
  upcoming: { tone: "paper" as const, label: "예정" },
  done: { tone: "lime" as const, label: "완료" },
  expired: { tone: "ink" as const, label: "지남" }
};

export function AdminTimelineCard({ item }: { item: DeadlineItem }) {
  const state = stateTone[item.state];

  return (
    <article className="rounded-[24px] border border-ink/10 bg-white px-4 py-4 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <StatusBadge tone={state.tone}>{state.label}</StatusBadge>
          <div>
            <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
            <p className="mt-1 text-sm text-ink/65">{item.dueLabel}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-mist px-3 py-3 text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">혜택</p>
          <p className="mt-2 text-sm font-medium text-ink">{item.amount}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-ink/72">{item.note}</p>
      <dl className="mt-4 grid gap-3 text-sm text-ink/72 sm:grid-cols-3">
        <div className="rounded-2xl bg-mist px-3 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">채널</dt>
          <dd className="mt-2">{item.channel}</dd>
        </div>
        <div className="rounded-2xl bg-mist px-3 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">기준일</dt>
          <dd className="mt-2">{item.effectiveDate}</dd>
        </div>
        <div className="rounded-2xl bg-mist px-3 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">최종 검수</dt>
          <dd className="mt-2">{item.verifiedAt}</dd>
        </div>
      </dl>
      <div className="mt-3 rounded-2xl border border-dashed border-ink/10 px-3 py-3 text-sm text-ink/62">
        지역 범위: {item.regionScope}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-ink/90">
          자세히 보기
        </button>
        <button type="button" className="rounded-full border border-ink/12 bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:border-ink/30">
          행정 데드라인 보내기
        </button>
      </div>
    </article>
  );
}
