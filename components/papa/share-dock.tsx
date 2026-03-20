"use client";

import { useEffect, useMemo, useState } from "react";

import {
  buildShareMessage,
  buildShareUrl,
  copyShareText,
  downloadShareImage,
  getShareFallbackGuide,
  shareEntryRoles,
  shareViaKakao,
  type ShareEntryRole,
  type ShareIntentState
} from "@/lib/share-domain";

type ShareDockProps = {
  title: string;
  message: string;
  intent: ShareIntentState;
  triggerLabel?: string;
  autoOpenKey?: string | number;
};

export function ShareDock({
  title,
  message,
  intent,
  triggerLabel = "남편에게 보내기",
  autoOpenKey
}: ShareDockProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [entryRole, setEntryRole] = useState<ShareEntryRole>("mom");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [busyMethod, setBusyMethod] = useState<"kakao" | "image" | "link" | null>(null);

  useEffect(() => {
    if (typeof autoOpenKey !== "undefined") {
      setSheetOpen(true);
    }
  }, [autoOpenKey]);

  const fallbackGuide = useMemo(() => {
    if (typeof navigator === "undefined") {
      return "카카오 공유가 안 열리면 이미지 저장이나 링크 복사를 사용하세요";
    }

    return getShareFallbackGuide(navigator.userAgent);
  }, []);

  const shareUrl = useMemo(() => buildShareUrl(intent, { entryRole }), [entryRole, intent]);
  const shareText = useMemo(() => buildShareMessage(intent, entryRole), [entryRole, intent]);

  async function runShareAction(method: "kakao" | "image" | "link") {
    setBusyMethod(method);
    setStatusMessage(null);

    try {
      if (method === "kakao") {
        await shareViaKakao(intent, entryRole);
        setStatusMessage("카카오 공유 창을 열었습니다.");
        return;
      }

      if (method === "image") {
        await downloadShareImage(intent, entryRole);
        setStatusMessage("공유 이미지를 저장했습니다.");
        return;
      }

      await copyShareText(intent, entryRole);
      setStatusMessage("공유 링크를 복사했습니다.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "공유 처리 중 문제가 발생했습니다.";
      setStatusMessage(
        method === "kakao"
          ? `카카오 공유를 바로 열지 못했습니다. ${fallbackGuide}`
          : message
      );
    } finally {
      setBusyMethod(null);
    }
  }

  return (
    <div role="complementary" aria-label="공유 도크" className="fixed bottom-0 left-0 right-0 z-30">
      <div id="share-sheet" hidden={!sheetOpen} className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-h-[70vh] overflow-y-auto rounded-t-[24px] border border-b-0 border-ink/10 bg-white/98 px-4 pb-4 pt-4 shadow-panel backdrop-blur-md">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-ink">{title}</p>
            <p className="text-sm text-ink/62">{message}</p>
          </div>

          <section className="mt-4 rounded-[20px] bg-mist px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">공유 컨텍스트</p>
            <h3 className="mt-2 text-base font-semibold text-ink">{intent.title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink/68">{intent.description}</p>
            {intent.lines && intent.lines.length > 0 && (
              <ul className="mt-3 space-y-2 text-sm leading-6 text-ink/72">
                {intent.lines.slice(0, 3).map((line) => (
                  <li key={line} className="rounded-2xl bg-white px-3 py-3">
                    {line}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mt-4 rounded-[20px] border border-ink/10 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">entry_role</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {shareEntryRoles.map((role) => {
                const active = entryRole === role;
                const label = role === "mom" ? "엄마가 보냄" : "아빠가 공유";
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setEntryRole(role)}
                    aria-pressed={active}
                    className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      active ? "bg-ink text-paper" : "bg-mist text-ink hover:bg-paper"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-sm text-ink/62">{shareText}</p>
            <p className="mt-2 break-all text-xs leading-5 text-ink/52">{shareUrl}</p>
          </section>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => runShareAction("kakao")}
              disabled={busyMethod !== null}
              className="rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-paper transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busyMethod === "kakao" ? "여는 중..." : "카카오톡으로 보내기"}
            </button>
            <button
              type="button"
              onClick={() => runShareAction("image")}
              disabled={busyMethod !== null}
              className="rounded-2xl bg-ember px-4 py-3 text-sm font-medium text-paper transition hover:bg-ember/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busyMethod === "image" ? "저장 중..." : "이미지로 저장하기"}
            </button>
            <button
              type="button"
              onClick={() => runShareAction("link")}
              disabled={busyMethod !== null}
              className="col-span-2 rounded-2xl border border-ink/12 bg-white px-4 py-3 text-sm font-medium text-ink transition hover:border-ink/24 hover:bg-mist disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-1"
            >
              {busyMethod === "link" ? "복사 중..." : "링크 복사"}
            </button>
          </div>

          <div className="mt-4 rounded-[20px] border border-dashed border-ink/12 bg-paper/70 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">Fallback 안내</p>
            <p className="mt-2 text-sm leading-6 text-ink/68">{fallbackGuide}</p>
            {statusMessage && <p className="mt-3 text-sm font-medium text-ink">{statusMessage}</p>}
          </div>
        </div>
      </div>

      <div className="border-t border-ink/8 bg-white/96 backdrop-blur-md" style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}>
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setSheetOpen((prev) => !prev)}
            aria-expanded={sheetOpen}
            aria-controls="share-sheet"
            className="flex w-full items-center justify-between rounded-[20px] bg-ink px-5 py-4 text-sm font-semibold text-paper transition hover:bg-ink/90 active:scale-[0.99]"
          >
            <span>{triggerLabel}</span>
            <span aria-hidden className={`text-paper/72 transition-transform duration-200 ${sheetOpen ? "rotate-45" : ""}`}>
              +
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
