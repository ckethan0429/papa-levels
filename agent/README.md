# PapaLevel Multi-Agent Playbook

이 디렉터리는 PapaLevel MVP PM 워크플로를 역할별 서브에이전트로 분리한 운영 문서다.

운영 판단 기준은 `/Users/ckahn/Desktop/papa/agent/operating-rules.md`를 우선 참고한다.

## 에이전트 맵

| Agent | File | 핵심 질문 | 주요 산출물 |
|------|------|-----------|-------------|
| PM Orchestrator Agent | `/Users/ckahn/Desktop/papa/agent/pm-orchestrator-agent.md` | 지금 어떤 순서와 기준으로 다음 단계를 진행할 것인가? | 단계별 실행 계획, handoff, 전체 상태표 |
| Trend Research Agent | `/Users/ckahn/Desktop/papa/agent/trend-research-agent.md` | 시장/경쟁/콘텐츠/플랫폼에서 무슨 변화가 있나? | 시장/경쟁/바이럴 인사이트 |
| User Research Agent | `/Users/ckahn/Desktop/papa/agent/user-research-agent.md` | 실제 아빠/엄마는 무엇을 힘들어하고 어떻게 행동하나? | 페르소나, 페인포인트, 행동 인사이트 |
| Problem Definition Agent | `/Users/ckahn/Desktop/papa/agent/problem-definition-agent.md` | 그래서 우리가 진짜 풀어야 하는 문제는 무엇인가? | 문제정의 문서, 문제 우선순위, POV |
| PRD Agent | `/Users/ckahn/Desktop/papa/agent/prd-agent.md` | 어떤 제품을 어떤 범위까지 만들 것인가? | PRD, 기능 범위, 성공지표 |
| UX Flow Agent | `/Users/ckahn/Desktop/papa/agent/ux-flow-agent.md` | 사용자는 어떤 화면과 흐름으로 목표를 달성하는가? | IA, 화면 목록, 주요 플로우 |
| Tech Stack Agent | `/Users/ckahn/Desktop/papa/agent/tech-stack-agent.md` | 이 범위를 가장 현실적으로 구현하는 기술 방향은 무엇인가? | 기술 방향 메모, 아키텍처, 위험요인 |
| Frontend Designer Agent | `/Users/ckahn/Desktop/papa/agent/frontend-designer-agent.md` | UX/Tech 결과를 실제 프론트엔드 화면과 컴포넌트로 어떻게 번역할 것인가? | UI 명세, 컴포넌트 구조, 구현안 |
| Task Breakdown Agent | `/Users/ckahn/Desktop/papa/agent/task-breakdown-agent.md` | 구현 가능한 티켓 단위로 어떻게 쪼갤 것인가? | MVP 백로그, 티켓, 선행관계 |
| QA / Release Readiness Agent | `/Users/ckahn/Desktop/papa/agent/qa-release-readiness-agent.md` | 지금 릴리즈해도 되는가? 무엇을 더 검증해야 하는가? | QA 매트릭스, 릴리즈 체크리스트, go/no-go |

## 권장 흐름

```text
1. PM Orchestrator
   -> Trend Research + User Research (병렬)
2. PM Orchestrator synthesis gate
3. Problem Definition
4. PRD
5. UX Flow + Tech Stack (병렬 가능)
6. Frontend Designer (선택, 화면/구현 구체화 필요시)
7. Task Breakdown
8. QA / Release Readiness
```

## 병렬화 규칙

- `Trend Research`와 `User Research`는 서로 독립된 탐색 작업이라 병렬 실행한다.
- `UX Flow`와 `Tech Stack`은 PRD가 잠긴 뒤 병렬 실행할 수 있다.
- `Frontend Designer`는 보통 `UX Flow`와 `Tech Stack` 이후에 호출한다.
- `Task Breakdown`은 `PRD`, `UX`, `Tech`가 모두 정리된 뒤 실행한다.
- `QA / Release Readiness`는 구현 범위와 계측 포인트가 잠긴 뒤 실행한다.

## Team Worker Routing

- `Frontend Designer`나 `fd` 스킬이 중심인 디자인 초안/프론트 polish lane은 `Claude worker`를 우선 사용한다.
- 기존 코드 통합, lint/build, 회귀 확인, 문서/기획 단계는 기본적으로 `Codex worker`를 우선 사용한다.
- 디자인 + 구현이 섞인 병렬 실행은 `mixed team`을 권장한다.
- 실무 기본 예시:
  - 디자인 lane 1개 + 구현/검증 lane 2개
  - `OMX_TEAM_WORKER_CLI_MAP=claude,codex,codex omx team 3:frontend-designer "..."`
- 중요한 점:
  - `N:agent-type`는 역할 프롬프트를 고르는 값이고
  - `OMX_TEAM_WORKER_CLI` 또는 `OMX_TEAM_WORKER_CLI_MAP`가 실제 worker CLI를 고른다.

## 단계별 입출력 계약

| Stage | 필수 입력 | 출력 | 다음 단계 |
|------|-----------|------|----------|
| Research | 제품 가설, 시장 컨텍스트 | 트렌드/유저 리서치 요약 | Problem Definition |
| Problem Definition | 리서치 결과, 창업자 컨텍스트 | 핵심 문제, 타겟, 우선순위, non-goal | PRD |
| PRD | 문제정의 문서 | 기능 범위, 성공지표, acceptance 수준 요구사항 | UX / Tech |
| UX | PRD | 화면 구조, 흐름, edge case | Task Breakdown |
| Tech | PRD, UX 주요 흐름 | 기술 방향, 데이터/서비스 경계, 구현 위험 | Task Breakdown |
| Task Breakdown | PRD, UX, Tech | 티켓, 의존성, 일정 순서 | Engineering / QA |
| QA | PRD, 백로그, 구현 상태 | QA 체크리스트, 버그/리스크, launch gate | Release |

## 오케스트레이터 규칙

- 각 단계 시작 전에 `입력 문서`, `이번 단계의 결정 범위`, `출력 형식`을 먼저 잠근다.
- 하위 단계가 상위 단계의 결정을 뒤집으려면 반드시 `새로운 증거` 또는 `치명적 구현 제약`을 제시해야 한다.
- 모든 산출물은 `검증된 사실`, `가설`, `미해결 질문`을 분리한다.
- 사람이 읽는 문서는 한국어 기준으로 정리하고, 필요한 경우만 영어 용어를 병기한다.

## 실제 Codex 연결

- 프로젝트 로컬 Codex 에이전트 설정은 `/Users/ckahn/Desktop/papa/.codex/config.toml`에 등록했다.
- 역할별 실행 설정은 `/Users/ckahn/Desktop/papa/.codex/agents/*.toml`에 있다.
- 기존의 리서치 문서는 사람용 상세 명세이고, `.codex/agents/*.toml`은 Codex가 실제로 호출할 실행용 지시문이다.

## 샘플 오케스트레이터 요청

```text
PapaLevel MVP PM 워크플로를 시작하세요.
1) Trend Research와 User Research를 병렬로 돌려 핵심 발견사항을 요약하고
2) 그 결과로 Problem Definition을 업데이트한 뒤
3) MVP PRD, UX 초안, 기술 방향, 개발 태스크, QA 체크까지 이어서 정리하세요.

현재 기준 문서는 /Users/ckahn/Desktop/papa/prd/v2-papalevel-prd.md 입니다.
이미 있는 내용을 덮어쓰지 말고, 필요한 변경만 제안하거나 반영하세요.
```
