import { StatusBadge } from "@/components/papa/status-badge";
import { cn } from "@/lib/utils";

export function QuizQuestionStepper({
  currentStep,
  totalSteps
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <section className="rounded-[24px] border border-ink/10 bg-white px-4 py-4 shadow-card" aria-label="퀴즈 진행도">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">Quiz Progress</p>
          <h2 className="mt-2 text-lg font-semibold text-ink">{currentStep} / {totalSteps}</h2>
        </div>
        <StatusBadge tone="ember">5 Questions</StatusBadge>
      </div>
      <ol className="mt-4 grid grid-cols-5 gap-2" aria-hidden="true">
        {Array.from({ length: totalSteps }, (_, index) => {
          const isCompleted = index < currentStep - 1;
          const isCurrent = index === currentStep - 1;

          return (
            <li
              key={index}
              className={cn(
                "h-2 rounded-full transition-colors",
                isCurrent ? "bg-ember" : isCompleted ? "bg-lime" : "bg-mist"
              )}
            />
          );
        })}
      </ol>
      <p className="mt-3 text-sm leading-6 text-ink/62">선택 즉시 다음 질문으로 넘어갑니다. 필요하면 이전 질문으로 돌아가 답을 바꿀 수 있어요.</p>
    </section>
  );
}
