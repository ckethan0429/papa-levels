import Link from "next/link";

import { ContextSummaryBar } from "@/components/papa/context-summary-bar";
import { PageFrame } from "@/components/papa/page-frame";
import { ResultCardSurface } from "@/components/papa/result-card-surface";
import { ShareDock } from "@/components/papa/share-dock";
import { StatusBadge } from "@/components/papa/status-badge";
import { budgetCategories, budgetSummary, routeContext } from "@/lib/papa-data";

export default function BudgetPage() {
  return (
    <PageFrame
      eyebrow="Shock Number"
      title="총액보다 먼저, 실질 부담액이 보이는 예산 화면"
      description="예산은 계산기보다 영수증처럼 읽혀야 합니다. 가장 큰 비용과 지원금 차감을 먼저 보여준 뒤, 체크리스트와 행정 탭으로 자연스럽게 이어집니다."
      currentPath="/budget"
    >
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[30px] bg-ink px-5 py-5 text-paper shadow-panel">
          <StatusBadge tone="lime">Budget Hook</StatusBadge>
          <h2 className="mt-4 font-display text-3xl leading-tight sm:text-[2.4rem]">
            {budgetSummary.hero}
          </h2>
          <p className="mt-3 text-sm leading-6 text-paper/72">
            입력은 최소화하고, 결과는 receipt-style summary로 바로 보여주는 흐름이 MVP에 가장 적합합니다.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {routeContext.slice(0, 3).map((item) => (
              <div key={item.label} className="rounded-2xl bg-white/8 px-3 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/45">
                  {item.label}
                </p>
                <p className="mt-2 text-sm text-paper">{item.value}</p>
              </div>
            ))}
          </div>
        </article>

        <ResultCardSurface
          eyebrow="Receipt Surface"
          title="예산 결과 요약"
          body={budgetSummary.note}
          metrics={[
            { label: "총 예상 비용", value: budgetSummary.total },
            { label: "지원금 총액", value: budgetSummary.support },
            { label: "실질 부담액", value: budgetSummary.net }
          ]}
          footer={
            <div className="flex flex-wrap gap-2">
              <button type="button" className="rounded-full bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:bg-paper/90">
                결과 공유
              </button>
              <Link
                href="/checklist?tab=admin"
                className="rounded-full border border-white/14 px-4 py-2 text-sm font-medium text-paper transition hover:bg-white/8"
              >
                행정 탭 열기
              </Link>
            </div>
          }
        />
      </section>

      <ContextSummaryBar items={routeContext} />

      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          {budgetCategories.map((category) => (
            <details key={category.title} className="rounded-[24px] border border-ink/10 bg-white px-5 py-4 shadow-card">
              <summary className="cursor-pointer list-none text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {category.title}
                <span className="mt-2 block text-sm font-normal text-ink/58">{category.helper}</span>
              </summary>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-ink/72">
                {category.items.map((item) => (
                  <li key={item} className="rounded-2xl bg-mist px-3 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        <article className="rounded-[24px] border border-ink/10 bg-white px-5 py-5 shadow-card">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/45">CTA Flow</p>
          <h3 className="mt-3 font-display text-2xl text-ink">결과 다음 행동까지 끊기지 않게</h3>
          <div className="mt-4 space-y-3 text-sm leading-6 text-ink/68">
            <p>1. receipt summary를 보여준 뒤</p>
            <p>2. 준비물 체크리스트로 전환하고</p>
            <p>3. 행정 데드라인 카드 공유로 이어집니다.</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/checklist"
              className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-ink/90"
            >
              체크리스트 보기
            </Link>
            <Link
              href="/quiz"
              className="rounded-full border border-ink/12 bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:border-ink/30"
            >
              전투력 결과도 보기
            </Link>
          </div>
        </article>
      </section>

      <ShareDock
        title="예산 결과 보내기"
        message="OG와 결과 카드가 비슷한 톤으로 이어지도록, receipt-style surface와 하단 액션 도크를 함께 유지합니다."
      />
    </PageFrame>
  );
}
