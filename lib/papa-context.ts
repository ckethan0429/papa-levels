const deliveryStatuses = ["pregnant", "born"] as const;
export const papaChecklistTabs = ["prepare", "center", "home", "admin"] as const;

export type DeliveryStatus = (typeof deliveryStatuses)[number];
export type PapaChecklistTab = (typeof papaChecklistTabs)[number];

export type AppContextState = {
  delivery_status: DeliveryStatus;
  base_date: string;
  region: string;
  dual_income: boolean;
};

export type AppContextSummaryItem = {
  key: keyof AppContextState;
  label: string;
  value: string;
};

export const DEFAULT_REGION_LABEL = "한국";

export const defaultAppContextState: AppContextState = {
  delivery_status: "pregnant",
  base_date: "",
  region: DEFAULT_REGION_LABEL,
  dual_income: false
};

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeDateString(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();

  return isIsoDateString(trimmed) ? trimmed : "";
}

function normalizeRegion(value: unknown): string {
  if (typeof value !== "string") {
    return DEFAULT_REGION_LABEL;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : DEFAULT_REGION_LABEL;
}

export function isDeliveryStatus(value: unknown): value is DeliveryStatus {
  return typeof value === "string" && deliveryStatuses.includes(value as DeliveryStatus);
}

export function isPapaChecklistTab(value: unknown): value is PapaChecklistTab {
  return typeof value === "string" && papaChecklistTabs.includes(value as PapaChecklistTab);
}

export function isIsoDateString(value: unknown): value is string {
  if (typeof value !== "string" || !isoDatePattern.test(value)) {
    return false;
  }

  const [yearValue, monthValue, dayValue] = value.split("-");
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return false;
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function normalizeAppContext(value: unknown): AppContextState {
  const record = isRecord(value) ? value : {};

  return {
    delivery_status: isDeliveryStatus(record.delivery_status)
      ? record.delivery_status
      : defaultAppContextState.delivery_status,
    base_date: normalizeDateString(record.base_date),
    region: normalizeRegion(record.region),
    dual_income: typeof record.dual_income === "boolean" ? record.dual_income : defaultAppContextState.dual_income
  };
}

export function mergeAppContext(current: AppContextState, patch: Partial<AppContextState>): AppContextState {
  return normalizeAppContext({ ...normalizeAppContext(current), ...patch });
}

export function isAppContextComplete(context: AppContextState): boolean {
  return isIsoDateString(context.base_date);
}

export function formatDeliveryStatusLabel(status: DeliveryStatus): string {
  return status === "pregnant" ? "출산 예정" : "출산 완료";
}

export function formatDualIncomeLabel(dualIncome: boolean): string {
  return dualIncome ? "맞벌이" : "외벌이";
}

export function getBaseDateFieldLabel(status: DeliveryStatus): string {
  return status === "pregnant" ? "출산 예정일" : "출산일";
}

export function getContextSummaryItems(context: AppContextState): AppContextSummaryItem[] {
  const normalized = normalizeAppContext(context);

  return [
    {
      key: "delivery_status",
      label: "상태",
      value: formatDeliveryStatusLabel(normalized.delivery_status)
    },
    {
      key: "base_date",
      label: "기준일",
      value: normalized.base_date || "미입력"
    },
    {
      key: "region",
      label: "지역",
      value: normalized.region
    },
    {
      key: "dual_income",
      label: "가구",
      value: formatDualIncomeLabel(normalized.dual_income)
    }
  ];
}
