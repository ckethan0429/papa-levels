# ADR-001. Foundation IA & Shared Contracts 잠금

- 상태: Accepted
- 작성일: 2026-03-12
- 기준 문서:
  - `prd/v2-papalevel-prd.md`
  - `tasks/ticket-001-foundation-ia-and-shared-contracts.md`
  - `tasks/mvp-backlog.md`
  - `research/wireframes/checklist.md`
  - `research/wireframes/checklist-admin.md`

## 1. 목적

PapaLevel MVP의 핵심 실행 흐름을 후속 티켓(`T-003 ~ T-008`)이 그대로 참조할 수 있도록, 라우트 구조, 체크리스트 IA, 공용 입력값, D-Day 계산 규칙, 공유/계측 계약을 하나의 기준 문서로 잠근다.

## 2. 검증된 사실

- MVP 핵심 라우트는 `/`, `/quiz`, `/checklist`, `/budget` 4개다.
- `행정 타임라인`은 독립 라우트가 아니라 `/checklist?tab=admin` 딥링크를 단일 기준으로 사용한다.
- 공용 입력값은 `delivery_status`, `base_date`, `region`, `dual_income` 4개를 우선 채택한다.
- `D-Day` 기준 구조는 `D-30 ~ D-Day`, `D-Day ~ D+13`, `D+14 ~ D+30`, `행정/지원금` 4축이다.
- 공유 기본 포맷은 카카오톡 링크이며 fallback 순서는 `Kakao SDK -> 이미지 저장 -> 링크 복사`다.
- 카카오 인앱 브라우저 안내는 iOS/Android 분기를 포함해야 한다.
- MVP 필수 이벤트는 `quiz_*`, `budget_*`, `checklist_*`, `admin_timeline_*`, `action_card_share`, `cta_click`, `affiliate_click`, `send_to_husband_click`이다.

## 3. 작업 가설

- foundation 기준을 ADR 하나로 고정하면 후속 티켓의 해석 차이를 줄일 수 있다.
- 공유 링크는 개인 체크 상태를 담지 않고 `tab`, `section`, `card_type` 수준의 콘텐츠 컨텍스트만 전달하는 편이 MVP 범위에 맞다.
- 로그인 없이도 `localStorage + URL query` 조합으로 공용 입력값을 재사용할 수 있다.

## 4. 미해결 질문

- 없음. 본 ADR은 2026-03-12 기준 handoff 결정을 구현 기준으로 고정한다.

## 5. 결정 사항

### 5-1. Route Map

| Route | 역할 | 잠금 기준 |
|------|------|----------|
| `/` | 랜딩 + 핵심 CTA 분기 | `/quiz`, `/checklist`, `/budget` 진입 연결 |
| `/quiz` | 전투력 측정기 | 결과 CTA는 체크리스트/행정/예산으로 연결 |
| `/checklist` | 핵심 잔존 화면 | 기본 탭은 실행 체크리스트, 상단에 `D-Day + 이번 주 할 일 + 진행률` 노출 |
| `/checklist?tab=admin` | 행정 타임라인 딥링크 | 독립 라우트 금지, `원스톱 추천 순서 + 마감 임박 카드` 우선 |
| `/budget` | 예산 시뮬레이터 | 지역/기준일 안내 문구 포함 |

### 5-2. Checklist IA

| 축 | 내부 키 | 역할 | 기본 노출 규칙 |
|---|---|---|---|
| D-30 ~ D-Day | `prepare` | 출산 전 준비물/사전 행정 준비 | `delivery_status=pregnant` 또는 `D-30 ~ D-1` |
| D-Day ~ D+13 | `center` | 조리원/출생 직후/초기 행정 집중 구간 | `D-Day ~ D+13` 우선 추천 |
| D+14 ~ D+30 | `home` | 퇴소 후 집 세팅, 실전 돌봄, 생활 루틴 | `D+14 ~ D+30` 우선 추천 |
| 행정/지원금 | `admin` | 기한 중심 행정 타임라인 | `/checklist?tab=admin`에서 활성 |

추가 잠금 기준:

- `/checklist`는 `온보딩 입력 시트 -> Context Summary Bar -> D-Day/이번 주 할 일/진행률 -> 탭 -> 섹션/항목` 순서를 기본 구조로 둔다.
- `/checklist?tab=admin`은 `Context Summary Bar -> 4축 탭 -> 원스톱 추천 순서 -> 마감 임박 카드 -> 행정 타임라인` 순서를 유지한다.
- 하단 고정 CTA `남편에게 보내기`는 checklist/admin/budget/quiz 공통 행동 패턴으로 유지한다.

### 5-3. Shared Input Contract

| 필드 | 타입 | 설명 | 사용 범위 |
|------|------|------|----------|
| `delivery_status` | `pregnant | born` | 출산 예정/출산 완료 상태 | checklist, admin, budget, quiz CTA 분기 |
| `base_date` | `date string` | 출산 예정일 또는 출산일 | D-Day 계산, 타임라인 정렬, 마감 카드 |
| `region` | `string` | 거주 지역 | 정책/지원금 일반 기준 + 지역 안내 |
| `dual_income` | `boolean` | 맞벌이 여부 | 예산/휴직 관련 계산 및 안내 |

입력 계약 가드레일:

- 입력값은 MVP 전역에서 동일한 의미를 유지한다.
- 공유 링크는 이 입력값 자체를 퍼뜨리지 않고, 수신자가 진입 후 직접 입력하거나 로컬 저장값을 재사용한다.
- localStorage 저장 키 설계가 필요하더라도 필드 이름은 위 계약과 동일하게 유지한다.

### 5-4. D-Day Calculation Rule

- `delivery_status=pregnant`이면 `base_date`를 출산 예정일로 취급하고 `base_date - today` 기준으로 `D-n`을 계산한다.
- `delivery_status=born`이면 `base_date`를 출산일로 취급하고 `today - base_date` 기준으로 `D+n`을 계산한다.
- 경계값은 반드시 아래 4개를 기준 테스트로 사용한다.
  - `D-30`: 출산 전 준비 축 진입
  - `D-Day`: 조리원/행정 타임라인 동시 활성화 기준점
  - `D+14`: 퇴소 후 첫 30일 축 진입
  - `D+30`: MVP 기본 범위 종료
- 행정 항목은 절대 날짜보다 `due_offset_days` 기반 상대일 규칙을 우선 적용한다.

### 5-5. Shared Contracts to Freeze

다음 계약은 후속 티켓에서 재사용 가능한 공용 타입 기준으로 취급한다.

| 계약명 | 역할 | 필수 메모 |
|---|---|---|
| `ChecklistSection` | 탭/섹션 구조 | `prepare`, `center`, `home`, `admin` 축과 연결 |
| `ChecklistItem` | 실행 항목 | `why`, `when`, `who`, `budget`, `due_offset_days` 확장 가능 |
| `PolicyBenefit` | 정책/지원금 항목 | `source`, `effective_date`, `verified_at`, `region_scope` 메타 포함 |
| `ActionCard` | 이번 주 할 일/행정 데드라인 공유 카드 | `card_type`, `surface`, CTA 맥락 유지 |
| `BudgetItem` | 예산 시뮬레이터 항목 | 카테고리/금액/가감 규칙 참조 |
| `QuizQuestion` | 퀴즈 문항 | 예비 아빠 모드 분기 고려 |
| `QuizResult` | 퀴즈 결과 | 결과 CTA는 실행 도구 전환 목적 |
| `ShareTemplate` | 공유 문구/포맷 | 카카오 우선, 이미지/링크 fallback 지원 |
| `EventSpec` | GA4 이벤트 스펙 | surface/context 파라미터 일관성 유지 |

### 5-6. GA4 Event Taxonomy

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

계측 가드레일:

- 이벤트 이름은 후속 티켓에서 임의로 바꾸지 않는다.
- `surface`, `tab`, `section`, `card_type`은 UI copy와 별개로 안정적인 enum처럼 관리한다.
- 공유 이벤트는 개인 체크 상태가 아니라 콘텐츠 컨텍스트만 보낸다.

### 5-7. Share Fallback Matrix

| 환경 | 1차 | 2차 | 3차 |
|------|-----|-----|-----|
| 일반 모바일 브라우저 | Kakao SDK | 이미지 저장 | 링크 복사 |
| 카카오 인앱 브라우저 Android | Kakao SDK | 이미지 저장 + 저장 안내 | 링크 복사 |
| 카카오 인앱 브라우저 iOS | Kakao SDK | 링크 복사 우선 안내 + 이미지 저장 보조 | 링크 복사 재시도 |

공유 가드레일:

- 기본 공유 포맷은 카카오톡 링크다.
- fallback UI는 checklist/admin/budget/quiz에서 같은 순서를 유지한다.
- iOS Kakao in-app에서는 링크 복사 안내를 더 앞세우되, 이미지 저장을 보조 수단으로 남긴다.

## 6. 구현 영향 범위

### 후속 티켓이 반드시 이 ADR을 참조해야 하는 영역

- `T-003`: checklist 기본 화면, 탭 구조, D-Day 헤더, 진행률, 공유 CTA
- `T-004`: `/checklist?tab=admin` 딥링크, `due_offset_days`, 정책 메타 필드
- `T-005`: share fallback 시트, send-to-husband flow, 비개인화 링크 정책
- `T-006`: budget 입력값 재사용, 지역/맞벌이 컨텍스트, 공유 이벤트
- `T-007`: quiz 결과 CTA, 예비 아빠 모드, 공용 입력값 연결
- `T-008`: analytics/launch QA에서 이벤트 taxonomy 및 fallback QA 기준

### 구현 금지선

- `/admin` 같은 독립 행정 라우트 추가 금지
- 공용 입력값 필드명 변경 금지
- 공유 링크에 개인 체크 상태/개인 식별 정보 포함 금지
- GA4 이벤트명 재명명 금지

## 7. 리스크 및 추적 포인트

### 검증된 리스크

- 하단 고정 CTA가 체크리스트 탭 전환/체크 조작을 가릴 수 있다.
- 지역 안내 문구와 기준일 메타데이터가 모바일 카드 안에서 과밀해질 수 있다.

### 추적 필요 항목

- `region_scope`를 전국/광역/기초 수준 중 어디까지 세분화할지 데이터 단계에서 확정 필요
- iOS Kakao in-app fallback 안내 카피는 실기기 QA에서 최종 조정 필요

## 8. 산출물 상태

이 ADR은 `T-001 Foundation / IA / Shared Contracts`의 문서 산출물이며, 후속 구현 티켓이 참조하는 single source of truth 중 하나로 취급한다.
