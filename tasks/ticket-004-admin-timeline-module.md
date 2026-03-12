# T-004 Admin Timeline Module

- Status: `todo`
- Priority: `P0`
- Phase: `MVP Week 2`
- Depends on: `T-001`, `T-002`

## Goal

체크리스트 내부에서 `행정/지원금 마스터 타임라인`을 독립된 탭/모듈로 제공한다.

## Reference Inputs (2026-03-12)

- Wireframe: [checklist-admin.md](/Users/ckahn/Desktop/papa/research/wireframes/checklist-admin.md)
- Parent flow: [checklist.md](/Users/ckahn/Desktop/papa/research/wireframes/checklist.md)
- Copy draft: [korean-copy-v1.md](/Users/ckahn/Desktop/papa/prompts/korean-copy-v1.md)

## Implementation Lock

- 상단 우선 블록은 `원스톱 추천 순서 -> 마감 임박 카드 -> 행정/지원금 리스트` 순서를 기준으로 한다.
- 정책 메타데이터는 `지역 안내문구 -> 기준일 -> 최종 검수일 -> 지역 범위` 순서로 노출하는 것을 기본안으로 둔다.
- 모바일 카드 과밀을 피하기 위해 `안내문구 + 메타데이터`는 한 묶음 컴포넌트로 재사용 가능해야 한다.

## Component / State Dependencies

### 공통 컴포넌트 후보

- `ContextSummaryBar`
- `AdminPriorityCard`
- `DeadlineAlertCard`
- `AdminTimelineItemCard`
- `PolicyMetaNotice`
- `StickySendToHusbandBar`

### 상태 모델

- `AppContextState`: checklist와 동일 입력값 재사용
- `AdminDeadlineState`: `due_offset_days` 기반 마감 임박/지남 계산
- `ShareIntentState`: 행정 데드라인 카드 공유 surface 상태

## Scope

- `admin` 탭 또는 딥링크 모듈 구현
- 항목 노출 필드:
  - 기한
  - 금액
  - 처리 방법
  - 아빠 코멘트
  - 기준일
  - 최종 검수일
  - 지역 범위
- `지역에 따라 달라질 수 있음` 안내문구와 일반 기준 노출 규칙
- 추천 순서 블록 구현
- 기한 임박 항목 강조
- 액션 카드 생성용 데이터 노출
- `due_offset_days` 기반 상대일 계산
- `D-Day`, `D-7`, `마감 임박`, `지남` 상태 규칙 정의

## Out of Scope

- 실제 정부 사이트 연동
- 알림 푸시

## Deliverables

- 행정 타임라인 모듈 UI
- 정책 메타데이터 표기
- 딥링크 규칙
- 기한 계산 규칙 문서
- action card 재사용 데이터 구조
- wireframe 기준 블록 우선순위 반영 메모

## Acceptance Criteria

- `/checklist?tab=admin`과 `#admin`이 동일 모듈을 가리키는 구현 기준으로 문서화된다.
- `/checklist` 내부에서 행정 타임라인에 바로 접근 가능하다.
- 정책 항목마다 `effective_date`, `verified_at`, `region_scope`를 표시할 수 있다.
- 지역별 차이가 있는 항목에는 안내문구와 일반 기준이 함께 노출된다.
- `due_offset_days` 기준으로 기한 임박/지남 상태가 계산된다.
- 액션 카드/공유에 재사용 가능한 형태로 데이터가 정리된다.
- [checklist-admin.md](/Users/ckahn/Desktop/papa/research/wireframes/checklist-admin.md)의 상단 블록 순서와 CTA 위치가 구현 기준으로 연결된다.
