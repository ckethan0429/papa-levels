# 체크리스트 콘텐츠 입력 가이드

기준 문서: [T-002 Checklist Data Model and Content Schema](/tasks/ticket-002-checklist-data-model-and-content-schema.md)
작성일: 2026-03-12
대상: 콘텐츠 운영자, 데이터 입력 담당자

> **주의:** 이 가이드는 `content/checklist/items.json` 및 `content/policy/benefits.json` 입력 기준을 설명한다.
> 스키마 정의나 상위 결정(route map, D-Day 계산 규칙, shared contracts)은 재정의하지 않는다.
> 스키마 원본은 T-002, 공용 계약은 T-001을 참조한다.

---

## 목차

1. [4축 구조 개요](#1-4축-구조-개요)
2. [기본 필드 입력 규칙](#2-기본-필드-입력-규칙)
3. [정책/지원금 메타데이터 입력 규칙](#3-정책지원금-메타데이터-입력-규칙)
4. [검증 상태 표기 규칙](#4-검증-상태-표기-규칙)
5. [섹션별 입력 기준](#5-섹션별-입력-기준)
6. [카피 작성 원칙](#6-카피-작성-원칙)
7. [입력 금지 사항](#7-입력-금지-사항)
8. [입력 예시](#8-입력-예시)
9. [운영 QA 체크리스트](#9-운영-qa-체크리스트)

---

## 1. 4축 구조 개요

체크리스트 항목은 반드시 아래 4개 섹션(`section` 필드) 중 하나에 속해야 한다.

| section | 표시명 | 기간 | 주요 포함 항목 |
|---------|--------|------|----------------|
| `prepare` | D-30 준비 | D-30 ~ D-Day | 출산 전 준비물, 사전 행정 준비 |
| `center` | 조리원 | D-Day ~ D+13 | 조리원 필수템, 조리원 기간 실행 타임라인 |
| `home` | 퇴소 후 30일 | D+14 ~ D+30 | 퇴소 후 집 세팅, 수유/교대, 멘탈케어 |
| `admin` | 행정 | 기간 무관 | 출생신고, 행복출산, 지원금, 휴가/휴직 |

> **`admin` 섹션은 `/checklist?tab=admin` 딥링크로 노출된다.** 독립 라우트로 오해하지 않도록 주의.

---

## 2. 기본 필드 입력 규칙

### 2-1. 필드 목록

| 필드 | 타입 | 필수 여부 | 설명 |
|------|------|-----------|------|
| `id` | `string` | 필수 | 콘텐츠 식별자. 한번 정하면 변경 금지. |
| `section` | `prepare \| center \| home \| admin` | 필수 | 4축 구분값 |
| `title` | `string` | 필수 | 항목명. 간결하고 명확하게. |
| `urgency` | `required \| recommended \| optional` | 필수 | 필수도/긴급도 |
| `why` | `string` | 필수 | 행동 이유. 정보 설명이 아닌 행동 유발 문장. |
| `when_label` | `string` | 필수 | 사용자 노출용 시점 문구 (예: "출산 2주 전까지") |
| `due_offset_days` | `number \| null` | 권장 | `base_date` 기준 상대일. 절대 날짜 하드코딩 금지. |
| `who` | `dad \| mom \| couple \| admin` | 필수 | 실행 주체 |
| `cost_range` | `string \| null` | 선택 | 예산 범위 (예: "3~10만 원") |
| `used_market_allowed` | `boolean \| null` | 선택 | 중고 허용 여부 |
| `share_copy` | `string` | 필수 | 공유 카드/메시지 기본 문구. 반드시 한 줄. |
| `affiliate_target` | `string \| null` | 선택 | 제휴 링크 매핑 키 (MVP에서는 null 허용) |
| `deeplink_target` | `string \| null` | 선택 | 연결 목적지 (예: `/checklist?tab=admin`) |
| `status` | `validated_fact \| working_assumption \| open_question` | 필수 | 검증 상태 (§4 참조) |
| `proof_label` | `string \| null` | 선택 | 검수 기준 라벨 (MVP 비노출 메타데이터) |
| `proof_threshold` | `string \| null` | 선택 | 검수 통과 기준 (MVP 비노출 메타데이터) |

### 2-2. id 작성 규칙

- 형식: `{section}-{순번}-{키워드}` (소문자, 하이픈 구분)
- 예: `prepare-01-birth-cert-docs`, `admin-01-birth-registration`
- **한번 배포된 id는 변경하지 않는다.** 삭제 후 재생성 시 신규 id를 부여한다.

### 2-3. urgency 기준

| 값 | 의미 | 화면 배지 | 사용 기준 |
|----|------|-----------|-----------|
| `required` | 필수 | `필수` | 놓치면 법적·건강·금전 손실이 발생하는 항목 |
| `recommended` | 권장 | `권장` | 대부분의 상황에서 강력히 권장되는 항목 |
| `optional` | 선택 | `선택` | 여유 있을 때 하면 좋은 항목 |

### 2-4. who 기준

| 값 | 의미 |
|----|------|
| `dad` | 아빠가 직접 실행 (기본 권장 주체) |
| `mom` | 엄마가 주도하는 항목 |
| `couple` | 부부 합의 또는 공동 실행 필요 |
| `admin` | 기관/기업 통해 처리 (회사, 정부기관 등) |

### 2-5. due_offset_days 작성 규칙

- `base_date`(출산일 또는 출산 예정일) 기준 **상대일**로 입력한다.
- `D-30`이면 `-30`, `D+14`이면 `14`로 입력.
- 마감일이 없는 항목은 `null`.
- **절대 날짜(`2025-11-10` 등) 하드코딩 금지.**

---

## 3. 정책/지원금 메타데이터 입력 규칙

`admin` 섹션 또는 지원금·정책 관련 항목은 아래 메타필드를 **반드시** 포함한다.

| 필드 | 타입 | 설명 |
|------|------|------|
| `source` | `string` | 원문/운영 출처 (예: "복지로", "고용보험 홈페이지") |
| `effective_date` | `date string` | 정보 기준일 (예: `"2025-01"`) |
| `verified_at` | `date string` | 최종 검수일 (예: `"2026-03-11"`) |
| `region_scope` | `national \| seoul \| local:<code>` | 적용 범위 |
| `region_notice` | `string` | 지역 안내 문구 (아래 §3-3 참조) |
| `benefit_amount_label` | `string \| null` | 금액/혜택 노출용 (예: "최대 200만 원") |
| `application_channel` | `string \| null` | 신청 채널 (예: "정부24", "복지로", "회사 HR") |

### 3-1. region_scope 값 기준

| 값 | 의미 | 예시 |
|----|------|------|
| `national` | 전국 동일 기준 | 출생신고, 첫만남이용권, 부모급여 |
| `seoul` | 서울시 기준 | 서울시 임산부 교통비 지원 |
| `local:<code>` | 특정 지역 기준 | `local:KR-11` (서울), `local:KR-26` (부산) |

> 지역 코드는 ISO 3166-2:KR 기준을 사용한다.

### 3-1A. MVP 운영 노출 규칙 (2026-03-19)

- 앱 첫 구현에서는 사용자 `region` 입력을 받지 않고 `한국` 고정값으로 시작한다.
- 따라서 사용자 노출용 기본 정책 리스트는 `region_scope: national` 항목을 우선 사용한다.
- `seoul`, `local:<code>`, `local:pending` 항목은 데이터에는 유지할 수 있지만, 후속 운영 규칙이 잠기기 전까지 기본 UI 노출 대상으로 삼지 않는다.
- 지역 변수 논의는 추후 별도 결정으로 분리한다.

### 3-2. effective_date / verified_at 작성 기준

- `effective_date`: 해당 정책/금액 정보의 **기준 시점** (월 단위로 충분, 예: `"2025-01"`)
- `verified_at`: 콘텐츠 담당자가 정보를 **최종 확인한 날짜** (일 단위, 예: `"2026-03-11"`)
- 정책이 변경되면 두 필드 모두 업데이트한다.
- 화면 노출 형식: `기준일: {effective_date} | 최종 검수일: {verified_at}`

### 3-3. region_notice 작성 기준

모든 정책/지원금 항목에 아래 문구 중 하나를 사용한다. 임의 변형 금지.

**기본형** (행정 타임라인 항목 등 공간이 충분한 경우):
```
지역에 따라 달라질 수 있습니다.
아래 내용은 일반적인 기준이며, 거주지 기준으로 다시 확인하세요.
```

**컴팩트형** (모바일 카드 공간이 제한된 경우):
```
※ 지역·소득 기준에 따라 금액이 달라질 수 있습니다.
```

### 3-4. 정책 항목 입력 우선순위

금액보다 **신청 순서 > 기한 > 신청 채널 > 지역 변수**를 우선 기록한다.

| 우선순위 | 기록 항목 | 예시 |
|----------|-----------|------|
| 1 | 신청 순서 | "출생신고 완료 후 신청 가능" |
| 2 | 기한 | `due_offset_days: 60` (D+60까지) |
| 3 | 신청 채널 | `application_channel: "정부24"` |
| 4 | 지역 변수 | `region_notice` 필드로 표기 |
| 5 | 금액 | `benefit_amount_label: "최대 200만 원"` |

---

## 4. 검증 상태 표기 규칙

모든 항목은 `status` 필드에 아래 세 값 중 하나를 반드시 입력한다.

| status | 의미 | 입력 기준 |
|--------|------|-----------|
| `validated_fact` | 검증된 사실 | 공식 출처 확인 완료, 기준일/검수일 있음 |
| `working_assumption` | 작업 가설 | 합리적 추정이나 미검증. 운영 시 명시적 표기 필요. |
| `open_question` | 미해결 질문 | 확인 필요 항목. 배포 전 반드시 해소해야 함. |

### 4-1. 상태별 처리 원칙

- `validated_fact`: 그대로 배포 가능. `proof_label`/`proof_threshold` 선택 입력.
- `working_assumption`: 배포는 가능하나 운영 검수 대상. `proof_label`에 근거 명시 권장.
- `open_question`: **배포 금지.** 미해결 내용을 `proof_label`에 기록하고 해소 후 상태 전환.

### 4-2. status와 콘텐츠 일관성 검사

`status` 값과 실제 데이터가 충돌하지 않아야 한다.

| 위반 예시 | 올바른 처리 |
|-----------|-------------|
| `status: validated_fact`인데 `verified_at` 없음 | `verified_at` 추가 또는 `working_assumption`으로 변경 |
| `status: open_question`인데 배포됨 | 즉시 해소 또는 항목 비활성화 |
| 금액 정보 있는데 `effective_date` 없음 | `effective_date` 추가 필수 |

---

## 5. 섹션별 입력 기준

### 5-1. `prepare` — 출산 전 준비 (D-30 ~ D-Day)

- `due_offset_days`는 **음수** (D-Day 이전 기준)
- 행정 항목은 `who: "admin"` 또는 `who: "dad"` 명시
- 준비물 항목은 `cost_range`와 `used_market_allowed` 권장 입력

**seed 항목 기준:**
- 출생신고 서류 미리 준비
- 정부24 앱 + 행복출산 원스톱 확인
- 배우자 출산휴가 회사 신청

### 5-2. `center` — 산후조리원 (D-Day ~ D+13)

- `due_offset_days`는 **양수 소범위** (0 ~ 13)
- 조리원 기간 내 실행 가능한 항목만 포함
- 행정 마감 항목(`D+1~3 출생신고` 등)은 urgency를 `required`로 설정

**seed 항목 기준:**
- 빨대 / 멀티탭 / 가습기 (준비물)
- D+1~3 출생신고
- D+3~7 첫만남이용권 신청

### 5-3. `home` — 퇴소 후 첫 30일 (D+14 ~ D+30)

- `due_offset_days`는 `14` ~ `30` 범위
- 수유/교대 등 일상 루틴 항목은 `who: "couple"` 권장
- 정신건강·멘탈케어 항목은 `urgency: recommended`로 설정

> 경계 해석 주의: `D+14`는 `home` 시작점으로 본다. `center`는 `D+13`까지다.

**seed 항목 기준:**
- 냉장고 채우기
- 기저귀/분유 재고 확보
- 새벽 수유 교대 스케줄

### 5-4. `admin` — 행정/지원금 타임라인

- **정책/지원금 메타데이터 필드 전체 필수** (§3 참조)
- `deeplink_target: "/checklist?tab=admin"` 기본값으로 설정
- `due_offset_days` 기반 마감 계산이 핵심. 절대 날짜 사용 금지.
- 신청 채널(`application_channel`)은 반드시 기재

**seed 항목 기준:**
- 출생신고
- 행복출산 원스톱
- 산후도우미 지원사업

---

## 6. 카피 작성 원칙

카피 작성 기준 원본: [korean-copy-v1.md](/prompts/korean-copy-v1.md)

### 6-1. `why` 필드 작성 원칙

- **정보 설명이 아닌 행동 이유** 중심으로 작성한다.
- 1~2문장, 구체적이고 행동 유발이 명확하게.

| 잘못된 예 | 올바른 예 |
|-----------|-----------|
| "온도지정 포트기는 40도 자동 유지 기능이 있는 제품입니다." | "새벽 3시에 물 끓이고 식히는 건 고문입니다. 40도 자동 유지 필수." |
| "첫만남이용권은 정부에서 제공하는 바우처입니다." | "출생 후 한 번밖에 못 받는 200만 원. 신청 기한 놓치면 영원히 사라집니다." |

### 6-2. `when_label` 필드 작성 원칙

- 절대 날짜 하드코딩 금지. `due_offset_days`와 연동되는 **상대적 시점 표현** 사용.
- 예: "출산 2주 전까지", "출산 후 3일 이내", "조리원 퇴소 전"

| 잘못된 예 | 올바른 예 |
|-----------|-----------|
| "2025년 11월 10일까지" | "출산 2주 전까지" |
| "11월 말까지" | "출산 후 60일 이내" |

### 6-3. `share_copy` 필드 작성 원칙

- 엄마→아빠 전달 또는 아빠 자기 실행 맥락에서 **바로 써도 어색하지 않은 한 줄**로 제한한다.
- 친근하고 가볍되 행동 유발이 명확하게.
- 카카오톡 메시지 200자 이내 원칙. (현재 모든 예시 100자 이하로 안전.)

**참고 패턴** (korean-copy-v1.md 기준):
```
여보, 이번 주 이것만 해줘 → [링크]
여보, {항목명} {N}일 남았어. 지금 해야 해 → [링크]
```

> `share_copy`에는 `{N}`, `{항목명}` 같은 변수 자리표시자를 사용할 수 있다.
> 런타임에서 `base_date`와 `due_offset_days`를 기반으로 실제 값으로 대체된다.

### 6-4. 정책 안내 문구 사용 원칙

- 정책/지원금 항목 **상단**에 반드시 지역 안내 문구를 포함한다.
- 안내 문구는 §3-3에 정의된 두 가지 형식만 사용한다. 임의 변형 금지.
- 기준일/검수일 표기 형식: `기준일: {YYYY-MM} | 최종 검수일: {YYYY-MM-DD}`

---

## 7. 입력 금지 사항

| 금지 사항 | 이유 |
|-----------|------|
| `due_offset_days` 대신 절대 날짜 하드코딩 | D-Day 기준 상대일 계산 시스템과 충돌 |
| `id` 재사용 또는 임의 변경 | 로컬 저장 상태, 통계, 딥링크 연결 파괴 |
| `open_question` 상태로 배포 | 미검증 정보 노출 위험 |
| `status: validated_fact`인데 `verified_at` 누락 | 정보 신뢰도 표기 불일치 |
| 정책 항목에 `region_notice` 누락 | 사용자 혼동 및 민원 위험 |
| `share_copy` 2줄 이상 작성 | 카카오톡 공유 카드 UI 깨짐 |
| `admin` 섹션 항목에 정책 메타필드 누락 | 기준일/검수일 없이 정책 정보 노출 |
| 사회적 증거 수치 노출 (`아빠 N%가 체크` 등) | MVP 비노출 결정 사항 (T-001 기준) |

---

## 8. 입력 예시

### 8-1. 준비물 항목 (`prepare` 섹션)

```json
{
  "id": "prepare-01-bottle-warmer",
  "section": "prepare",
  "title": "온도지정 포트기",
  "urgency": "required",
  "why": "새벽 3시에 물 끓이고 식히는 건 고문입니다. 40도 자동 유지 필수.",
  "when_label": "출산 2주 전까지 구매",
  "due_offset_days": -14,
  "who": "dad",
  "cost_range": "3~10만 원",
  "used_market_allowed": true,
  "share_copy": "여보, 포트기 아직 안 샀으면 이번 주에 주문해줘 → [링크]",
  "affiliate_target": "coupang-bottle-warmer",
  "deeplink_target": null,
  "status": "validated_fact",
  "proof_label": null,
  "proof_threshold": null
}
```

### 8-2. 행정 항목 (`admin` 섹션, 정책 메타데이터 포함)

```json
{
  "id": "admin-01-birth-registration",
  "section": "admin",
  "title": "출생신고",
  "urgency": "required",
  "why": "출생 후 1개월 이내 신고 의무. 이후 과태료 발생.",
  "when_label": "출산 후 14일 이내 (법적 기한 1개월)",
  "due_offset_days": 14,
  "who": "dad",
  "cost_range": null,
  "used_market_allowed": null,
  "share_copy": "여보, 출생신고 {N}일 남았어. 지금 해야 해 → [링크]",
  "affiliate_target": null,
  "deeplink_target": "/checklist?tab=admin",
  "status": "validated_fact",
  "proof_label": "법령 근거: 가족관계등록법 제44조",
  "proof_threshold": "출생신고 완료 증빙",
  "source": "대법원 전자가족관계등록시스템",
  "effective_date": "2025-01",
  "verified_at": "2026-03-11",
  "region_scope": "national",
  "region_notice": "※ 지역·소득 기준에 따라 금액이 달라질 수 있습니다.",
  "benefit_amount_label": null,
  "application_channel": "정부24, 주민센터"
}
```

### 8-3. 지원금 항목 (`admin` 섹션, 지역 변수 있음)

```json
{
  "id": "admin-02-first-meeting-voucher",
  "section": "admin",
  "title": "첫만남이용권 신청",
  "urgency": "required",
  "why": "출생 후 한 번밖에 못 받는 200만 원. 신청 기한 놓치면 영원히 사라집니다.",
  "when_label": "출산 후 60일 이내",
  "due_offset_days": 60,
  "who": "dad",
  "cost_range": null,
  "used_market_allowed": null,
  "share_copy": "여보, 200만 원짜리 신청 {N}일 남았어. 잊지 마 → [링크]",
  "affiliate_target": null,
  "deeplink_target": "/checklist?tab=admin",
  "status": "validated_fact",
  "proof_label": "복지로 기준 2025-01 확인",
  "proof_threshold": "신청 완료 스크린샷",
  "source": "복지로 (www.bokjiro.go.kr)",
  "effective_date": "2025-01",
  "verified_at": "2026-03-11",
  "region_scope": "national",
  "region_notice": "지역에 따라 달라질 수 있습니다.\n아래 내용은 일반적인 기준이며, 거주지 기준으로 다시 확인하세요.",
  "benefit_amount_label": "200만 원 (국민행복카드 바우처)",
  "application_channel": "정부24, 복지로, 행복출산 원스톱"
}
```

---

## 9. 운영 QA 체크리스트

항목 입력 또는 수정 후 아래를 확인한다.

### 필수 검사 (배포 전)

- [ ] `id` 중복 없음
- [ ] `section` 4축 중 하나
- [ ] `urgency` 올바른 값
- [ ] `why` — 정보 설명이 아닌 행동 이유 중심
- [ ] `when_label` — 절대 날짜 없음
- [ ] `due_offset_days` — 절대 날짜 하드코딩 없음
- [ ] `share_copy` — 한 줄, 200자 이내
- [ ] `status` 값 입력됨
- [ ] `open_question` 항목 없음 (있으면 배포 차단)

### 정책/지원금 항목 추가 검사

- [ ] `source` 입력됨
- [ ] `effective_date` 입력됨
- [ ] `verified_at` 입력됨
- [ ] `region_scope` 입력됨
- [ ] `region_notice` 입력됨 (§3-3 형식 준수)
- [ ] `application_channel` 입력됨
- [ ] `status: validated_fact`이면 `verified_at` 있음

### 정기 검수 (분기별)

- [ ] 정책/지원금 항목 `effective_date` 및 `verified_at` 최신 여부 확인
- [ ] `working_assumption` 항목 중 검증 완료된 것 `validated_fact`로 전환
- [ ] `open_question` 항목 미해소 상태로 남은 것 확인 및 처리

---

## 관련 문서

| 문서 | 경로 |
|------|------|
| T-001 Foundation / IA / Shared Contracts | `tasks/ticket-001-foundation-ia-and-shared-contracts.md` |
| T-002 Checklist Data Model and Content Schema | `tasks/ticket-002-checklist-data-model-and-content-schema.md` |
| 체크리스트 와이어프레임 | `research/wireframes/checklist.md` |
| 한국어 카피 v1 | `prompts/korean-copy-v1.md` |
| 체크리스트 seed data | `content/checklist/items.json` |
| 정책/지원금 seed data | `content/policy/benefits.json` |
