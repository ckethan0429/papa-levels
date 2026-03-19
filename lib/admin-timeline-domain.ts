import benefitsSeed from "@/content/policy/benefits.json";
import type { DeadlineItem, DeadlineState } from "@/lib/papa-data";

export type PolicyBenefitStatus = "validated_fact" | "working_assumption" | "open_question";
export type PolicyBenefitRegionScope = "national" | "seoul" | `local:${string}`;

export type PolicyBenefit = {
  id: string;
  section: string;
  title: string;
  urgency: "required" | "recommended";
  why: string;
  when_label: string;
  due_offset_days: number | null;
  who: string;
  cost_range: string;
  used_market_allowed: boolean | null;
  share_copy: string;
  affiliate_target: string | null;
  deeplink_target: string;
  status: PolicyBenefitStatus;
  proof_label: string | null;
  proof_threshold: string | null;
  source: string;
  effective_date: string;
  verified_at: string;
  region_scope: PolicyBenefitRegionScope;
  region_notice: string;
  benefit_amount_label: string | null;
  application_channel: string | null;
};

export type DeadlineBucket = "d_day" | "d_7" | "imminent" | "passed" | "none";

export type AdminTimelineCardItem = {
  id: string;
  title: string;
  whenLabel: string;
  dueLabel: string;
  deadlineBucket: DeadlineBucket;
  daysRemaining: number | null;
  benefitAmountLabel: string | null;
  applicationChannel: string | null;
  why: string;
  metadata: {
    regionNotice: string;
    effectiveDate: string;
    verifiedAt: string;
    regionScopeLabel: string;
  };
  shareCopy: string;
  deeplinkTarget: string;
};

export type AdminTimelineCardInput = AdminTimelineCardItem | DeadlineItem;

const DEFAULT_REGION_SCOPE_LABELS: Record<string, string> = {
  national: "전국 공통",
  seoul: "서울시 기준",
  "local:pending": "지역 확인 필요",
  전국: "전국 공통"
};

const LOCAL_PENDING_NOTICE = "지역마다 크게 다릅니다. 거주지 공고를 우선 확인하세요.";

const policyBenefits = benefitsSeed as PolicyBenefit[];

function isAdminTimelineCardItem(item: AdminTimelineCardInput): item is AdminTimelineCardItem {
  return "deadlineBucket" in item && "metadata" in item;
}

function stripPrefix(value: string, prefix: string) {
  return value.startsWith(prefix) ? value.slice(prefix.length).trim() : value;
}

function extractDaysRemaining(label: string) {
  const matched = label.match(/(\d+)일 남음/);
  if (matched) {
    return Number(matched[1]);
  }

  if (label.includes("오늘")) {
    return 0;
  }

  if (label.includes("지남")) {
    return -1;
  }

  return null;
}

function mapLegacyDeadlineState(state: DeadlineState): DeadlineBucket {
  switch (state) {
    case "today":
      return "d_day";
    case "soon":
      return "d_7";
    case "upcoming":
      return "none";
    case "expired":
      return "passed";
    case "done":
    default:
      return "none";
  }
}

function formatDeadlineBaseLabel(dueOffsetDays: number) {
  return `${dueOffsetDays < 0 ? `D${dueOffsetDays}` : `D+${dueOffsetDays}`} 마감`;
}

function formatDaysRemaining(daysRemaining: number) {
  if (daysRemaining < 0) {
    return "기한 지남";
  }

  if (daysRemaining === 0) {
    return "오늘까지";
  }

  return `${daysRemaining}일 남음`;
}

export function getDaysRemaining(dueOffsetDays: number | null, elapsedDays = 0) {
  return dueOffsetDays === null ? null : dueOffsetDays - elapsedDays;
}

export function resolveDeadlineBucket(daysRemaining: number | null): DeadlineBucket {
  if (daysRemaining === null) {
    return "none";
  }

  if (daysRemaining < 0) {
    return "passed";
  }

  if (daysRemaining === 0) {
    return "d_day";
  }

  if (daysRemaining <= 7) {
    return "d_7";
  }

  if (daysRemaining <= 14) {
    return "imminent";
  }

  return "none";
}

export function formatRegionScopeLabel(regionScope: string) {
  if (regionScope in DEFAULT_REGION_SCOPE_LABELS) {
    return DEFAULT_REGION_SCOPE_LABELS[regionScope];
  }

  if (regionScope.startsWith("local:")) {
    return "지역별 상이";
  }

  return regionScope;
}

export function resolveRegionNotice(item: Pick<PolicyBenefit, "region_scope" | "region_notice">) {
  return item.region_scope === "local:pending" ? LOCAL_PENDING_NOTICE : item.region_notice;
}

export function formatDueLabel(item: Pick<PolicyBenefit, "due_offset_days" | "when_label">, elapsedDays = 0) {
  const daysRemaining = getDaysRemaining(item.due_offset_days, elapsedDays);

  if (daysRemaining === null || item.due_offset_days === null) {
    return item.when_label;
  }

  return `${formatDeadlineBaseLabel(item.due_offset_days)} · ${formatDaysRemaining(daysRemaining)}`;
}

export function selectNationalAdminBenefits(items: PolicyBenefit[] = policyBenefits) {
  return items.filter((item) => item.section === "admin" && item.region_scope === "national" && item.status !== "open_question");
}

export function mapPolicyBenefitToAdminTimelineItem(item: PolicyBenefit, options: { elapsedDays?: number } = {}): AdminTimelineCardItem {
  const elapsedDays = options.elapsedDays ?? 0;
  const daysRemaining = getDaysRemaining(item.due_offset_days, elapsedDays);

  return {
    id: item.id,
    title: item.title,
    whenLabel: item.when_label,
    dueLabel: formatDueLabel(item, elapsedDays),
    deadlineBucket: resolveDeadlineBucket(daysRemaining),
    daysRemaining,
    benefitAmountLabel: item.benefit_amount_label,
    applicationChannel: item.application_channel,
    why: item.why,
    metadata: {
      regionNotice: resolveRegionNotice(item),
      effectiveDate: item.effective_date,
      verifiedAt: item.verified_at,
      regionScopeLabel: formatRegionScopeLabel(item.region_scope)
    },
    shareCopy: item.share_copy,
    deeplinkTarget: item.deeplink_target
  };
}

export function selectAdminTimelineItems(
  options: {
    items?: PolicyBenefit[];
    onlyNational?: boolean;
    elapsedDays?: number;
  } = {}
) {
  const sourceItems = options.items ?? policyBenefits;
  const filteredItems =
    options.onlyNational ?? true
      ? selectNationalAdminBenefits(sourceItems)
      : sourceItems.filter((item) => item.section === "admin" && item.status !== "open_question");

  return [...filteredItems]
    .sort((left, right) => {
      if (left.due_offset_days === null && right.due_offset_days === null) {
        return left.title.localeCompare(right.title, "ko");
      }

      if (left.due_offset_days === null) {
        return 1;
      }

      if (right.due_offset_days === null) {
        return -1;
      }

      return left.due_offset_days - right.due_offset_days;
    })
    .map((item) => mapPolicyBenefitToAdminTimelineItem(item, { elapsedDays: options.elapsedDays ?? 0 }));
}

export function selectDeadlineAlertItems(items = selectAdminTimelineItems()) {
  return items.filter((item) => item.deadlineBucket === "d_day" || item.deadlineBucket === "d_7");
}

export function coerceAdminTimelineCardItem(item: AdminTimelineCardInput): AdminTimelineCardItem {
  if (isAdminTimelineCardItem(item)) {
    return item;
  }

  const daysRemaining = extractDaysRemaining(item.dueLabel) ?? (item.state === "today" ? 0 : item.state === "expired" ? -1 : null);

  return {
    id: item.id,
    title: item.title,
    whenLabel: item.dueLabel,
    dueLabel: item.dueLabel,
    deadlineBucket: daysRemaining === null ? mapLegacyDeadlineState(item.state) : resolveDeadlineBucket(daysRemaining),
    daysRemaining,
    benefitAmountLabel: item.amount === "-" ? null : item.amount,
    applicationChannel: item.channel,
    why: item.note,
    metadata: {
      regionNotice: item.regionNotice,
      effectiveDate: stripPrefix(item.effectiveDate, "기준일"),
      verifiedAt: stripPrefix(item.verifiedAt, "최종 검수"),
      regionScopeLabel: formatRegionScopeLabel(item.regionScope)
    },
    shareCopy: `${item.title} 확인 필요`,
    deeplinkTarget: "/checklist?tab=admin"
  };
}

export const adminTimelineItems = selectAdminTimelineItems();
