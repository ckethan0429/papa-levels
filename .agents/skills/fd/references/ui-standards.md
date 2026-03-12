# Frontend UI Standards

Use this reference after the first draft and before finalizing frontend changes.

## Layout

- Design mobile-first, then widen gracefully.
- Prevent horizontal scrolling on narrow screens.
- Keep primary actions visible without hunting.
- Use consistent spacing rhythm inside cards, sections, and form groups.

## Text and Overflow

- Long titles, labels, and user-generated text must wrap or clamp safely.
- Avoid fixed-width layouts that collapse with Korean or mixed-language strings.
- Buttons should not expand unpredictably from long labels.
- Prefer explicit overflow handling over hoping content stays short.

## Semantics and Accessibility

- Use semantic elements first: `main`, `section`, `header`, `nav`, `button`, `label`.
- Every interactive control must be keyboard reachable.
- Use ARIA only when semantic HTML is not enough.
- Preserve visible focus styles.
- Link labels and form controls properly.

## States

- Important UI should define loading, empty, error, and success states.
- Empty states should explain what to do next.
- Error states should be visible and actionable.
- Skeletons/spinners should not cause layout jumps.

## Component Quality

- Prefer existing components or patterns if they already solve the problem.
- Keep component boundaries simple and readable.
- Avoid introducing a heavy abstraction for one screen.
- Refactor only when it directly improves maintainability of the changed UI.

## PapaLevel-Specific Reminders

- Mobile usage is primary.
- Kakao/share surfaces and result-card layouts need extra care.
- CTA hierarchy matters more than decorative density.
- Information should feel actionable, not merely informative.
