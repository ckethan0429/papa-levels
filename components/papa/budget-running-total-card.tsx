"use client";

import { formatKRW, type BudgetCalculation } from "@/lib/budget-domain";

export function BudgetRunningTotalCard({
  calc,
  onViewResults
}: {
  calc: BudgetCalculation;
  onViewResults: () => void;
}) {
  const isNet = calc.net <= 0;

  return (
    <section
      aria-label="실시간 예산 합산"
      className="sticky top-3 z-10 rounded-[24px] bg-ink px-5 py-4 text-paper shadow-panel"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-paper/45">
        Running Total
      </p>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div className="min-w-0 rounded-[20px] bg-white/8 px-3 py-3">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-paper/45">
            총 비용
          </p>
          <p className="mt-2 truncate text-base font-semibold text-paper">
            {formatKRW(calc.total)}
          </p>
        </div>
        <div className="min-w-0 rounded-[20px] bg-white/8 px-3 py-3">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-paper/45">
            지원금
          </p>
          <p className="mt-2 truncate text-base font-semibold text-lime">
            -{formatKRW(calc.supportTotal)}
          </p>
        </div>
        <div className="min-w-0 rounded-[20px] bg-white/8 px-3 py-3">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-paper/45">
            실질 부담액
          </p>
          <p className={`mt-2 truncate text-base font-semibold ${isNet ? "text-lime" : "text-ember"}`}>
            {calc.net <= 0 ? formatKRW(Math.abs(calc.net)) + " 절약" : formatKRW(calc.net)}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onViewResults}
        className="mt-4 w-full rounded-[18px] bg-paper px-4 py-3 text-sm font-semibold text-ink transition hover:bg-paper/90 active:scale-[0.99]"
      >
        결과 보기 →
      </button>
    </section>
  );
}
