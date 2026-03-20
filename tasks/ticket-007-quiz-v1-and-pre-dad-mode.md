# T-007 Quiz v1 and Pre-Dad Mode

- Status: `doing`
- Priority: `P1`
- Phase: `MVP Week 3`
- Depends on: `T-001`
- GitHub Issue: [#7](https://github.com/ckethan0429/papa-levels/issues/7)

## Goal

전투력 측정기를 얇고 빠른 유입 훅으로 구현하되, 미출산 사용자를 위한 `예비 아빠 모드`를 포함한다.

## Reference Inputs (2026-03-12)

- Wireframe: [quiz.md](/Users/ckahn/Desktop/papa/research/wireframes/quiz.md)
- Copy draft: [korean-copy-v1.md](/Users/ckahn/Desktop/papa/prompts/korean-copy-v1.md)

## Implementation Lock

- `/quiz`는 `랜딩 -> 5문항 -> 결과 -> 실행 도구 전환` 흐름을 기준으로 한다.
- 미출산 응답 3개 이상이면 `예비 아빠 모드`로 분기하고, 낮은 등급 낙인 없이 체크리스트/행정/예산 CTA로 연결한다.
- 퍼센타일/비교형 social proof는 금지하고, 필요하면 총 사용량 카운트만 옵션으로 검토한다.
- 결과 카드의 레이더 차트와 이미지 생성은 구현/QA 리스크로 분리 관리한다.

## Component / State Dependencies

### 공통 컴포넌트 후보

- `QuizQuestionStepper`
- `QuizChoiceCard`
- `QuizResultCard`
- `QuizResultShareCard`
- `StickySendToHusbandBar`

### 상태 모델

- `QuizDraftState`: 답변, 점수, 등급, 예비 아빠 모드 여부
- `ShareIntentState`: 퀴즈 결과 공유 상태

## Scope

- 5문항 퀴즈 UI
- 점수 계산과 결과 카드 생성
- 예비 아빠 모드 분기
- 등급 노출 규칙 정의 및 퍼센타일 비노출 처리
- 결과 화면 CTA:
  - 이번 주 아빠 할 일
  - 행정 타임라인
  - 예산 시뮬레이터

## Out of Scope

- 복잡한 소셜 기능
- 개인 프로필 저장

## Deliverables

- `/quiz` MVP 화면
- 결과 카드 이미지
- 예비 아빠 모드 카피
- 결과 화면 CTA 매핑 기준

## Acceptance Criteria

- 미출산 응답이 많은 사용자는 낮은 등급 낙인 없이 별도 결과를 받음
- 결과 화면에서 실행 도구로 자연스럽게 이동 가능
- 공유용 카드가 카카오/이미지 저장 기준으로 동작함
- MVP에서는 `상위 X%` 같은 퍼센타일 문구를 노출하지 않는다.
- [quiz.md](/Users/ckahn/Desktop/papa/research/wireframes/quiz.md)의 화면 흐름과 CTA 우선순위가 구현 기준으로 연결된다.

## Closeout Prep (2026-03-19)

### 검증된 사실

- 1차 구현 기준 반영 파일:
  - `app/quiz/page.tsx`
  - `lib/quiz-domain.ts`
  - `components/papa/quiz-question-stepper.tsx`
  - `components/papa/quiz-choice-card.tsx`
  - `components/papa/quiz-result-panel.tsx`
  - `components/papa/result-card-surface.tsx`
- 현재 `/quiz`는 `intro -> 5문항 -> pre-dad gate -> result` 흐름으로 연결된다.
- 예비 아빠 모드는 `미출산 응답 3개 이상` 기준으로 분기한다.
- 퍼센타일 비교형 카피는 제거되었고, 결과 CTA는 checklist/admin/budget 3개로 연결된다.
- 2026-03-19 로컬 검증 기준 `npm run lint`, `npm run build`가 통과했다.

### 작업 가설

- 현재 구현은 유입 훅으로서 충분한 골격을 갖췄고, 이후 계측/QA에서 레이더 차트 없이도 MVP 검증은 가능하다.
- copy tone과 D등급 거부감 검증은 `T-010` QA에서 실제 공유 맥락으로 한 번 더 보는 편이 안전하다.

### 미해결 질문

- 총 사용자 수 카피(`3,421명`)를 실제 계측값으로 바꿀지, 고정 데모 문구로 둘지 결정이 필요하다.
- 레이더 차트/이미지 생성 고도화는 계속 `Phase 2 or QA risk`로 둘지 확정이 필요하다.

### Next Handoff

- 다음 연결 티켓은 `T-008 Analytics and Attribution`, `T-010 Launch QA and Release Checklist`다.
- `quiz_start`, `quiz_complete`, `quiz_share`, `cta_click` 이벤트를 `T-008`에서 우선 연결한다.
