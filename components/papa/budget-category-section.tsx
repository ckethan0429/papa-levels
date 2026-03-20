"use client";

import { useState } from "react";

import {
  budgetGradeLabels,
  formatKRW,
  type BudgetCategory,
  type BudgetDraftState,
  type BudgetItemGrade,
  type BudgetItemSelection
} from "@/lib/budget-domain";

function GradeToggle({
  grades,
  selected,
  onChange
}: {
  grades: BudgetItemGrade[];
  selected: BudgetItemGrade;
  onChange: (g: BudgetItemGrade) => void;
}) {
  return (
    <div className="flex gap-1">
      {grades.map((g) => (
        <button
          key={g}
          type="button"
          onClick={() => onChange(g)}
          aria-pressed={selected === g}
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
            selected === g
              ? "bg-ink text-paper"
              : "bg-mist text-ink/60 hover:bg-ink/10"
          }`}
        >
          {budgetGradeLabels[g]}
        </button>
      ))}
    </div>
  );
}

export function BudgetCategorySection({
  category,
  draft,
  onToggleItem,
  onChangeGrade
}: {
  category: BudgetCategory;
  draft: BudgetDraftState;
  onToggleItem: (itemId: string, enabled: boolean) => void;
  onChangeGrade: (itemId: string, grade: BudgetItemGrade) => void;
}) {
  const [open, setOpen] = useState(true);

  const categoryTotal = category.items.reduce((sum, item) => {
    const sel: BudgetItemSelection | undefined = draft.categorySelections[item.id];
    if (!sel?.enabled) return sum;
    return sum + item.amounts[sel.grade];
  }, 0);

  const grades: BudgetItemGrade[] = ["low", "mid", "high"];

  return (
    <div className="overflow-hidden rounded-[24px] border border-ink/10 bg-white shadow-card">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        aria-expanded={open}
      >
        <div>
          <p className="text-base font-semibold text-ink">{category.title}</p>
          <p className="mt-0.5 text-sm text-ink/55">{category.helper}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-ink">{formatKRW(categoryTotal)}</span>
          <span
            aria-hidden
            className={`text-ink/45 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            ▾
          </span>
        </div>
      </button>

      {open && (
        <ul className="space-y-2 px-5 pb-4">
          {category.items.map((item) => {
            const sel: BudgetItemSelection | undefined = draft.categorySelections[item.id];
            const enabled = sel?.enabled ?? true;
            const grade = sel?.grade ?? item.defaultGrade;

            return (
              <li
                key={item.id}
                className={`rounded-[18px] border px-4 py-3 transition ${
                  enabled ? "border-ink/8 bg-mist" : "border-ink/5 bg-ink/3 opacity-55"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <label className="flex cursor-pointer items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => onToggleItem(item.id, e.target.checked)}
                      className="mt-0.5 h-4 w-4 flex-shrink-0 accent-ink"
                    />
                    <div>
                      <p className="text-sm font-medium text-ink">{item.label}</p>
                      {item.note && (
                        <p className="mt-0.5 text-xs text-ink/50">{item.note}</p>
                      )}
                    </div>
                  </label>
                  <p className="flex-shrink-0 text-sm font-semibold text-ink">
                    {enabled ? formatKRW(item.amounts[grade]) : "—"}
                  </p>
                </div>
                {enabled && (
                  <div className="mt-2.5">
                    <GradeToggle
                      grades={grades}
                      selected={grade}
                      onChange={(g) => onChangeGrade(item.id, g)}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
