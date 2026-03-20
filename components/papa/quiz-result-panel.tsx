import Link from "next/link";

import { StatusBadge } from "@/components/papa/status-badge";
import { type QuizOutcome } from "@/lib/quiz-domain";
import { cn } from "@/lib/utils";

export function QuizResultPanel({
  outcome,
  onShare,
  onRestart
}: {
  outcome: QuizOutcome;
  onShare: () => void;
  onRestart: () => void;
}) {
  const isPreDad = outcome.resultType === "pre_dad";

  return (
    <section className="space-y-4" aria-label="퀴즈 결과">
      <article className="rounded-[30px] bg-ink px-5 py-5 text-paper shadow-panel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StatusBadge tone={isPreDad ? "ember" : "lime"}>{isPreDad ? "Pre-Dad Mode" : "Quiz Result"}</StatusBadge>
          <p className="text-sm text-paper/68">퍼센타일 비교 없이 행동 전환 CTA만 남겼습니다.</p>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div>
              {outcome.grade ? (
                <p className="text-5xl font-display leading-none text-lime">{outcome.grade}</p>
              ) : (
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-lime">PRE-DAD</p>
              )}
              <h2 className="mt-3 font-display text-3xl leading-tight sm:text-[2.4rem]">{outcome.title}</h2>
              <p className="mt-3 text-base leading-7 text-paper/82">{outcome.summary}</p>
              <p className="mt-3 text-sm leading-6 text-paper/68">{outcome.detail}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onShare}
                className="rounded-full bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:bg-paper/90"
              >
                결과 공유
              </button>
              <button
                type="button"
                onClick={onRestart}
                className="rounded-full border border-white/14 px-4 py-2 text-sm font-medium text-paper transition hover:bg-white/8"
              >
                다시 테스트하기
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {outcome.metrics.map((metric) => (
              <div key={metric.label} className="min-w-0 rounded-[22px] bg-white/8 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/45">{metric.label}</p>
                <p className="mt-3 break-words text-xl font-semibold text-lime">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </article>

      <section className="grid gap-3 lg:grid-cols-3" aria-label="다음 단계 CTA">
        {outcome.ctas.map((cta, index) => (
          <Link
            key={cta.href}
            href={cta.href}
            className={cn(
              "rounded-[24px] border px-4 py-4 shadow-card transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60",
              index === 0 ? "border-ink bg-ink text-paper hover:bg-ink/92" : "border-ink/10 bg-white text-ink hover:border-ink/24 hover:bg-mist"
            )}
          >
            <p className={cn("text-[11px] font-semibold uppercase tracking-[0.22em]", index === 0 ? "text-paper/45" : "text-ink/45")}>Next Action {index + 1}</p>
            <h3 className="mt-3 text-lg font-semibold leading-7 break-words">{cta.label}</h3>
            <p className={cn("mt-2 text-sm leading-6 break-words", index === 0 ? "text-paper/72" : "text-ink/62")}>{cta.description}</p>
          </Link>
        ))}
      </section>
    </section>
  );
}
