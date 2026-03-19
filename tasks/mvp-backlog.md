# PapaLevel MVP Backlog

기준 문서: [v2 PRD](/Users/ckahn/Desktop/papa/prd/v2-papalevel-prd.md)

## 작업 순서

| ID | 우선순위 | 상태 | 제목 | 권장 시점 | 선행 티켓 |
|----|----------|------|------|-----------|-----------|
| T-001 | P0 | done | Foundation / IA / Shared Contracts | 1주차 | - |
| T-002 | P0 | done | Checklist Data Model and Content Schema | 1주차 | T-001 |
| T-003 | P0 | todo | Checklist Experience and D-Day Flow | 2주차 | T-001, T-002 |
| T-004 | P0 | todo | Admin Timeline Module | 2주차 | T-001, T-002 |
| T-005 | P0 | todo | Share System and Send-to-Husband Flows | 2주차 | T-003, T-004 |
| T-006 | P1 | todo | Budget Simulator v1 | 3주차 | T-001 |
| T-007 | P1 | todo | Quiz v1 and Pre-Dad Mode | 3주차 | T-001 |
| T-008 | P0 | todo | Analytics and Attribution | 3~4주차 | T-003, T-004, T-005, T-006, T-007 |
| T-009 | P1 | todo | Policy/Support Data Operations | 3~4주차 | T-002, T-004, T-006 |
| T-010 | P1 | todo | Launch QA and Release Checklist | 4주차 | T-003, T-004, T-005, T-006, T-007, T-008, T-009 |
| T-011 | P2 | todo | Paid Pack Experiment | MVP 후 | T-003, T-004, T-005, T-008 |

## Local Status Source Of Truth (2026-03-19)

- 이 파일의 `상태` 컬럼이 로컬 문서 백로그의 단일 기준이다.
- 상태 값은 [tasks/README.md](/Users/ckahn/Desktop/papa/tasks/README.md)의 규칙(`todo`, `doing`, `blocked`, `done`)만 사용한다.
- GitHub Project의 `Workflow` 필드는 운영 보드 상태를 보여주는 보조 신호다. 로컬 `done`과 GitHub `Review`가 동시에 존재할 수 있다.
- `T-001`, `T-002`는 아래 산출물이 존재하므로 로컬 문서 기준 `done`으로 본다:
  - [001-foundation-ia-and-contracts.md](/Users/ckahn/Desktop/papa/docs/adr/001-foundation-ia-and-contracts.md)
  - [items.json](/Users/ckahn/Desktop/papa/content/checklist/items.json)
  - [benefits.json](/Users/ckahn/Desktop/papa/content/policy/benefits.json)
  - [checklist-input-guide.md](/Users/ckahn/Desktop/papa/docs/content/checklist-input-guide.md)
- `T-003`, `T-004`는 착수 가능 상태이지만 아직 구현 시작 전이므로 로컬 상태는 `todo`로 유지한다.

## GitHub Tracking (2026-03-12)

| ID | GitHub Issue |
|----|--------------|
| T-001 | [#1](https://github.com/ckethan0429/papa-levels/issues/1) |
| T-002 | [#2](https://github.com/ckethan0429/papa-levels/issues/2) |
| T-003 | [#3](https://github.com/ckethan0429/papa-levels/issues/3) |
| T-004 | [#4](https://github.com/ckethan0429/papa-levels/issues/4) |
| T-005 | [#5](https://github.com/ckethan0429/papa-levels/issues/5) |
| T-006 | [#6](https://github.com/ckethan0429/papa-levels/issues/6) |
| T-007 | [#7](https://github.com/ckethan0429/papa-levels/issues/7) |
| T-008 | [#8](https://github.com/ckethan0429/papa-levels/issues/8) |
| T-009 | [#9](https://github.com/ckethan0429/papa-levels/issues/9) |
| T-010 | [#10](https://github.com/ckethan0429/papa-levels/issues/10) |

## GitHub Operations (2026-03-12)

- Project Board: [PapaLevel MVP Board](https://github.com/users/ckethan0429/projects/1)
- Milestones:
  - `MVP Week 1` = `T-001 ~ T-002`
  - `MVP Week 2` = `T-003 ~ T-005`
  - `MVP Week 3` = `T-006 ~ T-007`
  - `MVP Week 4` = `T-008 ~ T-010`
  - `Post-MVP` = `T-011+`
- Labels:
  - priority: `P0`, `P1`, `P2`
  - stage: `stage:foundation`, `stage:checklist`, `stage:admin`, `stage:share`, `stage:budget`, `stage:quiz`, `stage:analytics`, `stage:policy`, `stage:qa`
  - risk: `risk:kakao`, `risk:policy`, `risk:ux`, `risk:performance`
- Project workflow field:
  - `Review`: `T-001`, `T-002`
  - `Ready`: `T-003`, `T-004`
  - `Backlog`: `T-005 ~ T-010`
- 로컬 문서 상태는 이 파일의 `상태` 컬럼을 우선 사용하고, GitHub `Workflow`는 보드 운영용으로 해석한다.
- GitHub 기본 `Status`는 작업 시작 시 `In Progress`, 완료 시 `Done`으로 갱신한다.

## 구현 원칙

- `행정 타임라인`은 독립 라우트가 아니라 체크리스트 내부 모듈로 구현한다.
- `전투력 측정기`는 유입 훅으로 얇게 구현하고, 핵심 가치는 체크리스트/행정/예산에 둔다.
- `엄마 → 아빠 전달`을 최우선 공유 시나리오로 취급한다.
- 공유 기본 포맷은 `카카오톡 링크`로 두고, 이미지 저장/링크 복사는 fallback으로 처리한다.
- 정책성 데이터는 `기준일`과 `최종 검수일`을 함께 관리한다.
- 정책/지원금은 `지역에 따라 달라질 수 있음` 안내문구를 먼저 노출하고, 본문은 일반적인 기준을 우선 보여준다.
- 이벤트 계측은 기능 릴리즈 후가 아니라 구현과 동시에 넣는다.
- 사회적 증거(`아빠 N%가 체크`, `상위 X%`, `같은 지역 평균 비교`)는 MVP에서 보류한다.

## Task Breakdown Handoff (2026-03-11)

### Current Stage

- 현재 stage는 `PRD 완료 -> UX / Tech 입력 고정 -> Task Breakdown 진행 가능`으로 본다.
- `T-001 ~ T-005`는 UX/Tech 결정을 구현 티켓으로 번역하는 첫 묶음이다.

### Decisions

**검증된 사실**

- `/checklist`가 핵심 경험이며, `행정 타임라인`은 `/checklist?tab=admin`으로 고정한다.
- `엄마 → 아빠 전달`은 페이지 전체 공유보다 `이번 주 할 일`, `행정 데드라인`, `예산 결과`, `전투력 결과` 같은 action unit 공유를 우선한다.
- 이벤트 계측은 기능 구현과 동시에 넣는다.
- 공유 기본 포맷은 `카카오톡 링크`다.
- 카카오 인앱 브라우저 fallback 안내는 iOS/Android별로 분기한다.
- 정책/지원금은 안내문구와 함께 일반 기준 + `기준일`/`최종 검수일`을 노출한다.
- 사회적 증거는 MVP 노출 범위에서 제외한다.

**작업 가설**

- `T-001` 산출물은 `IA + route map + D-Day 계산 규칙 + shared contracts + GA4 event spec + share fallback matrix`까지 포함한다.
- `T-002`는 `source`, `effective_date`, `verified_at`, `region_scope`, `due_offset_days`를 포함하는 콘텐츠/정책 메타데이터 계약을 잠근다.
- `T-005`는 `Kakao SDK 우선 + 이미지 저장 fallback + 공유 링크 비개인화`를 구현 기준으로 둔다.
- `T-008`은 `GA4 필수`, `Mixpanel 옵션`, `pack_* / checkout_*`은 Phase 2 dormant로 본다.

### Risks / Open Questions

- 카카오 인앱 브라우저에서 이미지 저장, 외부 링크 이동, 딥링크 fallback이 핵심 QA 리스크다.
- 지역별 실제 정책 차이와 일반 기준 안내문구가 사용자에게 혼동 없이 전달되는지 확인이 필요하다.

### Next Handoff

- 다음 단계는 `task-breakdown`이다.
- 입력 문서는 `v2 PRD`, `mvp-backlog`, `ticket-001 ~ ticket-009`, 이번 handoff 섹션이다.
- 우선 잠글 항목은 `route map`, `checklist/admin tab 구조`, `D-Day 계산 규칙`, `shared contracts`, `GA4 event taxonomy`, `share fallback / in-app browser QA points`다.
- 티켓 보강 우선순위는 `T-001`, `T-002`, `T-005`, `T-008`, `T-010`이다.

## Frontend Designer Handoff (2026-03-11)

### Current Stage

- 현재 stage는 `UX / Tech / Task Breakdown 완료 -> Frontend Designer handoff`로 본다.
- 이 단계의 범위는 상위 결정 재정의가 아니라 `모바일 우선 화면 구조`, `CTA 우선순위`, `공통 컴포넌트`, `공유 fallback UI`를 잠그는 것이다.

### Decisions

**검증된 사실**

- `/checklist`를 MVP의 기본 잔존 화면으로 두고, 상단에 `D-Day + 이번 주 아빠 할 일 + 진행률`을 우선 노출한다.
- `행정 타임라인`은 `/checklist?tab=admin` 내부 모듈로 유지하며, 상단에 `원스톱 추천 순서`와 `마감 임박 카드`를 먼저 배치한다.
- 모든 핵심 화면(`/checklist`, `/checklist?tab=admin`, `/budget`, `/quiz`)에는 맥락형 `남편에게 보내기` CTA를 유지한다.
- 공유 fallback UI는 `Kakao SDK -> 이미지 저장 -> 링크 복사` 순서의 공통 패턴으로 정리한다.
- 실행 공유의 기본 포맷은 `카카오톡 링크`다.
- 카카오 인앱 브라우저 fallback 안내는 iOS/Android별로 분기한다.
- 사회적 증거 UI는 MVP에서 노출하지 않는다.

**작업 가설**

- 공용 입력값(`delivery_status`, `base_date`, `region`, `dual_income`)은 상단 `context summary bar`로 재사용한다.
- 실행 공유의 핵심 단위는 `이번 주 아빠 할 일 카드`와 `행정 데드라인 카드`다.
- 체크리스트 항목 UI는 `왜 / 언제 / 누가 / 예산 / 액션` 구조의 카드형 패턴으로 통일한다.
- `/budget`은 step flow, `/quiz`는 결과 화면 중심 설계가 MVP 구현 효율이 가장 높다.

### Risks / Open Questions

- `남편에게 보내기` 하단 고정 UI가 체크리스트 탭 전환이나 체크 조작을 가릴 가능성이 있다.
- 지역 안내문구와 기준일 메타데이터가 모바일 카드 안에서 과밀해질 가능성이 있다.

### Next Handoff

- 다음 단계는 `frontend implementation prep`이다.
- 입력 문서는 `v2 PRD`, `mvp-backlog`, `ticket-001`, `ticket-003`, `ticket-004`, `ticket-005`, `ticket-006`, `ticket-007`, 이번 handoff 섹션이다.
- 우선 구현 토대는 `ContextSummaryBar`, `StickySendToHusbandBar`, `StatusBadge`, `ShareFallbackSheet`다.
- 화면 설계/구현 우선순위는 `/checklist -> /checklist?tab=admin -> /budget -> /quiz` 순서로 둔다.

## Frontend Implementation Prep Handoff (2026-03-12)

### Current Stage

- 현재 stage는 `T-001/T-002 고정 완료 -> 4개 핵심 화면 wireframe 확보 -> copy draft 확보 -> frontend implementation prep 진입 가능`으로 본다.
- 이번 단계의 목적은 상위 결정을 다시 바꾸는 것이 아니라, `T-003 ~ T-007` 구현 티켓에 wireframe/copy 입력을 연결하고 공통 컴포넌트 경계를 선명하게 만드는 것이다.

## Current Snapshot (2026-03-19)

- 로컬 문서 기준 완료 티켓은 `T-001`, `T-002`다.
- 다음 실행 큐는 `T-003`, `T-004`다.
- 현재 저장소 단계는 `frontend implementation prep -> checklist/admin implementation start`로 해석한다.

### Decisions

**검증된 사실**

- `T-001`, `T-002`에 `Lock Proposal`이 반영되어 route map, 공용 입력값, D-Day 규칙, metadata schema 기준이 고정됐다.
- wireframe 초안은 [checklist.md](/Users/ckahn/Desktop/papa/research/wireframes/checklist.md), [checklist-admin.md](/Users/ckahn/Desktop/papa/research/wireframes/checklist-admin.md), [budget.md](/Users/ckahn/Desktop/papa/research/wireframes/budget.md), [quiz.md](/Users/ckahn/Desktop/papa/research/wireframes/quiz.md)에 정리됐다.
- 공유/CTA/정책 안내 카피 초안은 [korean-copy-v1.md](/Users/ckahn/Desktop/papa/prompts/korean-copy-v1.md)에 정리됐다.
- 공유 기준은 `카카오톡 링크 우선`, `개인 상태 비포함`, `social proof MVP 비노출`, `localStorage 기반 시작`이다.

**작업 가설**

- 구현 시작 전 `ContextSummaryBar`, `StickySendToHusbandBar`, `PolicyMetaNotice`, `ShareFallbackSheet`, `ActionCard`를 공통 컴포넌트 후보로 먼저 잠그는 편이 효율적이다.
- `T-003 ~ T-007` 티켓은 각자 독립 구현이 아니라 wireframe/copy 입력을 참조하는 linked ticket 묶음으로 다루는 편이 재작업이 적다.
- `T-010`은 현재 시점에서 frontend prep 리스크를 선반영해 QA 체크리스트를 미리 조정하는 것이 맞다.

### Risks / Open Questions

- `iOS Kakao in-app fallback` 상세 동작과 안내 카피는 실기기 검증 전까지 열어둬야 한다.
- MVP 첫 구현에서는 `region`을 `한국` 고정값으로 두고 `national` 기준 항목만 사용자 노출 대상으로 삼는다. 지역 세분화는 추후 논의한다.
- `/checklist` sticky CTA, `/budget` long scroll, `/quiz` card generation 성능은 모두 구현 리스크이자 QA 선행 항목이다.
- `D등급` 공유 카피는 실제 공유 맥락에서 거부감이 생길 가능성이 있어 톤 검증이 필요하다.

### Shared Component / State Design

**공통 컴포넌트 후보**

- `ContextSummaryBar`: checklist, admin, budget 공용 입력값 표시/수정
- `StickySendToHusbandBar`: checklist, admin, budget, quiz 공통 하단 CTA
- `ShareFallbackSheet`: 카카오 우선 / 이미지 저장 / 링크 복사 분기 UI
- `PolicyMetaNotice`: 지역 안내문구 + 기준일 + 최종 검수일 표기
- `ActionCard`: 이번 주 할 일 / 행정 데드라인 공유 카드 공용 베이스

**route별 핵심 컴포넌트**

- `/checklist`: `DdayProgressHeader`, `WeeklyActionCard`, `ChecklistTabBar`, `ChecklistItemCard`
- `/checklist?tab=admin`: `AdminPriorityCard`, `DeadlineAlertCard`, `AdminTimelineItemCard`
- `/budget`: `BudgetRunningTotalCard`, `BudgetCategorySection`
- `/quiz`: `QuizQuestionStepper`, `QuizChoiceCard`, `QuizResultCard`, `QuizResultShareCard`

**공통 상태 모델**

- `AppContextState`: `delivery_status`, `base_date`, `region`, `dual_income`
- `ChecklistProgressState`: 체크 상태, 진행률, 추천 섹션
- `AdminDeadlineState`: `due_offset_days` 기반 deadline 계산
- `BudgetDraftState`: 카테고리 선택/등급/합산 계산 상태
- `QuizDraftState`: 답변/점수/예비 아빠 모드 분기
- `ShareIntentState`: `surface`, `card_type`, `share_method`, `entry_role`

### Next Handoff

- 다음 단계는 `task-breakdown sync + frontend implementation prep`이다.
- 입력 문서는 [ticket-001-foundation-ia-and-shared-contracts.md](/Users/ckahn/Desktop/papa/tasks/ticket-001-foundation-ia-and-shared-contracts.md), [ticket-002-checklist-data-model-and-content-schema.md](/Users/ckahn/Desktop/papa/tasks/ticket-002-checklist-data-model-and-content-schema.md), [research/wireframes](/Users/ckahn/Desktop/papa/research/wireframes), [korean-copy-v1.md](/Users/ckahn/Desktop/papa/prompts/korean-copy-v1.md)다.
- 우선 반영 대상 티켓은 `T-003`, `T-004`, `T-005`, `T-006`, `T-007`, `T-010`이다.
- 다음 산출물은 `공통 컴포넌트/상태 설계`, `티켓별 UI/input/copy 연결`, `QA 리스크 선반영`이다.

## GitHub Issues 변환 순서

1. T-001 ~ T-005 이슈화 완료
2. T-006 ~ T-010 이슈화 완료
3. T-011은 MVP 지표 확인 후 이슈화
