# AGENTS.md - PapaLevel

> Operating guide for AI agents working in this repository.

## Project Overview

PapaLevel is a documentation-first MVP planning workspace with an early application scaffold.

- Current state: product planning documents, research notes, backlog tickets, ADRs, implementation specs, and an initial Next.js app scaffold are present.
- Current focus: keep `research -> problem definition -> PRD -> UX draft -> tech direction -> task breakdown -> QA` connected while turning already-locked decisions into implementation-ready artifacts.
- Product thesis: PapaLevel is an execution tool for fathers around `D-30 ~ D+30`, and a "send-to-husband" switch for mothers.
- Current source-of-truth product doc: `/Users/ckahn/Desktop/papa/prd/v2-papalevel-prd.md`

This repository is still primarily driven by Markdown artifacts, but it already includes a non-trivial product scaffold under `app/`, `components/`, `content/`, `docs/`, and `lib/`. Treat product/planning docs as the decision source of truth and the current app scaffold as an implementation consumer of those decisions.

## Canonical Files

- `/Users/ckahn/Desktop/papa/prd/v2-papalevel-prd.md`
  Current product source of truth.
- `/Users/ckahn/Desktop/papa/agent/README.md`
  Multi-agent workflow map and handoff model.
- `/Users/ckahn/Desktop/papa/tasks/README.md`
  Ticket format and backlog rules.
- `/Users/ckahn/Desktop/papa/tasks/mvp-backlog.md`
  Current implementation order and dependencies.
- `/Users/ckahn/Desktop/papa/research/papalevel-research-history.md`
  Research history and evidence log.
- `/Users/ckahn/Desktop/papa/docs/adr/001-foundation-ia-and-contracts.md`
  Accepted foundation IA, route, D-Day, event, and share fallback decisions.
- `/Users/ckahn/Desktop/papa/docs/implementation/checklist-admin-ready-spec.md`
  Checklist/admin implementation kickoff spec for `T-003`, `T-004`.

## Repo Layout

```text
AGENTS.md                  Project-level orchestration rules
.agents/skills/fd/         Local frontend finishing skill
app/                       Next.js App Router scaffold
agent/                     Human-readable agent specifications
.codex/config.toml         Project-local Codex multi-agent registry
.codex/agents/*.toml       Executable agent definitions
components/                PapaLevel UI components
content/                   Checklist/policy seed data
docs/                      ADRs, implementation specs, content guides
lib/                       Shared app data/utilities
prd/                       Problem definition and PRD docs
research/                  Research notes and evidence summaries
tasks/                     MVP backlog and ticket drafts
```

## Current Stage Snapshot

- As of `2026-03-19`, upstream PM stages are largely locked in documents.
- `T-001`, `T-002` have document/artifact evidence in `docs/adr/001-foundation-ia-and-contracts.md`, `content/checklist/items.json`, `content/policy/benefits.json`, and `docs/content/checklist-input-guide.md`.
- Current execution stage is best treated as `frontend implementation prep`, with `T-003`, `T-004` being the next implementation-ready tickets.
- If any task/ticket header conflicts with accepted ADR/spec artifacts, sync the task documents instead of silently treating older headers as authoritative.

## Working Rules

- Default writing language is Korean.
- Use English only for established product or technical terms when it improves precision.
- Separate `validated facts`, `working assumptions`, and `open questions`.
- Do not invent market data, user quotes, or metrics.
- When using external or time-sensitive information, cite sources and dates.
- Prefer updating the current canonical doc over creating duplicate versions.
- Do not rewrite or downgrade the core product thesis without new evidence or an explicit user instruction.
- Preserve version-history notes already present in PRD/problem-definition docs.

## Team Execution Guardrails

- `$team`은 `tmux 안에서 실행 중인 실제 에이전트 leader pane`이 있을 때만 사용한다.
- detached tmux session 안에서 `omx team ...; exec zsh`처럼 `shell leader`를 만드는 방식은 금지한다.
- `$team` 실행 전 leader workspace는 반드시 clean 상태여야 한다.
- dirty workspace라면:
  - 먼저 main workspace에서 정리 가능한 변경을 정리하거나
  - clean snapshot/worktree를 만든 뒤
  - 그 안에서 다시 `tmux + agent leader` 조건을 만족시켜 실행한다.
- `$team` launch prompt는 긴 prose 한 문단으로 쓰지 말고, worker별 ownership이 드러나는 numbered task 형식으로 고정한다.
- `$team` 시작 직후 아래 3가지를 확인하기 전에는 실행 성공으로 간주하지 않는다:
  - worker pane이 실제 agent prompt를 넘어 inbox를 읽기 시작했는지
  - `leader-fixed` mailbox에 startup ACK가 들어왔는지
  - `task-*.json` 상태가 `pending -> in_progress`로 전이했는지
- 이 머신에서 첫 `$team` 시도는 `Claude worker` 또는 1-worker smoke로 launch path를 먼저 검증한 뒤 확장하는 것을 권장한다.
- 위 3개 중 하나라도 실패하면 해당 런은 abort하고, broken team을 shutdown/cleanup한 뒤 다시 띄운다.

## Local Skills

- `fd`
  Path: `/Users/ckahn/Desktop/papa/.agents/skills/fd/SKILL.md`
  Use for frontend UI design, screen scaffolding, component polish, responsive fixes, accessibility hardening, truncation/overflow cleanup, and frontend finishing work.
  The `frontend-designer` specialist should use this skill by default for frontend-facing implementation/design tasks in this project.

## Document Editing Rules

- `prd/` documents:
  Update in place when refining the current thesis.
  If a new version is necessary, explain why a new file is better than updating the current one.
- `tasks/` documents:
  Follow `/Users/ckahn/Desktop/papa/tasks/README.md` exactly.
  Keep `Goal`, `Scope`, `Out of Scope`, `Deliverables`, `Acceptance Criteria`.
- `agent/` documents:
  Treat them as role contracts.
  Keep responsibilities, boundaries, inputs, outputs, and prompt templates explicit.

## Primary Routing Rules

When a request spans multiple PM stages, the main agent should treat `pm-orchestrator` as the top-level endpoint.

Use `/Users/ckahn/Desktop/papa/.codex/config.toml` and its registered agents as the project-local execution map.

### Route to `pm-orchestrator` when the user asks for:

- end-to-end PM workflow execution
- coordination across two or more stages
- research synthesis followed by downstream planning
- "figure out the next step" or "run the full flow"
- multi-agent planning or orchestration itself

### Route directly to a specialist agent when the request is narrow:

- `trend-research`
  Market trends, competitors, viral patterns, category scans
- `user-research`
  User pain points, behaviors, segmentation, WTP, community review analysis
- `problem-definition`
  Sharp problem framing, problem priority, POV, anti-goals
- `prd`
  MVP scope, feature roles, success metrics, open questions
- `ux-flow`
  IA, flow design, screen list, branch logic, UX risks
- `tech-stack`
  MVP stack choice, architecture boundaries, data/schema notes, platform risks
- `frontend-designer`
  Implementable frontend UI structure, component design, responsive layout, accessibility, oh-my-codex designer-style frontend work
- `task-breakdown`
  Backlog design, ticket creation, sequencing, acceptance criteria
- `qa-release-readiness`
  Launch checklist, blockers, QA matrix, go/no-go

## Orchestration Rules

- Default flow:
  `Trend Research + User Research -> Problem Definition -> PRD -> UX Flow + Tech Stack -> Task Breakdown -> QA / Release Readiness`
- Parallelize only independent work:
  `Trend Research` and `User Research`
  `UX Flow` and `Tech Stack`
- Do not skip problem definition before PRD.
- Do not skip PRD before UX or task breakdown.
- Do not let downstream stages silently redefine upstream decisions.
- If a downstream stage finds a critical contradiction, surface it explicitly and send it back upstream.

## Prompt Interpretation Rules For The Main Agent

- If the user prompt is broad, first identify:
  current stage, target deliverable, source-of-truth file, and whether edits or proposal-only output are desired.
- If the user prompt is broad and ambiguous, still prefer starting with `pm-orchestrator` instead of directly calling multiple specialists ad hoc.
- If the user asks for only one artifact, keep routing narrow and avoid unnecessary orchestration.
- If the user asks to "continue the flow", continue from the latest completed stage shown in the repo docs.

## Output Expectations

For planning artifacts, prefer outputs that can be pasted back into the repo with minimal cleanup.

Useful output shapes:
- synthesis notes
- problem definition sections
- PRD sections
- IA / flow tables
- backlog tables
- ticket drafts
- QA checklists

## What Good Work Looks Like Here

- Research changes product decisions rather than sitting as a separate note.
- Problem statements are concrete and time-bounded.
- PRD scope is tighter after analysis, not broader.
- UX focuses on action-driving flows rather than passive information pages.
- Tech decisions are MVP-realistic.
- Tickets are implementation-ready.
- QA includes mobile browser, Kakao in-app browser, sharing, analytics, and policy-data checks.

## Quick Start For Agents

If the user asks for PapaLevel PM work and does not specify an agent:

1. Read `/Users/ckahn/Desktop/papa/agent/README.md`
2. Read `/Users/ckahn/Desktop/papa/prd/v2-papalevel-prd.md`
3. Decide whether the request is:
   a narrow single-stage task, or
   a multi-stage orchestration task
4. Use `pm-orchestrator` for multi-stage work
5. Keep outputs aligned to the current repo documents
