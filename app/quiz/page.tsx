import Link from "next/link";

import { PageFrame } from "@/components/papa/page-frame";
import { ResultCardSurface } from "@/components/papa/result-card-surface";
import { ShareDock } from "@/components/papa/share-dock";
import { StatusBadge } from "@/components/papa/status-badge";
import { quizQuestions, quizResult } from "@/lib/papa-data";

export default function QuizPage() {
  return (
    <PageFrame
      eyebrow="Acquisition Hook"
      title="재미로 들어와도 실행으로 끝나는 전투력 화면"
      description="퀴즈는 얇고 빨라야 하지만, 결과 화면은 반드시 체크리스트·행정·예산 CTA를 바로 품어야 합니다."
      currentPath="/quiz"
    >
      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[30px] border border-ink/10 bg-white px-5 py-5 shadow-card">
          <StatusBadge tone="ember">5 Questions</StatusBadge>
          <h2 className="mt-4 font-display text-3xl leading-tight text-ink">한 화면씩 빠르게, 결과는 강하게</h2>
          <ol className="mt-5 space-y-3">
            {quizQuestions.map((question, index) => (
              <li key={question} className="flex gap-3 rounded-2xl bg-mist px-4 py-3 text-sm leading-6 text-ink">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper">
                  {index + 1}
                </span>
                <span>{question}</span>
              </li>
            ))}
          </ol>
        </article>

        <ResultCardSurface
          eyebrow="Quiz Result"
          title={`${quizResult.grade} 등급 | ${quizResult.title}`}
          body={quizResult.summary}
          metrics={[
            { label: "퍼센타일", value: quizResult.percentile },
            { label: "예비 아빠 모드", value: quizResult.preDadTitle },
            { label: "전환 CTA", value: "Checklist · Admin · Budget" }
          ]}
          footer={
            <div className="flex flex-wrap gap-2">
              <Link
                href="/checklist"
                className="rounded-full bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:bg-paper/90"
              >
                이번 주 할 일 보기
              </Link>
              <Link
                href="/budget"
                className="rounded-full border border-white/14 px-4 py-2 text-sm font-medium text-paper transition hover:bg-white/8"
              >
                예산 보기
              </Link>
            </div>
          }
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-[24px] border border-ink/10 bg-white px-5 py-5 shadow-card">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/45">Result Tone</p>
          <h3 className="mt-3 text-xl font-semibold text-ink">유쾌하지만 낙인 없는 결과</h3>
          <p className="mt-3 text-sm leading-6 text-ink/68">
            일반 모드는 퍼센타일과 등급, 예비 아빠 모드는 준비 유도 문장으로 분기해 브랜드 톤을 지킵니다.
          </p>
        </article>
        <article className="rounded-[24px] border border-ink/10 bg-white px-5 py-5 shadow-card">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/45">Overflow Safety</p>
          <h3 className="mt-3 text-xl font-semibold text-ink">안전한 오버플로우 처리</h3>
          <p className="mt-3 text-sm leading-6 text-ink/68">
            긴 한글 카피와 결과 카드 safe area를 고려해, CTA는 본문 아래 별도 줄에 배치합니다.
          </p>
        </article>
        <article className="rounded-[24px] border border-ink/10 bg-white px-5 py-5 shadow-card">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/45">Share Surface</p>
          <h3 className="mt-3 text-xl font-semibold text-ink">공유 서피스 일관성</h3>
          <p className="mt-3 text-sm leading-6 text-ink/68">
            결과 카드 surface와 인앱 랜딩의 시각 톤을 맞춰, 카카오 프리뷰 후 이탈을 줄이는 구조로 설계합니다.
          </p>
        </article>
      </section>

      <ShareDock
        title="결과 보내기"
        message="퀴즈는 유입 훅이지만, 공유 후 랜딩 첫 화면에서 같은 색조와 카드 구조가 이어지도록 결과 surface를 먼저 잠급니다."
      />
    </PageFrame>
  );
}
