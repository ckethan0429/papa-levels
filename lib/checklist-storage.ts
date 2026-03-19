import {
  defaultAppContextState,
  isAppContextComplete,
  isPapaChecklistTab,
  mergeAppContext,
  normalizeAppContext,
  type AppContextState,
  type PapaChecklistTab
} from "./papa-context";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const checklistStorageKeys = {
  appContext: "app_context",
  checkedItemIds: "checklist_checked_item_ids",
  activeTab: "checklist_active_tab",
  expandedItemIds: "checklist_expanded_item_ids"
} as const;

export type ChecklistStorageSnapshot = {
  appContext: AppContextState;
  checkedItemIds: string[];
  activeTab: PapaChecklistTab;
  expandedItemIds: string[];
};

export function createDefaultChecklistStorageSnapshot(): ChecklistStorageSnapshot {
  return {
    appContext: { ...defaultAppContextState },
    checkedItemIds: [],
    activeTab: "prepare",
    expandedItemIds: []
  };
}

export const defaultChecklistStorageSnapshot = createDefaultChecklistStorageSnapshot();

function resolveStorage(storage?: StorageLike | null): StorageLike | null {
  if (storage) {
    return storage;
  }

  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readRawValue(key: string, storage?: StorageLike | null): string | null {
  const resolvedStorage = resolveStorage(storage);

  if (!resolvedStorage) {
    return null;
  }

  try {
    return resolvedStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRawValue(key: string, value: string, storage?: StorageLike | null): void {
  const resolvedStorage = resolveStorage(storage);

  if (!resolvedStorage) {
    return;
  }

  try {
    resolvedStorage.setItem(key, value);
  } catch {
    // Ignore storage quota / privacy-mode failures so client state stays usable.
  }
}

function removeRawValue(key: string, storage?: StorageLike | null): void {
  const resolvedStorage = resolveStorage(storage);

  if (!resolvedStorage) {
    return;
  }

  try {
    resolvedStorage.removeItem(key);
  } catch {
    // Ignore removal failures for the same reason as writes.
  }
}

function parseJson(rawValue: string | null): unknown {
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}

function uniqueStrings(items: Iterable<string>): string[] {
  const deduped = new Set<string>();

  for (const item of items) {
    const trimmed = item.trim();

    if (trimmed.length > 0) {
      deduped.add(trimmed);
    }
  }

  return [...deduped];
}

function normalizeStoredIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return uniqueStrings(value.filter((item): item is string => typeof item === "string"));
}

function normalizeStoredTab(value: unknown, fallback: PapaChecklistTab = defaultChecklistStorageSnapshot.activeTab): PapaChecklistTab {
  return isPapaChecklistTab(value) ? value : fallback;
}

export function canUseChecklistStorage(storage?: StorageLike | null): boolean {
  return resolveStorage(storage) !== null;
}

export function readStoredAppContext(storage?: StorageLike | null): AppContextState {
  return normalizeAppContext(parseJson(readRawValue(checklistStorageKeys.appContext, storage)));
}

export function writeStoredAppContext(context: unknown, storage?: StorageLike | null): AppContextState {
  const normalized = normalizeAppContext(context);

  writeRawValue(checklistStorageKeys.appContext, JSON.stringify(normalized), storage);

  return normalized;
}

export function patchStoredAppContext(patch: Partial<AppContextState>, storage?: StorageLike | null): AppContextState {
  const nextValue = mergeAppContext(readStoredAppContext(storage), patch);

  return writeStoredAppContext(nextValue, storage);
}

export function hasStoredAppContext(storage?: StorageLike | null): boolean {
  return isAppContextComplete(readStoredAppContext(storage));
}

export function clearStoredAppContext(storage?: StorageLike | null): void {
  removeRawValue(checklistStorageKeys.appContext, storage);
}

export function readCheckedItemIds(storage?: StorageLike | null): string[] {
  return normalizeStoredIds(parseJson(readRawValue(checklistStorageKeys.checkedItemIds, storage)));
}

export function writeCheckedItemIds(itemIds: Iterable<string>, storage?: StorageLike | null): string[] {
  const nextValue = uniqueStrings(itemIds);

  writeRawValue(checklistStorageKeys.checkedItemIds, JSON.stringify(nextValue), storage);

  return nextValue;
}

export function toggleCheckedItemId(itemId: string, storage?: StorageLike | null): string[] {
  const normalizedId = itemId.trim();

  if (normalizedId.length === 0) {
    return readCheckedItemIds(storage);
  }

  const currentIds = readCheckedItemIds(storage);
  const nextIds = currentIds.includes(normalizedId)
    ? currentIds.filter((currentId) => currentId !== normalizedId)
    : [...currentIds, normalizedId];

  return writeCheckedItemIds(nextIds, storage);
}

export function clearCheckedItemIds(storage?: StorageLike | null): void {
  removeRawValue(checklistStorageKeys.checkedItemIds, storage);
}

export function readStoredActiveTab(
  storage?: StorageLike | null,
  fallback: PapaChecklistTab = defaultChecklistStorageSnapshot.activeTab
): PapaChecklistTab {
  const rawValue = readRawValue(checklistStorageKeys.activeTab, storage);

  if (isPapaChecklistTab(rawValue)) {
    return rawValue;
  }

  return normalizeStoredTab(parseJson(rawValue), fallback);
}

export function writeStoredActiveTab(tab: PapaChecklistTab, storage?: StorageLike | null): PapaChecklistTab {
  writeRawValue(checklistStorageKeys.activeTab, tab, storage);

  return tab;
}

export function clearStoredActiveTab(storage?: StorageLike | null): void {
  removeRawValue(checklistStorageKeys.activeTab, storage);
}

export function readExpandedItemIds(storage?: StorageLike | null): string[] {
  return normalizeStoredIds(parseJson(readRawValue(checklistStorageKeys.expandedItemIds, storage)));
}

export function writeExpandedItemIds(itemIds: Iterable<string>, storage?: StorageLike | null): string[] {
  const nextValue = uniqueStrings(itemIds);

  writeRawValue(checklistStorageKeys.expandedItemIds, JSON.stringify(nextValue), storage);

  return nextValue;
}

export function toggleExpandedItemId(itemId: string, storage?: StorageLike | null): string[] {
  const normalizedId = itemId.trim();

  if (normalizedId.length === 0) {
    return readExpandedItemIds(storage);
  }

  const currentIds = readExpandedItemIds(storage);
  const nextIds = currentIds.includes(normalizedId)
    ? currentIds.filter((currentId) => currentId !== normalizedId)
    : [...currentIds, normalizedId];

  return writeExpandedItemIds(nextIds, storage);
}

export function clearExpandedItemIds(storage?: StorageLike | null): void {
  removeRawValue(checklistStorageKeys.expandedItemIds, storage);
}

export function readChecklistStorageSnapshot(storage?: StorageLike | null): ChecklistStorageSnapshot {
  return {
    appContext: readStoredAppContext(storage),
    checkedItemIds: readCheckedItemIds(storage),
    activeTab: readStoredActiveTab(storage),
    expandedItemIds: readExpandedItemIds(storage)
  };
}

export function clearChecklistStorage(storage?: StorageLike | null): void {
  clearStoredAppContext(storage);
  clearCheckedItemIds(storage);
  clearStoredActiveTab(storage);
  clearExpandedItemIds(storage);
}

export function createMemoryStorage(seed: Record<string, string> = {}) {
  const store = new Map(Object.entries(seed));

  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    dump() {
      return Object.fromEntries(store.entries());
    },
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    key(index: number) {
      return [...store.keys()][index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    }
  };
}
