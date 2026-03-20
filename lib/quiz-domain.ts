import { type ShareIntentState } from "@/lib/share-domain";

export const QUIZ_TOTAL_RESPONDENTS_LABEL = "이미 3,421명의 아빠가 측정했어요";
export const PRE_DAD_THRESHOLD = 3;

export type QuizChoice = {
  id: string;
  label: string;
  helper?: string;
  score: number;
  isPreDad?: boolean;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  choices: QuizChoice[];
};

export type QuizAnswerMap = Partial<Record<QuizQuestion["id"], QuizChoice["id"]>>;
export type QuizGrade = "S" | "A" | "B" | "C" | "D";
export type QuizResultType = "graded" | "pre_dad";
export type QuizDeliveryStatus = "pregnant" | "born";

export type QuizMetric = {
  label: string;
  value: string;
};

export type QuizResultCta = {
  href: "/checklist" | "/budget" | "/checklist?tab=admin";
  label: string;
  description: string;
};

export type QuizOutcome = {
  resultType: QuizResultType;
  deliveryStatus: QuizDeliveryStatus;
  title: string;
  headline: string;
  summary: string;
  detail: string;
  score: number;
  preDadCount: number;
  grade?: QuizGrade;
  metrics: QuizMetric[];
  ctas: QuizResultCta[];
  shareTitle: string;
  shareDescription: string;
  shareLines: string[];
  shareMessageByRole: {
    mom: string;
    dad: string;
  };
  shareCtaLabel: string;
  imageEyebrow: string;
};

type QuizGradeSpec = {
  grade: QuizGrade;
  min: number;
  max: number;
  title: string;
  summary: string;
  dadShareMessage: string;
};

const defaultResultCtas: QuizResultCta[] = [
  {
    href: "/checklist",
    label: "이번 주 아빠가 해야 할 3가지 →",
    description: "실행 카드부터 먼저 열어 이번 주 우선순위를 잠급니다."
  },
  {
    href: "/checklist?tab=admin",
    label: "행정 타임라인 바로 보기 →",
    description: "출생신고와 지원금 신청 순서를 한 번에 확인합니다."
  },
  {
    href: "/budget",
    label: "첫 아이, 얼마나 들까요? →",
    description: "지원금 반영 후 실질 부담액을 receipt처럼 읽습니다."
  }
];

const preDadResultCtas: QuizResultCta[] = [
  {
    href: "/checklist",
    label: "출산 전 준비 체크리스트 보기 →",
    description: "D-Day 전에 바로 준비할 항목부터 가볍게 시작합니다."
  },
  {
    href: "/checklist?tab=admin",
    label: "출생신고 전에 알아야 할 것들 →",
    description: "행정 선행 지식과 데드라인을 먼저 익혀 둡니다."
  },
  {
    href: "/budget",
    label: "얼마나 준비해야 할까? →",
    description: "출산 전후 1년 지출과 지원금 차감을 미리 가늠합니다."
  }
];

const gradeSpecs: QuizGradeSpec[] = [
  {
    grade: "S",
    min: 23,
    max: 25,
    title: "전설의 슈퍼대디",
    summary: "아내가 이 결과를 보면 의심할 수 있습니다",
    dadShareMessage: "나 파파레벨 S등급 나왔는데 진짜임ㅋㅋ 아내도 믿는다고 함 →"
  },
  {
    grade: "A",
    min: 18,
    max: 22,
    title: "숙련된 육아전사",
    summary: "장모님이 인정한 사위 레벨입니다",
    dadShareMessage: "파파레벨 A등급. 장모님 공인 사위 레벨ㅋ →"
  },
  {
    grade: "B",
    min: 13,
    max: 17,
    title: "성장형 아빠",
    summary: "의지는 S급, 스킬은 업데이트 중",
    dadShareMessage: "파파레벨 B등급... 의지는 S급이라고 합니다 →"
  },
  {
    grade: "C",
    min: 8,
    max: 12,
    title: "루키 아빠",
    summary: "모든 레전드도 여기서 시작했습니다",
    dadShareMessage: "나도 루키 아빠래ㅋㅋ 너도 한번 해봐 →"
  },
  {
    grade: "D",
    min: 5,
    max: 7,
    title: "관전 아빠",
    summary: "지금 이 테스트를 누가 보내줬는지 생각해보세요",
    dadShareMessage: "관전 아빠 D등급 나왔는데 ㄹㅇ 이거 누가 보내줬는지 생각해봐야 할 것 같음 →"
  }
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: "wake-up-speed",
    prompt: "아기 울음소리에 몇 초 만에 눈을 뜨나요?",
    choices: [
      { id: "wake-now", label: "거의 바로 깬다", helper: "새벽 호출에 즉시 반응", score: 5 },
      { id: "wake-soon", label: "조금 뒤척이면 깬다", helper: "상황 파악은 빠른 편", score: 4 },
      { id: "wake-late", label: "옆에서 깨워야 일어난다", helper: "반응 속도 업데이트 필요", score: 3 },
      { id: "wake-pre", label: "모름 (아직 미출산)", helper: "예비 아빠 응답", score: 1, isPreDad: true }
    ]
  },
  {
    id: "diaper-confidence",
    prompt: "기저귀 교체, 자신 있나요?",
    choices: [
      { id: "diaper-anywhere", label: "혼자서도 바로 가능", helper: "밤중 교체도 무리 없음", score: 5 },
      { id: "diaper-guided", label: "몇 번 해봐서 감은 있다", helper: "실전 경험이 조금 있음", score: 4 },
      { id: "diaper-nervous", label: "영상 보면 할 수 있을 듯", helper: "준비는 됐지만 손이 덜 익음", score: 3 },
      { id: "diaper-pre", label: "기저귀 종류를 잘 모른다", helper: "예비 아빠 응답", score: 1, isPreDad: true }
    ]
  },
  {
    id: "formula-temp",
    prompt: "분유 적정 온도를 어떻게 확인하나요?",
    choices: [
      { id: "formula-thermometer", label: "온도계나 정해둔 기준으로 본다", helper: "루틴이 분명함", score: 5 },
      { id: "formula-wrist", label: "손목 테스트로 확인한다", helper: "기본은 알고 있음", score: 4 },
      { id: "formula-guess", label: "대충 미지근하면 된다고 안다", helper: "정확도는 낮은 편", score: 3 },
      { id: "formula-pre", label: "분유를 타본 적 없다", helper: "예비 아빠 응답", score: 1, isPreDad: true }
    ]
  },
  {
    id: "solo-outing",
    prompt: "아기와 단둘이 외출한 최장 시간은?",
    choices: [
      { id: "outing-halfday", label: "반나절 이상 가능", helper: "독립 돌봄 경험 충분", score: 5 },
      { id: "outing-short", label: "1~2시간 정도는 해봤다", helper: "기본 동선은 경험함", score: 4 },
      { id: "outing-nearby", label: "집 앞 정도만 가능하다", helper: "실전 노출이 적은 편", score: 3 },
      { id: "outing-pre", label: "아직 없음 (미출산 포함)", helper: "예비 아빠 응답", score: 1, isPreDad: true }
    ]
  },
  {
    id: "sleep-knowhow",
    prompt: "아기 재우기, 본인만의 비법이 있나요?",
    choices: [
      { id: "sleep-routine", label: "루틴과 순서를 정해둔 편", helper: "경험 기반 노하우 보유", score: 5 },
      { id: "sleep-some", label: "몇 가지 먹히는 패턴이 있다", helper: "상황 대응 가능", score: 4 },
      { id: "sleep-trial", label: "늘 시행착오로 버틴다", helper: "방법은 더 찾는 중", score: 3 },
      { id: "sleep-pre", label: "재운 적 없다", helper: "예비 아빠 응답", score: 1, isPreDad: true }
    ]
  }
];

function findChoice(questionId: string, choiceId: string | undefined) {
  const question = quizQuestions.find((candidate) => candidate.id === questionId);
  return question?.choices.find((choice) => choice.id === choiceId);
}

export function getAnsweredCount(answers: QuizAnswerMap) {
  return quizQuestions.filter((question) => Boolean(answers[question.id])).length;
}

export function evaluateQuiz(answers: QuizAnswerMap): QuizOutcome | null {
  const answeredCount = getAnsweredCount(answers);

  if (answeredCount !== quizQuestions.length) {
    return null;
  }

  const selectedChoices = quizQuestions
    .map((question) => findChoice(question.id, answers[question.id]))
    .filter((choice): choice is QuizChoice => Boolean(choice));

  const score = selectedChoices.reduce((total, choice) => total + choice.score, 0);
  const preDadCount = selectedChoices.filter((choice) => choice.isPreDad).length;

  if (preDadCount >= PRE_DAD_THRESHOLD) {
    return {
      resultType: "pre_dad",
      deliveryStatus: "pregnant",
      title: "지금 준비하면 되는 아빠",
      headline: "💡 지금 준비하면 되는 아빠예요!",
      summary: "출산 전이라면 지금이 딱 좋은 타이밍입니다.",
      detail:
        "낮은 등급 대신 준비 동선으로 바로 연결합니다. 체크리스트·행정·예산 세 가지부터 잠그면 됩니다.",
      score,
      preDadCount,
      metrics: [
        { label: "완료 문항", value: `${answeredCount}/${quizQuestions.length}` },
        { label: "미출산 응답", value: `${preDadCount}개` },
        { label: "다음 단계", value: "준비 시작" }
      ],
      ctas: preDadResultCtas,
      shareTitle: "지금 준비하면 되는 아빠",
      shareDescription: "출산 전이라면 지금이 딱 좋은 타이밍. 체크리스트·행정·예산부터 준비하세요.",
      shareLines: [`미출산 응답 ${preDadCount}개`, "다음 단계: 체크리스트 · 행정 · 예산"],
      shareMessageByRole: {
        mom: "여보, 이거 한번 해봐ㅋㅋ →",
        dad: "나 곧 아빠 되는데 파파레벨로 준비 중ㅋ 같이 해봐 →"
      },
      shareCtaLabel: "준비 시작하기",
      imageEyebrow: "PRE-DAD MODE"
    };
  }

  const gradeSpec = gradeSpecs.find((spec) => score >= spec.min && score <= spec.max) ?? gradeSpecs[gradeSpecs.length - 1];

  return {
    resultType: "graded",
    deliveryStatus: "born",
    grade: gradeSpec.grade,
    title: gradeSpec.title,
    headline: `${gradeSpec.grade} | ${gradeSpec.title}`,
    summary: gradeSpec.summary,
    detail:
      preDadCount > 0
        ? `실전 응답과 준비 응답이 섞여 있어도 결과는 낙인보다 실행 전환에 초점을 맞춥니다. 미출산 응답 ${preDadCount}개는 별도로 반영했습니다.`
        : "결과는 재미로 보되, 아래 CTA 세 개로 바로 행동을 이어가도록 설계했습니다.",
    score,
    preDadCount,
    metrics: [
      { label: "전투력 점수", value: `${score}점` },
      { label: "완료 문항", value: `${answeredCount}/${quizQuestions.length}` },
      { label: "미출산 응답", value: `${preDadCount}개` }
    ],
    ctas: defaultResultCtas,
    shareTitle: `${gradeSpec.grade} 등급 | ${gradeSpec.title}`,
    shareDescription: gradeSpec.summary,
    shareLines: [
      `전투력 점수 ${score}점`,
      preDadCount > 0 ? `미출산 응답 ${preDadCount}개` : "다음 단계: 체크리스트 · 행정 · 예산"
    ],
    shareMessageByRole: {
      mom: "여보, 이거 한번 해봐ㅋㅋ →",
      dad: gradeSpec.dadShareMessage
    },
    shareCtaLabel: "전투력 결과 보기",
    imageEyebrow: "QUIZ RESULT"
  };
}

export function buildQuizIntroShareIntent(): ShareIntentState {
  return {
    surface: "quiz",
    card_type: "quiz_result",
    route: "/quiz",
    query: { mode: "intro" },
    title: "당신의 육아 전투력은?",
    description: "5개 질문으로 빠르게 측정하고, 결과 아래에서 바로 체크리스트·행정·예산으로 넘어갑니다.",
    lines: ["30초 퀴즈", QUIZ_TOTAL_RESPONDENTS_LABEL, "퍼센타일 비교 미노출"],
    messageByRole: {
      mom: "여보, 이거 한번 해봐ㅋㅋ →",
      dad: "파파레벨 전투력 측정기 해봤어요 →"
    },
    ctaLabel: "전투력 측정하기",
    imageEyebrow: "QUIZ HOOK"
  };
}

export function buildQuizShareIntent(outcome: QuizOutcome): ShareIntentState {
  return {
    surface: "quiz",
    card_type: "quiz_result",
    route: "/quiz",
    query: {
      mode: outcome.resultType,
      delivery_status: outcome.deliveryStatus,
      result_type: outcome.grade ?? "pre_dad"
    },
    title: outcome.shareTitle,
    description: outcome.shareDescription,
    lines: outcome.shareLines,
    messageByRole: outcome.shareMessageByRole,
    ctaLabel: outcome.shareCtaLabel,
    imageEyebrow: outcome.imageEyebrow
  };
}
