import { ChecklistItem } from "@/lib/papa-data";

export function ChecklistItemCard({ item }: { item: ChecklistItem }) {
  return (
    <article className="rounded-[24px] border border-ink/10 bg-white px-4 py-4 shadow-card">
      <div className="flex items-start gap-3">
        <input
          id={item.id}
          type="checkbox"
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
          <dd className="mt-2 break-words">{item.when}</dd>
        </div>
        <div className="rounded-2xl bg-mist px-3 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">누가</dt>
          <dd className="mt-2 break-words">{item.owner}</dd>
        </div>
        <div className="rounded-2xl bg-mist px-3 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">예산</dt>
          <dd className="mt-2 break-words">{item.budget}</dd>
        </div>
        <div className="rounded-2xl bg-mist px-3 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">
            사회적 증거
          </dt>
          <dd className="mt-2 break-words">{item.socialProof}</dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-ink/90">
          {item.cta}
        </button>
        <button type="button" className="rounded-full border border-ink/12 bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:border-ink/30">
          남편에게 보내기
        </button>
      </div>
    </article>
  );
}
