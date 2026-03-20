# T-006 Budget Simulator v1

- Status: `doing`
- Priority: `P1`
- Phase: `MVP Week 3`
- Depends on: `T-001`
- GitHub Issue: [#6](https://github.com/ckethan0429/papa-levels/issues/6)

## Goal

출산 첫 해 비용을 빠르게 계산하고, 지원금 차감 후 실질 부담액을 보여주는 예산 시뮬레이터를 만든다.

## Reference Inputs (2026-03-12)

- Wireframe: [budget.md](/Users/ckahn/Desktop/papa/research/wireframes/budget.md)
- Copy draft: [korean-copy-v1.md](/Users/ckahn/Desktop/papa/prompts/korean-copy-v1.md)

## Implementation Lock

- `/budget`은 `Step 1 기본 입력 -> Step 2 항목 선택 -> Step 3 결과` 3단 흐름을 기준으로 한다.
- Step 2는 상단 `Context Summary Bar + 실시간 합산 요약`을 유지한다.
- 결과 화면은 `지역 안내문구 + 기준일/최종 검수일 + 지원금 상세 + 절약 팁 + 공유 CTA` 순서를 기본안으로 둔다.
- 카테고리 선택 화면 스크롤 길이는 QA 리스크로 취급하고, 구현 시 accordion/collapse 가능성을 열어둔다.

## Component / State Dependencies

### 공통 컴포넌트 후보

- `ContextSummaryBar`
- `BudgetRunningTotalCard`
- `BudgetCategorySection`
- `PolicyMetaNotice`
- `StickySendToHusbandBar`

### 상태 모델

- `AppContextState`: `delivery_status`, `region`, `dual_income`
- `BudgetDraftState`: 선택 항목, 등급, 총액/지원금/실질부담액 계산 결과
- `ShareIntentState`: 예산 결과 카드 공유 상태

## Scope

- 기본 입력:
  - 출산 예정/출산 완료
  - 거주 지역
  - 맞벌이 여부
- 비용 카테고리:
  - 산후조리
  - 출산/의료
  - 육아용품
  - 월간 소모품
  - 숨은 비용
- 지원금 자동 차감
- 결과 화면:
  - 총 예상 비용
  - 지원금 총액
  - 실질 부담액
  - 절약 팁
  - 공유 CTA

## Out of Scope

- 지역별 정교한 실시간 정책 API
- 사용자별 정밀 재무 설계

## Deliverables

- `/budget` MVP 화면
- 계산 로직
- 공유 가능한 결과 카드
- 결과 화면 메타데이터/CTA 배치 기준

## Acceptance Criteria

- 3분 안에 결과 도출이 가능
- 첫만남이용권/부모급여/아동수당/지자체 지원금을 계산에 반영 가능
- 결과에서 체크리스트/행정 모듈로 이동 가능
- [budget.md](/Users/ckahn/Desktop/papa/research/wireframes/budget.md)의 단계 구조와 CTA 우선순위가 구현 기준으로 연결된다.
- 결과 화면에 `지역에 따라 달라질 수 있음` 안내와 `기준일/최종 검수일` 노출 방침이 반영된다.

## Closeout Prep (2026-03-19)

### 검증된 사실

- 1차 구현 기준 반영 파일:
  - `app/budget/page.tsx`
  - `lib/budget-domain.ts`
  - `components/papa/budget-running-total-card.tsx`
  - `components/papa/budget-category-section.tsx`
  - `components/papa/context-summary-bar.tsx`
  - `components/papa/result-card-surface.tsx`
- 현재 `/budget`은 `Step 1 기본 입력 -> Step 2 항목 선택 -> Step 3 결과` 3단 흐름으로 동작한다.
- 지원금 차감 로직과 결과 share intent는 기존 `T-005` share layer를 재사용한다.
- 2026-03-19 로컬 검증 기준 `npm run lint`, `npm run build`가 통과했다.

### 작업 가설

- 현재 구현은 MVP 계산기/receipt 흐름의 골격을 충족하지만, 금액/copy polish와 정책 운영 연결은 `T-009`, `T-010`에서 함께 닫는 편이 효율적이다.
- `ContextSummaryBar` 수정 CTA와 long-scroll QA가 closeout 핵심 리스크다.

### 미해결 질문

- `region`을 현재 UI처럼 다중 선택으로 둘지, MVP 운영 기준대로 `한국` 고정에 더 가깝게 잠글지 다시 확인이 필요하다.
- 실제 운영 기준의 지원금 수치/문구는 `T-009` 정책 운영 lane에서 재검수해야 한다.

### Next Handoff

- 다음 연결 티켓은 `T-008 Analytics and Attribution`, `T-009 Policy and Support Data Operations`, `T-010 Launch QA and Release Checklist`다.
- `budget_start`, `budget_complete`, `budget_share`, `cta_click` 이벤트를 `T-008`에서 우선 연결한다.
