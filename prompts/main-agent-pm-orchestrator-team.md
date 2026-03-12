# Main Agent -> PM Orchestrator + Team

```text
이 요청은 PapaLevel의 multi-stage PM orchestration 작업입니다.
`pm-orchestrator`를 coordinator로 사용하고, 병렬 가능한 단계는 `$team`을 사용하세요. 최대 5명으로 병렬 작업하세요.

현재 기준 문서:
- /Users/ckahn/Desktop/papa/prd/v2-papalevel-prd.md
- /Users/ckahn/Desktop/papa/tasks/mvp-backlog.md
- /Users/ckahn/Desktop/papa/agent/README.md
- /Users/ckahn/Desktop/papa/agent/operating-rules.md

현재 상태:
- [예: 트렌드/유저 리서치를 병렬로 다시 돌리고 싶음]
- [예: 그 결과를 문제정의와 PRD까지 연결해야 함]

이번 요청:
1. 병렬 가능한 조사/분석 작업은 `$team`으로 실행
2. 결과를 합쳐 핵심 발견사항을 정리
3. 필요하면 Problem Definition, PRD, backlog까지 순차 반영

이번 턴 산출물:
- 병렬 작업 결과 요약
- 합성된 결정 사항
- 수정이 필요한 문서 목록
- Next Handoff

운영 원칙:
- `$team`은 병렬 실행에만 사용
- 병렬 결과 합성과 다음 단계 연결은 `pm-orchestrator`가 담당
- 기존 백로그와 문서 흐름을 기준으로 판단
```
