# T-010 Launch QA and Release Checklist

- Status: `todo`
- Priority: `P1`
- Phase: `MVP Week 4`
- Depends on: `T-003`, `T-004`, `T-005`, `T-006`, `T-007`, `T-008`, `T-009`
- GitHub Issue: [#10](https://github.com/ckethan0429/papa-levels/issues/10)

## Goal

카카오 인앱 브라우저 중심의 실제 런칭 조건을 점검하고 배포 가능한 상태로 만든다.

## Scope

- 모바일 브라우저 QA
- 카카오 인앱 브라우저 QA
- 공유 링크/OG 이미지 QA
- 이미지 저장 / 링크 복사 fallback QA
- 카카오 인앱 브라우저 iOS/Android 분기 안내 QA
- D-Day 계산 검증
- 정책 데이터 기준일 검증
- 이벤트 수집 검증
- 로컬 저장 및 재진입 검증
- deep link (`/checklist?tab=admin`) 검증
- 릴리즈 체크리스트 작성

## Out of Scope

- 대규모 성능 테스트
- 다국어 지원

## Deliverables

- 릴리즈 체크리스트
- QA 버그 리스트
- 배포 기준 문서
- 브라우저별 QA 매트릭스
- GA4 DebugView 또는 동등 검증 로그
- implementation prep 리스크 반영 메모

## Acceptance Criteria

- 핵심 3개 화면(`/quiz`, `/checklist`, `/budget`)과 `/checklist?tab=admin`이 모바일에서 정상 동작한다.
- 공유 링크, OG, 이미지 저장 fallback이 깨지지 않는다.
- 카카오 인앱 브라우저에서 `남편에게 보내기` 플로우가 fallback 포함 기준으로 동작한다.
- 주요 이벤트가 GA4 실데이터 또는 DebugView에서 수집되는 것이 확인된다.
- D-Day 경계값과 정책 데이터 기준일/검수일 노출이 확인된다.

## QA Lock (2026-03-11)

### 검증된 사실

- 핵심 경험은 `/checklist`이며, 행정 타임라인은 `/checklist?tab=admin`으로 운영한다.
- `엄마 -> 아빠 전달`이 최우선 공유 시나리오다.
- 공유 fallback 순서는 `Kakao SDK -> 이미지 저장 -> 링크 복사`다.
- 분석 기준은 `GA4 + UTM + entry_role`이다.
- 실행 공유의 기본 포맷은 `카카오톡 링크`다.
- 카카오 인앱 브라우저 fallback 안내는 iOS/Android 분기 기준으로 검수한다.
- 사회적 증거 UI는 MVP 범위에서 제외한다.

### 작업 가설

- 본 티켓은 실행 QA 이전에 `launch gate`와 `evidence requirements`를 잠그는 목적을 가진다.
- 카카오 인앱 브라우저, D-Day 경계값, 정책 데이터 기준일, GA4 DebugView가 MVP launch risk의 핵심 축이다.

### Frontend Prep Risks (2026-03-12)

- `/checklist`의 `남편에게 보내기` 하단 고정 CTA가 소형 화면에서 체크 조작과 탭 전환을 가릴 수 있다.
- `/checklist?tab=admin`의 `지역 안내문구 + 기준일/최종 검수일` 메타데이터가 모바일 카드에서 과밀해질 수 있다.
- `/budget` Step 2는 카테고리 길이로 인해 과도한 스크롤이 생길 수 있다.
- `/quiz` 결과 화면의 레이더 차트와 html2canvas 기반 카드 생성 성능 검증이 필요하다.
- `D등급` 공유 카피와 카카오 메시지 길이는 실기기 검증 전까지 확정 카피로 보지 않는다.

### 미해결 질문

- 없음. 위 항목은 2026-03-12 결정사항을 기준으로 고정한다.

## Launch Gates

| Gate | Pass Criteria | Required Evidence |
|------|---------------|-------------------|
| Core Routes | `/quiz`, `/checklist`, `/budget`, `/checklist?tab=admin`가 모바일에서 정상 동작 | 실기기 캡처 또는 영상 |
| Kakao In-App Browser | 카카오 인앱 브라우저에서 진입/공유/fallback과 OS별 안내 분기가 동작 | iOS/Android 각 1건 이상 영상 |
| Share Fallback | Kakao SDK 실패 시 이미지 저장, 최종적으로 링크 복사 가능 | 실패 유도 시나리오 캡처 |
| D-Day Boundaries | `D-30`, `D-Day`, `D+14`, `D+30`, `D+60`, `D+90` 계산이 일관됨 | 경계값 테스트 시트 |
| Policy Metadata | 정책 항목에 `source`, `effective_date`, `verified_at`, `region_scope`와 지역 안내문구가 노출 | 샘플 데이터와 화면 캡처 |
| GA4 DebugView | 핵심 이벤트와 `entry_role` 파라미터 수집 확인 | DebugView 스크린샷 |
| Non-Personalized Share | 공유 링크에 개인 체크 상태나 개인 식별 정보가 없다 | 공유 URL 검토표 |

## Required Evidence Before Go

- 모바일 브라우저별 핵심 플로우 캡처
- 카카오 인앱 브라우저 캡처
- 공유 fallback 증빙
- D-Day 경계값 테스트 결과
- 정책 데이터 샘플 + 검수 로그
- GA4 DebugView 로그
- OG 프리뷰 캡처
- 공유 URL 검토표

## Go / No-Go Rule

- 위 Launch Gates가 모두 pass 되기 전에는 `No-Go`
- 다음 항목은 blocker가 아니라 post-launch 최적화 항목으로 분리한다:
  - 인스타/스레드 고급 최적화
  - PDF 생성 고도화
  - 대규모 성능 테스트
