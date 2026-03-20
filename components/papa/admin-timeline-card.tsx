import { coerceAdminTimelineCardItem, type AdminTimelineCardInput, type AdminTimelineCardItem } from "@/lib/admin-timeline-domain";

import { StatusBadge } from "@/components/papa/status-badge";

function getDeadlineBadge(item: AdminTimelineCardItem) {
  switch (item.deadlineBucket) {
    case "d_day":
      return { tone: "ember" as const, label: "D-Day" };
    case "d_7":
      return { tone: "ember" as const, label: item.daysRemaining ? `D-${item.daysRemaining}` : "D-7" };
    case "imminent":
      return { tone: "paper" as const, label: "마감 임박" };
    case "passed":
      return { tone: "ink" as const, label: "기한 지남" };
    case "none":
    default:
      return { tone: "paper" as const, label: "일정 확인" };
  }
}

function PolicyMetaNotice({ item }: { item: AdminTimelineCardItem }) {
  return (
    <section className="mt-4 rounded-[20px] border border-dashed border-ink/10 bg-paper/70 px-4 py-4">
      <p className="text-sm leading-6 text-ink/68">{item.metadata.regionNotice}</p>
      <dl className="mt-4 grid gap-2 text-sm text-ink/62 sm:grid-cols-[repeat(3,minmax(0,1fr))]">
        <div className="rounded-2xl bg-white px-3 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">기준일</dt>
          <dd className="mt-2 break-words text-ink">{item.metadata.effectiveDate}</dd>
        </div>
        <div className="rounded-2xl bg-white px-3 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">최종 검수일</dt>
          <dd className="mt-2 break-words text-ink">{item.metadata.verifiedAt}</dd>
        </div>
        <div className="rounded-2xl bg-white px-3 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">지역 범위</dt>
          <dd className="mt-2 break-words text-ink">{item.metadata.regionScopeLabel}</dd>
        </div>
      </dl>
    </section>
  );
}

export function AdminTimelineCard({
  item,
  onShare
}: {
  item: AdminTimelineCardInput;
  onShare?: (item: AdminTimelineCardItem) => void;
}) {
  const viewModel = coerceAdminTimelineCardItem(item);
  const state = getDeadlineBadge(viewModel);
  const amountLabel = viewModel.benefitAmountLabel ?? "필수 행정";
  const pathLabel = viewModel.deeplinkTarget === "/checklist?tab=admin" ? "체크리스트 > 행정 탭" : viewModel.deeplinkTarget;

  return (
    <article className="rounded-[24px] border border-ink/10 bg-white px-4 py-4 shadow-card sm:px-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <StatusBadge tone={state.tone}>{state.label}</StatusBadge>
          <div>
            <h3 className="break-words text-lg font-semibold text-ink">{viewModel.title}</h3>
            <p className="mt-1 text-sm text-ink/65">{viewModel.whenLabel}</p>
            <p className="mt-2 text-sm font-medium text-ink">{viewModel.dueLabel}</p>
          </div>
        </div>
        <div className="w-full rounded-2xl bg-mist px-3 py-3 text-left sm:w-auto sm:min-w-[11rem] sm:text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">혜택 / 포인트</p>
          <p className="mt-2 break-words text-sm font-medium text-ink">{amountLabel}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-ink/72">{viewModel.why}</p>
      <dl className="mt-4 grid gap-3 text-sm text-ink/72 sm:grid-cols-2">
        <div className="rounded-2xl bg-mist px-3 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">채널</dt>
          <dd className="mt-2 break-words text-ink">{viewModel.applicationChannel ?? "채널 확인 필요"}</dd>
        </div>
        <div className="rounded-2xl bg-mist px-3 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">확인 경로</dt>
          <dd className="mt-2 break-words text-ink">{pathLabel}</dd>
        </div>
      </dl>
      <PolicyMetaNotice item={viewModel} />
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-ink/90">
          자세히 보기
        </button>
        <button
          type="button"
          onClick={() => onShare?.(viewModel)}
          disabled={!onShare}
          className="rounded-full border border-ink/12 bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:border-ink/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          행정 데드라인 보내기
        </button>
      </div>
    </article>
  );
}
