# Main Agent -> Frontend Designer + fd Skill

```text
이 요청은 PapaLevel의 디자인/개발 수행 단계 작업입니다.
`frontend-designer` specialist를 직접 호출하고, 로컬 스킬 `/Users/ckahn/Desktop/papa/.agents/skills/fd/SKILL.md`를 사용하세요.

현재 기준 문서:
- /Users/ckahn/Desktop/papa/prd/v2-papalevel-prd.md
- /Users/ckahn/Desktop/papa/agent/ux-flow-agent.md
- /Users/ckahn/Desktop/papa/agent/tech-stack-agent.md
- /Users/ckahn/Desktop/papa/.agents/skills/fd/SKILL.md

현재 상태:
- UX Flow와 Tech Stack의 큰 방향은 정해졌음
- 지금은 실제 화면 구조, 컴포넌트 분해, responsive/a11y/overflow 품질 보강이 필요한 단계임
- 프론트엔드 코드가 있으면 기존 패턴을 존중해야 함

이번 요청:
1. 현재 화면/컴포넌트 대상을 파악
2. `fd` 스킬 workflow를 사용해 first-pass draft를 생성
3. 그 결과를 기준으로 responsive, accessibility, truncation/overflow, semantic HTML, 상태 처리를 보강
4. 필요하면 실제 프론트엔드 구현안 또는 수정안까지 제안

이번 턴 산출물:
- 화면 구조
- 컴포넌트 제안
- UI 리스크 / 개선 포인트
- 필요 시 구현안

작업 원칙:
- 모바일 우선
- 카카오 공유/OG/결과 카드 같은 PapaLevel 맥락 반영
- 기존 디자인 시스템/컴포넌트가 있으면 우선 활용
- 관련 없는 리팩터링 금지

team 실행 원칙:
- `$team`을 쓸 때 `frontend-designer` 또는 `fd` 중심 lane은 `Claude worker`를 우선 사용
- 코드 통합, lint/build, verification lane은 `Codex worker`를 우선 사용
- mixed team 기본 예시:
  - `OMX_TEAM_WORKER_CLI_MAP=claude,codex,codex omx team 3:frontend-designer "<task>"`
- 디자인 lane만 단독으로 돌리면:
  - `OMX_TEAM_WORKER_CLI=claude omx team 1:frontend-designer "<task>"`

Smoke test가 필요하면 아래 방식 사용:
- `env CLAUDE_OUTPUT_FORMAT=json scripts/run-claude-draft.sh '<spec>'`
- turn 제한이 필요할 때만 `CLAUDE_MAX_TURNS=<n>`을 명시
```
