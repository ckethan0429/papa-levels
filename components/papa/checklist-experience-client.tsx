"use client";

import { useEffect, useMemo, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ActionCard } from "@/components/papa/action-card";
import { AdminTimelineCard } from "@/components/papa/admin-timeline-card";
import { ChecklistItemCard } from "@/components/papa/checklist-item-card";
import { ContextSummaryBar } from "@/components/papa/context-summary-bar";
import { DdayHeader } from "@/components/papa/dday-header";
import { PageFrame } from "@/components/papa/page-frame";
import { ShareDock } from "@/components/papa/share-dock";
import { StatusBadge } from "@/components/papa/status-badge";
import {
  selectAdminTimelineItems,
  selectDeadlineAlertItems,
  type AdminTimelineCardItem
} from "@/lib/admin-timeline-domain";
import {
  getChecklistItems,
  selectChecklistDomain,
  type ChecklistItem,
  type ChecklistSection
} from "@/lib/checklist-domain";
import {
  getContextSummaryItems,
  isAppContextComplete,
  type AppContextState,
  type PapaChecklistTab,
  papaChecklistTabs
} from "@/lib/papa-context";
import {
  readChecklistStorageSnapshot,
  writeCheckedItemIds,
  writeStoredActiveTab,
  writeStoredAppContext
} from "@/lib/checklist-storage";
import { type ShareIntentState } from "@/lib/share-domain";
import { cn } from "@/lib/utils";

const tabMeta: Record<PapaChecklistTab, { label: string; helper: string }> = {
  prepare: { label: "준비", helper: "D-30 ~ D-Day" },
  center: { label: "조리원", helper: "D-Day ~ D+13" },
  home: { label: "집", helper: "D+14 ~ D+30" },
  admin: { label: "행정", helper: "기한 기반" }
};

function getHeaderCopy(section: ChecklistSection) {
  switch (section) {
    case "prepare":
      return {
        title: "이번 주엔 서류와 조리원 동선을 먼저 잠그세요",
        detail: "출산 전 모드에서는 준비물과 서류가 동시에 보이되, 정보 밀도보다 우선순위가 먼저 읽히도록 구성합니다."
      };
    case "center":
      return {
        title: "조리원/초기 행정을 같은 보드에서 처리하세요",
        detail: "D-Day 이후에는 조리원 준비와 출생 직후 행정이 겹치므로, 이번 주 카드와 행정 탭을 함께 보게 합니다."
      };
    case "home":
      return {
        title: "퇴소 후 루틴과 재고를 먼저 잠그세요",
        detail: "집에 온 뒤에는 새벽 수유, 재고 확보, 생활 루틴이 동시에 시작되므로 home 구간 액션을 우선 노출합니다."
      };
    case "admin":
      return {
        title: "행정 데드라인을 먼저 끝내세요",
        detail: "출생신고, 행복출산, 첫만남이용권 등 기한성 항목을 한 번에 확인할 수 있는 admin 모듈입니다."
      };
  }
}

function getProgressLabel(checkedIds: string[]) {
  const checklistIds = getChecklistItems()
    .filter((item) => item.section !== "admin")
    .map((item) => item.id);
  const total = checklistIds.length;
  const completed = checklistIds.filter((id) => checkedIds.includes(id)).length;

  if (total === 0) {
    return "0%";
  }

  return `${Math.round((completed / total) * 100)}%`;
}

function buildWeeklyActionShareIntent(weeklyBullets: string[], activeSection: ChecklistSection): ShareIntentState {
  return {
    surface: "checklist",
    card_type: "weekly_action",
    route: "/checklist",
    title: "이번 주 아빠 할 일",
    description: `${tabMeta[activeSection].label} 구간에서 먼저 해야 할 실행 카드입니다.`,
    lines: weeklyBullets,
    messageByRole: {
      mom: "여보, 이번 주에 이것만 해줘 👶",
      dad: "이번 주 아빠 할 일을 정리해봤어요 👶"
    },
    ctaLabel: "이번 주 할 일 보기",
    imageEyebrow: "WEEKLY ACTION"
  };
}

function buildChecklistItemShareIntent(item: ChecklistItem): ShareIntentState {
  const shouldDeepLinkAdmin = item.deeplink_target === "/checklist?tab=admin";

  return {
    surface: "checklist",
    card_type: "weekly_action",
    route: "/checklist",
    query: shouldDeepLinkAdmin ? { tab: "admin" } : undefined,
    title: item.title,
    description: item.why,
    lines: [`언제: ${item.when_label}`, `예산: ${item.cost_range ?? "미정"}`, item.share_copy],
    messageByRole: {
      mom: shouldDeepLinkAdmin ? `여보, ${item.title} 행정 먼저 확인해줘 👶` : `여보, ${item.title} 먼저 해줘 👶`,
      dad: shouldDeepLinkAdmin ? `${item.title} 행정 타임라인 먼저 확인해보세요 👶` : `${item.title} 확인해보세요 👶`
    },
    ctaLabel: shouldDeepLinkAdmin ? "행정 탭 보기" : "체크리스트 보기",
    imageEyebrow: "CHECKLIST ACTION"
  };
}

function getAdminDeadlineShareMessage(item: AdminTimelineCardItem) {
  const deadlineSummary = item.dueLabel.split("·").at(1)?.trim() ?? item.dueLabel.trim();
  return `여보, ${item.title} ${deadlineSummary}. 지금 해야 해 →`;
}

function buildAdminShareIntent(item: AdminTimelineCardItem | undefined): ShareIntentState {
  if (!item) {
    return {
      surface: "admin",
      card_type: "admin_deadline",
      route: "/checklist",
      query: { tab: "admin" },
      title: "행정 데드라인",
      description: "출생신고와 행복출산 원스톱을 먼저 확인하세요.",
      lines: ["/checklist?tab=admin 딥링크", "기한 기반 실행 가이드"],
      messageByRole: {
        mom: "여보, 출생 직후 행정 먼저 확인해줘 →",
        dad: "행정 데드라인을 먼저 정리해보세요 →"
      },
      ctaLabel: "행정 탭 열기",
      imageEyebrow: "ADMIN DEADLINE"
    };
  }

  return {
    surface: "admin",
    card_type: "admin_deadline",
    route: "/checklist",
    query: { tab: "admin" },
    title: item.title,
    description: item.dueLabel,
    lines: [
      `채널: ${item.applicationChannel ?? "신청 채널 확인"}`,
      `안내: ${item.metadata.regionNotice}`
    ],
    messageByRole: {
      mom: item.shareCopy?.trim().length ? `${item.shareCopy} →` : getAdminDeadlineShareMessage(item),
      dad: `${item.title} 마감 전에 확인해보세요 →`
    },
    ctaLabel: "행정 타임라인 보기",
    imageEyebrow: "ADMIN DEADLINE"
  };
}

export function ChecklistExperienceClient({
  requestedTab
}: {
  requestedTab: PapaChecklistTab | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSnapshot = useMemo(() => {
    const snapshot = readChecklistStorageSnapshot();
    const nextContext = snapshot.appContext;
    const hasCompleteContext = isAppContextComplete(nextContext);

    const initialTab = requestedTab
      ? requestedTab
      : hasCompleteContext
        ? selectChecklistDomain({
            deliveryStatus: nextContext.delivery_status,
            baseDate: nextContext.base_date
          }).activeSection
        : snapshot.activeTab;

    return {
      context: nextContext,
      checkedItemIds: snapshot.checkedItemIds,
      activeTab: initialTab
    };
  }, [requestedTab]);

  const [context, setContext] = useState<AppContextState>(initialSnapshot.context);
  const [checkedItemIds, setCheckedItemIds] = useState<string[]>(initialSnapshot.checkedItemIds);
  const [activeTab, setActiveTab] = useState<PapaChecklistTab>(initialSnapshot.activeTab);
  const [isEditingContext, setIsEditingContext] = useState(false);
  const [selectedShareIntent, setSelectedShareIntent] = useState<ShareIntentState | null>(null);
  const [shareSelectionNonce, setShareSelectionNonce] = useState(0);

  useEffect(() => {
    writeStoredAppContext(context);
  }, [context]);

  useEffect(() => {
    writeCheckedItemIds(checkedItemIds);
  }, [checkedItemIds]);

  useEffect(() => {
    writeStoredActiveTab(activeTab);
  }, [activeTab]);

  const hasCompleteContext = isAppContextComplete(context);

  const checklistDomain = useMemo(() => {
    if (!hasCompleteContext) {
      return null;
    }

    return selectChecklistDomain({
      deliveryStatus: context.delivery_status,
      baseDate: context.base_date,
      activeSection: activeTab,
      checkedItemIds
    });
  }, [activeTab, checkedItemIds, context, hasCompleteContext]);

  const adminItems = useMemo<AdminTimelineCardItem[]>(() => {
    if (!hasCompleteContext || !checklistDomain) {
      return selectAdminTimelineItems({ onlyNational: true });
    }

    return selectAdminTimelineItems({
      onlyNational: true,
      elapsedDays: checklistDomain.dday.dayOffset
    });
  }, [checklistDomain, hasCompleteContext]);

  const deadlineAlertItems = useMemo(() => selectDeadlineAlertItems(adminItems), [adminItems]);

  const summaryItems = getContextSummaryItems(context).map((item) => ({
    label: item.label,
    value: item.value
  }));

  const activeSection = checklistDomain?.activeSection ?? activeTab;
  const headerCopy = getHeaderCopy(activeSection);
  const weeklyBullets = useMemo(
    () =>
      checklistDomain?.weeklyAction.items.map((item) => item.title) ?? ["기준일을 입력하면 이번 주 아빠 할 일을 계산합니다."],
    [checklistDomain]
  );

  const defaultShareIntent = useMemo(() => {
    if (activeTab === "admin") {
      return buildAdminShareIntent(deadlineAlertItems[0] ?? adminItems[0]);
    }

    return buildWeeklyActionShareIntent(weeklyBullets, activeSection);
  }, [activeSection, activeTab, adminItems, deadlineAlertItems, weeklyBullets]);

  const shareIntent = selectedShareIntent ?? defaultShareIntent;

  function updateQuery(nextTab: PapaChecklistTab) {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("tab", nextTab);
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  }

  function handleTabChange(nextTab: PapaChecklistTab) {
    setActiveTab(nextTab);
    setSelectedShareIntent(null);
    updateQuery(nextTab);
  }

  function handleChecklistToggle(itemId: string) {
    setCheckedItemIds((currentIds) =>
      currentIds.includes(itemId)
        ? currentIds.filter((currentId) => currentId !== itemId)
        : [...currentIds, itemId]
    );
  }

  function openShareIntent(intent: ShareIntentState) {
    setSelectedShareIntent(intent);
    setShareSelectionNonce((current) => current + 1);
  }

  function handleContextSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isAppContextComplete(context)) {
      return;
    }

    setIsEditingContext(false);

    if (!requestedTab) {
      const recommended = selectChecklistDomain({
        deliveryStatus: context.delivery_status,
        baseDate: context.base_date
      }).activeSection;
      setActiveTab(recommended);
      updateQuery(recommended);
    }
  }

  return (
    <PageFrame
      eyebrow="Retention Core"
      title="이번 주 아빠 실행판"
      description="핵심 경험은 탭 자체보다 이번 주 해야 할 일과 마감 리스크가 바로 보이는 모바일 실행판입니다."
      currentPath="/checklist"
    >
      <DdayHeader
        dday={checklistDomain?.dday.label ?? "기준일 미설정"}
        title={headerCopy.title}
        detail={headerCopy.detail}
        progressLabel={getProgressLabel(checkedItemIds)}
      />

      {(!hasCompleteContext || isEditingContext) && (
        <form
          onSubmit={handleContextSubmit}
          className="rounded-[24px] border border-ink/10 bg-white p-5 shadow-card"
        >
          <StatusBadge tone="ember">온보딩 입력</StatusBadge>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-ink">출산 상태</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { key: "pregnant", label: "출산 예정" },
                  { key: "born", label: "출산 완료" }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() =>
                      setContext((current) => ({
                        ...current,
                        delivery_status: item.key as AppContextState["delivery_status"]
                      }))
                    }
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition",
                      context.delivery_status === item.key
                        ? "bg-ink text-paper"
                        : "bg-mist text-ink hover:bg-paper"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <label className="block">
              <span className="text-sm font-semibold text-ink">
                {context.delivery_status === "pregnant" ? "출산 예정일" : "출산일"}
              </span>
              <input
                type="date"
                value={context.base_date}
                onChange={(event) =>
                  setContext((current) => ({
                    ...current,
                    base_date: event.target.value
                  }))
                }
                className="mt-3 w-full rounded-2xl border border-ink/12 bg-paper px-4 py-3 text-sm text-ink outline-none ring-0 transition focus:border-ink/30"
              />
            </label>
            <div className="rounded-2xl bg-mist px-4 py-4 text-sm text-ink/72">
              <p className="font-semibold text-ink">지역</p>
              <p className="mt-2">MVP에서는 `한국` 일반 기준으로 시작합니다.</p>
            </div>
            <label className="flex items-center gap-3 rounded-2xl bg-mist px-4 py-4 text-sm text-ink">
              <input
                type="checkbox"
                checked={context.dual_income}
                onChange={(event) =>
                  setContext((current) => ({
                    ...current,
                    dual_income: event.target.checked
                  }))
                }
                className="h-5 w-5 rounded border-ink/20 text-ember focus:ring-ember"
              />
              <span>맞벌이 여부</span>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={!isAppContextComplete(context)}
              className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              실행판 열기
            </button>
            {hasCompleteContext && (
              <button
                type="button"
                onClick={() => setIsEditingContext(false)}
                className="rounded-full border border-ink/12 bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:border-ink/30"
              >
                닫기
              </button>
            )}
          </div>
        </form>
      )}

      <ContextSummaryBar items={summaryItems} />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsEditingContext((current) => !current)}
          className="rounded-full border border-ink/12 bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:border-ink/30"
        >
          입력 수정
        </button>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <ActionCard
          eyebrow="이번 주 아빠 할 일"
          title="이번 주 딱 3가지만 끝내면 됩니다"
          description="seed checklist와 현재 시점을 기준으로 이번 주 액션을 먼저 계산합니다."
          bullets={weeklyBullets}
          footer={
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleTabChange(activeSection)}
                className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-ink/90"
              >
                지금 시작
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("admin")}
                className="rounded-full border border-ink/12 bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:border-ink/30"
              >
                행정 탭 보기
              </button>
              <button
                type="button"
                onClick={() => openShareIntent(buildWeeklyActionShareIntent(weeklyBullets, activeSection))}
                className="rounded-full border border-ink/12 bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:border-ink/30"
              >
                이번 주 할 일 보내기
              </button>
            </div>
          }
        />

        <article className="rounded-[28px] border border-ink/10 bg-white px-5 py-5 shadow-card">
          <StatusBadge tone="ember">지금 제일 급한 행정</StatusBadge>
          <h3 className="mt-4 font-display text-2xl text-ink">
            {deadlineAlertItems[0]?.title ?? "출생신고와 행복출산 원스톱"}
          </h3>
          <p className="mt-3 text-sm leading-6 text-ink/68">
            {deadlineAlertItems[0]?.dueLabel ?? "admin 탭은 별도 페이지가 아니라 deep link로 바로 들어가는 first-class 모듈입니다."}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleTabChange("admin")}
              className="inline-flex rounded-full bg-ember px-4 py-2 text-sm font-medium text-paper transition hover:bg-ember/90"
            >
              행정 탭 바로 열기
            </button>
            <button
              type="button"
              onClick={() => openShareIntent(buildAdminShareIntent(deadlineAlertItems[0] ?? adminItems[0]))}
              className="rounded-full border border-ink/12 bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:border-ink/30"
            >
              행정 마감 보내기
            </button>
          </div>
        </article>
      </section>

      <nav
        aria-label="체크리스트 탭"
        className="grid grid-cols-2 gap-3 rounded-[28px] border border-ink/10 bg-white p-3 shadow-card sm:grid-cols-4"
      >
        {papaChecklistTabs.map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabChange(tab)}
              aria-pressed={active}
              className={cn(
                "rounded-[22px] px-4 py-4 text-left transition",
                active ? "bg-ink text-paper shadow-card" : "bg-mist text-ink/70 hover:bg-paper"
              )}
            >
              <p className="text-base font-semibold">{tabMeta[tab].label}</p>
              <p className={cn("mt-2 text-xs leading-5", active ? "text-paper/68" : "text-ink/55")}>
                {tabMeta[tab].helper}
              </p>
            </button>
          );
        })}
      </nav>

      {activeTab === "admin" ? (
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
          {deadlineAlertItems.length > 0 && (
            <article className="rounded-[24px] border border-ink/10 bg-white px-5 py-5 shadow-card">
              <StatusBadge tone="ember">마감 임박</StatusBadge>
              <ul className="mt-4 space-y-2 text-sm text-ink/72">
                {deadlineAlertItems.map((item) => (
                  <li key={item.id} className="rounded-2xl bg-mist px-3 py-3">
                    <strong className="text-ink">{item.title}</strong>
                    <p className="mt-1">{item.dueLabel}</p>
                  </li>
                ))}
              </ul>
            </article>
          )}
          {adminItems.map((item) => (
            <AdminTimelineCard key={item.id} item={item} onShare={(selectedItem) => openShareIntent(buildAdminShareIntent(selectedItem))} />
          ))}
        </section>
      ) : (
        <section className="space-y-4">
          {(checklistDomain?.visibleItems ?? []).map((item) => (
            <ChecklistItemCard
              key={item.id}
              item={item}
              checked={checkedItemIds.includes(item.id)}
              onCheckedChange={() => handleChecklistToggle(item.id)}
              onShare={() => openShareIntent(buildChecklistItemShareIntent(item))}
            />
          ))}
        </section>
      )}

      <ShareDock
        title="남편에게 보내기"
        message="카카오 공유 > 이미지 저장 > 링크 복사 순서를 유지하고, 공유 링크에는 개인 체크 상태를 싣지 않습니다."
        triggerLabel={activeTab === "admin" ? "행정 마감 남편에게 보내기" : "남편에게 보내기"}
        intent={shareIntent}
        autoOpenKey={shareSelectionNonce}
      />
    </PageFrame>
  );
}
