# Checklist / Admin 구현 준비 스펙

작성일: 2026-03-12  
작성자: worker-3  
대상 티켓: `T-003 Checklist Experience and D-Day Flow`, `T-004 Admin Timeline Module`

## 1. 문서 목적

이 문서는 `/checklist`와 `/checklist?tab=admin` 구현을 시작하기 전에, 이미 잠긴 상위 결정을 다시 해석하지 않고 바로 착수할 수 있도록 공통 입력·상태·컴포넌트·리스크를 한 번에 정리한 kickoff 스펙이다.

- 상위 결정 원본: `tasks/ticket-001-foundation-ia-and-shared-contracts.md`, `docs/adr/001-foundation-ia-and-contracts.md`
- 데이터 계약 원본: `tasks/ticket-002-checklist-data-model-and-content-schema.md`
- 화면 기준: `research/wireframes/checklist.md`, `research/wireframes/checklist-admin.md`
- 콘텐츠 입력 기준: `docs/content/checklist-input-guide.md`
- seed data: `content/checklist/items.json`, `content/policy/benefits.json`

## 2. 이번 단계에서 잠겨 있는 결정 (validated facts)

### 2-1. 라우트 / 진입 구조

- 핵심 라우트는 `/`, `/quiz`, `/checklist`, `/budget` 4개만 유지한다.
- 행정 타임라인은 독립 라우트가 아니라 `/checklist?tab=admin` 또는 `#admin`이 가리키는 동일 모듈이다.
- `/checklist` 첫 진입 기본 흐름은 `온보딩 입력 시트 -> Context Summary Bar -> D-Day + 이번 주 아빠 할 일 + 진행률 -> 4축 탭 -> 항목 리스트`다.
- `/checklist?tab=admin` 첫 진입 기본 흐름은 `Context Summary Bar -> 4축 탭(admin 활성) -> 원스톱 추천 순서 -> 마감 임박 카드 -> 행정 타임라인`이다.

### 2-2. 공용 입력값 / 상태 계약

`/checklist`와 `admin` 탭은 아래 공용 입력값을 반드시 재사용한다.

| 키 | 설명 |
|---|---|
| `delivery_status` | `pregnant | born` |
| `base_date` | 출산 예정일 또는 출산일 |
| `region` | 거주 지역 |
| `dual_income` | 맞벌이 여부 |

- 단, MVP 첫 구현에서는 `region` 필드 계약은 유지하되 실제 값/노출은 `한국` 고정으로 시작한다.

추가 구현 상태는 아래 두 덩어리로 나눈다.

| 상태 묶음 | 목적 |
|---|---|
| `ChecklistProgressState` | 체크 상태, 진행률, 현재 추천 섹션 |
| `WeeklyActionState` | 이번 주 아빠 할 일 3개 계산 결과 |
| `AdminDeadlineState` | `due_offset_days` 기반 마감 임박/지남 계산 |
| `ShareIntentState` | 카드 공유 surface, fallback 분기 |

### 2-3. 탭 / 섹션 구조

- 4축 탭은 `prepare`, `center`, `home`, `admin` 순서로 고정한다.
- `admin`은 별도 제품이 아니라 체크리스트 내부 4번째 탭이다.
- `/checklist` 기본 화면에서는 `D-Day 계산 결과`에 따라 추천 섹션을 우선 노출하되, 탭 구조 자체는 변하지 않는다.

### 2-4. 공통 CTA 원칙

- 하단 고정 CTA `남편에게 보내기`는 checklist/admin 모두 유지한다.
- 공유 기본 우선순위는 `카카오톡 링크 -> 이미지 저장 -> 링크 복사`다.
- 모바일 기본형은 `남편에게 보내기` primary CTA 1개만 노출하고, 세부 fallback은 share sheet 내부에서 처리한다.
- checklist/admin 화면 하단에는 `safe-area + CTA 높이`만큼의 예약 여백을 둔다.
- 체크리스트 핵심 액션은 `체크`, `이번 주 아빠 할 일 확인`, `행정 탭 이동`, `남편에게 보내기` 4개로 제한한다.
- admin 핵심 액션은 `원스톱 순서 확인`, `마감 임박 확인`, `공식 채널 이동`, `남편에게 보내기`다.

## 3. 화면별 구현 블록 정렬

### 3-1. `/checklist`

1. 온보딩 입력 시트(입력값 없을 때만)
2. `ContextSummaryBar`
3. `DdayProgressHeader`
4. `WeeklyActionCard`
5. `ChecklistTabBar`
6. 섹션 헤더 + `ChecklistItemCard` 리스트
7. `StickySendToHusbandBar`

### 3-2. `/checklist?tab=admin`

1. `ContextSummaryBar`
2. `ChecklistTabBar` (`admin` 활성)
3. `AdminPriorityCard`
4. `DeadlineAlertCard`
5. `AdminTimelineItemCard` 리스트
6. 행정 데드라인 공유 블록
7. `StickySendToHusbandBar`

## 4. 컴포넌트 책임 경계

### 4-1. 공통 재사용 컴포넌트

| 컴포넌트 | checklist | admin | 비고 |
|---|---|---|---|
| `ContextSummaryBar` | 사용 | 사용 | 입력값 수정 진입점 공통 |
| `ChecklistTabBar` | 사용 | 사용 | 탭과 딥링크 상태 동기화 |
| `StickySendToHusbandBar` | 사용 | 사용 | 문구만 맥락형으로 분기 |

### 4-2. checklist 전용

| 컴포넌트 | 책임 |
|---|---|
| `DdayProgressHeader` | D-Day, 기준일, 진행률 요약 |
| `WeeklyActionCard` | 이번 주 우선 할 일 3개 노출 |
| `ChecklistItemCard` | 일반 항목 체크/펼침/구매/공유 |

### 4-3. admin 전용

| 컴포넌트 | 책임 |
|---|---|
| `AdminPriorityCard` | 출생신고 -> 행복출산 -> 첫만남이용권 등 추천 순서 고정 노출 |
| `DeadlineAlertCard` | `due_offset_days` 기준 임박 항목 요약 |
| `AdminTimelineItemCard` | 행정/지원금 상세, 채널, 금액, 메타데이터 노출 |
| `PolicyMetaNotice` | `region_notice`, `effective_date`, `verified_at`, `region_scope` 묶음 노출 |

## 5. 데이터 연결 규칙

### 5-1. checklist 데이터 소스

- 기본 항목 리스트 소스: `content/checklist/items.json`
- 섹션별 seed 최소 세트는 이미 준비되어 있다.
- `admin` 성격 항목이 checklist seed에도 섞여 있으므로, `/checklist`에서는 `deeplink_target: "/checklist?tab=admin"`을 가진 항목을 `행정 탭 이동 유도`에 활용할 수 있다.

### 5-2. admin 데이터 소스

- 정책/지원금 카드 기본 소스: `content/policy/benefits.json`
- `admin` 탭 상세 카드에는 아래 메타데이터가 모두 들어갈 수 있어야 한다.

| 필드 | 용도 |
|---|---|
| `due_offset_days` | D-day 상대 마감 계산 |
| `benefit_amount_label` | 금액/혜택 라벨 |
| `application_channel` | 신청 채널 |
| `source` | 운영 출처 |
| `effective_date` | 기준일 |
| `verified_at` | 최종 검수일 |
| `region_scope` | 전국/서울/지역 단위 구분 |
| `region_notice` | 지역 차이 안내 |

- MVP 첫 구현 사용자 노출 기준은 `region_scope = national` 우선이다.
- `seoul`, `local:*`, `local:pending` 항목은 후속 정책 운영 규칙이 정해질 때까지 기본 리스트에서 제외하거나 내부 확인용으로만 유지한다.

### 5-3. 체크 / 진행률 / 탭 동기화

- 체크 상태는 `/checklist`와 `admin` 탭에서 같은 로컬 저장소를 사용한다.
- `admin` 항목도 동일한 체크 모델에 포함하되, 진행률 계산 시 전체 기준/섹션 기준 어느 방식인지 구현 단계에서 명시가 필요하다.
- 딥링크 진입 시 탭 상태가 URL과 동기화되어야 하며, 입력값이 없으면 온보딩 후 원래 탭으로 복귀해야 한다.

## 6. 계산 규칙 초안

### 6-1. D-Day 기반 추천 섹션

| 조건 | 기본 추천 섹션 |
|---|---|
| `D <= -1` | `prepare` |
| `D = 0 ~ 13` | `center` |
| `D = 14 ~ 30` | `home` |
| 직접 딥링크 진입 | `admin` 우선 |

> 경계값은 `T-003`과 동일하게 해석한다. 즉 `D+14`는 `center`가 아니라 `home` 진입 시점이다.
> 위 구간은 wireframe과 티켓 문구를 합친 구현 준비용 분기다. 상위 구조 변경이 아니라 기본 탭 추천 규칙 정리다.

### 6-2. admin 마감 상태 버킷

| 상태 | 규칙 |
|---|---|
| `upcoming` | 남은 일수 `>= 8` |
| `deadline_soon` | 남은 일수 `0 ~ 7` |
| `due_today` | 남은 일수 `0` |
| `overdue` | 남은 일수 `< 0` |

추가 노출 문구 기준:

- `D+N 마감` 또는 `D-N 마감` 형식 유지
- 남은 일수는 `N일 남음` 또는 `기한 지남`으로 보조 표시
- `DeadlineAlertCard`는 `deadline_soon`, `due_today`, `overdue`만 우선 노출

## 7. seed data 기준 구현 우선순위

### 7-1. checklist 우선 항목

- `prepare-docs-ready`
- `prepare-gov24-check`
- `center-birth-registration-window`
- `home-night-shift`

이 4개는 각각 준비/조리원/행정 연결/퇴소 후 대표 역할을 하므로, 첫 UI 검증용 fixture로 적합하다.

### 7-2. admin 우선 항목

- `benefit-birth-registration`
- `benefit-happy-birth-one-stop`
- `benefit-first-meeting-voucher`
- `benefit-postpartum-helper-support`

위 4개로 `추천 순서`, `마감 임박`, `전국 공통`, `지역 변수` 케이스를 모두 검증할 수 있다.

## 8. 구현 전 확인해야 할 데이터 품질 상태

### 8-1. validated facts

- `content/checklist/items.json`에 4축 최소 seed가 존재한다.
- `content/policy/benefits.json`에 admin 메타데이터 필드가 이미 포함되어 있다.
- `docs/content/checklist-input-guide.md`가 `region_notice`, `effective_date`, `verified_at`, `region_scope` 입력 규칙을 고정했다.
- wireframe이 checklist/admin의 상단 블록 순서를 이미 확정했다.

### 8-2. working assumptions

- `content/policy/benefits.json`의 일부 항목은 `status: working_assumption`이라 실제 운영 전 검수 UI 또는 내부 표시 규칙이 필요할 수 있다.
- checklist와 admin의 체크 완료율을 하나의 progress로 합칠지, 화면별 progress를 둘지 아직 구현 선택이 남아 있다.
- `#admin` hash와 `?tab=admin` query를 동시에 허용할 때 우선순위는 `query > hash`로 처리하는 편이 안전하다.
- `region` 필드는 이후 지역 확장을 위해 유지하되, MVP에서는 `한국` 고정값으로 저장/표시하는 편이 구현 복잡도를 가장 낮춘다.

### 8-3. open questions

- `benefit-local-birth-grant`는 `status: open_question` 상태라 배포용 기본 리스트에 바로 노출하면 안 된다.
- 모바일에서 `StickySendToHusbandBar`가 체크 조작/탭 조작을 가리지 않게 하는 최소 높이와 숨김 규칙은 UI 구현 중 실측이 필요하다.

## 9. 작업 분리 기준

### 9-1. T-003이 바로 가져가야 하는 것

- `ContextSummaryBar`, `DdayProgressHeader`, `WeeklyActionCard`, `ChecklistTabBar`, `ChecklistItemCard`, `StickySendToHusbandBar`
- D-Day 추천 섹션 계산
- 로컬 체크 상태 및 진행률
- admin 탭 이동 딥링크 유지

### 9-2. T-004가 바로 가져가야 하는 것

- `ContextSummaryBar` 재사용
- `AdminPriorityCard`, `DeadlineAlertCard`, `AdminTimelineItemCard`, `PolicyMetaNotice`
- `content/policy/benefits.json` 기반 메타데이터 노출

### 9-3. 바로 구현할 UI 권장안

- `StickySendToHusbandBar`는 모바일 기본형에서 단일 primary CTA만 노출한다.
- `Kakao 공유 / 이미지 저장 / 링크 복사`는 하단 바가 아니라 `ShareFallbackSheet` 내부 액션으로 이동한다.
- `PageFrame` 또는 route wrapper에 하단 예약 여백을 추가해 마지막 카드와 CTA가 겹치지 않게 한다.
- 카드 확장/온보딩 시트가 열려 있을 때도 CTA가 입력/탭 조작을 가리지 않는지 소형 화면 기준으로 먼저 확인한다.
- `due_offset_days` 기반 마감 버킷 계산
- `?tab=admin`, `#admin` 진입 동기화

### 9-3. 공유 영역 경계

- 공통 상태 계약과 탭 규칙은 공유하되, 화면 상세 레이아웃 파일은 분리한다.
- `ContextSummaryBar`, `ChecklistTabBar`, `StickySendToHusbandBar`는 공통 컴포넌트로 추상화하더라도, checklist/admin 화면 조립 코드는 분리 유지가 안전하다.
- `PolicyMetaNotice`는 admin 전용으로 두고 checklist 카드에는 끌고 오지 않는다.

## 10. QA / 검증 포인트

### 10-1. checklist

- 입력값이 없는 최초 진입 시 온보딩 시트가 먼저 뜬다.
- 입력 완료 후 현재 시점 섹션과 이번 주 할 일이 즉시 보인다.
- 1개 이상 체크하면 진행률과 로컬 저장이 갱신된다.
- admin 딥링크로 이동 후 돌아와도 입력값/체크 상태가 유지된다.

### 10-2. admin

- `/checklist?tab=admin` 직접 진입 시 admin 탭이 즉시 활성화된다.
- 정책 카드마다 `지역 안내문구 -> 기준일 -> 최종 검수일 -> 지역 범위`를 노출할 수 있다.
- `due_offset_days` 기준으로 `임박`, `오늘`, `지남`이 올바르게 계산된다.
- 카카오 인앱 브라우저에서도 딥링크 fallback이 깨지지 않도록 별도 QA 대상에 넣는다.

## 11. Acceptance Evidence Sync (2026-03-19)

이 섹션은 kickoff 스펙 자체를 바꾸는 것이 아니라, closeout 이후 현재 저장소 구현이 어디까지 상위 스펙을 따라왔는지와 왜 `T-003`, `T-004`를 로컬 문서 기준 `done`으로 볼 수 있는지 증거 기반으로 정리한다.

### 11-1. validated facts

- `/checklist`는 `ChecklistExperienceLoader -> ChecklistExperienceClient` 구조로 분리되어, 온보딩 입력 / localStorage 복원 / D-Day 추천 섹션 / weekly actions 계산을 화면에 연결한다.
- `lib/checklist-domain.ts`가 `content/checklist/items.json` 기반 selector, D-Day 계산, 추천 섹션, weekly actions 계산을 제공한다.
- `lib/papa-context.ts`, `lib/checklist-storage.ts`가 checklist/admin 공용 입력값과 localStorage 키 계약을 구현한다.
- `components/papa/share-dock.tsx`는 모바일 기본형 `single primary CTA + share sheet` 패턴을 구현하고, `components/papa/checklist-item-card.tsx`는 실제 체크 상태를 props로 받는 구조로 바뀌었다.
- `lib/admin-timeline-domain.ts`가 `content/policy/benefits.json` 기반 national filter, `due_offset_days` deadline bucket, metadata mapping을 제공한다.
- `components/papa/admin-timeline-card.tsx`는 정책 메타데이터와 legacy `DeadlineItem` 호환 표시를 모두 처리한다.

### 11-2. working assumptions

- checklist/admin의 핵심 acceptance는 현재 main 구현으로 충족됐다고 본다.
- 따라서 남은 리스크는 T-003/T-004 자체보다 `공유`, `계측`, `launch QA` follow-up에 더 가깝다.

### 11-3. open questions / carry-forward items

- `T-005`: 실제 Kakao SDK 공유, 이미지 저장, 링크 복사 fallback, share payload 정리
- `T-008`: checklist/admin CTA와 share 이벤트 GA4 연결
- `T-010`: 카카오 인앱 브라우저, `?tab=admin` / `#admin`, mobile sticky CTA 실기기 QA

### 11-4. QA carry-forward notes

- 경계값 QA: `D-30`, `D-Day`, `D+14`, `D+30`
- 딥링크 QA: `?tab=admin`, `#admin`, 온보딩 후 admin 복귀
- 레이아웃 QA: small viewport에서 `ShareDock`가 탭/체크 조작을 가리지 않는지
- 데이터 QA: `national`만 노출되는지, seed/data contract 직결 후 메타데이터 순서가 유지되는지
- 정책성 UI QA: `social proof`가 사용자 노출에서 빠지고 운영 메타데이터로만 남는지

## 12. 현재 readiness 판단

### readiness 변화

- `T-003`은 route integration, state/storage 복원, checklist seed 연결, weekly action 계산까지 main에 반영되어 로컬 문서 기준 `done`이다.
- `T-004`는 admin seed selector, national filter, deadline bucket, metadata card surface까지 main에 반영되어 로컬 문서 기준 `done`이다.
- 두 티켓 모두 상위 결정 미정으로 막히는 상태는 아니다. 남은 리스크는 follow-up ticket으로 이동한다.

### 남은 리스크

1. 실제 공유 fallback과 Kakao 인앱 브라우저 동작은 아직 미검증
2. analytics wiring이 없어 launch 기준 행동 데이터가 비어 있음
3. sticky CTA와 admin 딥링크는 실기기 QA에서 추가 확인이 필요함

## 13. 참고 파일 경로

- `docs/implementation/checklist-admin-ready-spec.md`
- `tasks/ticket-003-checklist-experience-and-d-day-flow.md`
- `tasks/ticket-004-admin-timeline-module.md`
- `research/wireframes/checklist.md`
- `research/wireframes/checklist-admin.md`
- `docs/content/checklist-input-guide.md`
- `content/checklist/items.json`
- `content/policy/benefits.json`
