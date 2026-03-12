# T-006 Budget Simulator v1

- Status: `todo`
- Priority: `P1`
- Phase: `MVP Week 3`
- Depends on: `T-001`

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
