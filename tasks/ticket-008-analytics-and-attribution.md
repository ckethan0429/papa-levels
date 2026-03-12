# T-008 Analytics and Attribution

- Status: `todo`
- Priority: `P0`
- Phase: `MVP Week 3~4`
- Depends on: `T-003`, `T-004`, `T-005`, `T-006`, `T-007`

## Goal

v2 PRD의 핵심 가설을 검증할 수 있도록 이벤트 계측과 유입 구분을 구현한다.

## Scope

- GA4 이벤트 구현
- UTM 규칙 적용
- MVP 핵심 이벤트:
  - quiz_start, quiz_complete, quiz_share
  - budget_start, budget_complete, budget_share
  - checklist_check, checklist_share
  - admin_timeline_view, admin_timeline_share
  - action_card_share
  - cta_click
  - affiliate_click
  - send_to_husband_click
- 간단한 KPI 대시보드 정의
- 공통 이벤트 파라미터 정의:
  - route
  - content_type
  - share_target
  - dday_bucket
  - entry_role
- Phase 2 dormant 이벤트 문서화:
  - pack_paywall_view, pack_cta_click
  - checkout_start, purchase_complete

## Out of Scope

- 고급 데이터 웨어하우스
- 마케팅 자동화
- Mixpanel 구현

## Deliverables

- 이벤트 스키마 문서
- 클라이언트 계측 구현
- 초기 KPI 뷰 정의
- UTM / entry_role 규칙 문서
- dormant 이벤트 note

## Acceptance Criteria

- MVP KPI 항목이 모두 측정 가능하다.
- 엄마 유입과 아빠 유입을 `UTM + entry_role` 규칙으로 구분 가능하다.
- `T-003 ~ T-007`의 주요 액션이 공통 파라미터와 함께 수집된다.
- `pack_* / checkout_*` 이벤트는 MVP 필수 구현이 아니라 dormant spec으로 분리된다.
