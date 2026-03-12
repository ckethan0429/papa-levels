import { ReactNode } from "react";

import Link from "next/link";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/checklist", label: "체크리스트" },
  { href: "/budget", label: "예산" },
  { href: "/quiz", label: "전투력" }
];

export function PageFrame({
  eyebrow,
  title,
  description,
  currentPath,
  children
}: {
  eyebrow: string;
  title: string;
  description: string;
  currentPath: string;
  children: ReactNode;
}) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        본문으로 바로가기
      </a>
      <main id="main-content" className="min-h-screen bg-grid-fade pb-28 safe-pad">
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-5 sm:px-6">
          <header className="rounded-[28px] border border-white/60 bg-white/80 px-4 py-4 shadow-card backdrop-blur md:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-xl text-ink">PapaLevel</p>
                <p className="text-xs text-ink/55">Command Center for New Dads</p>
              </div>
              <nav aria-label="주요 라우트" className="flex flex-wrap gap-2">
                {navItems.map((item) => {
                  const active =
                    currentPath === item.href ||
                    (item.href !== "/" && currentPath.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "rounded-full px-3 py-2 text-sm font-medium transition",
                        active
                          ? "bg-ink text-paper"
                          : "bg-mist text-ink/70 hover:bg-ink hover:text-paper"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="mt-6 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ember">
                {eyebrow}
              </p>
              <h1 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
                {title}
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-ink/70 sm:text-base">
                {description}
              </p>
            </div>
          </header>
          <div className="mt-6 space-y-6">{children}</div>
        </div>
      </main>
    </>
  );
}
