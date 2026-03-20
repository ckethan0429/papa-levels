"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import { PageFrame } from "@/components/papa/page-frame";
import { QuizChoiceCard } from "@/components/papa/quiz-choice-card";
import { QuizQuestionStepper } from "@/components/papa/quiz-question-stepper";
import { QuizResultPanel } from "@/components/papa/quiz-result-panel";
import { ShareDock } from "@/components/papa/share-dock";
import { StatusBadge } from "@/components/papa/status-badge";
import {
  buildQuizIntroShareIntent,
  buildQuizShareIntent,
  evaluateQuiz,
  getAnsweredCount,
  PRE_DAD_THRESHOLD,
  QUIZ_TOTAL_RESPONDENTS_LABEL,
  quizQuestions,
  type QuizAnswerMap
} from "@/lib/quiz-domain";

const optionLabels = ["A", "B", "C", "D", "E"];

type QuizPhase = "intro" | "questions" | "pre_dad_gate" | "result";

export default function QuizPage() {
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [answers, setAnswers] = useState<QuizAnswerMap>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [pendingChoiceId, setPendingChoiceId] = useState<string | null>(null);
  const [shareOpenKey, setShareOpenKey] = useState(0);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const outcome = useMemo(() => evaluateQuiz(answers), [answers]);
  const answeredCount = useMemo(() => getAnsweredCount(answers), [answers]);

  const shareIntent = useMemo(
    () => (outcome ? buildQuizShareIntent(outcome) : buildQuizIntroShareIntent()),
    [outcome]
  );

  useEffect(() => {
    if (phase === "intro") {
      return;
    }

    const anchor = document.getElementById("quiz-flow-anchor");

    if (!anchor) {
      return;
    }

    window.requestAnimationFrame(() => {
      anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [currentQuestionIndex, phase]);

  function startQuiz() {
    setAnswers({});
    setPendingChoiceId(null);
    setPhase("questions");
    setCurrentQuestionIndex(0);
  }

  function restartQuiz() {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setPendingChoiceId(null);
    setPhase("intro");
  }

  function handleChoiceSelect(choiceId: string) {
    if (!currentQuestion) {
      return;
    }

    const nextAnswers = {
      ...answers,
      [currentQuestion.id]: choiceId
    } satisfies QuizAnswerMap;

    setPendingChoiceId(choiceId);
    setAnswers(nextAnswers);

    window.setTimeout(() => {
      setPendingChoiceId(null);

      if (currentQuestionIndex === quizQuestions.length - 1) {
        const nextOutcome = evaluateQuiz(nextAnswers);

        if (nextOutcome?.resultType === "pre_dad") {
          setPhase("pre_dad_gate");
          return;
        }

        setPhase("result");
        return;
      }

      setCurrentQuestionIndex((index) => Math.min(index + 1, quizQuestions.length - 1));
    }, 140);
  }

  function handleBack() {
    setCurrentQuestionIndex((index) => Math.max(index - 1, 0));
  }

  return (
    <PageFrame
      eyebrow="Acquisition Hook"
      title="재미로 들어와도 실행으로 끝나는 전투력 측정기"
      description="5문항으로 빠르게 진입시키되, 결과는 체크리스트·행정·예산 CTA까지 이어지게 설계합니다. 미출산 응답이 많으면 예비 아빠 모드로 분기하고, 퍼센타일 비교는 노출하지 않습니다."
      currentPath="/quiz"
    >
      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[30px] bg-ink px-5 py-5 text-paper shadow-panel">
          <StatusBadge tone="lime">30초 진입 훅</StatusBadge>
          <div className="mt-4 space-y-4">
            <div>
              <h2 className="font-display text-3xl leading-tight sm:text-[2.5rem]">당신의 육아 전투력은?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-paper/72">
                {QUIZ_TOTAL_RESPONDENTS_LABEL}. 비교형 percentile 대신, 결과 아래에서 바로 움직일 수 있는 실행 CTA만 남깁니다.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[22px] bg-white/8 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/45">Flow</p>
                <p className="mt-3 text-base font-semibold text-paper">랜딩 → 5문항 → 결과</p>
              </div>
              <div className="rounded-[22px] bg-white/8 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/45">Branch</p>
                <p className="mt-3 text-base font-semibold text-paper">미출산 응답 {PRE_DAD_THRESHOLD}개 이상</p>
              </div>
              <div className="rounded-[22px] bg-white/8 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/45">Output</p>
                <p className="mt-3 text-base font-semibold text-paper">Checklist · Admin · Budget</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={startQuiz}
                className="rounded-full bg-lime px-5 py-3 text-sm font-semibold text-ink transition hover:brightness-95"
              >
                {phase === "intro" ? "지금 측정하기 →" : "다시 시작하기 →"}
              </button>
              <Link
                href="/checklist"
                className="rounded-full border border-white/14 px-5 py-3 text-sm font-semibold text-paper transition hover:bg-white/8"
              >
                이번 주 할 일 먼저 보기
              </Link>
            </div>
          </div>
        </article>

        <article className="rounded-[30px] border border-ink/10 bg-white px-5 py-5 shadow-card">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/45">Quiz Notes</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight text-ink">퍼센타일은 지우고, 결과는 행동으로 이어집니다.</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-ink/70">
            <li className="rounded-2xl bg-mist px-4 py-3">5개 질문 모두 선택 즉시 다음 단계로 이동</li>
            <li className="rounded-2xl bg-mist px-4 py-3">미출산 응답이 많으면 낮은 등급 대신 예비 아빠 모드 노출</li>
            <li className="rounded-2xl bg-mist px-4 py-3">결과 공유는 기존 T-005 ShareDock 계약을 그대로 재사용</li>
            <li className="rounded-2xl bg-mist px-4 py-3">결과 CTA는 체크리스트 / 행정 / 예산 3개로 고정</li>
          </ul>
        </article>
      </section>

      {phase === "questions" && currentQuestion ? (
        <section
          id="quiz-flow-anchor"
          className="grid gap-4 scroll-mt-6 lg:grid-cols-[0.92fr_1.08fr]"
        >
          <QuizQuestionStepper currentStep={currentQuestionIndex + 1} totalSteps={quizQuestions.length} />

          <article className="rounded-[30px] border border-ink/10 bg-white px-5 py-5 shadow-card">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/45">Question {currentQuestionIndex + 1}</p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-ink">{currentQuestion.prompt}</h2>
            <div className="mt-5 space-y-3">
              {currentQuestion.choices.map((choice, index) => {
                const selected = answers[currentQuestion.id] === choice.id || pendingChoiceId === choice.id;
                return (
                  <QuizChoiceCard
                    key={choice.id}
                    optionLabel={optionLabels[index] ?? `${index + 1}`}
                    label={choice.label}
                    helper={choice.helper}
                    isPreDad={choice.isPreDad}
                    selected={selected}
                    disabled={Boolean(pendingChoiceId)}
                    onSelect={() => handleChoiceSelect(choice.id)}
                  />
                );
              })}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-ink/8 pt-4">
              <p className="text-sm text-ink/62">진행률 {answeredCount} / {quizQuestions.length}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentQuestionIndex === 0 || Boolean(pendingChoiceId)}
                  className="rounded-full border border-ink/12 bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:border-ink/28 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  이전 질문
                </button>
                <button
                  type="button"
                  onClick={restartQuiz}
                  disabled={Boolean(pendingChoiceId)}
                  className="rounded-full border border-ink/12 bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:border-ink/28 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  처음으로
                </button>
              </div>
            </div>
          </article>
        </section>
      ) : null}

      {phase === "pre_dad_gate" && outcome ? (
        <section
          id="quiz-flow-anchor"
          className="grid gap-4 scroll-mt-6 lg:grid-cols-[0.95fr_1.05fr]"
        >
          <article className="rounded-[30px] bg-ink px-5 py-5 text-paper shadow-panel">
            <StatusBadge tone="ember">Pre-Dad Branch</StatusBadge>
            <h2 className="mt-4 font-display text-3xl leading-tight sm:text-[2.4rem]">{outcome.headline}</h2>
            <p className="mt-3 text-sm leading-6 text-paper/72">{outcome.summary}</p>
            <p className="mt-3 text-sm leading-6 text-paper/68">출산 전이라면 지금이 딱 좋은 타이밍입니다. 아래 도구로 준비를 시작하세요.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {outcome.metrics.map((metric) => (
                <div key={metric.label} className="rounded-[22px] bg-white/8 px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/45">{metric.label}</p>
                  <p className="mt-3 text-xl font-semibold text-lime">{metric.value}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] border border-ink/10 bg-white px-5 py-5 shadow-card">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/45">Start Here</p>
            <div className="mt-4 space-y-3">
              {outcome.ctas.map((cta) => (
                <Link
                  key={cta.href}
                  href={cta.href}
                  className="block rounded-[24px] border border-ink/10 bg-mist px-4 py-4 transition hover:border-ink/24 hover:bg-paper"
                >
                  <h3 className="text-base font-semibold leading-6 text-ink break-words">{cta.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/62 break-words">{cta.description}</p>
                </Link>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2 border-t border-ink/8 pt-4">
              <button
                type="button"
                onClick={() => setPhase("result")}
                className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-ink/92"
              >
                그래도 결과 보기 →
              </button>
              <button
                type="button"
                onClick={restartQuiz}
                className="rounded-full border border-ink/12 bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:border-ink/28"
              >
                다시 테스트하기
              </button>
            </div>
          </article>
        </section>
      ) : null}

      {phase === "result" && outcome ? (
        <section id="quiz-flow-anchor" className="scroll-mt-6">
        <QuizResultPanel
          outcome={outcome}
          onShare={() => setShareOpenKey((current) => current + 1)}
          onRestart={restartQuiz}
        />
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-[24px] border border-ink/10 bg-white px-5 py-5 shadow-card">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/45">Share Surface</p>
          <h3 className="mt-3 text-xl font-semibold text-ink">카카오 우선, 이미지/링크 fallback</h3>
          <p className="mt-3 text-sm leading-6 text-ink/68">
            T-005의 ShareDock 계약을 그대로 재사용해 `/quiz`도 같은 fallback 순서를 유지합니다.
          </p>
        </article>
        <article className="rounded-[24px] border border-ink/10 bg-white px-5 py-5 shadow-card">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/45">Pre-Dad Rule</p>
          <h3 className="mt-3 text-xl font-semibold text-ink">미출산 응답 {PRE_DAD_THRESHOLD}개 이상이면 별도 분기</h3>
          <p className="mt-3 text-sm leading-6 text-ink/68">
            낮은 등급으로 낙인찍지 않고 준비 동선으로 연결하는 것이 MVP 규칙입니다.
          </p>
        </article>
        <article className="rounded-[24px] border border-ink/10 bg-white px-5 py-5 shadow-card">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/45">Action First</p>
          <h3 className="mt-3 text-xl font-semibold text-ink">결과 다음 행동이 더 중요합니다</h3>
          <p className="mt-3 text-sm leading-6 text-ink/68">
            퀴즈는 유입 훅이고, 실제 가치는 체크리스트·행정·예산으로 이어지는 실행 흐름에서 완성됩니다.
          </p>
        </article>
      </section>

      <ShareDock
        title={outcome ? "퀴즈 결과 보내기" : "전투력 측정기 보내기"}
        message={
          outcome
            ? "결과 카드는 공유하되, 링크 랜딩에서도 같은 CTA 흐름이 이어지도록 유지합니다."
            : "카카오 공유가 실패하면 이미지 저장, 마지막엔 링크 복사로 빠지도록 동일한 share contract를 유지합니다."
        }
        intent={shareIntent}
        triggerLabel={outcome ? "결과 공유하기" : "남편에게 보내기"}
        autoOpenKey={shareOpenKey}
      />
    </PageFrame>
  );
}
