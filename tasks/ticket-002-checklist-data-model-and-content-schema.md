# T-002 Checklist Data Model and Content Schema

- Status: `todo`
- Priority: `P0`
- Phase: `MVP Week 1`
- Depends on: `T-001`

## Goal

`D-30 ~ D+30 실행 체크리스트`를 코드와 콘텐츠 양쪽에서 유지 가능한 구조로 모델링한다.

## Lock Proposal

### 검증된 사실

- 체크리스트는 `출산 전 준비`, `산후조리원`, `퇴소 후 첫 30일`, `행정/지원금 타임라인` 4축 구조를 유지한다.
- 각 항목은 `왜 / 언제 / 누가 / 예산 / 공유` 실행 문맥을 담아야 한다.
- 정책/행정 데이터는 `source`, `effective_date`, `verified_at`, `region_scope`, `due_offset_days` 메타필드를 반드시 포함한다.
- 정책/지원금 항목은 일반 기준 + `지역에 따라 달라질 수 있음` 안내 + `기준일/최종 검수일` 노출 원칙을 따른다.
- 데이터 레벨에서 `validated_fact`, `working_assumption`, `open_question` 상태를 구분한다.

### 작업 가설

- 체크리스트 카드와 행정 타임라인 카드는 공통 베이스 스키마를 공유하고, UI surface별 optional field만 확장하는 편이 유지보수에 유리하다.
- `proof_label`, `proof_threshold`는 MVP 비노출 메타데이터로 보관하되 QA/운영 검수에서만 사용한다.
- seed data는 전체 완성본이 아니라 4축별 대표 항목 2~3개씩만 있어도 `T-003`, `T-004`, `T-006` 설계 검증에 충분하다.

### 미해결 질문

- 없음. 본 티켓은 2026-03-12 기준 PRD/백로그에 명시된 메타데이터 계약을 잠그는 문서로 본다.

## Locked Schema Proposal

### 1) Checklist Item Base

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `string` | 안정적인 콘텐츠 키 |
| `section` | `prepare | center | home | admin` | 4축 구분값 |
| `title` | `string` | 항목명 |
| `urgency` | `required | recommended | optional` | 필수도/긴급도 |
| `why` | `string` | 왜 해야 하는지 |
| `when_label` | `string` | 사용자 노출용 시점 문구 |
| `due_offset_days` | `number \| null` | `base_date` 기준 상대일 |
| `who` | `dad | mom | couple | admin` | 실행 주체 |
| `cost_range` | `string \| null` | 예산 범위 |
| `used_market_allowed` | `boolean \| null` | 중고 허용 여부 |
| `share_copy` | `string` | 공유 카드/메시지 기본 문구 |
| `affiliate_target` | `string \| null` | 제휴 링크 매핑 키 |
| `deeplink_target` | `string \| null` | `/checklist`, `/checklist?tab=admin` 등 연결 목적지 |
| `status` | `validated_fact | working_assumption | open_question` | 검증 상태 |
| `proof_label` | `string \| null` | 검수 기준 라벨 |
| `proof_threshold` | `string \| null` | 검수 통과 기준 |

### 2) Policy / Support Metadata

| 필드 | 타입 | 설명 |
|------|------|------|
| `source` | `string` | 원문/운영 출처 |
| `effective_date` | `date string` | 기준일 |
| `verified_at` | `date string` | 최종 검수일 |
| `region_scope` | `national | seoul | local:<code>` | 적용 범위 |
| `region_notice` | `string` | `지역에 따라 달라질 수 있음` 안내문구 |
| `benefit_amount_label` | `string \| null` | 금액/혜택 노출용 |
| `application_channel` | `string \| null` | 정부24, 복지로, HR 등 |

### 3) Section Rules

| section | 포함 항목 | 잠금 기준 |
|--------|-----------|----------|
| `prepare` | 출산 전 준비물, 사전 행정 준비 | `D-30 ~ D-Day` 상대일 기반 |
| `center` | 조리원 필수템, 조리원 기간 실행 타임라인 | `D-Day ~ D+14` |
| `home` | 퇴소 후 집 세팅, 수유/교대, 멘탈케어 | `D+14 ~ D+30` |
| `admin` | 출생신고, 행복출산, 지원금, 휴가/휴직 | `/checklist?tab=admin` 딥링크 우선 |

### 4) Seed Data Minimum Set

- `prepare`
  - 출생신고 서류 미리 준비
  - 정부24 앱 + 행복출산 원스톱 확인
  - 배우자 출산휴가 회사 신청
- `center`
  - 빨대 / 멀티탭 / 가습기
  - D+1~3 출생신고
  - D+3~7 첫만남이용권 신청
- `home`
  - 냉장고 채우기
  - 기저귀/분유 재고 확보
  - 새벽 수유 교대 스케줄
- `admin`
  - 출생신고
  - 행복출산 원스톱
  - 산후도우미 지원사업

### 5) Content Input Rules

- 콘텐츠는 `검증된 사실 / 작업 가설 / 미해결 질문` 구분과 데이터 `status`가 서로 충돌하지 않아야 한다.
- 정책/지원금 항목은 금액보다 `신청 순서`, `기한`, `신청 채널`, `지역 변수`를 우선 기록한다.
- `share_copy`는 엄마→아빠 전달 또는 아빠 자기 실행 맥락에서 바로 써도 어색하지 않은 한 줄로 제한한다.
- `why`는 정보 설명이 아니라 행동 이유 중심으로 작성한다.
- `due_offset_days`가 있는 항목은 절대 날짜 하드코딩을 피한다.

## Recommended File Targets

- `tasks/ticket-002-checklist-data-model-and-content-schema.md` — 데이터 계약 원본
- `content/checklist/items.json` — 4축 체크리스트 seed data 후보
- `content/policy/benefits.json` — 정책/지원금 seed data 후보
- `src/lib/domain/checklist.ts` — `ChecklistItem` 타입 및 변환기 후보
- `src/lib/domain/policy.ts` — `PolicyBenefit` 타입 및 메타데이터 검증 후보
- `docs/content/checklist-input-guide.md` — 운영 입력 가이드 후보

## Scope

- 4축 데이터 모델 설계:
  - 출산 전 준비
  - 산후조리원
  - 퇴소 후 첫 30일
  - 행정/지원금 타임라인
- 각 항목 필드 정의:
  - title
  - urgency
  - why
  - when
  - who
  - cost_range
  - used_market_allowed
  - share_copy
  - affiliate_target
- 정책/행정 메타필드 정의:
  - source
  - effective_date
  - verified_at
  - region_scope
  - due_offset_days
  - deeplink_target
- 운영/확장 필드 정의:
  - proof_label
  - proof_threshold
  - status (`validated_fact` / `working_assumption` / `open_question`)
- JSON 또는 CMS-friendly 포맷 초안 작성
- seed data 최소 세트 작성

## Out of Scope

- 실제 렌더링 UI
- 쿠팡 링크 최종 운영
- 실시간 정책 크롤링

## Deliverables

- 체크리스트 스키마 파일
- 정책/지원금 스키마 파일
- 예시 데이터 파일
- 콘텐츠 입력 가이드
- 정책 메타데이터 입력 규칙
- 검증 상태 표기 규칙

## Acceptance Criteria

- 4축 모두 동일한 구조로 관리 가능
- `왜 / 언제 / 누가 / 공유`가 누락 없이 표현 가능
- 정책/지원금 항목마다 `source`, `effective_date`, `verified_at`, `region_scope`, `due_offset_days`를 넣을 수 있다.
- 검증된 사실 / 작업 가설 / 미해결 질문을 데이터 레벨에서 구분해 입력할 수 있다.
- 추후 정책/가격 업데이트 시 코드 수정 없이 데이터 수정으로 대응 가능하다.
- `T-004`, `T-005`, `T-006`이 동일 데이터 계약을 참조할 수 있다.
- `proof_label`, `proof_threshold`는 MVP 비노출 상태로 보관 가능하다.
