# T-001 Foundation / IA / Shared Contracts

- Status: `done`
- Priority: `P0`
- Phase: `MVP Week 1`
- Depends on: `None`
- GitHub Issue: [#1](https://github.com/ckethan0429/papa-levels/issues/1)

## Goal

`v2 PRD`의 핵심 개념을 구현 가능한 IA와 공용 데이터 계약으로 고정한다.

## Lock Proposal

### 검증된 사실

- MVP 핵심 라우트는 `/`, `/quiz`, `/checklist`, `/budget` 4개로 유지한다.
- `행정 타임라인`은 독립 라우트가 아니라 `/checklist?tab=admin`을 단일 기준으로 사용한다.
- 공용 입력값은 `delivery_status`, `base_date`, `region`, `dual_income` 4개를 우선 채택한다.
- `D-Day` 기준 화면 구조는 `D-30 ~ D-Day`, `D-Day ~ D+14`, `D+14 ~ D+30`, `행정/지원금` 4축으로 유지한다.
- 공유 기본 포맷은 `카카오톡 링크`이며 fallback 순서는 `Kakao SDK -> 이미지 저장 -> 링크 복사`다.
- 카카오 인앱 브라우저 fallback 안내는 iOS/Android 분기를 포함한다.
- MVP 필수 계측은 `quiz_*`, `budget_*`, `checklist_*`, `admin_timeline_*`, `action_card_share`, `cta_click`, `affiliate_click`, `send_to_husband_click`이다.

### 작업 가설

- `route map`, `D-Day 계산 규칙`, `shared contracts`, `GA4 event taxonomy`, `share fallback matrix`를 하나의 foundation 묶음으로 잠그는 편이 후속 티켓(`T-003 ~ T-008`) 참조 효율이 가장 높다.
- 공유 링크는 개인 체크 상태를 담지 않고, `tab`, `section`, `card_type` 수준의 콘텐츠 컨텍스트만 전달한다.
- 공용 입력값은 추후 로그인/계정 없이도 `localStorage`와 URL query 조합으로 재사용 가능하다.

### 미해결 질문

- 없음. 본 티켓은 2026-03-12 기준 PRD/백로그 handoff 결정을 구현 기준으로 고정한다.

## Locked Spec

### 1) Route Map

| Route | 역할 | 잠금 기준 |
|------|------|----------|
| `/` | 랜딩 + 핵심 CTA 분기 | `/quiz`, `/checklist`, `/budget`로 진입 연결 |
| `/quiz` | 전투력 측정기 | 결과 CTA는 반드시 체크리스트/행정/예산으로 연결 |
| `/checklist` | 핵심 잔존 화면 | 기본 탭은 실행 체크리스트, 상단에 `D-Day + 이번 주 할 일 + 진행률` 노출 |
| `/checklist?tab=admin` | 행정 타임라인 딥링크 | 독립 라우트 금지, `원스톱 추천 순서 + 마감 임박 카드` 우선 |
| `/budget` | 예산 시뮬레이터 | 지역/기준일 안내문구 포함 |

### 2) Shared Input Contract

| 필드 | 타입 | 설명 | 사용 범위 |
|------|------|------|----------|
| `delivery_status` | `pregnant | born` | 출산 예정/출산 완료 상태 | checklist, admin, budget, quiz CTA 분기 |
| `base_date` | `date string` | 출산 예정일 또는 출산일 | D-Day 계산, 타임라인 정렬, 마감카드 |
| `region` | `string` | 거주 지역 | 정책/지원금 일반 기준 + 지역 안내 |
| `dual_income` | `boolean` | 맞벌이 여부 | 예산/휴직 관련 계산 및 안내 |

### 3) D-Day Calculation Rule

- `delivery_status=pregnant`이면 `base_date`를 출산 예정일로 취급하고 `today - base_date`가 아닌 `base_date - today` 기준으로 `D-n`을 계산한다.
- `delivery_status=born`이면 `base_date`를 출산일로 취급하고 `today - base_date` 기준으로 `D+n`을 계산한다.
- 경계값은 아래 4개를 반드시 테스트한다:
  - `D-30`: 출산 전 준비 축 진입
  - `D-Day`: 조리원/행정 타임라인 동시 활성화 기준점
  - `D+14`: 퇴소 후 첫 30일 축 진입
  - `D+30`: MVP 기본 범위 종료
- 행정 항목은 절대 날짜보다 `due_offset_days` 기반 상대일 규칙을 우선 적용한다.

### 4) Shared Contracts to Freeze

- `ChecklistSection`
- `ChecklistItem`
- `PolicyBenefit`
- `ActionCard`
- `BudgetItem`
- `QuizQuestion`
- `QuizResult`
- `ShareTemplate`
- `EventSpec`

### 5) GA4 Event Taxonomy

| 이벤트 | 필수 파라미터 |
|--------|---------------|
| `quiz_start`, `quiz_complete`, `quiz_share` | `entry_point`, `delivery_status?`, `result_type?` |
| `budget_start`, `budget_complete`, `budget_share` | `entry_point`, `region`, `dual_income` |
| `checklist_check`, `checklist_share` | `tab`, `section`, `item_id`, `delivery_status` |
| `admin_timeline_view`, `admin_timeline_share` | `tab=admin`, `item_id?`, `deadline_bucket?` |
| `action_card_share` | `card_type`, `share_target`, `surface` |
| `cta_click` | `source_surface`, `target_route`, `cta_name` |
| `affiliate_click` | `item_id`, `partner`, `surface` |
| `send_to_husband_click` | `surface`, `card_type`, `share_method` |

### 6) Share Fallback Matrix

| 환경 | 1차 | 2차 | 3차 |
|------|-----|-----|-----|
| 일반 모바일 브라우저 | Kakao SDK | 이미지 저장 | 링크 복사 |
| 카카오 인앱 브라우저 Android | Kakao SDK | 이미지 저장 + 저장 안내 | 링크 복사 |
| 카카오 인앱 브라우저 iOS | Kakao SDK | 링크 복사 우선 안내 + 이미지 저장 보조 | 링크 복사 재시도 |

## Recommended File Targets

- `tasks/ticket-001-foundation-ia-and-shared-contracts.md` — 구현 기준 문서 원본
- `docs/adr/001-foundation-ia-and-contracts.md` — route map / D-Day / fallback ADR 후보
- `lib/papa-data.ts` — 현재 공용 데이터/타입 집합이 모여 있는 구현 기준점
- `lib/` 하위 신규 모듈 — `context`, `events`, `share`, `routes`를 추후 분리할 경우의 권장 위치

## Created Artifacts (2026-03-12)

- ADR: [001-foundation-ia-and-contracts.md](/Users/ckahn/Desktop/papa/docs/adr/001-foundation-ia-and-contracts.md)

## Scope

- 라우트 구조 확정: `/`, `/quiz`, `/budget`, `/checklist`
- 체크리스트 내부 모듈 구조 확정: `prepare`, `center`, `home`, `admin`
- `행정 타임라인`은 `/checklist` 내부 탭/딥링크로 통일
- 공용 입력값 정의:
  - `delivery_status` (`pregnant` / `born`)
  - `base_date` (출산 예정일 또는 출산일)
  - `region`
  - `dual_income`
- 공용 타입 정의:
  - `ChecklistSection`
  - `ChecklistItem`
  - `PolicyBenefit`
  - `ActionCard`
  - `BudgetItem`
  - `QuizQuestion`
  - `QuizResult`
  - `ShareTemplate`
  - `EventSpec`
- `D-Day` 계산 기준과 날짜 처리 규칙 정의
- 정책 데이터 메타필드 정의: `source`, `effective_date`, `verified_at`, `region_scope`
- 기한 계산 메타필드 정의: `due_offset_days`
- GA4 이벤트 taxonomy와 공통 파라미터 규칙 정의
- 카카오 인앱 브라우저 기준 공유 fallback matrix 정의 (iOS/Android 분기 포함)

## Out of Scope

- UI 완성
- 결제 구현
- 실제 콘텐츠 대량 입력
- Mixpanel 상세 설계

## Deliverables

- IA 문서 또는 간단한 ADR
- 공용 타입/스키마 파일
- 라우트 및 딥링크 명세
- D-Day 계산 규칙 문서
- GA4 이벤트 spec 문서
- share fallback / in-app browser note

## Acceptance Criteria

- `/checklist?tab=admin`이 행정 타임라인의 단일 구현 기준으로 문서화된다.
- `delivery_status`, `base_date`, `region`, `dual_income` 입력 계약이 `checklist`, `admin`, `budget`에서 공통으로 재사용 가능하다.
- 이후 티켓이 참조할 공용 타입과 메타필드가 준비된다.
- 날짜/D-Day 계산 규칙이 `D-30`, `D-Day`, `D+14`, `D+30` 경계값 기준으로 문서화된다.
- GA4 이벤트명과 필수 파라미터가 `T-003 ~ T-008`에서 재사용 가능한 수준으로 잠긴다.
- 카카오 인앱 브라우저에서 `Kakao SDK 우선 -> 이미지 저장 fallback -> 링크 복사` 순서와 iOS/Android 분기 규칙이 문서화된다.
