"use client";

import { useState } from "react";

export function ShareDock({
  title,
  message
}: {
  title: string;
  message: string;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div
      role="complementary"
      aria-label="공유 도크"
      className="fixed bottom-0 left-0 right-0 z-30"
    >
      {/* Always in DOM so aria-controls resolves; hidden attr removes from a11y tree when closed */}
      <div id="share-sheet" hidden={!sheetOpen} className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-h-[60vh] overflow-y-auto rounded-t-[24px] border border-b-0 border-ink/10 bg-white/98 px-4 pb-3 pt-4 shadow-panel backdrop-blur-md">
          <div className="mb-3 space-y-1">
            <p className="text-sm font-semibold text-ink">{title}</p>
            <p className="line-clamp-2 text-sm text-ink/62">{message}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <button
              type="button"
              className="rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-paper transition hover:bg-ink/90 active:scale-[0.98]"
            >
              카카오 공유
            </button>
            <button
              type="button"
              className="rounded-2xl bg-ember px-4 py-3 text-sm font-medium text-paper transition hover:bg-ember/90 active:scale-[0.98]"
            >
              이미지 저장
            </button>
            <button
              type="button"
              className="col-span-2 rounded-2xl border border-ink/12 bg-white px-4 py-3 text-sm font-medium text-ink transition hover:border-ink/24 hover:bg-mist active:scale-[0.98] sm:col-span-1"
            >
              링크 복사
            </button>
          </div>
        </div>
      </div>

      <div
        className="border-t border-ink/8 bg-white/96 backdrop-blur-md"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setSheetOpen((prev) => !prev)}
            aria-expanded={sheetOpen}
            aria-controls="share-sheet"
            className="flex w-full items-center justify-between rounded-[20px] bg-ink px-5 py-4 text-sm font-semibold text-paper transition hover:bg-ink/90 active:scale-[0.99]"
          >
            <span>남편에게 보내기</span>
            <span
              aria-hidden
              className={`text-paper/72 transition-transform duration-200 ${sheetOpen ? "rotate-45" : ""}`}
            >
              +
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
