export type ChecklistTab = "prepare" | "center" | "home" | "admin";

export type ChecklistItem = {
  id: string;
  title: string;
  why: string;
  when: string;
  owner: string;
  budget: string;
  socialProof: string;
  cta: string;
};

export type DeadlineState = "today" | "soon" | "upcoming" | "done" | "expired";

export type DeadlineItem = {
  id: string;
  title: string;
  dueLabel: string;
  amount: string;
  channel: string;
  note: string;
  effectiveDate: string;
  verifiedAt: string;
  regionScope: string;
  state: DeadlineState;
};

export const routeContext = [
  { label: "상태", value: "출산 예정" },
  { label: "기준일", value: "2026.03.23" },
  { label: "지역", value: "서울" },
  { label: "가구", value: "맞벌이" }
];

export const weeklyTodos = [
  "정부24 로그인과 출생신고 서류 확인",
  "조리원 입소 가방에서 멀티탭, 빨대, 충전기 체크",
  "산후도우미 지원사업 신청 윈도우 확인"
];

export const checklistTabs: Array<{ key: ChecklistTab; label: string; helper: string }> = [
  { key: "prepare", label: "준비", helper: "D-30 ~ D-Day" },
  { key: "center", label: "조리원", helper: "D-Day ~ D+14" },
  { key: "home", label: "집", helper: "D+14 ~ D+30" },
  { key: "admin", label: "행정", helper: "기한 기반" }
];

export const checklistItems: Record<Exclude<ChecklistTab, "admin">, ChecklistItem[]> = {
  prepare: [
    {
      id: "prepare-docs",
      title: "출생신고 서류 미리 준비",
      why: "조리원에서 바로 처리하려면 신분증과 증명서 세트가 먼저 잠겨 있어야 합니다.",
      when: "D-14",
      owner: "아빠가 직접",
      budget: "0원",
      socialProof: "많이 저장한 준비 항목",
      cta: "서류 목록 보기"
    },
    {
      id: "prepare-kettle",
      title: "온도지정 포트기 비교하기",
      why: "새벽 수유 동선은 물 온도 고정 여부가 가장 크게 좌우합니다.",
      when: "D-10",
      owner: "아빠가 직접",
      budget: "3만 ~ 10만 원",
      socialProof: "추천 장비 카드",
      cta: "구매 기준 보기"
    }
  ],
  center: [
    {
      id: "center-kit",
      title: "조리원 생존 키트 완성",
      why: "빨대, 폰 거치대, 멀티탭 같은 소형 물건이 체감 만족도를 좌우합니다.",
      when: "D+0",
      owner: "출산 직전 체크",
      budget: "2만 ~ 5만 원",
      socialProof: "실전 준비물 모듈",
      cta: "필수템 보기"
    },
    {
      id: "center-fridge",
      title: "입소 당일 방 세팅 끝내기",
      why: "가습기, 멀티탭, 냉장고 채우기를 첫날 끝내야 아내의 요구 반복이 줄어듭니다.",
      when: "D+0 ~ D+1",
      owner: "아빠가 직접",
      budget: "상황별 변동",
      socialProof: "빠른 실행 카드",
      cta: "세팅 순서 보기"
    }
  ],
  home: [
    {
      id: "home-night",
      title: "새벽 수유 교대표 잠그기",
      why: "퇴소 후에는 의지보다 교대 규칙이 갈등을 줄입니다.",
      when: "D+14",
      owner: "부부 함께",
      budget: "0원",
      socialProof: "행동 전환 카드",
      cta: "교대표 예시 보기"
    },
    {
      id: "home-stock",
      title: "기저귀와 분유 2주치 확보",
      why: "밤 2시에 재고가 떨어지는 순간부터 모든 계획이 무너집니다.",
      when: "D+12 ~ D+14",
      owner: "아빠가 직접",
      budget: "8만 ~ 18만 원",
      socialProof: "리마인드 카드",
      cta: "재고 계산 보기"
    }
  ]
};

export const adminDeadlines: DeadlineItem[] = [
  {
    id: "deadline-birth",
    title: "출생신고",
    dueLabel: "D+14 마감, 9일 남음",
    amount: "-",
    channel: "정부24 또는 주민센터",
    note: "나머지 지원금 신청의 전제조건입니다.",
    effectiveDate: "기준일 2026.01.01",
    verifiedAt: "최종 검수 2026.03.11",
    regionScope: "전국",
    state: "soon"
  },
  {
    id: "deadline-gov",
    title: "행복출산 원스톱",
    dueLabel: "출생신고 직후",
    amount: "부모급여 + 아동수당",
    channel: "정부24",
    note: "같은 날 함께 처리하는 흐름이 가장 단순합니다.",
    effectiveDate: "기준일 2026.01.01",
    verifiedAt: "최종 검수 2026.03.11",
    regionScope: "전국",
    state: "today"
  },
  {
    id: "deadline-firstgift",
    title: "첫만남이용권",
    dueLabel: "D+60 마감",
    amount: "첫째 200만 원",
    channel: "정부24 / 주민센터",
    note: "출생순위별 금액이 달라 지역 메시지와 함께 보여줘야 합니다.",
    effectiveDate: "기준일 2026.01.01",
    verifiedAt: "최종 검수 2026.03.11",
    regionScope: "전국",
    state: "upcoming"
  }
];

export const budgetSummary = {
  hero: "산후조리원만 평균 287만 원",
  total: "1,246만 원",
  support: "1,420만 원",
  net: "-174만 원",
  note: "지원금 반영 후에도 현금 흐름 점검은 필요합니다."
};

export const budgetCategories = [
  {
    title: "산후조리",
    helper: "가장 큰 충격 비용",
    items: [
      "산후조리원 2주 300만 원",
      "산후도우미 2주 120만 원"
    ]
  },
  {
    title: "육아용품",
    helper: "아빠가 비교해야 하는 장비",
    items: ["카시트 35만 원", "유모차 50만 원", "온도지정 포트기 5만 원"]
  },
  {
    title: "월간 소모품",
    helper: "장기 현금 흐름",
    items: ["기저귀 8만 원/월", "분유 10만 원/월", "물티슈 2만 원/월"]
  }
];

export const quizQuestions = [
  "아기 울음소리에 몇 초 만에 눈을 뜨나요?",
  "기저귀 교체, 자신 있나요?",
  "분유 적정 온도를 어떻게 확인하나요?",
  "아기와 단둘이 외출한 최장 시간은?",
  "아기 재우기, 본인만의 비법이 있나요?"
];

export const quizResult = {
  grade: "B",
  title: "성장형 아빠",
  summary: "의지는 S급, 스킬은 업데이트 중",
  percentile: "상위 38%",
  preDadTitle: "지금 준비하면 되는 아빠"
};

export const landingHighlights = [
  {
    title: "이번 주 아빠 할 일",
    body: "정보보다 먼저 보여야 하는 건 이번 주의 3가지 실행 카드입니다."
  },
  {
    title: "행정 데드라인",
    body: "기한, 금액, 처리 채널을 한 카드에 묶어 마감 리스크를 줄입니다."
  },
  {
    title: "실질 부담액",
    body: "예산은 총액보다 지원금 차감 후 현금 흐름을 먼저 보여줍니다."
  }
];
