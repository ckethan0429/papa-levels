import { StatusBadge } from "@/components/papa/status-badge";
import { cn } from "@/lib/utils";

export function QuizChoiceCard({
  optionLabel,
  label,
  helper,
  isPreDad = false,
  selected = false,
  disabled = false,
  onSelect
}: {
  optionLabel: string;
  label: string;
  helper?: string;
  isPreDad?: boolean;
  selected?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "w-full rounded-[24px] border px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 disabled:cursor-not-allowed disabled:opacity-70",
        selected
          ? "border-ink bg-ink text-paper shadow-card"
          : "border-ink/10 bg-white text-ink shadow-card hover:border-ink/28 hover:bg-mist"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span
            aria-hidden
            className={cn(
              "mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
              selected ? "bg-paper text-ink" : "bg-mist text-ink"
            )}
          >
            {optionLabel}
          </span>
          <div className="min-w-0">
            <p className="text-base font-semibold leading-6 break-words">{label}</p>
            {helper && (
              <p className={cn("mt-2 text-sm leading-6 break-words", selected ? "text-paper/78" : "text-ink/62")}>{helper}</p>
            )}
          </div>
        </div>
        {isPreDad ? <StatusBadge tone={selected ? "paper" : "ember"}>예비 응답</StatusBadge> : null}
      </div>
    </button>
  );
}
