# T-005 Share System and Send-to-Husband Flows

- Status: `doing`
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

## Closeout Prep (2026-03-19)

### 검증된 사실

- 1차 구현 기준 반영 파일:
  - `lib/share-domain.ts`
  - `components/papa/share-dock.tsx`
  - `components/papa/checklist-experience-client.tsx`
  - `components/papa/checklist-item-card.tsx`
  - `components/papa/admin-timeline-card.tsx`
  - `app/page.tsx`
  - `app/quiz/page.tsx`
  - `app/budget/page.tsx`
- share URL에는 `utm_source`, `utm_medium`, `utm_campaign`, `entry_role`, `surface`, `card_type`만 담고 개인 체크 상태는 넣지 않는다.
- fallback 순서는 `Kakao SDK -> 이미지 저장 -> 링크 복사`로 유지한다.
- checklist/admin/budget/quiz에서 route 또는 card 단위 share intent를 모두 만들 수 있다.
- 2026-03-19 로컬 검증 기준 `npm run lint`, `npm run build`가 통과했다.

### 작업 가설

- 현재 구현은 `T-008 Analytics`에서 `surface`, `card_type`, `entry_role` 이벤트 파라미터를 바로 이어 붙이기 쉬운 형태다.
- `T-005`를 `done`으로 닫기 전에 실기기 Kakao in-app QA와 env/domain 설정을 먼저 잠그는 편이 안전하다.
- copy polish는 일부 남아 있지만 blocker보다는 QA closeout 항목에 가깝다.

### 미해결 질문

- `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY`가 실제 배포/staging 환경에 언제 주입되는가?
- Kakao Product Link의 `Web domain` 등록 범위를 `papalevel.com`, staging domain까지 어디까지 열 것인가?
- iOS Kakao in-app에서 링크 복사 우선 안내가 실제로 가장 안정적인지 실기기 확인이 필요하다.

### T-005 Closeout Checklist

#### 1) Env / Kakao Console

- [ ] `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY`를 배포/staging 환경에 설정
- [ ] Kakao Developers의 JavaScript key / SDK domain 등록 확인
- [ ] Kakao Developers `Product Link > Web domain`에 실제 공유 링크 도메인 등록
- [ ] staging domain을 별도 검증할지 결정

참고:
- Getting started: https://developers.kakao.com/docs/latest/en/javascript/getting-started
- Security guideline: https://developers.kakao.com/docs/latest/en/getting-started/security-guideline
- Kakao Talk Share JS: https://developers.kakao.com/docs/latest/ko/kakaotalk-share/js-link

#### 2) Manual QA

- [ ] `/`에서 첫 공유 시나리오 sheet open / share action 확인
- [ ] `/checklist`에서 이번 주 할 일 공유 확인
- [ ] `/checklist` item-level `남편에게 보내기` 확인
- [ ] `/checklist?tab=admin` 행정 데드라인 공유 확인
- [ ] `/budget` 결과 공유 CTA 확인
- [ ] `/quiz` 결과 공유 CTA 확인
- [ ] 공유 URL에 개인 체크 상태가 없는지 확인
- [ ] `entry_role=mom|dad` 전환에 따라 share text / URL이 바뀌는지 확인

#### 3) Kakao In-App Browser QA

- [ ] Android Kakao in-app: Kakao share 기본 동작 확인
- [ ] Android Kakao in-app: Kakao 실패 시 이미지 저장 / 링크 복사 fallback 확인
- [ ] iOS Kakao in-app: 링크 복사 우선 안내 노출 확인
- [ ] iOS Kakao in-app: 이미지 저장 보조 fallback 확인

#### 4) Done Gate

- [ ] Kakao key/domain 설정 완료
- [ ] iOS/Android 실기기 QA 최소 1회씩 완료
- [ ] share URL 검토표 작성
- [ ] `T-008` analytics wiring handoff 준비

### Next Handoff

- 다음 연결 티켓은 `T-008 Analytics and Attribution`이다.
- `T-008`에서 우선 붙일 파라미터는 `surface`, `card_type`, `entry_role`, `share_method`, `target_route`다.
- `send_to_husband_click`, `action_card_share`, `cta_click`을 `T-005` share surface 기준으로 연결한다.
