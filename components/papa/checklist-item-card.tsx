import type { ChecklistItem } from "@/lib/checklist-domain";

function getOwnerLabel(owner: ChecklistItem["who"]) {
  switch (owner) {
    case "dad":
      return "아빠";
    case "mom":
      return "엄마";
    case "couple":
      return "부부 함께";
    case "admin":
      return "행정";
  }
}

function getPrimaryCtaLabel(item: ChecklistItem) {
  if (item.deeplink_target === "/checklist?tab=admin") {
    return "행정 탭 보기";
  }

  if (item.affiliate_target) {
    return "구매 후보 보기";
  }

  return "자세히 보기";
}

export function ChecklistItemCard({
  item,
  checked,
  onCheckedChange,
  onShare
}: {
  item: ChecklistItem;
  checked: boolean;
  onCheckedChange: () => void;
  onShare?: () => void;
}) {
  return (
    <article className="rounded-[24px] border border-ink/10 bg-white px-4 py-4 shadow-card">
      <div className="flex items-start gap-3">
        <input
          id={item.id}
          type="checkbox"
          checked={checked}
          onChange={onCheckedChange}
          className="mt-1 h-5 w-5 rounded border-ink/20 text-ember focus:ring-ember"
        />
        <div className="min-w-0 flex-1">
          <label htmlFor={item.id} className="block text-base font-semibold text-ink">
            {item.title}
          </label>
          <p className="mt-2 text-sm leading-6 text-ink/70">{item.why}</p>
        </div>
      </div>
      <dl className="mt-4 grid gap-3 text-sm text-ink/72 sm:grid-cols-2">
        <div className="rounded-2xl bg-mist px-3 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">언제</dt>
          <dd className="mt-2 break-words">{item.when_label}</dd>
        </div>
        <div className="rounded-2xl bg-mist px-3 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">누가</dt>
          <dd className="mt-2 break-words">{getOwnerLabel(item.who)}</dd>
        </div>
        <div className="rounded-2xl bg-mist px-3 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">예산</dt>
          <dd className="mt-2 break-words">{item.cost_range ?? "미정"}</dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="rounded-full bg-ink px-4 py-3 text-sm font-medium text-paper transition hover:bg-ink/90 active:scale-[0.98]">
          {getPrimaryCtaLabel(item)}
        </button>
        <button
          type="button"
          onClick={onShare}
          disabled={!onShare}
          aria-label={`${item.title} - 남편에게 보내기`}
          className="rounded-full border border-ink/12 bg-paper px-4 py-3 text-sm font-medium text-ink transition hover:border-ink/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          남편에게 보내기
        </button>
      </div>
    </article>
  );
}
