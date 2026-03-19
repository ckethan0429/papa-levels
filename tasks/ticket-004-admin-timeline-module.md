# T-004 Admin Timeline Module

- Status: `todo`
- Priority: `P0`
- Phase: `MVP Week 2`
- Depends on: `T-001`, `T-002`
- GitHub Issue: [#4](https://github.com/ckethan0429/papa-levels/issues/4)

## Goal

체크리스트 내부에서 `행정/지원금 마스터 타임라인`을 독립된 탭/모듈로 제공한다.

## Lock Proposal

### 검증된 사실

- `/checklist?tab=admin`이 행정 타임라인 단일 진입 기준이며, `/admin` 독립 라우트는 없다. (ADR-001 고정)
- `#admin` 앵커와 `/checklist?tab=admin` URL 파라미터는 동일 모듈을 가리키는 것으로 문서화한다.
- 화면 블록 순서는 `원스톱 추천 순서 카드 → 마감 임박 카드 → 행정 타임라인 리스트` 고정이다. (Implementation Lock)
- 정책 항목마다 `지역에 따라 달라질 수 있습니다` 안내문구 + `effective_date(기준일)` + `verified_at(최종 검수일)` + `region_scope`를 필수 노출한다. (T-002 계약 상속)
- `AppContextState`(`delivery_status`, `base_date`, `region`, `dual_income`)는 `/checklist` 탭과 동일 저장값을 재사용한다.
- MVP 첫 구현에서는 `region` 계약은 유지하되 사용자 입력/분기는 `한국` 고정값으로 처리한다.
- `due_offset_days` 기준 상대일 계산을 절대 날짜 하드코딩보다 우선 적용한다. (ADR-001 § 5-4)
- 하단 고정 CTA는 `행정 마감 남편에게 보내기`로 고정한다. (korean-copy-v1.md § 3-3)
- 하단 고정 CTA는 모바일에서 `primary CTA 1개 + share sheet` 구조를 기본안으로 사용한다.
- 사회적 증거(아빠 N%가 체크 등)는 MVP에서 노출하지 않는다.
- 공유 fallback 순서는 `Kakao SDK → 이미지 저장 → 링크 복사`이며 iOS/Android 분기를 포함한다. (ADR-001 § 5-7)

### 작업 가설

- `PolicyMetaNotice`는 안내문구 + `기준일` + `최종 검수일` 세 요소를 묶은 재사용 컴포넌트로 구현하면 카드 과밀을 최소화할 수 있다.
- 마감 임박 판별은 `deadline_bucket` enum(`d_day`, `d_7`, `imminent`, `passed`, `none`)으로 일원화하면 뱃지 렌더링과 GA4 파라미터를 동시에 처리할 수 있다.
- 원스톱 추천 순서 카드는 정적 콘텐츠로 처리하고, 동적 마감 임박 카드만 `AdminDeadlineState`에서 실시간 계산한다.
- `ShareIntentState`에 `surface=admin_timeline`과 `card_type=deadline_card`를 명시하면 T-005 공유 시스템과 계약 충돌 없이 연결된다.

### 미해결 질문

- 카카오 인앱 브라우저에서 `?tab=admin` 딥링크 fallback 동작은 실기기 QA 전까지 열어둔다. (T-010 QA 대상)

## Reference Inputs (2026-03-12)

- Wireframe: [checklist-admin.md](/Users/ckahn/Desktop/papa/research/wireframes/checklist-admin.md)
- Parent flow: [checklist.md](/Users/ckahn/Desktop/papa/research/wireframes/checklist.md)
- Copy draft: [korean-copy-v1.md](/Users/ckahn/Desktop/papa/prompts/korean-copy-v1.md)

## Implementation Lock

- 상단 우선 블록은 `원스톱 추천 순서 -> 마감 임박 카드 -> 행정/지원금 리스트` 순서를 기준으로 한다.
- 정책 메타데이터는 `지역 안내문구 -> 기준일 -> 최종 검수일 -> 지역 범위` 순서로 노출하는 것을 기본안으로 둔다.
- 모바일 카드 과밀을 피하기 위해 `안내문구 + 메타데이터`는 한 묶음 컴포넌트로 재사용 가능해야 한다.
- MVP 첫 구현에서는 `national` 기준 항목만 사용자 노출 대상으로 삼고, `seoul`/`local:*`/`local:pending`은 후속 논의 전까지 운영 내부 확인용으로 남긴다.
- 하단 CTA는 3버튼 상시 노출 대신 단일 `남편에게 보내기` 버튼으로 유지하고, 세부 fallback은 share sheet 내부에서 처리한다.

## Component / State Dependencies

### 공통 컴포넌트 후보

- `ContextSummaryBar`
- `AdminPriorityCard`
- `DeadlineAlertCard`
- `AdminTimelineItemCard`
- `PolicyMetaNotice`
- `StickySendToHusbandBar`

### 상태 모델

- `AppContextState`: checklist와 동일 입력값 재사용
- `AdminDeadlineState`: `due_offset_days` 기반 마감 임박/지남 계산
- `ShareIntentState`: 행정 데드라인 카드 공유 surface 상태

## Scope

- `admin` 탭 또는 딥링크 모듈 구현
- 항목 노출 필드:
  - 기한
  - 금액
  - 처리 방법
  - 아빠 코멘트
  - 기준일
  - 최종 검수일
  - 지역 범위
- `지역에 따라 달라질 수 있음` 안내문구와 일반 기준 노출 규칙
- `한국 일반 기준 우선` 노출 규칙
- 추천 순서 블록 구현
- 기한 임박 항목 강조
- 액션 카드 생성용 데이터 노출
- `due_offset_days` 기반 상대일 계산
- `D-Day`, `D-7`, `마감 임박`, `지남` 상태 규칙 정의

## Out of Scope

- 실제 정부 사이트 연동
- 알림 푸시

## Deliverables

- 행정 타임라인 모듈 UI
- 정책 메타데이터 표기
- 딥링크 규칙
- 기한 계산 규칙 문서
- action card 재사용 데이터 구조
- wireframe 기준 블록 우선순위 반영 메모

## Locked Spec

### 1) 기한 상태 계산 규칙 (deadline_bucket)

`due_offset_days`와 `base_date`(출산일, `delivery_status=born`)를 기준으로 아래 enum을 계산한다.

| `deadline_bucket` 값 | 조건 | 뱃지/표시 |
|---|---|---|
| `d_day` | `days_remaining === 0` | `D-Day` 강조 뱃지 |
| `d_7` | `1 ≤ days_remaining ≤ 7` | `D-{N}` 경고 뱃지 |
| `imminent` | `8 ≤ days_remaining ≤ 14` | `마감 임박` 안내 뱃지 |
| `passed` | `days_remaining < 0` | `기한 지남` 음소거 표시 |
| `none` | `due_offset_days === null` | 배지 없음 |

계산식:
```
days_remaining = due_offset_days - (today - base_date 일수)
```

- `due_offset_days`가 `null`인 항목(예: 지자체 출산축하금)은 `none` 처리하고 기한 카드에서 제외한다.
- 마감 임박 카드(`DeadlineAlertCard`)에는 `d_day` + `d_7` 버킷만 노출한다.
- GA4 `admin_timeline_view` 이벤트의 `deadline_bucket` 파라미터에 이 값을 그대로 전달한다.

### 2) 화면 블록 우선순위 규칙

| 순서 | 블록 | 컴포넌트 | 노출 조건 |
|---|---|---|---|
| 1 | 컨텍스트 요약 바 | `ContextSummaryBar` | 항상 (공용, `/checklist`와 동일 입력값) |
| 2 | 4축 탭바 | `ChecklistTabBar` | 항상, `admin` 탭 활성 |
| 3 | 원스톱 추천 순서 카드 | `AdminPriorityCard` | 항상 (정적 콘텐츠) |
| 4 | 마감 임박 카드 | `DeadlineAlertCard` | `d_day` 또는 `d_7` 버킷 항목 존재 시만 |
| 5 | 행정 타임라인 리스트 | `AdminTimelineItemCard` × N | `admin` 섹션 항목 전체 |
| 6 | 행정 데드라인 공유 카드 | `ActionCard` (deadline variant) | 리스트 하단 고정 |
| 7 | 하단 고정 CTA | `StickySendToHusbandBar` | 항상 고정 |

### 3) 컴포넌트 Props 명세

**`AdminPriorityCard`**
```
props: {
  items: Array<{ order: number; label: string; when_label: string }>
  // 정적 콘텐츠. 원스톱 순서 1~6번 고정.
}
```

**`DeadlineAlertCard`**
```
props: {
  deadlines: Array<{
    title: string
    due_offset_days: number
    days_remaining: number
    deadline_bucket: 'd_day' | 'd_7'
  }>
}
```

**`AdminTimelineItemCard`**
```
props: {
  item: PolicyBenefit  // T-002 스키마 그대로
  isChecked: boolean
  onCheck: () => void
  defaultExpanded?: boolean
  // 펼침 상태에서 PolicyMetaNotice, 공식 사이트 링크 노출
}
```

**`PolicyMetaNotice`**
```
props: {
  region_notice: string      // "지역에 따라 달라질 수 있습니다." 안내
  effective_date: string     // 기준일 YYYY-MM
  verified_at: string        // 최종 검수일 YYYY-MM-DD
  compact?: boolean          // true = ※ 단행 버전, false = 기본형
}
```

**`StickySendToHusbandBar`** (공용 — T-003과 동일 계약)
```
props: {
  surface: 'admin_timeline'
  card_type: 'deadline_card'
  onPress: () => void  // ShareFallbackSheet 열기
}
```

### 4) 딥링크 진입 규칙

| 진입 경로 | 동작 |
|---|---|
| `/checklist?tab=admin` 직접 URL | admin 탭 활성, ContextSummaryBar 공용 입력값 유지 |
| `#admin` 앵커 | `/checklist?tab=admin`과 동일 모듈로 처리 (구현 기준 문서화만, 별도 라우트 없음) |
| 체크리스트 다른 탭 → 행정 탭 클릭 | 탭 전환, 스크롤 상단 이동 |
| 공유 링크 수신 진입 | admin 탭 활성, localStorage 입력값 없으면 온보딩 시트 → 완료 후 admin 탭 복귀 |
| 퀴즈 결과 CTA "행정 타임라인 바로 보기 →" | `/checklist?tab=admin` 딥링크 |

### 5) GA4 이벤트 명세 (admin_timeline)

| 이벤트 | 발생 시점 | 필수 파라미터 |
|---|---|---|
| `admin_timeline_view` | admin 탭 진입 시 | `tab=admin`, `item_id?`, `deadline_bucket?` |
| `admin_timeline_share` | 행정 데드라인 카드 공유 시 | `tab=admin`, `item_id`, `deadline_bucket`, `share_method` |
| `send_to_husband_click` | 하단 CTA 탭 시 | `surface=admin_timeline`, `card_type=deadline_card`, `share_method` |
| `cta_click` | 정부24 바로가기 탭 시 | `source_surface=admin_timeline`, `target_route=gov24`, `cta_name=official_site_link` |

### 6) 액션 카드 데이터 구조

행정 데드라인 공유 카드(`ActionCard` deadline variant)가 필요로 하는 최소 데이터:

```ts
type AdminDeadlineActionCard = {
  card_type: 'deadline_card'
  surface: 'admin_timeline'
  title: string              // 예: "출생신고 9일 남았어!"
  item_id: string            // PolicyBenefit.id
  deadline_bucket: 'd_day' | 'd_7'
  days_remaining: number
  share_copy: string         // korean-copy-v1.md § 2-4 기준
  deeplink_target: '/checklist?tab=admin'
}
```

`share_copy` 기본 포맷 (korean-copy-v1.md § 2-4):
```
여보, {항목명} {N}일 남았어. 지금 해야 해 → [링크]
```

### 7) 정책 메타데이터 노출 규칙

- 항목 카드 접힘 상태: 제목 + `when_label` + `days_remaining` 표시만
- 항목 카드 펼침 상태: `무엇 / 어디 / 금액 / 조건` + `PolicyMetaNotice`(기본형) + 공식 사이트 링크
- 모바일 카드 과밀 시 `PolicyMetaNotice compact=true`(※ 단행) 사용, 상세 안내는 아코디언 하단 고정
- `region_scope`가 `local:pending`인 항목은 안내문구를 `지역마다 크게 다릅니다. 거주지 공고를 우선 확인하세요.`로 표기
- 단, MVP 첫 구현에서는 `region_scope !== national` 항목을 기본 리스트에서 제외해 사용자 혼선을 줄인다.

## Recommended File Targets

| 목적 | 파일 경로 |
|---|---|
| 컴포넌트 — ContextSummaryBar | `src/components/admin/ContextSummaryBar.tsx` |
| 컴포넌트 — AdminPriorityCard | `src/components/admin/AdminPriorityCard.tsx` |
| 컴포넌트 — DeadlineAlertCard | `src/components/admin/DeadlineAlertCard.tsx` |
| 컴포넌트 — AdminTimelineItemCard | `src/components/admin/AdminTimelineItemCard.tsx` |
| 컴포넌트 — PolicyMetaNotice | `src/components/admin/PolicyMetaNotice.tsx` |
| 컴포넌트 — StickySendToHusbandBar | `src/components/shared/StickySendToHusbandBar.tsx` |
| 상태 — AdminDeadlineState | `src/lib/domain/admin.ts` |
| 상태 — ShareIntentState (공용) | `src/lib/domain/share.ts` (T-005와 공유) |
| 기한 계산 유틸 | `src/lib/utils/deadline.ts` |
| 데이터 — 정책/지원금 seed | `content/policy/benefits.json` (T-002 산출물, 읽기 전용) |
| 구현 킥오프 공유 스펙 | `docs/implementation/checklist-admin-ready-spec.md` (worker-3 산출물) |

## Created Artifacts (2026-03-12)

- 킥오프 공유 스펙: `docs/implementation/checklist-admin-ready-spec.md` (worker-3 작성 예정 — T-003/T-004 공통 참조용)

## Remaining Risks

| 리스크 | 내용 | 권장 대응 |
|---|---|---|
| 카드 과밀 | `PolicyMetaNotice` + `기준일/검수일` 표기가 모바일 카드 내에서 과밀해질 수 있음 | `compact=true` 단행 버전 우선 적용, 상세 아코디언 하단 고정 |
| 카카오 인앱 딥링크 | `?tab=admin` fallback 동작이 iOS 카카오 인앱에서 불안정할 수 있음 | T-010 QA 대상으로 등록, 실기기 테스트 필수 |
| `region_scope` 세분화 범위 | 전국/광역/기초 어디까지 MVP에서 지원할지 미확정 | `national / local:pending` 2단계로 시작, 운영 데이터 확보 후 확장 |
| `StickySendToHusbandBar` 겹침 | 하단 고정 CTA가 타임라인 항목 체크/탭 전환을 가릴 수 있음 | T-003과 동일 패턴으로 스크롤 시 자동 숨김 또는 미니화 검토 |

## Acceptance Criteria

- `/checklist?tab=admin`과 `#admin`이 동일 모듈을 가리키는 구현 기준으로 문서화된다.
- `/checklist` 내부에서 행정 타임라인에 바로 접근 가능하다.
- 정책 항목마다 `effective_date`, `verified_at`, `region_scope`를 표시할 수 있다.
- 지역별 차이가 있는 항목에는 안내문구와 일반 기준이 함께 노출된다.
- `due_offset_days` 기준으로 기한 임박/지남 상태가 계산된다.
- 액션 카드/공유에 재사용 가능한 형태로 데이터가 정리된다.
- [checklist-admin.md](/Users/ckahn/Desktop/papa/research/wireframes/checklist-admin.md)의 상단 블록 순서와 CTA 위치가 구현 기준으로 연결된다.
