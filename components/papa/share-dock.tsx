export function ShareDock({
  title,
  message
}: {
  title: string;
  message: string;
}) {
  return (
    <aside
      aria-label="공유 및 저장"
      className="sticky z-20 rounded-[26px] border border-ink/12 bg-white/92 p-4 shadow-panel backdrop-blur"
      style={{ bottom: "max(1rem, calc(env(safe-area-inset-bottom) + 0.5rem))" }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-semibold text-ink">{title}</p>
          <p className="line-clamp-2 text-sm text-ink/62">{message}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button type="button" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-ink/90">
            카카오 공유
          </button>
          <button type="button" className="rounded-full bg-ember px-4 py-2 text-sm font-medium text-paper transition hover:bg-ember/90">
            이미지 저장
          </button>
          <button type="button" className="rounded-full border border-ink/12 bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:border-ink/30">
            링크 복사
          </button>
        </div>
      </div>
    </aside>
  );
}
