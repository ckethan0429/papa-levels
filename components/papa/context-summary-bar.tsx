export function ContextSummaryBar({
  items
}: {
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <section
      aria-label="현재 컨텍스트"
      className="grid grid-cols-2 gap-3 rounded-[24px] border border-ink/10 bg-white/90 p-4 shadow-card sm:grid-cols-4"
    >
      {items.map((item) => (
        <div key={item.label} className="min-w-0 rounded-2xl bg-mist px-3 py-3">
          <p className="truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">
            {item.label}
          </p>
          <p className="mt-2 truncate text-sm font-medium text-ink">{item.value}</p>
        </div>
      ))}
    </section>
  );
}
