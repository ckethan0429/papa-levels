# T-005 Share System and Send-to-Husband Flows

- Status: `todo`
- Priority: `P0`
- Phase: `MVP Week 2`
- Depends on: `T-003`, `T-004`
- GitHub Issue: [#5](https://github.com/ckethan0429/papa-levels/issues/5)

## Goal

`바이럴 공유`와 `실행 공유`를 분리 구현하고, 엄마가 아빠에게 보내는 시나리오를 최우선으로 만든다.

## Reference Inputs (2026-03-12)

- Checklist flow: [checklist.md](/Users/ckahn/Desktop/papa/research/wireframes/checklist.md)
- Admin flow: [checklist-admin.md](/Users/ckahn/Desktop/papa/research/wireframes/checklist-admin.md)
- Budget flow: [budget.md](/Users/ckahn/Desktop/papa/research/wireframes/budget.md)
- Quiz flow: [quiz.md](/Users/ckahn/Desktop/papa/research/wireframes/quiz.md)
- Copy draft: [korean-copy-v1.md](/Users/ckahn/Desktop/papa/prompts/korean-copy-v1.md)

## Implementation Lock

- 메시지/CTA/정책 안내의 기본 카피 소스는 [korean-copy-v1.md](/Users/ckahn/Desktop/papa/prompts/korean-copy-v1.md)를 우선 참조한다.
- 화면별 공유 맥락은 `/checklist=실행`, `/checklist?tab=admin=긴급 행정`, `/budget=충격 숫자`, `/quiz=유입 훅`으로 구분한다.
- 공유 fallback 시트는 카카오 우선, 이미지 저장, 링크 복사 순서를 유지하고 iOS/Android별 안내문구를 분기한다.

## Component / State Dependencies

### 공통 컴포넌트 후보

- `ShareTriggerButton`
- `StickySendToHusbandBar`
- `ShareFallbackSheet`
- `ShareMessageBuilder`
- `ActionCardSharePreview`

### 상태 모델

- `ShareIntentState`: `surface`, `card_type`, `share_method`, `entry_role`
- `AppContextState`: 공유 링크 생성 시 공용 입력값 참조

## Scope

- 공유 단위 4개 구현
  - 전투력 결과 카드
  - 예산 영수증 카드
  - 이번 주 아빠 할 일 카드
  - 행정 데드라인 카드
- 실행 공유의 기본 포맷을 `카카오톡 링크`로 고정
- `남편에게 보내기` 버튼 및 메시지 템플릿
- 카카오톡 공유 우선 구현
- 이미지 저장 fallback 구현
- UTM 파라미터 규칙 적용
- 공유 링크는 개인 체크 상태를 포함하지 않고 콘텐츠 컨텍스트만 전달
- 카카오 인앱 브라우저 fallback 규칙 정의:
  - Kakao SDK 우선
  - 실패 시 이미지 저장
  - 최종 fallback으로 링크 복사
  - iOS/Android별 안내문구 분기
- 주요 화면 CTA 적용 위치 정의:
  - `/quiz`
  - `/checklist`
  - `/budget`

## Out of Scope

- 인스타/스레드 고급 최적화
- A/B 테스트 자동화
- PDF 생성 고도화

## Deliverables

- 공유 컴포넌트 세트
- 카카오 공유 템플릿
- 메시지 카피 초안
- 공유 UTM 규칙
- share fallback QA note
- route별 CTA/카피 매핑 표

## Acceptance Criteria

- 체크리스트/행정 모듈에서 실행 카드 공유 가능하다.
- 실행 카드 공유는 `카카오톡 링크`가 기본 동작이다.
- 전투력/예산 화면에서 바이럴 카드 공유 가능하다.
- 공유 링크에 엄마 유입/아빠 유입 구분값이 들어간다.
- 공유 링크에 개인 체크 상태나 개인 식별 정보가 포함되지 않는다.
- 카카오 인앱 브라우저에서 공유 실패 시 이미지 저장 또는 링크 복사로 fallback 가능하다.
- [korean-copy-v1.md](/Users/ckahn/Desktop/papa/prompts/korean-copy-v1.md)의 공유 문구와 CTA 문구가 각 화면에 연결된다.
