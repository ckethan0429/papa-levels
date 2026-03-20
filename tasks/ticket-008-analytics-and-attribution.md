# T-008 Analytics and Attribution

- Status: `todo`
- Priority: `P0`
- Phase: `MVP Week 3~4`
- Depends on: `T-003`, `T-004`, `T-005`, `T-006`, `T-007`
- GitHub Issue: [#8](https://github.com/ckethan0429/papa-levels/issues/8)

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

## T-005 Handoff (2026-03-19)

### 검증된 사실

- `T-005` 1차 구현에서 share contract가 `lib/share-domain.ts`로 정리되었다.
- 현재 share surface는 `/`, `/checklist`, `/checklist?tab=admin`, `/budget`, `/quiz`에 연결되어 있다.
- share URL에는 `utm_source`, `utm_medium`, `utm_campaign`, `entry_role`, `surface`, `card_type`만 포함되고 개인 체크 상태는 포함하지 않는다.
- 현재 share intent 수준에서 바로 읽을 수 있는 핵심 파라미터는 `surface`, `card_type`, `entry_role`이다.

### 작업 가설

- `T-008`은 share action부터 먼저 계측해도 KPI 해석력이 크게 오른다.
- checklist/admin/budget/quiz 전체에 공통 event helper를 넣고 route별 context만 주입하는 편이 재작업이 적다.

### 우선 연결 이벤트

- `send_to_husband_click`
  - trigger: share sheet 내부에서 `카카오톡으로 보내기`, `이미지로 저장하기`, `링크 복사` 중 하나를 누른 시점
  - params: `surface`, `card_type`, `share_method`, `entry_role`
- `action_card_share`
  - trigger: action unit share가 실제로 시도된 시점
  - params: `surface`, `card_type`, `share_target`, `entry_role`
- `cta_click`
  - trigger: cross-route CTA (`/quiz -> /checklist`, `/budget -> /checklist?tab=admin` 등)
  - params: `source_surface`, `target_route`, `cta_name`, `entry_role?`

### 구현 우선순위

1. 공통 analytics helper 추가
2. `ShareDock` action click 계측
3. checklist/admin CTA 계측
4. budget/quiz/result CTA 계측
5. DebugView 검증 및 이벤트 표 보강

### 미해결 질문

- `action_card_share`와 `send_to_husband_click`를 완전히 분리 집계할지, 일부 share action에서 동시 발화할지 정해야 한다.
- `share_target`를 `husband`, `self`, `generic` 중 어떤 enum으로 잠글지 정해야 한다.
