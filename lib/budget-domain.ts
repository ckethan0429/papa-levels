import { type AppContextState } from "@/lib/papa-context";
import { type ShareIntentState } from "@/lib/share-domain";

// ─── Category definitions ─────────────────────────────────────────────────────

export type BudgetItemGrade = "low" | "mid" | "high";

export type BudgetItem = {
  id: string;
  label: string;
  amounts: Record<BudgetItemGrade, number>;
  defaultGrade: BudgetItemGrade;
  note?: string;
};

export type BudgetCategory = {
  id: string;
  title: string;
  helper: string;
  items: BudgetItem[];
};

export const budgetGradeLabels: Record<BudgetItemGrade, string> = {
  low: "절약형",
  mid: "표준",
  high: "프리미엄"
};

export const POLICY_BASE_DATE = "2026.01.01";
export const POLICY_VERIFIED_AT = "2026.03.11";
export const POLICY_REGION_NOTICE = "지역에 따라 지원금 상세 조건이 달라질 수 있습니다. 아래 금액은 전국 기준입니다.";

export const budgetCategories: BudgetCategory[] = [
  {
    id: "postpartum",
    title: "산후조리",
    helper: "가장 큰 충격 비용",
    items: [
      {
        id: "postpartum-center",
        label: "산후조리원 (2주)",
        amounts: { low: 1_800_000, mid: 2_800_000, high: 4_500_000 },
        defaultGrade: "mid",
        note: "지역·시설에 따라 크게 다릅니다"
      },
      {
        id: "postpartum-helper",
        label: "산후도우미 (2주)",
        amounts: { low: 800_000, mid: 1_200_000, high: 2_000_000 },
        defaultGrade: "mid",
        note: "정부 바우처 최대 80% 지원 가능"
      }
    ]
  },
  {
    id: "medical",
    title: "출산/의료",
    helper: "분만비와 초기 검진 비용",
    items: [
      {
        id: "medical-birth",
        label: "분만 관련 비용",
        amounts: { low: 500_000, mid: 1_000_000, high: 2_500_000 },
        defaultGrade: "mid",
        note: "국민건강보험 출산비 지원 적용 후"
      },
      {
        id: "medical-checkup",
        label: "신생아 검진·예방접종",
        amounts: { low: 100_000, mid: 300_000, high: 600_000 },
        defaultGrade: "low",
        note: "필수 예방접종은 무료"
      }
    ]
  },
  {
    id: "gear",
    title: "육아용품",
    helper: "아빠가 비교해야 하는 장비",
    items: [
      {
        id: "gear-carseat",
        label: "카시트",
        amounts: { low: 150_000, mid: 350_000, high: 800_000 },
        defaultGrade: "mid"
      },
      {
        id: "gear-stroller",
        label: "유모차",
        amounts: { low: 200_000, mid: 500_000, high: 1_500_000 },
        defaultGrade: "mid"
      },
      {
        id: "gear-kettle",
        label: "온도지정 포트기",
        amounts: { low: 30_000, mid: 60_000, high: 150_000 },
        defaultGrade: "low"
      },
      {
        id: "gear-etc",
        label: "기타 육아용품",
        amounts: { low: 200_000, mid: 500_000, high: 1_200_000 },
        defaultGrade: "mid"
      }
    ]
  },
  {
    id: "monthly",
    title: "월간 소모품 (12개월)",
    helper: "장기 현금 흐름",
    items: [
      {
        id: "monthly-diaper",
        label: "기저귀 (12개월)",
        amounts: { low: 720_000, mid: 960_000, high: 1_440_000 },
        defaultGrade: "mid",
        note: "월 6~12만 원 기준"
      },
      {
        id: "monthly-formula",
        label: "분유 (12개월)",
        amounts: { low: 720_000, mid: 1_200_000, high: 1_800_000 },
        defaultGrade: "mid",
        note: "모유수유 시 절감 가능"
      },
      {
        id: "monthly-wipes",
        label: "물티슈·소모품 (12개월)",
        amounts: { low: 180_000, mid: 300_000, high: 480_000 },
        defaultGrade: "low"
      }
    ]
  },
  {
    id: "hidden",
    title: "숨은 비용",
    helper: "몰랐다가 후회하는 항목",
    items: [
      {
        id: "hidden-room",
        label: "아이방 세팅·인테리어",
        amounts: { low: 200_000, mid: 600_000, high: 2_000_000 },
        defaultGrade: "mid"
      },
      {
        id: "hidden-clothes",
        label: "신생아 의류·침구류",
        amounts: { low: 150_000, mid: 300_000, high: 700_000 },
        defaultGrade: "low"
      },
      {
        id: "hidden-photo",
        label: "신생아 사진·기념",
        amounts: { low: 0, mid: 200_000, high: 800_000 },
        defaultGrade: "low"
      }
    ]
  }
];

// ─── Support (government subsidies) ──────────────────────────────────────────

export type SupportItem = {
  id: string;
  title: string;
  amount: number;
  condition?: string;
  channel: string;
  deadline: string;
};

export function getSupportItems(ctx: AppContextState): SupportItem[] {
  const isDual = ctx.dual_income;

  return [
    {
      id: "firstmeet",
      title: "첫만남이용권",
      amount: 2_000_000,
      condition: "첫째 기준",
      channel: "정부24 / 주민센터",
      deadline: "D+60 마감"
    },
    {
      id: "parent-benefit",
      title: "부모급여 (12개월)",
      amount: isDual ? 9_600_000 : 9_600_000,
      condition: "만 0세 월 80만 원",
      channel: "정부24 행복출산 원스톱",
      deadline: "출생신고 직후"
    },
    {
      id: "child-allowance",
      title: "아동수당 (12개월)",
      amount: 1_200_000,
      condition: "만 8세 미만 월 10만 원",
      channel: "정부24 행복출산 원스톱",
      deadline: "출생신고 직후"
    },
    {
      id: "postpartum-helper-gov",
      title: "산후도우미 바우처",
      amount: isDual ? 600_000 : 800_000,
      condition: isDual ? "맞벌이 기준 (최대 80%)" : "외벌이 기준",
      channel: "사회서비스 전자바우처",
      deadline: "출산 후 60일 이내"
    }
  ];
}

// ─── Draft state ──────────────────────────────────────────────────────────────

export type BudgetItemSelection = {
  itemId: string;
  grade: BudgetItemGrade;
  enabled: boolean;
};

export type BudgetDraftState = {
  categorySelections: Record<string, BudgetItemSelection>;
};

export function buildDefaultDraftState(): BudgetDraftState {
  const categorySelections: Record<string, BudgetItemSelection> = {};

  for (const category of budgetCategories) {
    for (const item of category.items) {
      categorySelections[item.id] = {
        itemId: item.id,
        grade: item.defaultGrade,
        enabled: true
      };
    }
  }

  return { categorySelections };
}

// ─── Calculation ──────────────────────────────────────────────────────────────

export type BudgetCalculation = {
  total: number;
  supportTotal: number;
  net: number;
  supportItems: SupportItem[];
  categoryTotals: Record<string, number>;
};

export function calculateBudget(
  draft: BudgetDraftState,
  ctx: AppContextState
): BudgetCalculation {
  let total = 0;
  const categoryTotals: Record<string, number> = {};

  for (const category of budgetCategories) {
    let catTotal = 0;

    for (const item of category.items) {
      const sel = draft.categorySelections[item.id];

      if (sel?.enabled) {
        catTotal += item.amounts[sel.grade];
      }
    }

    categoryTotals[category.id] = catTotal;
    total += catTotal;
  }

  const supportItems = getSupportItems(ctx);
  const supportTotal = supportItems.reduce((sum, s) => sum + s.amount, 0);
  const net = total - supportTotal;

  return { total, supportTotal, net, supportItems, categoryTotals };
}

// ─── Formatting ───────────────────────────────────────────────────────────────

export function formatKRW(amount: number): string {
  const abs = Math.abs(amount);

  if (abs >= 100_000_000) {
    const eok = Math.round(abs / 10_000_000) / 10;
    const formatted = eok % 1 === 0 ? `${eok}억` : `${eok}억`;
    return amount < 0 ? `-${formatted}` : formatted;
  }

  if (abs >= 10_000) {
    const man = Math.round(abs / 10_000);
    return amount < 0 ? `-${man}만 원` : `${man}만 원`;
  }

  return `${amount.toLocaleString("ko-KR")}원`;
}

// ─── Share intent builder ─────────────────────────────────────────────────────

export function buildBudgetShareIntent(calc: BudgetCalculation): ShareIntentState {
  return {
    surface: "budget",
    card_type: "budget_receipt",
    route: "/budget",
    title: "아기 첫 해 예산 결과",
    description: "지원금 반영 후 실질 부담액을 확인하세요.",
    lines: [
      `총 예상 비용 ${formatKRW(calc.total)}`,
      `지원금 총액 ${formatKRW(calc.supportTotal)}`,
      `실질 부담액 ${formatKRW(calc.net)}`
    ],
    messageByRole: {
      mom: "여보, 우리 아기 첫 해 얼마나 드는지 알아? →",
      dad: "아기 첫 해 예산을 한 번에 정리해봤어요 →"
    },
    ctaLabel: "예산 결과 보기",
    imageEyebrow: "BUDGET RECEIPT"
  };
}

// ─── Saving tips ──────────────────────────────────────────────────────────────

export const savingTips = [
  "산후도우미 바우처는 출산 후 60일 이내에 신청해야 합니다. 기한 놓치면 소멸.",
  "부모급여·아동수당은 출생신고 직후 행복출산 원스톱으로 한 번에 신청하세요.",
  "카시트는 중고 구매 시 사고 이력 확인이 필수입니다.",
  "분유는 모유수유 성공 여부에 따라 예산이 크게 달라집니다. 일단 소량만 준비.",
  "신생아 의류는 성장이 빠르므로 0~3개월 사이즈를 과다 구매하지 마세요."
];
