# T-003 Checklist Experience and D-Day Flow

- Status: `todo`
- Priority: `P0`
- Phase: `MVP Week 2`
- Depends on: `T-001`, `T-002`
- GitHub Issue: [#3](https://github.com/ckethan0429/papa-levels/issues/3)

## Goal

사용자가 출산(예정)일을 입력하면 자신의 시점에 맞는 체크리스트와 할 일을 바로 볼 수 있게 만든다.

## Reference Inputs (2026-03-12)

- Wireframe: [checklist.md](/Users/ckahn/Desktop/papa/research/wireframes/checklist.md)
- Admin deep link reference: [checklist-admin.md](/Users/ckahn/Desktop/papa/research/wireframes/checklist-admin.md)
- Copy draft: [korean-copy-v1.md](/Users/ckahn/Desktop/papa/prompts/korean-copy-v1.md)
- Shared contract lock: [ticket-001-foundation-ia-and-shared-contracts.md](/Users/ckahn/Desktop/papa/tasks/ticket-001-foundation-ia-and-shared-contracts.md)
- Data/schema lock: [ticket-002-checklist-data-model-and-content-schema.md](/Users/ckahn/Desktop/papa/tasks/ticket-002-checklist-data-model-and-content-schema.md)
- Content input guide: [checklist-input-guide.md](/Users/ckahn/Desktop/papa/docs/content/checklist-input-guide.md)
- Seed data: [items.json](/Users/ckahn/Desktop/papa/content/checklist/items.json)

## Implementation Lock

- `/checklist` 첫 진입은 `온보딩 입력 시트 -> Context Summary Bar -> D-Day + 이번 주 아빠 할 일 + 진행률` 흐름을 기준으로 한다.
- 공용 입력값은 상단 요약 바에서 수정 가능해야 하며, `delivery_status`, `base_date`, `region`, `dual_income`를 재사용한다.
- 단, MVP 첫 구현에서는 `region` 입력 계약은 유지하되 값/노출은 `한국` 고정으로 시작한다. 지역 세분화 UI와 로컬 정책 분기는 추후 논의한다.
- 핵심 액션은 `체크`, `이번 주 아빠 할 일 확인`, `행정 탭 이동`, `남편에게 보내기` 4개로 단순화한다.
- `남편에게 보내기` 하단 고정 CTA는 유지하되, 모바일에서는 `primary CTA 1개 + share sheet` 진입 구조를 기본안으로 둔다.
- 하단 고정 CTA가 조작 영역을 가리지 않도록 페이지 하단에는 `safe-area + CTA 높이`만큼의 예약 여백을 확보한다.
- 기본 탭 구조는 `prepare`, `center`, `home`, `admin` 4축을 유지한다. `admin`은 별도 라우트가 아니라 `/checklist?tab=admin`으로만 진입한다.
- 구현 우선순위는 `입력 완료 -> 추천 섹션 계산 -> 이번 주 아빠 할 일 3개 계산 -> 항목 체크/저장 -> admin 딥링크 복귀` 순서로 둔다.

## Frontend Prep Lock (2026-03-12)

### 검증된 사실

- `/checklist`는 MVP 핵심 잔존 화면이며 상단에 `D-Day + 이번 주 아빠 할 일 + 진행률`을 우선 노출한다.
- 공용 입력값 4개(`delivery_status`, `base_date`, `region`, `dual_income`)는 checklist/admin/budget에서 동일 계약을 사용한다.
- MVP 첫 구현에서는 `region`을 사용자 선택값이 아니라 `한국` 기본값으로 처리한다.
- D-Day 경계값은 `D-30`, `D-Day`, `D+14`, `D+30`으로 고정한다.
- 체크리스트 seed data는 `content/checklist/items.json`을 기준으로 연결한다.
- 공유 기본 포맷은 `카카오톡 링크 -> 이미지 저장 -> 링크 복사`이며, 개인 체크 상태는 공유 URL에 넣지 않는다.

### 작업 가설

- `이번 주 아빠 할 일`은 현재 활성 섹션 기준으로 `required` 우선, 이후 `recommended`를 섞어 최대 3개까지 노출하는 방식이 MVP 구현 효율이 가장 높다.
- 체크리스트 항목 상세 UI는 `왜 / 언제 / 누가 / 예산 / 액션` 구조를 고정하면 `T-005` 공유 카드와 재사용 경계가 선명해진다.
- 온보딩 입력 시트와 상단 요약 바의 입력 스키마를 동일하게 맞추면 수정/재진입 로직이 단순해진다.

### 미해결 질문

- 없음. 상위 결정 재정의 없이 구현 기준만 고정한다.

## Component / State Dependencies

### 공통 컴포넌트 후보

- `ContextSummaryBar`
- `DdayProgressHeader`
- `WeeklyActionCard`
- `ChecklistTabBar`
- `ChecklistSectionBlock`
- `ChecklistItemCard`
- `StickySendToHusbandBar`

### 상태 모델

- `AppContextState`: `delivery_status`, `base_date`, `region`, `dual_income`
- `ChecklistProgressState`: `checked_item_ids`, `completion_rate`, `recommended_section`, `active_tab`
- `WeeklyActionState`: `selected_item_ids`, `card_type=weekly_actions`, `source_section`
- `ChecklistUiState`: `expanded_item_ids`, `is_onboarding_open`, `is_context_editing`

## Interaction Contract

### 1) 최초 진입

- 공용 입력값이 없으면 온보딩 입력 시트를 먼저 연다.
- 입력 완료 후 기본 진입 라우트는 `/checklist`이며, 딥링크로 들어온 경우 `tab` query를 유지한 채 복귀한다.
- 온보딩 완료 직후 아래 순서로 화면이 그려진다.
  1. `ContextSummaryBar`
  2. `DdayProgressHeader`
  3. `WeeklyActionCard`
  4. `ChecklistTabBar`
  5. 현재 탭 섹션 목록
  6. `StickySendToHusbandBar`

### 2) 추천 탭 / 섹션 계산

| 조건 | 기본 활성 탭 | 비고 |
|------|--------------|------|
| `delivery_status=pregnant` and `d_day < 0` | `prepare` | `D-30 ~ D-1` |
| `delivery_status=born` and `0 <= d_day < 14` | `center` | `D-Day ~ D+13` |
| `delivery_status=born` and `14 <= d_day <= 30` | `home` | `D+14 ~ D+30` |
| `tab=admin` query 존재 | `admin` | 딥링크 우선 |

- `delivery_status=pregnant`인데 `base_date`가 오늘 이후면 `D-n` 형식으로 표시한다.
- `delivery_status=born`이면 `D+n` 형식으로 표시한다.
- MVP 범위 밖(`D-30` 이전, `D+30` 이후)이어도 가장 가까운 탭에 진입시키고, 헤더/보조 카피에서 범위 밖 안내를 처리한다.

### 3) 이번 주 아빠 할 일 3개 계산 규칙

- 입력 데이터 소스: `content/checklist/items.json`
- 후보군 필터 순서:
  1. 현재 활성 탭과 동일한 `section`
  2. `who`가 `dad`, `couple`, `admin`인 항목 우선
  3. 미체크 항목만 우선
  4. `urgency=required` 우선, 이후 `recommended`
  5. `due_offset_days` 절대값이 현재 시점과 가까운 순 정렬
- 결과는 최대 3개 노출한다.
- 후보가 3개 미만이면 인접 섹션에서 보충하되 `admin` 항목은 행정성 urgency가 높은 항목만 끌어온다.
- MVP seed data 기준 최소 연결 대상:
  - `prepare-docs-ready`
  - `prepare-gov24-check`
  - `center-birth-registration-window`
  - `center-first-meeting-voucher`
  - `home-stock-up`
  - `home-night-shift`
  - `admin-birth-registration`
  - `admin-happy-birth`

### 4) 체크 상태 / 로컬 저장

- localStorage 시작 기준을 유지한다.
- 최소 저장 단위:
  - `app_context`
  - `checklist_checked_item_ids`
  - `checklist_active_tab`
  - `checklist_expanded_item_ids`
- 저장 규칙:
  - 항목 체크 즉시 저장
  - 탭 전환 즉시 활성 탭 저장
  - `/checklist?tab=admin` 진입 후 `/checklist`로 돌아와도 체크 상태 유지
  - 공용 입력값 수정 시 `d_day`, `추천 탭`, `이번 주 아빠 할 일`, `진행률`을 즉시 재계산

## Data Mapping Lock

### section -> 탭 라벨

| section | 탭 라벨 | 설명 |
|--------|--------|------|
| `prepare` | `D-30 준비` | 출산 전 준비/사전 행정 |
| `center` | `조리원` | D-Day ~ D+13 |
| `home` | `퇴소 후 30일` | D+14 ~ D+30 |
| `admin` | `행정` | `/checklist?tab=admin` 딥링크 |

### 카드 필드 매핑

| UI 블록 | 데이터 필드 |
|--------|-------------|
| 항목 제목 | `title` |
| 상태 배지 | `urgency`, 체크 여부 |
| 왜 | `why` |
| 언제 | `when_label`, `due_offset_days` |
| 누가 | `who` |
| 예산/중고 | `cost_range`, `used_market_allowed` |
| 공유 CTA | `share_copy`, `deeplink_target` |
| 구매 CTA | `affiliate_target` |

### admin 연결 규칙

- `deeplink_target=/checklist?tab=admin`인 항목은 checklist 카드 내부 CTA에서도 admin 탭 이동을 허용한다.
- 단, `T-003` 범위에서는 admin 자체 UI를 재정의하지 않고 `T-004` 구현을 전제한 연결 규칙만 고정한다.

## Recommended File Targets

- `tasks/ticket-003-checklist-experience-and-d-day-flow.md` — 구현 기준 원본
- `src/app/checklist/page.tsx` — `/checklist` 엔트리 후보
- `src/features/checklist/components/*` — checklist 화면 컴포넌트 후보
- `src/features/checklist/model/dday.ts` — D-Day 계산/추천 탭 규칙 후보
- `src/features/checklist/model/weekly-actions.ts` — 이번 주 아빠 할 일 추출 규칙 후보
- `src/features/checklist/model/storage.ts` — localStorage 키/직렬화 후보
- `src/features/checklist/lib/selectors.ts` — section/progress selector 후보

## Scope

- 출산 예정일/출산일 입력 플로우
- 공용 입력값 수집:
- 출산 상태 (`pregnant` / `born`)
- 출산 예정일 또는 출산일
- 거주 지역 계약 유지 (`MVP 첫 구현에서는 한국 고정`)
- 맞벌이 여부
- D-Day 기준 현재 섹션 우선 노출
- 4축 탭 UI
- 체크 상태 로컬 저장
- 완료율 계산
- `이번 주 아빠 할 일 3가지` 추출 로직
- 체크리스트 항목 상세 UI
- `/checklist?tab=admin` 딥링크 진입과 복귀 흐름 반영
- `남편에게 보내기` CTA가 들어갈 위치 정의
- wireframe/copy/seed data 매핑 고정
- `T-005`, `T-008`, `T-010`이 재사용할 이벤트/QA 포인트 선반영

## Out of Scope

- 로그인/계정 연동
- 고급 개인화 추천
- 기기 간 상태 동기화
- admin 탭 상세 정책 메타데이터 UI 자체 구현
- 카카오 공유/fallback 구현 상세 (`T-005` 범위)

## Deliverables

- `/checklist` MVP 화면 구현 기준
- D-Day 계산 기반 기본 탭/추천 섹션 규칙
- 로컬 저장 키/복원 규칙
- `이번 주 아빠 할 일` 추출 규칙
- deep link 진입/복귀 규칙
- wireframe 기준 레이아웃 반영 메모
- seed data 연결 표
- analytics / QA 체크포인트 메모

## Acceptance Criteria

- 사용자가 날짜 입력 후 바로 본인 시점에 맞는 섹션을 본다.
- `delivery_status`와 `base_date`에 따라 기본 탭 또는 추천 섹션이 일관되게 계산된다.
- 최소 1개 항목을 체크하면 진행률이 갱신되고 로컬에 유지된다.
- `이번 주 아빠 할 일` 카드 생성에 필요한 데이터가 준비된다.
- `/checklist?tab=admin`으로 진입해도 공용 입력값과 로컬 상태가 유지된다.
- [checklist.md](/Users/ckahn/Desktop/papa/research/wireframes/checklist.md)의 정보 구조와 CTA 우선순위가 구현 기준으로 연결된다.
- seed data 최소 세트가 `prepare`, `center`, `home`, `admin` 4축 모두에서 화면 연결 가능 상태로 문서화된다.

## Analytics / QA Hooks

### 필수 이벤트 연결

| 이벤트 | 트리거 | 필수 파라미터 |
|--------|--------|---------------|
| `checklist_check` | 항목 체크/해제 | `tab`, `section`, `item_id`, `delivery_status` |
| `cta_click` | `행정 타임라인 보기`, `이번 주 예산 확인하기`, `남편에게 보내기` 클릭 | `source_surface=/checklist`, `target_route`, `cta_name` |
| `send_to_husband_click` | 하단 고정 CTA 또는 카드 CTA | `surface`, `card_type`, `share_method?` |

### 구현 전 QA 포인트

- `D-30`, `D-Day`, `D+14`, `D+30` 경계값에서 추천 탭이 바뀌는지 확인
- 하단 고정 CTA가 소형 화면에서 탭/체크 조작을 가리지 않도록 `하단 예약 여백 + safe area`가 적용되는지 확인
- 모바일 기본형이 `primary CTA 1개 + share sheet` 구조로 동작하는지 확인
- 온보딩 후 `tab=admin` 딥링크 복귀가 자연스러운지 확인
- `이번 주 아빠 할 일` 3개가 모두 완료됐을 때 대체 항목 재계산 규칙을 확인
- localStorage가 없는 초기 상태/비정상 값에서도 안전하게 기본값으로 복원되는지 확인

## Remaining Risks

- `이번 주 아빠 할 일` 우선순위 규칙은 seed data가 늘어나면 재조정이 필요할 수 있다.
- 모바일에서 `WeeklyActionCard + 탭 + Sticky CTA`가 한 화면에 겹치며 첫 스크롤 부담을 만들 수 있다.
- admin 관련 항목 CTA는 `T-004` 상세 UI가 고정되기 전까지 연결 레벨에서만 검증 가능하다.
