# T-011 Paid Pack Experiment

- Status: `todo`
- Priority: `P2`
- Phase: `Post-MVP`
- Depends on: `T-003`, `T-004`, `T-005`, `T-008`

## Goal

`단건 실행 팩`이 실제 결제로 이어지는지 빠르게 검증한다.

## Scope

- 상품 3종 노출 테스트
- 가격 가설 테스트:
  - 4,900원
  - 9,900원
  - 19,900원
- 포맷 가설 테스트:
  - 카톡 텍스트
  - 이미지 카드
  - PDF
  - 노션형 링크
- paywall 카피 실험

## Out of Scope

- 완전한 결제 시스템 고도화
- 장기 구독 모델

## Deliverables

- 실험 설계 문서
- 랜딩/페이월 변형안
- 결과 해석 기준

## Acceptance Criteria

- 가격/포맷/카피 중 최소 하나에 대해 우세 가설을 얻음
- `pack_paywall_view → purchase_complete` 퍼널 데이터를 확인 가능
- 구독 전환보다 단건 구매가 맞는지 초기 판단 근거를 확보함
