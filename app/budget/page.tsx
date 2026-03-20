"use client";

import { useCallback, useMemo, useState } from "react";

import Link from "next/link";

import { BudgetCategorySection } from "@/components/papa/budget-category-section";
import { BudgetRunningTotalCard } from "@/components/papa/budget-running-total-card";
import { ContextSummaryBar } from "@/components/papa/context-summary-bar";
import { PageFrame } from "@/components/papa/page-frame";
import { ShareDock } from "@/components/papa/share-dock";
import { StatusBadge } from "@/components/papa/status-badge";
import {
  buildBudgetShareIntent,
  buildDefaultDraftState,
  budgetCategories,
  calculateBudget,
  formatKRW,
  POLICY_BASE_DATE,
  POLICY_REGION_NOTICE,
  POLICY_VERIFIED_AT,
  savingTips,
  type BudgetDraftState,
  type BudgetItemGrade
} from "@/lib/budget-domain";
import {
  defaultAppContextState,
  formatDeliveryStatusLabel,
  formatDualIncomeLabel,
  getBaseDateFieldLabel,
  getContextSummaryItems,
  mergeAppContext,
  type AppContextState
} from "@/lib/papa-context";

// ─── Step indicator ───────────────────────────────────────────────────────────

type Step = 1 | 2 | 3;

function StepIndicator({ step }: { step: Step }) {
  const steps: Array<{ n: Step; label: string }> = [
    { n: 1, label: "기본 입력" },
    { n: 2, label: "항목 선택" },
    { n: 3, label: "결과" }
  ];

  return (
    <div className="flex items-center gap-2" aria-label="진행 단계">
      {steps.map(({ n, label }, i) => (
        <div key={n} className="flex items-center gap-2">
          {i > 0 && <div className="h-px w-6 bg-ink/15" />}
          <div className="flex items-center gap-1.5">
            <span
              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition ${
                step === n
                  ? "bg-ink text-paper"
                  : step > n
                    ? "bg-lime/20 text-ink"
                    : "bg-ink/8 text-ink/40"
              }`}
            >
              {step > n ? "✓" : n}
            </span>
            <span
              className={`hidden text-xs font-medium sm:inline ${
                step === n ? "text-ink" : "text-ink/45"
              }`}
            >
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Step 1: Basic input ──────────────────────────────────────────────────────

function Step1BasicInput({
  context,
  onChange,
  onNext
}: {
  context: AppContextState;
  onChange: (patch: Partial<AppContextState>) => void;
  onNext: () => void;
}) {
  const deliveryLabel = getBaseDateFieldLabel(context.delivery_status);

  return (
    <section aria-labelledby="step1-heading" className="space-y-4">
      <div className="rounded-[28px] bg-ink px-5 py-5 text-paper shadow-panel">
        <StatusBadge tone="lime">Step 1</StatusBadge>
        <h2 id="step1-heading" className="mt-4 font-display text-2xl leading-tight">
          기본 정보를 알려주세요
        </h2>
        <p className="mt-2 text-sm leading-6 text-paper/68">
          3분 안에 실질 부담액을 확인할 수 있습니다.
        </p>
      </div>

      <div className="space-y-3 rounded-[24px] border border-ink/10 bg-white px-5 py-5 shadow-card">
        {/* Delivery status */}
        <fieldset>
          <legend className="text-sm font-semibold text-ink">출산 상태</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["pregnant", "born"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => onChange({ delivery_status: status })}
                aria-pressed={context.delivery_status === status}
                className={`rounded-[18px] px-4 py-3 text-sm font-medium transition ${
                  context.delivery_status === status
                    ? "bg-ink text-paper"
                    : "bg-mist text-ink hover:bg-ink/10"
                }`}
              >
                {formatDeliveryStatusLabel(status)}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Base date */}
        <div>
          <label htmlFor="base-date" className="text-sm font-semibold text-ink">
            {deliveryLabel}
          </label>
          <input
            id="base-date"
            type="date"
            value={context.base_date}
            onChange={(e) => {
              const raw = e.target.value.trim();
              onChange({ base_date: raw });
            }}
            className="mt-2 w-full rounded-[18px] border border-ink/12 bg-mist px-4 py-3 text-sm text-ink focus:border-ink/30 focus:outline-none"
          />
          <p className="mt-1 text-xs text-ink/45">미입력 시 기본 기준일로 계산됩니다</p>
        </div>

        {/* Region */}
        <div>
          <label htmlFor="region" className="text-sm font-semibold text-ink">
            거주 지역
          </label>
          <select
            id="region"
            value={context.region}
            onChange={(e) => onChange({ region: e.target.value })}
            className="mt-2 w-full rounded-[18px] border border-ink/12 bg-mist px-4 py-3 text-sm text-ink focus:border-ink/30 focus:outline-none"
          >
            <option value="한국">한국 (전국 기준)</option>
            <option value="서울">서울</option>
            <option value="경기">경기</option>
            <option value="인천">인천</option>
            <option value="부산">부산</option>
            <option value="기타 광역시">기타 광역시</option>
            <option value="기타 지방">기타 지방</option>
          </select>
          <p className="mt-1 text-xs text-ink/45">
            지자체 추가 지원금은 지역별로 다를 수 있습니다
          </p>
        </div>

        {/* Dual income */}
        <fieldset>
          <legend className="text-sm font-semibold text-ink">가구 형태</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {([false, true] as const).map((dual) => (
              <button
                key={String(dual)}
                type="button"
                onClick={() => onChange({ dual_income: dual })}
                aria-pressed={context.dual_income === dual}
                className={`rounded-[18px] px-4 py-3 text-sm font-medium transition ${
                  context.dual_income === dual
                    ? "bg-ink text-paper"
                    : "bg-mist text-ink hover:bg-ink/10"
                }`}
              >
                {formatDualIncomeLabel(dual)}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-ink/45">
            맞벌이 여부에 따라 산후도우미 바우처 지원금이 달라집니다
          </p>
        </fieldset>

        <button
          type="button"
          onClick={onNext}
          className="mt-2 w-full rounded-[18px] bg-ink px-4 py-3.5 text-sm font-semibold text-paper transition hover:bg-ink/90 active:scale-[0.99]"
        >
          항목 선택으로 →
        </button>
      </div>
    </section>
  );
}

// ─── Step 2: Category selection ───────────────────────────────────────────────

function Step2CategorySelection({
  context,
  draft,
  onToggleItem,
  onChangeGrade,
  onBack,
  onNext
}: {
  context: AppContextState;
  draft: BudgetDraftState;
  onToggleItem: (itemId: string, enabled: boolean) => void;
  onChangeGrade: (itemId: string, grade: BudgetItemGrade) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const calc = useMemo(() => calculateBudget(draft, context), [draft, context]);
  const contextItems = useMemo(() => getContextSummaryItems(context), [context]);

  return (
    <section aria-labelledby="step2-heading" className="space-y-4">
      <div className="rounded-[28px] bg-ink px-5 py-5 text-paper shadow-panel">
        <StatusBadge tone="lime">Step 2</StatusBadge>
        <h2 id="step2-heading" className="mt-4 font-display text-2xl leading-tight">
          예산 항목을 선택하세요
        </h2>
        <p className="mt-2 text-sm leading-6 text-paper/68">
          체크 해제로 제외하거나 등급을 바꿔 실질 부담액을 조정하세요.
        </p>
      </div>

      <ContextSummaryBar items={contextItems} />

      <BudgetRunningTotalCard calc={calc} onViewResults={onNext} />

      <div className="space-y-3">
        {budgetCategories.map((category) => (
          <BudgetCategorySection
            key={category.id}
            category={category}
            draft={draft}
            onToggleItem={onToggleItem}
            onChangeGrade={onChangeGrade}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-[18px] border border-ink/12 bg-white px-5 py-3 text-sm font-medium text-ink transition hover:border-ink/24"
        >
          ← 뒤로
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 rounded-[18px] bg-ink px-4 py-3 text-sm font-semibold text-paper transition hover:bg-ink/90 active:scale-[0.99]"
        >
          결과 보기 →
        </button>
      </div>
    </section>
  );
}

// ─── Step 3: Results ──────────────────────────────────────────────────────────

function Step3Results({
  context,
  draft,
  onBack,
  onShareOpen
}: {
  context: AppContextState;
  draft: BudgetDraftState;
  onBack: () => void;
  onShareOpen: () => void;
}) {
  const calc = useMemo(() => calculateBudget(draft, context), [draft, context]);
  const isNet = calc.net <= 0;

  return (
    <section aria-labelledby="step3-heading" className="space-y-4">
      {/* Receipt summary */}
      <div className="rounded-[28px] bg-ink px-5 py-5 text-paper shadow-panel">
        <StatusBadge tone="lime">Budget Receipt</StatusBadge>
        <h2 id="step3-heading" className="mt-4 font-display text-2xl leading-tight">
          아기 첫 해 예산 결과
        </h2>
        <p className="mt-2 text-sm leading-6 text-paper/68">
          지원금 반영 후 실질 부담액입니다. 현금 흐름도 함께 점검하세요.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[20px] bg-white/8 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/45">
              총 예상 비용
            </p>
            <p className="mt-2 text-xl font-bold text-paper">{formatKRW(calc.total)}</p>
          </div>
          <div className="rounded-[20px] bg-white/8 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/45">
              지원금 총액
            </p>
            <p className="mt-2 text-xl font-bold text-lime">-{formatKRW(calc.supportTotal)}</p>
          </div>
          <div className="rounded-[20px] bg-white/8 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/45">
              실질 부담액
            </p>
            <p className={`mt-2 text-xl font-bold ${isNet ? "text-lime" : "text-ember"}`}>
              {isNet
                ? `${formatKRW(Math.abs(calc.net))} 절약`
                : formatKRW(calc.net)}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onShareOpen}
            className="rounded-full bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:bg-paper/90"
          >
            예산 결과 카톡으로 공유
          </button>
          <Link
            href="/checklist?tab=admin"
            className="rounded-full border border-white/14 px-4 py-2 text-sm font-medium text-paper transition hover:bg-white/8"
          >
            행정 탭 열기
          </Link>
        </div>
      </div>

      {/* Policy notice */}
      <div className="rounded-[20px] border border-dashed border-ink/15 bg-white px-5 py-4 shadow-card">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/45">
          정책 안내
        </p>
        <p className="mt-2 text-sm leading-6 text-ink/72">{POLICY_REGION_NOTICE}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-ink/45">
          <span>기준일 {POLICY_BASE_DATE}</span>
          <span>최종 검수 {POLICY_VERIFIED_AT}</span>
        </div>
      </div>

      {/* Support breakdown */}
      <div className="rounded-[24px] border border-ink/10 bg-white px-5 py-5 shadow-card">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/45">
          지원금 상세
        </p>
        <ul className="mt-3 space-y-2">
          {calc.supportItems.map((item) => (
            <li key={item.id} className="rounded-[18px] bg-mist px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-ink">{item.title}</p>
                  {item.condition && (
                    <p className="mt-0.5 text-xs text-ink/50">{item.condition}</p>
                  )}
                  <p className="mt-0.5 text-xs text-ink/45">
                    {item.deadline} · {item.channel}
                  </p>
                </div>
                <p className="flex-shrink-0 text-sm font-semibold text-ink">
                  {formatKRW(item.amount)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Saving tips */}
      <div className="rounded-[24px] border border-ink/10 bg-white px-5 py-5 shadow-card">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/45">
          절약 팁
        </p>
        <ul className="mt-3 space-y-2">
          {savingTips.map((tip) => (
            <li key={tip} className="flex items-start gap-2.5 text-sm leading-6 text-ink/72">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Checklist / admin CTA */}
      <div className="rounded-[24px] border border-ink/10 bg-white px-5 py-5 shadow-card">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/45">
          다음 단계
        </p>
        <h3 className="mt-3 font-display text-xl text-ink">결과 다음 행동까지 끊기지 않게</h3>
        <p className="mt-2 text-sm leading-6 text-ink/65">
          체크리스트로 준비 항목을 확인하고, 행정 탭에서 지원금 신청 기한을 놓치지 마세요.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/checklist"
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-ink/90"
          >
            체크리스트 보기
          </Link>
          <Link
            href="/checklist?tab=admin"
            className="rounded-full border border-ink/12 bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:border-ink/30"
          >
            행정 데드라인 확인
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="rounded-[18px] border border-ink/12 bg-white px-5 py-3 text-sm font-medium text-ink transition hover:border-ink/24"
      >
        ← 항목 다시 선택
      </button>
    </section>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────

export default function BudgetPage() {
  const [step, setStep] = useState<Step>(1);
  const [context, setContext] = useState<AppContextState>(defaultAppContextState);
  const [draft, setDraft] = useState<BudgetDraftState>(buildDefaultDraftState);
  const [shareOpenKey, setShareOpenKey] = useState(0);

  const handleContextChange = useCallback((patch: Partial<AppContextState>) => {
    setContext((prev) => mergeAppContext(prev, patch));
  }, []);

  const handleToggleItem = useCallback((itemId: string, enabled: boolean) => {
    setDraft((prev) => ({
      ...prev,
      categorySelections: {
        ...prev.categorySelections,
        [itemId]: { ...prev.categorySelections[itemId]!, enabled }
      }
    }));
  }, []);

  const handleChangeGrade = useCallback((itemId: string, grade: BudgetItemGrade) => {
    setDraft((prev) => ({
      ...prev,
      categorySelections: {
        ...prev.categorySelections,
        [itemId]: { ...prev.categorySelections[itemId]!, grade }
      }
    }));
  }, []);

  const calc = useMemo(() => calculateBudget(draft, context), [draft, context]);
  const shareIntent = useMemo(() => buildBudgetShareIntent(calc), [calc]);

  const pageDescriptions: Record<Step, string> = {
    1: "기본 정보를 입력하면 지원금이 자동으로 계산됩니다.",
    2: "항목을 선택하고 등급을 조정해 실질 부담액을 확인하세요.",
    3: "지원금 차감 후 실질 부담액과 신청 기한을 확인하세요."
  };

  return (
    <PageFrame
      eyebrow="Budget Simulator"
      title="아기 첫 해 실질 부담액 계산기"
      description={pageDescriptions[step]}
      currentPath="/budget"
    >
      <StepIndicator step={step} />

      {step === 1 && (
        <Step1BasicInput
          context={context}
          onChange={handleContextChange}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <Step2CategorySelection
          context={context}
          draft={draft}
          onToggleItem={handleToggleItem}
          onChangeGrade={handleChangeGrade}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <Step3Results
          context={context}
          draft={draft}
          onBack={() => setStep(2)}
          onShareOpen={() => setShareOpenKey((k) => k + 1)}
        />
      )}

      <ShareDock
        title="예산 결과 보내기"
        message="지원금 반영 후 실질 부담액을 남편/아내에게 공유하세요."
        intent={shareIntent}
        autoOpenKey={shareOpenKey}
      />
    </PageFrame>
  );
}
