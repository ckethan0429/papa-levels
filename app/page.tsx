"use client";

import { useState } from "react";

import Link from "next/link";

import { PageFrame } from "@/components/papa/page-frame";
import { ResultCardSurface } from "@/components/papa/result-card-surface";
import { ShareDock } from "@/components/papa/share-dock";
import { StatusBadge } from "@/components/papa/status-badge";
import { landingHighlights, quizResult } from "@/lib/papa-data";
import { type ShareIntentState } from "@/lib/share-domain";

const landingShareIntent: ShareIntentState = {
  surface: "checklist",
  card_type: "weekly_action",
  route: "/checklist",
  title: "이번 주 아빠 할 일",
  description: "남편에게 보내면 바로 움직이게 되는 첫 공유 시나리오입니다.",
  lines: ["D-Day 기준 실행 카드", "행정 마감 딥링크", "예산 결과 전환 CTA"],
  messageByRole: {
    mom: "여보, 이번 주에 이것만 해줘 👶",
    dad: "이번 주 아빠 할 일부터 확인해보세요 👶"
  },
  ctaLabel: "체크리스트 열기",
  imageEyebrow: "SEND TO HUSBAND"
};

export default function HomePage() {
  const [shareOpenKey, setShareOpenKey] = useState(0);

  return (
    <PageFrame
      eyebrow="Execution Hub"
      title="남편에게 보내면 바로 움직이게 되는 실행 허브"
      description="PapaLevel은 출산 전후 30일의 행정, 준비물, 예산을 한 장의 액션 보드처럼 보여주는 모바일 퍼스트 실행 도구입니다."
      currentPath="/"
    >
      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[30px] bg-ink px-5 py-5 text-paper shadow-panel">
          <StatusBadge tone="lime">엄마 {">"} 아빠 전달</StatusBadge>
          <div className="mt-4 space-y-4">
            <div>
              <h2 className="font-display text-3xl leading-tight sm:text-[2.5rem]">
                이번 주 아빠 할 일부터 바로 열어보는 제품
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-paper/72">
                긴 설명보다 먼저 보여야 하는 건 D-Day, 마감, 실질 부담액, 그리고 바로 공유할 수 있는 카드입니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/checklist"
                className="rounded-full bg-lime px-5 py-3 text-sm font-semibold text-ink transition hover:brightness-95"
              >
                이번 주 할 일 보기
              </Link>
              <Link
                href="/quiz"
                className="rounded-full border border-white/14 px-5 py-3 text-sm font-semibold text-paper transition hover:bg-white/8"
              >
                전투력 측정기 열기
              </Link>
            </div>
          </div>
        </article>

        <ResultCardSurface
          eyebrow="Result Preview"
          title={`${quizResult.grade} 등급 | ${quizResult.title}`}
          body="재미로 끝나지 않게, 결과 아래에서 바로 체크리스트와 행정 모듈로 내려가게 구성합니다."
          metrics={[
            { label: "공유 포인트", value: quizResult.percentile },
            { label: "전환 CTA", value: "3개" },
            { label: "결과 톤", value: "유쾌 + 행동" }
          ]}
          footer={
            <div className="flex flex-wrap gap-2">
              <Link
                href="/budget"
                className="rounded-full bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:bg-paper/90"
              >
                예산 결과 보기
              </Link>
              <button
                type="button"
                onClick={() => setShareOpenKey((current) => current + 1)}
                className="rounded-full border border-white/14 px-4 py-2 text-sm font-medium text-paper transition hover:bg-white/8"
              >
                카카오 미리보기 확인
              </button>
            </div>
          }
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {landingHighlights.map((highlight) => (
          <article key={highlight.title} className="rounded-[24px] border border-ink/10 bg-white px-5 py-5 shadow-card">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ember">Core Value</p>
            <h3 className="mt-3 font-display text-2xl text-ink">{highlight.title}</h3>
            <p className="mt-3 text-sm leading-6 text-ink/68">{highlight.body}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[24px] border border-ink/10 bg-white px-5 py-5 shadow-card">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/45">엄마용 카피</p>
          <h3 className="mt-3 text-xl font-semibold text-ink">“여보, 이번 주엔 이것만 해줘.”</h3>
          <p className="mt-3 text-sm leading-6 text-ink/68">
            랜딩 첫 화면에서도 `남편에게 보내기`를 잃지 않도록, 메신저 카드처럼 읽히는 액션 블록을 먼저 노출합니다.
          </p>
        </article>
        <article className="rounded-[24px] border border-ink/10 bg-white px-5 py-5 shadow-card">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/45">아빠용 카피</p>
          <h3 className="mt-3 text-xl font-semibold text-ink">“출산은 프로젝트다. 이번 주 마감부터 끝낸다.”</h3>
          <p className="mt-3 text-sm leading-6 text-ink/68">
            PapaLevel의 시각 언어는 돌봄 정보 앱보다 PM 보드에 가깝게, 마감과 우선순위를 전면에 둡니다.
          </p>
        </article>
      </section>

      <ShareDock
        title="첫 공유 시나리오"
        message="카카오 공유가 실패하면 이미지 저장, 마지막엔 링크 복사로 빠지도록 하단 액션 도크를 유지합니다."
        intent={landingShareIntent}
        autoOpenKey={shareOpenKey}
      />
    </PageFrame>
  );
}
