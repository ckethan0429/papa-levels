# T-003 Checklist Experience and D-Day Flow

- Status: `todo`
- Priority: `P0`
- Phase: `MVP Week 2`
- Depends on: `T-001`, `T-002`

## Goal

사용자가 출산(예정)일을 입력하면 자신의 시점에 맞는 체크리스트와 할 일을 바로 볼 수 있게 만든다.

## Reference Inputs (2026-03-12)

- Wireframe: [checklist.md](/Users/ckahn/Desktop/papa/research/wireframes/checklist.md)
- Deep link reference: [checklist-admin.md](/Users/ckahn/Desktop/papa/research/wireframes/checklist-admin.md)
- Copy draft: [korean-copy-v1.md](/Users/ckahn/Desktop/papa/prompts/korean-copy-v1.md)

## Implementation Lock

- `/checklist` 첫 진입은 `온보딩 입력 시트 -> Context Summary Bar -> D-Day + 이번 주 아빠 할 일 + 진행률` 흐름을 기준으로 한다.
- 공용 입력값은 상단 요약 바에서 수정 가능해야 하며, `delivery_status`, `base_date`, `region`, `dual_income`를 재사용한다.
- 핵심 액션은 `체크`, `이번 주 아빠 할 일 확인`, `행정 탭 이동`, `남편에게 보내기` 4개로 단순화한다.
- `남편에게 보내기` 하단 고정 CTA는 유지하되, 모바일 소형 화면에서 탭/체크 조작을 가리지 않도록 QA 대상에 포함한다.

## Component / State Dependencies

### 공통 컴포넌트 후보

- `ContextSummaryBar`
- `DdayProgressHeader`
- `WeeklyActionCard`
- `ChecklistTabBar`
- `ChecklistItemCard`
- `StickySendToHusbandBar`

### 상태 모델

- `AppContextState`: `delivery_status`, `base_date`, `region`, `dual_income`
- `ChecklistProgressState`: 체크 상태, 진행률, 현재 추천 섹션
- `WeeklyActionState`: 이번 주 할 일 3개 계산 결과

## Scope

- 출산 예정일/출산일 입력 플로우
- 공용 입력값 수집:
  - 출산 상태 (`pregnant` / `born`)
  - 출산 예정일 또는 출산일
  - 거주 지역
  - 맞벌이 여부
- D-Day 기준 현재 섹션 우선 노출
- 4축 탭 UI
- 체크 상태 로컬 저장
- 완료율 계산
- `이번 주 아빠 할 일 3가지` 추출 로직
- 체크리스트 항목 상세 UI
- `/checklist?tab=admin` 딥링크 진입과 복귀 흐름 반영
- `남편에게 보내기` CTA가 들어갈 위치 정의

## Out of Scope

- 로그인/계정 연동
- 고급 개인화 추천
- 기기 간 상태 동기화

## Deliverables

- `/checklist` MVP 화면
- D-Day 계산 기반 우선순위 노출
- 로컬 저장 구현
- action card 생성에 필요한 상태/데이터 연결
- 기본 deep link 진입 규칙
- wireframe 기준 레이아웃 반영 메모

## Acceptance Criteria

- 사용자가 날짜 입력 후 바로 본인 시점에 맞는 섹션을 본다.
- `delivery_status`와 `base_date`에 따라 기본 탭 또는 추천 섹션이 일관되게 계산된다.
- 최소 1개 항목을 체크하면 진행률이 갱신되고 로컬에 유지된다.
- `이번 주 아빠 할 일` 카드 생성에 필요한 데이터가 준비된다.
- `/checklist?tab=admin`으로 진입해도 공용 입력값과 로컬 상태가 유지된다.
- [checklist.md](/Users/ckahn/Desktop/papa/research/wireframes/checklist.md)의 정보 구조와 CTA 우선순위가 구현 기준으로 연결된다.
