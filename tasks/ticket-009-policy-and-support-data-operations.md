# T-009 Policy and Support Data Operations

- Status: `todo`
- Priority: `P1`
- Phase: `MVP Week 3~4`
- Depends on: `T-002`, `T-004`, `T-006`
- GitHub Issue: [#9](https://github.com/ckethan0429/papa-levels/issues/9)

## Goal

정책과 지원금 데이터가 PRD와 실제 제품에서 빠르게 낡지 않도록 운영 구조를 만든다.

## Scope

- 정책 항목 데이터 포맷 정리
- 필수 메타데이터:
  - source
  - effective_date
  - verified_at
  - region_scope
- 검수 주기 문서화
- 업데이트 체크리스트 작성
- 지역별 지원금 데이터 입력 방식 정의
- `지역에 따라 달라질 수 있음` 안내문구와 일반 기준 노출 규칙 정의

## Out of Scope

- 자동 크롤러 구축
- CMS 전체 도입

## Deliverables

- 정책 데이터 운영 가이드
- 검수 체크리스트
- 최소 지역 데이터 셋

## Acceptance Criteria

- 정책 수치가 바뀌어도 수정 위치가 명확함
- 행정/지원금 항목에 기준일과 검수일을 붙일 수 있음
- 예산 시뮬레이터와 행정 타임라인이 동일 데이터 기준을 사용함
- 지역별 상세 데이터가 없어도 안내문구 + 일반 기준으로 우선 운영 가능하다.
