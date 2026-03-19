import Link from "next/link";

import { ActionCard } from "@/components/papa/action-card";
import { AdminTimelineCard } from "@/components/papa/admin-timeline-card";
import { ChecklistItemCard } from "@/components/papa/checklist-item-card";
import { ContextSummaryBar } from "@/components/papa/context-summary-bar";
import { DdayHeader } from "@/components/papa/dday-header";
import { PageFrame } from "@/components/papa/page-frame";
import { ShareDock } from "@/components/papa/share-dock";
import { StatusBadge } from "@/components/papa/status-badge";
import {
  checklistItems,
  checklistTabs,
  routeContext,
  type ChecklistTab,
  visibleAdminDeadlines,
  weeklyTodos
} from "@/lib/papa-data";
import { cn } from "@/lib/utils";

function isChecklistTab(value: string | null): value is ChecklistTab {
  return value === "prepare" || value === "center" || value === "home" || value === "admin";
}

export default async function ChecklistPage({
  searchParams
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const tabParam = params.tab ?? null;
  const currentTab: ChecklistTab = isChecklistTab(tabParam) ? tabParam : "prepare";

  return (
    <PageFrame
      eyebrow="Retention Core"
      title="이번 주 아빠 실행판"
      description="핵심 경험은 탭 자체보다 이번 주 해야 할 일과 마감 리스크가 바로 보이는 모바일 실행판입니다."
      currentPath="/checklist"
    >
      <DdayHeader
        dday="D-12"
        title="이번 주엔 서류와 조리원 동선을 먼저 잠그세요"
        detail="출산 전 모드에서는 준비물과 서류가 동시에 보이되, 정보 밀도보다 우선순위와 공유 가능성이 먼저 읽히도록 구성합니다."
      />

      <ContextSummaryBar items={routeContext} />

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <ActionCard
          eyebrow="이번 주 아빠 할 일"
          title="이번 주 딱 3가지만 끝내면 됩니다"
          description="주간 카드와 체크리스트를 분리해, 긴 정보 목록이 아니라 바로 행동 가능한 단위로 시작하게 만듭니다."
          bullets={weeklyTodos}
          footer={
            <div className="flex flex-wrap gap-2">
              <button type="button" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-ink/90">
                지금 시작
              </button>
              <button type="button" className="rounded-full border border-ink/12 bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:border-ink/30">
                남편에게 보내기
              </button>
            </div>
          }
        />

        <article className="rounded-[28px] border border-ink/10 bg-white px-5 py-5 shadow-card">
          <StatusBadge tone="ember">지금 제일 급한 행정</StatusBadge>
          <h3 className="mt-4 font-display text-2xl text-ink">출생신고와 행복출산 원스톱</h3>
          <p className="mt-3 text-sm leading-6 text-ink/68">
            `admin` 탭은 별도 페이지가 아니라 deep link로 바로 들어가는 first-class 모듈입니다.
          </p>
          <Link
            href="/checklist?tab=admin"
            className="mt-5 inline-flex rounded-full bg-ember px-4 py-2 text-sm font-medium text-paper transition hover:bg-ember/90"
          >
            행정 탭 바로 열기
          </Link>
        </article>
      </section>

      <nav aria-label="체크리스트 탭" className="grid grid-cols-2 gap-3 rounded-[28px] border border-ink/10 bg-white p-3 shadow-card sm:grid-cols-4">
        {checklistTabs.map((tab) => {
          const active = currentTab === tab.key;
          return (
            <Link
              key={tab.key}
              href={`/checklist?tab=${tab.key}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-[22px] px-4 py-4 text-left transition",
                active ? "bg-ink text-paper shadow-card" : "bg-mist text-ink/70 hover:bg-paper"
              )}
            >
              <p className="text-base font-semibold">{tab.label}</p>
              <p className={cn("mt-2 text-xs leading-5", active ? "text-paper/68" : "text-ink/55")}>
                {tab.helper}
              </p>
            </Link>
          );
        })}
      </nav>

      {currentTab === "admin" ? (
        <section className="space-y-4">
          <article className="rounded-[24px] border border-ink/10 bg-white px-5 py-5 shadow-card">
            <StatusBadge tone="lime">원스톱 추천 순서</StatusBadge>
            <ol className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
              {["출생신고", "행복출산", "첫만남이용권", "지자체 축하금", "회사 휴가"].map((step, index) => (
                <li key={step} className="rounded-2xl bg-mist px-3 py-4 text-sm text-ink">
                  <span className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper">
                    {index + 1}
                  </span>
                  <p className="font-medium">{step}</p>
                </li>
              ))}
            </ol>
          </article>
          {visibleAdminDeadlines.map((item) => (
            <AdminTimelineCard key={item.id} item={item} />
          ))}
        </section>
      ) : (
        <section className="space-y-4">
          {checklistItems[currentTab].map((item) => (
            <ChecklistItemCard key={item.id} item={item} />
          ))}
        </section>
      )}

      <ShareDock
        title="남편에게 보내기"
        message={"카카오 공유 > 이미지 저장 > 링크 복사 순서의 fallback을 유지하고, 하단 고정 액션으로 CTA 탐색 비용을 줄입니다."}
      />
    </PageFrame>
  );
}
