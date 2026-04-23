# TripKey 화면 구현 스펙 v1.x

---

## 0. 문서 목적

이 문서는 PRD나 시스템 아키텍처 문서에 담기엔 너무 세부적인 화면 단위 구현 사항을 기록합니다.

와이어프레임과 함께 참고하여 현재 UI 동작이 의도한 대로 구현되었는지 판단하는 기준으로 사용합니다.

---

## 1. 범위

포함 화면:

- SCR-03 정리 화면
- SCR-04 배치 화면
- SCR-05 최종 확인 화면
- 공통 카드 컴포넌트
- 공통 카드 추가 플로우
- 데모 Alert 화면

제외 범위:

- 백엔드 API 구현 세부사항
- 프로덕션 Enrichment 품질
- 04V 이동수단 계산 엔진
- 실제 Maps API 연동

---

## 2. 공통 카드 추가 플로우

### 2.1 진입점

카드 추가는 03과 04 모두에서 가능합니다.

- 03: `+ 카드 추가하기`
- 04: `+ 카드 추가하기`

동일한 추가 다이얼로그/시트 패턴을 양쪽 화면에서 공통으로 사용합니다.

### 2.2 필수 입력 항목

필수:

- `name` 또는 카드 이름
- `category`

선택:

- `location`
- `estimated_duration_min`
- `time_constraint`
- `memo`
- 숙소 전용 구조화 필드
- 교통 전용 구조화 필드

### 2.3 구조화 입력 필드

숙소 카드:

- 이름
- 위치 또는 주소
- 체크인 일시
- 체크아웃 일시

교통/항공편 카드:

- 위치 또는 공항명
- 시간
- 항공편 번호

일반 장소/활동/맛집/기타 카드:

- 이름
- 카테고리
- 지역
- 메모
- 체류 시간

### 2.4 추가 직후 초기 상태

사용자가 직접 추가한 카드는 `processing` 상태로 화면에 진입합니다.

```json
{
  "classification": "confirmed",
  "placement_status": "ready",
  "processing_status": "processing",
  "action_type": "review_only",
  "source": "manual",
  "is_ai_generated": false,
  "is_excluded": false
}
```

기본 중복 허용 정책:

- 숙소: `allow_duplicate = true`
- 교통: `allow_duplicate = true`
- 나머지: `allow_duplicate = false`

기본 제외 가능 정책:

- 숙소: `can_exclude = false`
- 교통: `can_exclude = false`
- 나머지: `can_exclude = true`

### 2.5 처리 중 UX

`processing` 상태 카드:

- 로딩 UI 표시
- 상세 패널 열기 불가
- Day 드래그 불가
- 처리 완료 시 자동 갱신

`pending` 상태 카드:

- 별도 UI 표시 없음
- 시스템 내부 준비 또는 큐 대기 상태로 취급
- 로딩 오버레이 표시하지 않음

### 2.6 처리 완료 동작

수동 추가 카드의 처리가 완료되면:

- `processing_status` → `completed`
- `processing_started_at` 초기화
- `user_context`가 위치 및 메모 기반으로 채워질 수 있음
- `tips`가 카테고리 기반으로 채워질 수 있음
- 카드는 03/04 렌더링의 일반 후보로 전환됨

현재는 프론트엔드 목 동작입니다. 프로덕션에서는 백엔드 파싱/Enrichment 파이프라인과 연결되어야 합니다.

---

## 3. SCR-03 정리 화면 구현

### 3.1 레이아웃

03은 카드 의미 정리 화면입니다.

표시 영역:

- 헤더 및 여행 요약
- 진행 상태 요약
- `action_type` 기반 카드 그룹
- 사이드 여행 요약
- 카드 추가 버튼
- 공통 상세 패널

Trip-level Alert는 03 메인 화면에 표시하지 않습니다.

### 3.2 그룹화

카드는 `action_type` 기준으로 그룹화됩니다.

그룹 목록:

- `input_required` → 입력이 필요한 카드들
- `select_required` → 선택이 필요한 카드들
- `fix_required` → 수정이 필요한 카드들
- `review_only` → 확인만 하면 되는 카드들
- `excluded` → 제외된 항목

제외 카드는 단일 `excluded` 그룹 하나만 사용합니다.

`unassigned` 제외 카드는 별도 그룹으로 분리하지 않고 동일 그룹 내 정렬로 처리합니다.

### 3.3 그룹 갱신 정책

현재 구현은 로컬 상태에서 그룹을 재계산합니다.

의도된 동작:

- 백엔드가 03 진입 시 1회 그룹 생성
- 카드 업데이트 시 카드 정보만 즉시 업데이트
- 그룹 재정렬은 명시적 재정렬 버튼으로만 트리거

### 3.4 다음 단계 진행 정책

v3.2 기준으로 03 → 04 전환은 `action_type`으로 차단하지 않습니다.

`review_only`, `input_required`, `select_required`, `fix_required` 모두 04 진입이 가능합니다.

향후 차단 정책을 재도입할 경우 별도 문서화가 필요하며, `action_type`에서 추론해서는 안 됩니다.

### 3.5 03에서 카드 추가 후 동작

03에서 카드를 추가하면:

- `classification: confirmed`
- `processing_status: processing`
- 03 카드 목록에 즉시 표시
- 처리 완료 후 현재 카드 상태의 `action_type` 그룹에 맞게 렌더링

현재 프론트엔드 목에서는 처리 완료를 로컬 타이머로 시뮬레이션합니다.

---

## 4. SCR-04 배치 화면 구현

### 4.1 레이아웃

04는 일정 배치 화면입니다.

```text
[Stock - 좌측] | [Day 보드 - 우측]
```

Day 카드를 배치하는 동안 Stock과 Day 보드는 항상 작업 화면 안에 남아 있어야 합니다.

스크롤 정책:

- 화면 전체는 04 작업대처럼 고정
- Stock은 좌측 영역 내부에서 독립 세로 스크롤
- Day 보드는 우측 영역에서 독립 가로 스크롤
- 각 Day 컬럼은 독립 세로 스크롤
- 각 Day 컬럼의 헤더(`Day 1`, 날짜, 카드 수)는 고정
- 각 Day 컬럼의 카드 배치 영역만 세로 스크롤
- 카드가 많아져 화면 height를 넘는 경우에도 Day 이름은 계속 보임

### 4.2 Stock 그룹화

Stock은 유연한 혼합 그룹화를 사용합니다.

배치 가능 카드는 실용적인 배치 힌트 기준으로 그룹화됩니다.

- 공항/항공권
- 숙소
- 위치/지역
- AI 생성 특별 그룹
- 여행 필수 항목 누락 시 추가 안내
- 새로 정리된 카드

배치 불가 카드는 고정 상태 버킷으로 분리할 필요가 없습니다. 현재 UI는 혼합된 단일 섹션 또는 목적별 안내 섹션으로 표시할 수 있습니다.

### 4.3 04에서 카드 추가 후 재정렬 대기

04에서 카드를 추가하면:

- `classification: confirmed`
- `processing_status: processing`
- Stock에 즉시 표시
- 처리 완료 후 재정렬 대기 그룹(`pending_reorder`, 화면명: `새로 정리된 카드`)에서 대기
- 사용자가 `재정렬`을 누르면 지역/거리 기준 그룹에 반영

재정렬 대기 그룹은 “처리는 끝났지만 아직 Stock 그룹 재계산에 반영하지 않은 카드”의 위치를 시각적으로 구분하는 임시 그룹입니다.

이 그룹은 배치 잠금 상태가 아닙니다. 카드가 `ready` 또는 `ready_partial`이고 `processing_status: completed`라면 Day로 드래그 배치할 수 있습니다.

현재 코드 기준:

- `group_label: "새로 정리된 카드"`로 표시
- `재정렬` 전에도 Day 드래그 배치 가능
- `재정렬` 후 `group_label`과 `group_reason`을 비워 일반 그룹으로 이동 가능하게 처리

### 4.4 배치 후 Stock 유지

카드는 Day에 배치된 후에도 Stock에 남아 있습니다.

시각적 처리:

- 배치된 비중복 카드는 흐릿하게 표시할 수 있음
- 중복 허용 카드는 더 선명하게 유지할 수 있음
- 배치 횟수 표시 가능

### 4.5 다음 단계 진행 정책

v3.2에서 04 및 이후 화면은 항상 진입 가능합니다.

차단하지 않는 조건:

- 미배치 카드 존재
- `input_required` 카드 존재
- `select_required` 카드 존재
- `fix_required` 카드 존재
- `open_question` 카드 존재
- 04V 검증 경고 존재

경고 및 검토 안내는 허용하되, 화면 진행 자체는 항상 가능해야 합니다.

### 4.6 드래그 정책

카드는 아래 조건을 모두 만족할 때만 드래그 가능합니다.

```ts
(placement_status === "ready" || placement_status === "ready_partial") &&
processing_status === "completed"
```

드래그 불가 카드:

- `processing` 카드
- `failed` 카드
- `needs_input` 또는 `blocked` 카드

`pending`은 UI 표시가 없지만, 백엔드가 명시적으로 완료 처리하기 전까지는 드래그 완료 상태로 취급하지 않습니다.

### 4.7 중복 배치 정책

`allow_duplicate = true`인 경우:

- 여러 Day에 자유롭게 배치 가능

`allow_duplicate = false`이고 이미 배치된 경우:

- 다이얼로그 표시
- 사용자가 이동 또는 중복 선택

중복 선택:

- 새 위치에 배치
- 현재 프론트엔드 구현에서는 해당 카드의 `allow_duplicate`를 자동으로 `true`로 변경

이동 선택:

- 기존 Day에서 카드 제거
- 새 Day에 배치

---

## 5. Day 고정 슬롯 구현

### 5.1 개념

Day 고정 슬롯은 항공편처럼 일정의 시작/종료 시간을 강하게 정의하는 카드를 일반 드래그 카드와 분리해 보여주는 렌더링 레이어입니다.

동일한 Canonical Card 모델을 사용하되, Day View Model에서 고정 슬롯으로 내려온 카드만 별도 블록으로 표시합니다.

### 5.2 고정 슬롯 타입

Day 보드는 다음 슬롯만 렌더링합니다.

```json
{
  "start_time_card": {},
  "cards": [],
  "end_time_card": {}
}
```

슬롯 의미:

- `start_time_card`: 도착 앵커, 주로 도착 항공편/공항 카드
- `end_time_card`: 출발 앵커, 주로 출발 항공편/공항 카드
- `cards`: 일반 드래그 가능 Day 카드

`top_cards`와 `bottom_cards`는 v3.2 기준에서 제거합니다.

### 5.3 교통/항공편 고정 동작

도착 교통 카드:

- 여행 첫 번째 Day 시작 지점에 고정될 수 있음
- 고정 시작 시간 블록으로 표시
- 일반 드래그 방문 카드처럼 취급하지 않음

출발 교통 카드:

- 여행 마지막 Day 종료 지점에 고정될 수 있음
- 고정 종료 시간 블록으로 표시
- 일반 드래그 방문 카드처럼 취급하지 않음

고정 항공편 카드는 드래그 재배치 대상이 아니며, 상세 패널에서 구조화 정보 수정만 가능합니다.

### 5.4 숙소 카드 동작

숙소 카드는 고정 슬롯을 사용하지 않습니다.

숙소 카드 정책:

- 일반 `cards[]` 배열에서 드래그 배치
- 사용자가 원하는 Day/순서에 자유 배치
- 05에서는 배치된 숙소만 표시
- 체크인/체크아웃 정보는 상세 패널과 카드 맥락 정보로 활용

숙소를 Day 앵커처럼 보이게 하는 UI는 현재 v3.2 기준에서 제외합니다.

### 5.5 빈 슬롯 정책

항공편 카드가 없는 경우:

- View Model에서는 `start_time_card` 또는 `end_time_card`를 `null`로 내려줄 수 있음
- MVP에서는 Stock 영역의 empty prompt로 항공편 추가 affordance 제공
- Day 고정 슬롯 내부의 추가 버튼은 후순위 의논 사항

현재 화면 구현은 Stock의 “항공권 추가하기” 안내로 빈 항공편 상태를 표현합니다.

### 5.6 현재 구현 참고

현재 고정 슬롯 배정은 하드코딩된 ID 기반의 프론트엔드 목 로직입니다.

프로덕션에서는 백엔드 View Model 생성 또는 스케줄링 엔진에서 처리되어야 합니다.

---

## 6. 숙소/교통 카드 구조화 정보 수정

### 6.1 상세 패널 수정 필드

숙소 수정 필드:

- 이름
- 위치
- 체크인 일시
- 체크아웃 일시

교통/항공편 수정 필드:

- 공항 또는 위치
- 시간
- 항공편 번호

### 6.2 수정 후 처리

숙소/교통 구조화 데이터 변경 시:

```json
{
  "processing_status": "processing",
  "action_type": "review_only"
}
```

완료 후:

- `processing_status` → `completed`
- `user_context` 재생성 가능
- `tips` 재생성 가능
- 백엔드/View Model이 지원할 경우 고정 슬롯 렌더링 변경 가능

### 6.3 수정 제한

현재 프론트엔드 구현은 구조화 필드를 로컬에서만 수정합니다.

프로덕션에서는 고정 슬롯과 동선 맥락이 일관성을 유지하도록 백엔드 업데이트/Enrichment를 통해 처리해야 합니다.

---

## 7. open_question 구현

### 7.1 기본 동작

`open_question`은 약한 액션 상태입니다.

일반적으로 아래와 같이 렌더링됩니다.

```json
{
  "classification": "open_question",
  "action_type": "review_only"
}
```

`select_required` 또는 `input_required`는 non-open-question 카드에 존재할 수 있으나, `open_question`을 차단 플로우로 강제해서는 안 됩니다.

### 7.2 상세 패널 동작

상세 패널에서 open_question 카드는 선택적 결정을 제공합니다.

- 포함
- 제외
- 그대로 두기

포함:

- 명시적 사용자 결정으로 간주
- `classification`이 `confirmed`로 변경될 수 있음

제외:

- `is_excluded`가 `true`로 변경됨

그대로 두기:

- 상태 변경 없음

### 7.3 Day 배치 동작

`open_question` 카드를 Day에 배치해도 `classification`이 자동으로 변경되지 않습니다.

배치 사실은 Canonical Card가 아니라 Plan/Placement 레이어에서 별도로 해석합니다.

```json
{
  "implicitly_accepted_by_placement": true
}
```

이 해석은 04V/05 참고용으로만 활용됩니다.

---

## 8. Alert 구현 기준

### 8.1 메인 플로우 노출

메인 플로우 기준:

- 03: Trip-level Alert 미표시
- 04: Trip-level practical 및 일부 insight를 배치 판단 맥락으로 노출 가능
- 05: Trip-level 및 Day-level Alert를 본격 노출 가능

### 8.2 canonical vs demo/mock

Canonical parse response:

- 현재 `scope: "trip"`만 사용
- `day`는 `null`

Demo/mock 데이터:

- 화면 밀도와 계층 검증을 위해 `scope: "day"` 포함 가능
- demo에서 Day Alert를 사용하더라도 canonical 정책과 별개로 취급

### 8.3 데모 Alert 화면

현재 05 Alert 페이지는 데모/목 뷰입니다.

밀도 및 계층 구조 확인에는 유용하나, 아직 Canonical 카드/일정 상태와 연결되어 있지 않습니다.

---

## 9. SCR-05 최종 확인 화면 구현

### 9.1 목적

05는 배치된 일정과 검토 맥락을 종합하여 보여주는 화면입니다.

포함 가능 요소:

- Trip-level Alert
- Day-level Alert
- 체크리스트 항목
- 카드 맥락 정보
- AI 팁
- 이동/체류 시간 요약

### 9.2 Alert 배치

- Trip-level Alert → 사이드 또는 요약 영역에 표시
- Day-level Alert → 해당 Day 검토 영역 내에 표시

05는 일정에 충분한 구조가 잡혀 있으므로 03/04보다 Alert를 더 적극적으로 표시할 수 있습니다.

### 9.3 04V 이후 진행

04V 검증 결과는 경고와 참고 정보로 제공됩니다.

05 진입은 차단하지 않습니다.

---

## 10. 데모 페이지 및 목 데이터

### 10.1 데모 페이지

기존 데모 페이지는 의도적으로 대안 레이아웃을 보여줄 수 있습니다.

- `organize-alerts`
- `organize-alerts-integrated`
- `arrange-alerts`
- `arrange-alerts-integrated`
- `final-alerts`
- `final-alerts-integrated`

데모 페이지는 메인 플로우로 명시적으로 승격되지 않는 한 디자인 탐색용으로 취급합니다.

### 10.2 정책 불일치

데모 페이지가 v3.2 정책과 충돌하는 경우, 탐색용으로 레이블링하거나 내용을 업데이트합니다.

충돌 사례:

- 03 Alert 데모가 “03 메인 화면에 Trip-level Alert 미표시” 정책과 충돌할 수 있음
- 구버전 open_question 목 카드가 여전히 `select_required`를 사용할 수 있음
- Day-level Alert demo가 canonical alert 정책보다 앞선 미래 상태를 표현할 수 있음

### 10.3 목 vs 프로덕션

현재 목 동작 범위:

- 시간 기반 로컬 처리 완료
- 하드코딩된 ID 기반 Day 항공편 슬롯 고정
- 로컬 전용 카드 추가
- 로컬 전용 상세 편집
- 로컬 전용 재정렬 대기 그룹
- 데모 Alert 데이터

프로덕션에서는 백엔드 기반 SSOT 및 View Model로 대체되어야 합니다.

---

## 11. 와이어프레임 검토 체크리스트

와이어프레임 또는 화면 구현을 검토할 때 아래 체크리스트를 사용하세요.

카드 추가:

- [ ] 03과 04 모두에서 추가 가능한가?
- [ ] 필수/선택 입력 항목이 명확한가?
- [ ] 카드가 `processing` 상태로 진입하는가?
- [ ] 03에서 추가한 카드는 완료 후 적절한 `action_type` 그룹으로 보이는가?
- [ ] 04에서 추가한 카드는 완료 후 재정렬 대기 그룹에서 시각적으로 구분되는가?
- [ ] 재정렬 대기 그룹 카드도 완료 상태라면 Day로 드래그 배치 가능한가?
- [ ] `재정렬` 이후 새 카드가 일반 Stock 그룹으로 반영되는가?

open_question:

- [ ] 비차단(non-blocking)인가?
- [ ] 사용자가 선택적으로 포함/제외할 수 있는가?
- [ ] Day 배치 시 `classification`이 자동 승격되지 않는가?
- [ ] 배치 해석은 Plan/Placement 레이어에서만 다루는가?

processing 상태:

- [ ] `processing`만 로딩 표시 및 인터랙션 잠금을 하는가?
- [ ] `pending`은 시각적으로 표시가 없는가?

04 진행:

- [ ] 미배치 카드가 있어도 다음 단계로 진행 가능한가?
- [ ] `fix_required` 카드가 있어도 화면 이동 자체는 가능한가?
- [ ] “모든 카드 배치 완료” 조건이 없는가?
- [ ] 04V 경고가 05 진입을 차단하지 않는가?

04 스크롤:

- [ ] Stock이 좌측 영역 내부에서 독립적으로 스크롤되는가?
- [ ] Day 보드가 우측 영역에서 가로 스크롤되는가?
- [ ] 각 Day 컬럼의 카드 배치 영역만 세로 스크롤되는가?
- [ ] Day 이름/날짜/카드 수 헤더가 스크롤 중에도 남아 있는가?

고정 슬롯:

- [ ] 도착/출발 항공편 카드가 시각적으로 고정 앵커로 표시되는가?
- [ ] 고정 항공편 카드가 일반 드래그 카드와 분리되어 렌더링되는가?
- [ ] 숙소 카드가 고정 슬롯이 아니라 일반 `cards[]`에서 드래그 배치되는가?
- [ ] 항공편이 없을 때 Stock 영역에서 추가 affordance가 보이는가?

05:

- [ ] Trip/Day Alert가 유용한 계층으로 표시되는가?
- [ ] 체크리스트와 카드 맥락이 함께 읽기 쉬운가?
- [ ] 데모 Alert와 canonical 정책의 차이가 혼동되지 않는가?

---

## 12. 현재 상태

```text
화면 구현 스펙 v0.1
v3.2 정책 변경 이후 현재 프론트엔드 목 방향과 일치
```
