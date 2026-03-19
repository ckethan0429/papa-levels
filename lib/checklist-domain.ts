import checklistItemsSeed from "../content/checklist/items.json";

export const CHECKLIST_SECTIONS = ["prepare", "center", "home", "admin"] as const;
export const CHECKLIST_NON_ADMIN_SECTIONS = ["prepare", "center", "home"] as const;

export type ChecklistSection = (typeof CHECKLIST_SECTIONS)[number];
export type ChecklistNonAdminSection = (typeof CHECKLIST_NON_ADMIN_SECTIONS)[number];
export type ChecklistUrgency = "required" | "recommended" | "optional";
export type ChecklistOwner = "dad" | "mom" | "couple" | "admin";
export type ChecklistValidationStatus = "validated_fact" | "working_assumption" | "open_question";
export type DeliveryStatus = "pregnant" | "born";

export type ChecklistItem = {
  id: string;
  section: ChecklistSection;
  title: string;
  urgency: ChecklistUrgency;
  why: string;
  when_label: string;
  due_offset_days: number | null;
  who: ChecklistOwner;
  cost_range: string | null;
  used_market_allowed: boolean | null;
  share_copy: string;
  affiliate_target: string | null;
  deeplink_target: string | null;
  status: ChecklistValidationStatus;
  proof_label: string | null;
  proof_threshold: string | null;
};

export type ChecklistDdayInput = {
  deliveryStatus: DeliveryStatus;
  baseDate: string | Date;
  today?: string | Date;
};

export type ChecklistDdayState = {
  deliveryStatus: DeliveryStatus;
  baseDate: string;
  today: string;
  dayOffset: number;
  label: string;
  recommendedSection: ChecklistNonAdminSection;
  isBeforeBirth: boolean;
  isToday: boolean;
  isWithinChecklistWindow: boolean;
  isBeforeChecklistWindow: boolean;
  isAfterChecklistWindow: boolean;
};

export type WeeklyActionItem = ChecklistItem & {
  distanceFromToday: number;
  isChecked: boolean;
  sourceSection: ChecklistSection;
};

export type WeeklyActionSelection = {
  sourceSection: ChecklistSection;
  sectionOrder: ChecklistSection[];
  sectionsUsed: ChecklistSection[];
  items: WeeklyActionItem[];
  selectedItemIds: string[];
};

export type WeeklyActionInput = {
  activeSection: ChecklistSection;
  dayOffset: number;
  checkedItemIds?: Iterable<string>;
  limit?: number;
};

export type ChecklistDomainInput = ChecklistDdayInput & {
  activeSection?: ChecklistSection | null;
  checkedItemIds?: Iterable<string>;
  weeklyActionLimit?: number;
};

export const checklistSectionMeta: Record<ChecklistSection, { label: string; helper: string }> = {
  prepare: { label: "준비", helper: "D-30 ~ D-Day" },
  center: { label: "조리원", helper: "D-Day ~ D+13" },
  home: { label: "집", helper: "D+14 ~ D+30" },
  admin: { label: "행정", helper: "기한 기반" }
};

const checklistItems = checklistItemsSeed as ChecklistItem[];
const checklistItemIndex = new Map(checklistItems.map((item, index) => [item.id, index]));

export const checklistItemsBySection: Record<ChecklistSection, ChecklistItem[]> = {
  prepare: [],
  center: [],
  home: [],
  admin: []
};

for (const item of checklistItems) {
  checklistItemsBySection[item.section].push(item);
}

const urgencyPriority: Record<ChecklistUrgency, number> = {
  required: 0,
  recommended: 1,
  optional: 2
};

const ownerPriority: Record<ChecklistOwner, number> = {
  dad: 0,
  couple: 1,
  admin: 2,
  mom: 3
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function parseDateInput(value: string | Date): Date {
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid checklist date input: ${value}`);
  }

  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

function toCalendarStamp(value: string | Date): number {
  const normalized = parseDateInput(value);
  return Date.UTC(normalized.getFullYear(), normalized.getMonth(), normalized.getDate());
}

function toIsoDate(value: string | Date): string {
  const normalized = parseDateInput(value);
  const year = normalized.getFullYear();
  const month = String(normalized.getMonth() + 1).padStart(2, "0");
  const day = String(normalized.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDdayLabel(dayOffset: number): string {
  if (dayOffset === 0) {
    return "D-Day";
  }

  if (dayOffset > 0) {
    return `D+${dayOffset}`;
  }

  return `D${dayOffset}`;
}

function getChecklistItemDistance(item: ChecklistItem, dayOffset: number): number {
  if (typeof item.due_offset_days !== "number") {
    return Number.POSITIVE_INFINITY;
  }

  return Math.abs(item.due_offset_days - dayOffset);
}

function getFallbackSections(activeSection: ChecklistSection, dayOffset: number): ChecklistSection[] {
  const recommendedSection = getRecommendedChecklistSection(dayOffset);

  if (activeSection === "prepare") {
    return ["center", "home", "admin"];
  }

  if (activeSection === "center") {
    return ["prepare", "home", "admin"];
  }

  if (activeSection === "home") {
    return ["center", "prepare", "admin"];
  }

  return [recommendedSection, ...CHECKLIST_NON_ADMIN_SECTIONS.filter((section) => section !== recommendedSection)];
}

function getSortedCandidates(section: ChecklistSection, checkedItemIds: ReadonlySet<string>, dayOffset: number): ChecklistItem[] {
  return [...checklistItemsBySection[section]].sort((left, right) => {
    const checkedDelta = Number(checkedItemIds.has(left.id)) - Number(checkedItemIds.has(right.id));
    if (checkedDelta !== 0) {
      return checkedDelta;
    }

    const urgencyDelta = urgencyPriority[left.urgency] - urgencyPriority[right.urgency];
    if (urgencyDelta !== 0) {
      return urgencyDelta;
    }

    const ownerDelta = ownerPriority[left.who] - ownerPriority[right.who];
    if (ownerDelta !== 0) {
      return ownerDelta;
    }

    const distanceDelta = getChecklistItemDistance(left, dayOffset) - getChecklistItemDistance(right, dayOffset);
    if (distanceDelta !== 0) {
      return distanceDelta;
    }

    return (checklistItemIndex.get(left.id) ?? Number.MAX_SAFE_INTEGER) - (checklistItemIndex.get(right.id) ?? Number.MAX_SAFE_INTEGER);
  });
}

export function getChecklistItems(): ChecklistItem[] {
  return [...checklistItems];
}

export function getChecklistItemsBySection(section: ChecklistSection): ChecklistItem[] {
  return [...checklistItemsBySection[section]];
}

export function getRecommendedChecklistSection(dayOffset: number): ChecklistNonAdminSection {
  if (dayOffset <= -1) {
    return "prepare";
  }

  if (dayOffset <= 13) {
    return "center";
  }

  return "home";
}

export function resolveChecklistSection(options: {
  activeSection?: ChecklistSection | null;
  dayOffset: number;
}): ChecklistSection {
  if (options.activeSection === "admin") {
    return "admin";
  }

  return options.activeSection ?? getRecommendedChecklistSection(options.dayOffset);
}

export function calculateChecklistDday(input: ChecklistDdayInput): ChecklistDdayState {
  const dayOffset = Math.round((toCalendarStamp(input.today ?? new Date()) - toCalendarStamp(input.baseDate)) / DAY_IN_MS);

  return {
    deliveryStatus: input.deliveryStatus,
    baseDate: toIsoDate(input.baseDate),
    today: toIsoDate(input.today ?? new Date()),
    dayOffset,
    label: getDdayLabel(dayOffset),
    recommendedSection: getRecommendedChecklistSection(dayOffset),
    isBeforeBirth: dayOffset < 0,
    isToday: dayOffset === 0,
    isWithinChecklistWindow: dayOffset >= -30 && dayOffset <= 30,
    isBeforeChecklistWindow: dayOffset < -30,
    isAfterChecklistWindow: dayOffset > 30
  };
}

export function selectWeeklyActions(input: WeeklyActionInput): WeeklyActionSelection {
  const checkedItemIds = new Set(input.checkedItemIds);
  const limit = input.limit ?? 3;
  const sectionOrder = [input.activeSection, ...getFallbackSections(input.activeSection, input.dayOffset)];
  const items: WeeklyActionItem[] = [];

  for (const section of sectionOrder) {
    const allowOnlyRequired = input.activeSection !== "admin" && section === "admin";
    const candidates = getSortedCandidates(section, checkedItemIds, input.dayOffset).filter(
      (item) => !allowOnlyRequired || item.urgency === "required"
    );

    for (const item of candidates) {
      if (items.length >= limit) {
        break;
      }

      if (items.some((existingItem) => existingItem.id === item.id)) {
        continue;
      }

      items.push({
        ...item,
        distanceFromToday: getChecklistItemDistance(item, input.dayOffset),
        isChecked: checkedItemIds.has(item.id),
        sourceSection: section
      });
    }

    if (items.length >= limit) {
      break;
    }
  }

  const sectionsUsed = Array.from(new Set(items.map((item) => item.sourceSection)));

  return {
    sourceSection: input.activeSection,
    sectionOrder,
    sectionsUsed,
    items,
    selectedItemIds: items.map((item) => item.id)
  };
}

export function selectChecklistDomain(input: ChecklistDomainInput) {
  const dday = calculateChecklistDday(input);
  const activeSection = resolveChecklistSection({
    activeSection: input.activeSection,
    dayOffset: dday.dayOffset
  });
  const weeklyAction = selectWeeklyActions({
    activeSection,
    dayOffset: dday.dayOffset,
    checkedItemIds: input.checkedItemIds,
    limit: input.weeklyActionLimit
  });

  return {
    dday,
    activeSection,
    recommendedSection: dday.recommendedSection,
    itemsBySection: checklistItemsBySection,
    visibleItems: getChecklistItemsBySection(activeSection),
    weeklyAction
  };
}
