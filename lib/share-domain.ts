export const shareEntryRoles = ["mom", "dad"] as const;
export const shareMethods = ["kakao", "image", "link"] as const;
export const shareSurfaces = ["checklist", "admin", "budget", "quiz"] as const;
export const shareCardTypes = ["weekly_action", "admin_deadline", "budget_receipt", "quiz_result"] as const;

export type ShareEntryRole = (typeof shareEntryRoles)[number];
export type ShareMethod = (typeof shareMethods)[number];
export type ShareSurface = (typeof shareSurfaces)[number];
export type ShareCardType = (typeof shareCardTypes)[number];

export type ShareIntentState = {
  surface: ShareSurface;
  card_type: ShareCardType;
  route: "/checklist" | "/budget" | "/quiz";
  query?: Record<string, string | null | undefined>;
  title: string;
  description: string;
  lines?: string[];
  messageByRole?: Partial<Record<ShareEntryRole, string>>;
  ctaLabel?: string;
  imageEyebrow?: string;
  imageFooter?: string;
};

export type ShareLinkOptions = {
  entryRole: ShareEntryRole;
  origin?: string;
};

const DEFAULT_UTM_SOURCE = "papalevel";
const DEFAULT_UTM_MEDIUM = "share";
const DEFAULT_IMAGE_FOOTER = "papalevel.com | 아빠 되기 프로젝트, 여기서 관리하세요";
const DEFAULT_CANVAS_WIDTH = 1080;
const DEFAULT_CANVAS_HEIGHT = 1080;
const DEFAULT_MAX_LINES = 4;
const KAKAO_SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.9/kakao.min.js";
const KAKAO_SCRIPT_ID = "papalevel-kakao-sdk";

declare global {
  interface Window {
    Kakao?: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Share?: {
        sendDefault: (payload: Record<string, unknown>) => void;
      };
    };
  }
}

function compactLines(lines: Array<string | null | undefined>): string[] {
  return lines
    .map((line) => line?.trim() ?? "")
    .filter((line, index, values) => line.length > 0 && values.indexOf(line) === index);
}

export function resolveShareOrigin(origin?: string) {
  if (origin) {
    return origin.replace(/\/$/, "");
  }

  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }

  if (typeof process !== "undefined") {
    const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL?.trim();

    if (configuredOrigin) {
      return configuredOrigin.replace(/\/$/, "");
    }
  }

  return "https://papalevel.com";
}

export function buildSharePath(intent: ShareIntentState) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(intent.query ?? {})) {
    if (typeof value === "string" && value.trim().length > 0) {
      params.set(key, value);
    }
  }

  const pathname = intent.route;
  const queryString = params.toString();

  return queryString.length > 0 ? `${pathname}?${queryString}` : pathname;
}

export function buildShareUrl(intent: ShareIntentState, options: ShareLinkOptions) {
  const shareOrigin = resolveShareOrigin(options.origin);
  const url = new URL(buildSharePath(intent), shareOrigin);

  url.searchParams.set("utm_source", DEFAULT_UTM_SOURCE);
  url.searchParams.set("utm_medium", DEFAULT_UTM_MEDIUM);
  url.searchParams.set("utm_campaign", `${intent.surface}_${intent.card_type}`);
  url.searchParams.set("entry_role", options.entryRole);
  url.searchParams.set("surface", intent.surface);
  url.searchParams.set("card_type", intent.card_type);

  return url.toString();
}

function getDefaultShareMessage(intent: ShareIntentState, entryRole: ShareEntryRole) {
  if (entryRole === "mom") {
    switch (intent.surface) {
      case "admin":
        return `여보, ${intent.title} 확인해줘 →`;
      case "budget":
        return "여보, 우리 아기 첫 해 얼마나 드는지 알아? →";
      case "quiz":
        return "여보, 이거 한번 해봐ㅋㅋ →";
      case "checklist":
      default:
        return "여보, 이번 주에 이것만 해줘 👶 →";
    }
  }

  switch (intent.surface) {
    case "admin":
      return `행정 마감 전에 ${intent.title} 먼저 확인해보세요 →`;
    case "budget":
      return "아기 첫 해 예산, 한 번에 정리해봤어요 →";
    case "quiz":
      return "파파레벨 전투력 결과 공유합니다 →";
    case "checklist":
    default:
      return "이번 주 아빠 할 일, 여기서 바로 확인하세요 →";
  }
}

export function buildShareMessage(intent: ShareIntentState, entryRole: ShareEntryRole) {
  return intent.messageByRole?.[entryRole] ?? getDefaultShareMessage(intent, entryRole);
}

export function getShareFallbackGuide(userAgent: string) {
  const normalizedUserAgent = userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(normalizedUserAgent);
  const isAndroid = normalizedUserAgent.includes("android");
  const isKakaoInApp = normalizedUserAgent.includes("kakaotalk");

  if (isKakaoInApp && isIOS) {
    return "카카오톡 iOS 인앱에서는 링크 복사를 먼저 권장합니다. 필요하면 이미지를 저장해 전달하세요.";
  }

  if (isKakaoInApp && isAndroid) {
    return "카카오톡 Android 인앱에서는 카카오 공유가 안 열리면 이미지를 저장하거나 링크를 복사해 전달하세요.";
  }

  if (isIOS) {
    return "카카오 공유가 안 열리면 링크 복사를 먼저 시도하고, 필요하면 이미지를 저장해 전달하세요.";
  }

  return "카카오 공유가 안 열리면 이미지 저장이나 링크 복사를 사용하세요";
}

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine.length > 0 ? `${currentLine} ${word}` : word;

    if (context.measureText(nextLine).width <= maxWidth || currentLine.length === 0) {
      currentLine = nextLine;
      continue;
    }

    lines.push(currentLine);
    currentLine = word;
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [text];
}

function clampTextLines(lines: string[], maxLines: number) {
  if (lines.length <= maxLines) {
    return lines;
  }

  const visibleLines = lines.slice(0, maxLines);
  const lastLine = visibleLines[maxLines - 1] ?? "";
  visibleLines[maxLines - 1] = lastLine.length > 1 ? `${lastLine.slice(0, -1)}…` : `${lastLine}…`;

  return visibleLines;
}

export async function buildShareImageBlob(intent: ShareIntentState, entryRole: ShareEntryRole) {
  if (typeof document === "undefined") {
    throw new Error("Image export is only available in the browser.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = DEFAULT_CANVAS_WIDTH;
  canvas.height = DEFAULT_CANVAS_HEIGHT;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas context unavailable.");
  }

  context.fillStyle = "#0f172a";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#bef264";
  context.font = "700 36px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  context.fillText(intent.imageEyebrow ?? `${intent.surface.toUpperCase()} SHARE`, 88, 110);

  context.fillStyle = "#ffffff";
  context.font = "700 64px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const titleLines = clampTextLines(wrapText(context, intent.title, canvas.width - 176), 3);
  let y = 200;

  for (const line of titleLines) {
    context.fillText(line, 88, y);
    y += 82;
  }

  context.fillStyle = "rgba(255,255,255,0.8)";
  context.font = "400 34px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const descriptionLines = clampTextLines(wrapText(context, intent.description, canvas.width - 176), 4);
  y += 20;

  for (const line of descriptionLines) {
    context.fillText(line, 88, y);
    y += 52;
  }

  const contentLines = compactLines([
    ...((intent.lines ?? []).slice(0, DEFAULT_MAX_LINES)),
    `보내는 사람: ${entryRole === "mom" ? "엄마" : "아빠"}`
  ]);

  y += 40;
  for (const line of contentLines) {
    context.fillStyle = "rgba(255,255,255,0.08)";
    context.fillRect(88, y - 36, canvas.width - 176, 74);
    context.fillStyle = "#ffffff";
    context.font = "500 32px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    context.fillText(line, 120, y + 8);
    y += 98;
  }

  context.fillStyle = "rgba(255,255,255,0.62)";
  context.font = "400 28px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  context.fillText(intent.imageFooter ?? DEFAULT_IMAGE_FOOTER, 88, canvas.height - 96);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("이미지 생성에 실패했습니다."));
        return;
      }

      resolve(blob);
    }, "image/png");
  });
}

export async function downloadShareImage(intent: ShareIntentState, entryRole: ShareEntryRole) {
  const blob = await buildShareImageBlob(intent, entryRole);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${intent.surface}-${intent.card_type}.png`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function copyShareText(intent: ShareIntentState, entryRole: ShareEntryRole, origin?: string) {
  const shareUrl = buildShareUrl(intent, { entryRole, origin });

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(shareUrl);
    return;
  }

  if (typeof document === "undefined") {
    throw new Error("Clipboard API unavailable.");
  }

  const textarea = document.createElement("textarea");
  textarea.value = shareUrl;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error("링크 복사에 실패했습니다.");
  }
}

function appendScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("Document unavailable."));
      return;
    }

    const existingScript = document.getElementById(KAKAO_SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      if (existingScript.dataset.loaded === "true") {
        resolve();
        return;
      }

      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Kakao SDK load failed.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = KAKAO_SCRIPT_ID;
    script.src = src;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve();
      },
      { once: true }
    );
    script.addEventListener("error", () => reject(new Error("Kakao SDK load failed.")), { once: true });
    document.head.appendChild(script);
  });
}

async function ensureKakaoSdk() {
  if (typeof window === "undefined") {
    throw new Error("Window unavailable.");
  }

  const appKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY?.trim();

  if (!appKey) {
    throw new Error("NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY is not configured.");
  }

  if (!window.Kakao) {
    await appendScript(KAKAO_SDK_URL);
  }

  if (!window.Kakao) {
    throw new Error("Kakao SDK missing after script load.");
  }

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(appKey);
  }

  return window.Kakao;
}

export async function shareViaKakao(intent: ShareIntentState, entryRole: ShareEntryRole, origin?: string) {
  const kakao = await ensureKakaoSdk();
  const shareUrl = buildShareUrl(intent, { entryRole, origin });
  const message = buildShareMessage(intent, entryRole);

  if (!kakao.Share?.sendDefault) {
    throw new Error("Kakao.Share.sendDefault unavailable.");
  }

  kakao.Share.sendDefault({
    objectType: "text",
    text: message,
    link: {
      mobileWebUrl: shareUrl,
      webUrl: shareUrl
    },
    buttonTitle: intent.ctaLabel ?? "파파레벨 열기",
    serverCallbackArgs: {
      entry_role: entryRole,
      surface: intent.surface,
      card_type: intent.card_type
    }
  });
}
