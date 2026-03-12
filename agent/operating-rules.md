# PapaLevel 운영 규칙

이 문서는 PapaLevel에서 메인 에이전트, 스페셜리스트 에이전트, `pm-orchestrator`, `$team`을 언제 어떻게 쓰는지 정리한 실무용 규칙이다.

---

## 1. 기본 원칙

- 사용자와 대화하는 상대는 항상 **메인 에이전트**다.
- 메인 에이전트는 요청의 성격에 따라:
  - 스페셜리스트를 직접 호출하거나
  - `pm-orchestrator`를 호출하거나
  - `$team`으로 병렬 실행을 시작한다.
- `pm-orchestrator`는 병렬 실행 엔진이 아니다.
- `$team`은 병렬 실행 엔진이지, PM 단계 설계자가 아니다.

한 줄로 정리하면:

> 메인 에이전트는 창구, 스페셜리스트는 작업자, `pm-orchestrator`는 PM 코디네이터, `$team`은 병렬 실행 런타임이다.

---

## 2. 무엇을 언제 쓰는가

| 상황 | 권장 방식 | 이유 |
|------|-----------|------|
| 단일 산출물 하나만 필요 | 메인 에이전트 → 스페셜리스트 직접 호출 | 가장 단순하고 빠름 |
| 2개 이상 단계가 순차적으로 연결됨 | 메인 에이전트 → `pm-orchestrator` | 단계 순서, handoff, 문서 정합성 관리 |
| 독립적인 작업을 동시에 처리 | 메인 에이전트 또는 `pm-orchestrator` → `$team` | 실제 병렬 실행에 적합 |
| 병렬 조사 후 다시 순차 문서화가 필요 | 메인 에이전트 → `pm-orchestrator`, 필요 구간에서 `$team` 사용 | 병렬 + 합성 + 다음 단계 연결이 모두 필요 |

---

## 3. 단일 작업 규칙

다음처럼 산출물이 하나로 좁혀져 있으면 `pm-orchestrator` 없이 바로 간다.

### 예시

#### 예시 A — PRD만 수정
요청:

```text
v2 PRD에서 예비 아빠 모드 정의만 더 선명하게 다듬어줘.
```

권장 경로:

```text
메인 에이전트 -> PRD Agent
```

이유:
- 단계가 하나다.
- 입력 문서와 출력 문서가 명확하다.
- 다른 스페셜리스트와의 handoff가 거의 필요 없다.

#### 예시 B — UX 플로우만 정리
요청:

```text
퀴즈 결과 화면에서 체크리스트로 이어지는 UX 플로우만 정리해줘.
```

권장 경로:

```text
메인 에이전트 -> UX Flow Agent
```

---

## 4. 순차 작업 규칙

여러 스페셜리스트를 순서대로 불러야 하고, 앞 단계의 결과가 다음 단계 입력이 되는 경우 `pm-orchestrator`가 유리하다.

### 왜 유리한가

`pm-orchestrator`가 있으면 아래를 한 곳에서 관리할 수 있다.

- 지금 어느 단계인지
- 어떤 문서가 기준 문서인지
- 앞 단계 결론이 다음 단계에 어떻게 넘어가는지
- 어떤 결정은 잠궈야 하고 어떤 질문은 아직 열어둘지

### 이 말이 특히 중요한 경우

#### 1. 반복적인 PM 파이프라인

같은 흐름을 여러 번 돌리는 경우다.

예시:

```text
매주
1) 트렌드/유저 조사 업데이트
2) 문제정의 변화 확인
3) PRD 수정 여부 판단
4) 백로그 우선순위 재정렬
```

이 경우 `pm-orchestrator`가 유리한 이유:
- 매번 같은 순서를 다시 판단하지 않아도 된다.
- 조사 결과가 PRD에 반영되었는지 누락 없이 추적하기 쉽다.
- "이번 주에는 문제정의까지, 다음 주에는 PRD까지" 같은 stage control이 가능하다.

#### 2. 단계가 많고 문서 연결이 중요한 경우

예시:

```text
Trend Research
-> User Research
-> Problem Definition
-> PRD
-> UX Flow
-> Task Breakdown
```

이 경우 `pm-orchestrator`가 유리한 이유:
- 리서치에서 나온 결론이 `problem definition`에 반영되었는지 체크한다.
- `problem definition`의 우선순위가 `PRD` 기능 우선순위와 맞는지 확인한다.
- `PRD`에서 정한 범위가 `tasks/` 티켓에 그대로 유지되는지 추적한다.

즉, 문서가 여러 개일수록 단순히 "순서대로 호출"하는 것만으로는 부족하고, **앞 단계 결론이 뒤 문서에 어떻게 연결되는지 관리하는 역할**이 필요하다.

---

## 5. 순차 작업인데도 `pm-orchestrator`가 꼭 필요하지 않은 경우

모든 순차 작업에 `pm-orchestrator`가 필요한 것은 아니다.

### 예시

```text
1) Trend Research 결과를 간단히 요약하고
2) 그걸 바탕으로 Problem Definition 문단 하나만 수정
```

이 정도는 메인 에이전트가 직접 해도 된다.

권장 경로:

```text
메인 에이전트 -> Trend Research Agent -> Problem Definition Agent
```

판단 기준:
- 단계 수가 적다
- 수정 문서 수가 적다
- handoff 규칙이 복잡하지 않다
- 반복 실행할 가능성이 낮다

---

## 6. 병렬 작업 규칙

독립적인 작업을 동시에 돌릴 때는 `$team`을 쓴다.

### 예시 A — 병렬 조사

요청:

```text
Trend Research와 User Research를 동시에 진행하고 싶다.
```

권장 경로:

```text
메인 에이전트 -> $team
```

또는

```text
메인 에이전트 -> pm-orchestrator -> $team
```

둘의 차이:
- 병렬 조사만 하면 되면 메인 에이전트가 바로 `$team`을 써도 충분하다.
- 병렬 조사 후 결과를 합쳐 문제정의/PRD까지 이어가야 하면 `pm-orchestrator`가 그 다음 단계를 관리하는 편이 낫다.

### 예시 B — PapaLevel 실제 시나리오

```text
1) Trend Research와 User Research를 병렬 실행
2) 두 결과를 합쳐 문제정의 업데이트
3) PRD 반영 포인트 정리
4) tasks 백로그 수정 여부 판단
```

권장 경로:

```text
메인 에이전트
-> pm-orchestrator
-> 병렬 구간에서 $team 사용
-> 결과 합성 후 다음 단계 진행
```

핵심:
- `$team`은 1번을 잘한다.
- `pm-orchestrator`는 2, 3, 4를 잘한다.

둘은 중복이라기보다 역할 분담이다.

### Worker CLI 기본값

- 병렬 lane 중 `Frontend Designer`, `fd`, visual draft, UI polish가 중심이면 `Claude worker`를 우선 붙인다.
- 병렬 lane 중 구현 통합, lint/build, regression check, 일반 문서/기획 작업이면 `Codex worker`를 우선 붙인다.
- 섞인 작업은 `OMX_TEAM_WORKER_CLI_MAP`으로 lane별로 나눈다.
- PapaLevel 권장 mixed 예시:

```bash
OMX_TEAM_WORKER_CLI_MAP=claude,codex,codex omx team 3:frontend-designer "<task>"
```

- 해석:
  - worker-1: 디자인 초안/프론트 polish
  - worker-2: 코드 통합
  - worker-3: 검증

---

## 7. 추천 운영 방식

PapaLevel에서는 아래 기준을 기본 운영 규칙으로 쓴다.

### Rule 1

단일 산출물 요청이면 메인 에이전트가 바로 스페셜리스트를 호출한다.

### Rule 2

여러 단계가 순차로 이어지고 결과 handoff가 중요하면 `pm-orchestrator`를 사용한다.

### Rule 3

독립적인 병렬 작업은 `$team`으로 실행한다.

### Rule 4

병렬 작업 뒤에 후속 문서화나 의사결정 단계가 이어지면 `pm-orchestrator`가 병렬 결과를 합성하고 다음 단계로 넘긴다.

### Rule 5

`pm-orchestrator`는 `$team`을 대체하지 않는다.

### Rule 6

`$team`은 `pm-orchestrator`를 대체하지 않는다.

---

## 8. 빠른 의사결정 체크리스트

아래 질문에 답하면 어느 경로를 쓸지 빨리 결정할 수 있다.

1. 산출물이 하나인가?
   - 예: 스페셜리스트 직접 호출
2. 앞 단계 결과가 다음 단계 입력이 되는가?
   - 예: `pm-orchestrator` 고려
3. 독립 작업을 동시에 돌릴 수 있는가?
   - 예: `$team`
4. 병렬 결과를 다시 합쳐 다음 문서까지 이어가야 하는가?
   - 예: `pm-orchestrator + $team`
5. 이 흐름을 반복해서 다시 돌릴 가능성이 큰가?
   - 예: `pm-orchestrator`가 특히 유리

---

## 9. PapaLevel 기본 경로

### 가장 가벼운 경로

```text
메인 에이전트 -> 스페셜리스트
```

### 순차 기획 경로

```text
메인 에이전트 -> pm-orchestrator -> 스페셜리스트들
```

### 병렬 조사 경로

```text
메인 에이전트 -> $team -> 결과 취합
```

### 병렬 + 순차 결합 경로

```text
메인 에이전트
-> pm-orchestrator
-> $team 로 병렬 조사
-> 문제정의/PRD/태스크로 순차 연결
```
