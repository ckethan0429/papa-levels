---
name: fd
description: Use this skill when the user asks for frontend UI design, screen scaffolding, component polish, responsive fixes, accessibility hardening, truncation/overflow cleanup, or frontend finishing work. Do not use for backend-only work or pure API tasks.
---

You are the frontend-finishing skill.

Use this skill for frontend-facing work where the output needs to look polished and hold up in production, especially on mobile.

## Workflow

1. Understand the requested screen and locate the relevant app routes/components.
2. Read `references/ui-standards.md` for the local finishing quality bar.
3. Generate a first-pass aesthetic draft by running:
   `scripts/run-claude-draft.sh "<concise spec>"`
   - By default, do not bound Claude turns.
   - Set `CLAUDE_MAX_TURNS` only when you intentionally want a short smoke test.
   - If the current worker itself is a Claude worker in team mode, you may draft directly in-session instead of nesting another Claude call.
4. Review the generated code or design draft and improve it for:
   - truncation / overflow
   - responsive layout
   - semantic HTML
   - keyboard accessibility
   - ARIA where needed
   - loading / empty / error states
   - simple, production-ready logic
5. Run lint, tests, and build checks where available.
6. If tests are missing and the repo already has a UI test pattern, add focused UI tests for the changed behavior.
7. Summarize what changed and any remaining risks.

## Guardrails

- No layout breakage on narrow screens.
- Buttons and inputs must be keyboard reachable.
- Long text must not destroy layout.
- Prefer existing design system/components if present.
- Avoid overengineering and unrelated refactors.
- If the first-pass Claude draft conflicts with the local codebase style, adapt it instead of forcing it in as-is.

## When To Skip The Draft Script

You may skip `scripts/run-claude-draft.sh` only when:

- the request is a tiny surgical fix,
- there is no frontend code or no concrete screen target yet,
- or the environment does not have a working `claude` command.
- or the current worker is already a Claude worker and the draft can be produced directly in-session without needing a separate script artifact.

If you skip it, say why briefly and continue with the same finishing standards.

## Smoke Test Example

For a quick health check, prefer a short spec and keep turn limits optional.

```bash
env CLAUDE_OUTPUT_FORMAT=json \
scripts/run-claude-draft.sh \
'Create a simple responsive login form with email input, password input, remember-me checkbox, forgot-password link, and one primary submit button. Return a compact draft.'
```

Why this is the preferred smoke test:

- `CLAUDE_OUTPUT_FORMAT=json` makes completion easier to detect in automation.
- If you need to bound cost or runtime, set `CLAUDE_MAX_TURNS` explicitly for that run only.
- The login form spec is small but exercises layout, form controls, and CTA structure.
