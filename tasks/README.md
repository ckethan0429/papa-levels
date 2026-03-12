# PapaLevel Tasks

## 목적

- 이 폴더는 PRD를 실제 구현 단위로 쪼갠 작업 티켓 모음이다.
- 현재 기준 문서는 [v2 PRD](/Users/ckahn/Desktop/papa/prd/v2-papalevel-prd.md)다.
- 티켓은 로컬 문서형 백로그로 관리하고, 확정 후 GitHub Issues로 옮길 수 있다.

## 파일 규칙

- `mvp-backlog.md`: 전체 우선순위, 선행관계, 순서
- `ticket-###-*.md`: 개별 실행 티켓

## 상태 규칙

- `todo`: 시작 전
- `doing`: 진행 중
- `blocked`: 외부 결정/데이터 대기
- `done`: 완료

## 권장 운영

- 구현 전: 티켓의 범위와 완료조건을 먼저 잠근다.
- 구현 중: PR 하나당 티켓 하나를 기본으로 한다.
- 구현 후: 완료조건과 계측 이벤트까지 같이 검수한다.
