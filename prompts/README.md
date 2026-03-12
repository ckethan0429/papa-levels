# PapaLevel Prompt Templates

이 폴더는 PapaLevel에서 메인 에이전트와 서브에이전트를 호출할 때 바로 복붙해서 쓸 수 있는 프롬프트 템플릿 모음이다.

## 파일 목록

- `/Users/ckahn/Desktop/papa/prompts/main-agent-pm-orchestrator.md`
  메인 에이전트에게 `pm-orchestrator`를 coordinator로 쓰라고 명시하는 템플릿
- `/Users/ckahn/Desktop/papa/prompts/main-agent-pm-orchestrator-team.md`
  메인 에이전트가 `pm-orchestrator`를 쓰고, 병렬 구간은 `$team`으로 처리하게 하는 템플릿
- `/Users/ckahn/Desktop/papa/prompts/main-agent-specialist-direct.md`
  메인 에이전트가 스페셜리스트를 직접 호출하게 하는 템플릿
- `/Users/ckahn/Desktop/papa/prompts/main-agent-frontend-designer-fd.md`
  메인 에이전트가 `frontend-designer`를 직접 호출하고 `fd` 스킬을 사용하게 하는 디자인/개발 수행 단계 템플릿
- `/Users/ckahn/Desktop/papa/prompts/pm-orchestrator-direct.md`
  `pm-orchestrator`에 직접 넣을 때 쓰는 템플릿

## 빠른 선택 규칙

- 단일 산출물:
  `main-agent-specialist-direct.md`
- 디자인/개발 수행 단계:
  `main-agent-frontend-designer-fd.md`
- 순차 다단계:
  `main-agent-pm-orchestrator.md`
- 병렬 + 순차 결합:
  `main-agent-pm-orchestrator-team.md`
- 오케스트레이터에게 직접 맡길 때:
  `pm-orchestrator-direct.md`

## 사용 팁

- 항상 `현재 기준 문서`, `현재 상태`, `이번 턴 목표`, `수정할지/제안만 할지`를 포함하는 편이 좋다.
- 요청이 넓을수록 `pm-orchestrator`를 명시하는 것이 안정적이다.
- 병렬 실행이 필요하면 템플릿 안에 `$team` 사용 지시를 명시한다.
- 디자인/프론트 lane은 `Claude worker`, 구현/검증 lane은 `Codex worker`를 기본값으로 두는 mixed team이 가장 실용적이다.
