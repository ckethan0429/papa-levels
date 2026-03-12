import { cn } from "@/lib/utils";

type Tone = "ember" | "lime" | "ink" | "paper";

const toneClass: Record<Tone, string> = {
  ember: "bg-ember/15 text-ember ring-1 ring-ember/25",
  lime: "bg-lime/15 text-ink ring-1 ring-lime/30",
  ink: "bg-ink text-paper ring-1 ring-white/5",
  paper: "bg-white/80 text-ink ring-1 ring-ink/10"
};

export function StatusBadge({
  tone = "paper",
  children
}: {
  tone?: Tone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]",
        toneClass[tone]
      )}
    >
      {children}
    </span>
  );
}
