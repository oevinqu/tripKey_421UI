"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MainHeader, SubHeader } from "@/components/header";
import { TripCard } from "@/components/trip/TripCard";
import { AddTripCardDialog } from "@/components/trip/AddTripCardDialog";
import {
  createProcessingTripCard,
  finalizeProcessingTripCard,
  type NewTripCardInput,
} from "@/components/trip/addCardUtils";
import type { TripCardData } from "@/types/card";

const INITIAL_UNBOOKED_STOCK_CARDS: TripCardData[] = [
  {
    instance_id: "unbooked-1",
    place_id: "universal-studios-japan",
    name: "유니버설 스튜디오 재팬",
    category: "place",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: false,
    estimated_duration_min: 480,
    coordinates: { lat: 34.6654, lng: 135.4323 },
    time_constraint: null,
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: "오사카에서 하루를 크게 쓰는 메인 일정이에요.",
    tips: "입장 시간을 먼저 정하면 다른 날과 충돌이 줄어들어요.",
    tags: ["오사카"],
    source: "demo",
    day: null,
    notes: null,
    memo: null,
    location: "오사카",
  },
  {
    instance_id: "unbooked-2",
    place_id: null,
    name: "도톤보리 맛집 투어",
    category: "food",
    classification: "undecided",
    placement_status: "ready_partial",
    processing_status: "completed",
    action_type: "select_required",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: false,
    estimated_duration_min: 120,
    coordinates: { lat: 34.6687, lng: 135.5013 },
    time_constraint: null,
    question_text: "어떤 맛집을 중심으로 볼지 정해주세요.",
    options: null,
    blocked_reason: null,
    user_context: "저녁 동선에 맞춰 넣을 가능성이 높아요.",
    tips: "숙소 위치가 정해지면 저녁 귀가 동선까지 같이 잡기 쉬워져요.",
    tags: ["오사카"],
    source: "demo",
    day: null,
    notes: null,
    memo: null,
    location: "오사카",
  },
  {
    instance_id: "unbooked-3",
    place_id: "gion-district-kyoto",
    name: "기온 거리 산책",
    category: "activity",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: false,
    estimated_duration_min: 90,
    coordinates: { lat: 35.0037, lng: 135.7762 },
    time_constraint: null,
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: "교토에서 가볍게 산책하는 일정이에요.",
    tips: "숙소가 교토인지 오사카인지에 따라 배치 위치가 많이 달라져요.",
    tags: ["교토"],
    source: "demo",
    day: null,
    notes: null,
    memo: null,
    location: "교토",
  },
  {
    instance_id: "unbooked-4",
    place_id: "nara-deer-park",
    name: "나라 사슴공원",
    category: "activity",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: false,
    estimated_duration_min: 120,
    coordinates: { lat: 34.6851, lng: 135.8425 },
    time_constraint: null,
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: "나라 왕복은 항공 시간과 숙소 위치 영향을 크게 받아요.",
    tips: "항공이나 숙소가 정해지면 전체 일정에서 밀릴 수 있는 후보예요.",
    tags: ["나라"],
    source: "demo",
    day: null,
    notes: null,
    memo: null,
    location: "나라",
  },
];

const EMPTY_GROUPS = [
  {
    title: "항공권",
    reason:
      "아직 항공권이 없어서 Day 1 시작 시간과 마지막 날 마무리 시간이 모두 비어 있어요.",
  },
  {
    title: "숙소",
    reason:
      "아직 숙소가 없어서 숙소 중심 동선이나 체크인/체크아웃 앵커 없이 배치해야 하는 상태예요.",
  },
];

const DAY_COLUMNS = [
  { id: "day1", label: "Day 1", date: "5월 10일" },
  { id: "day2", label: "Day 2", date: "5월 11일" },
  { id: "day3", label: "Day 3", date: "5월 12일" },
  { id: "day4", label: "Day 4", date: "5월 13일" },
  { id: "day5", label: "Day 5", date: "5월 14일" },
];

export default function ArrangeUnbookedPage() {
  const [stockCards, setStockCards] = useState<TripCardData[]>(INITIAL_UNBOOKED_STOCK_CARDS);
  const [addCardOpen, setAddCardOpen] = useState(false);

  const hasExistingTransport = useMemo(
    () => stockCards.some((card) => card.category === "transport" && !card.is_excluded),
    [stockCards]
  );

  const handleAddCard = (input: NewTripCardInput) => {
    const processingCard = createProcessingTripCard("arr-unbooked-add", input);
    setStockCards((prev) => [...prev, finalizeProcessingTripCard(processingCard)]);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F3] font-sans">
      <MainHeader />
      <SubHeader
        currentStep={4}
        tripInfo={{
          destinations: ["오사카", "교토", "나라"],
          travelers: 2,
          startDate: "5월 10일",
          endDate: "5월 14일",
        }}
        rightButtons={
          <div className="flex items-center gap-2">
            <Link
              href="/arrange"
              className="rounded-lg border border-[#E0E0E0] bg-white px-4 py-2 text-[13px] font-medium text-[#666] no-underline transition-colors hover:bg-[#F8F8F8]"
            >
              기본 04로
            </Link>
            <button
              onClick={() => setAddCardOpen(true)}
              className="rounded-lg bg-[#534AB7] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#4840A0]"
            >
              카드 추가하기
            </button>
          </div>
        }
      />

      <div className="border-b border-[#EBEBEB] bg-white px-8 py-4 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          <h1 className="text-xl font-semibold text-[#1A1A1A]">일정 배치 미확정 케이스</h1>
          <p className="mt-1 text-sm text-[#888]">
            숙소와 항공권이 모두 없는 경우를 별도로 보는 논의용 화면이에요. 일부러 추가 버튼은 넣지 않았어요.
          </p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-[28rem] flex-col border-r border-[#EBEBEB] bg-white">
          <div className="border-b border-[#EBEBEB] p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[#1A1A1A]">카드 목록</h2>
              <span className="text-sm text-[#888]">{stockCards.length}개</span>
            </div>
            <p className="mt-2 text-xs text-[#888]">
              비어 있는 숙소/항공 그룹을 함께 두고, 나머지 카드가 어떤 영향을 받는지 보는 버전이에요.
            </p>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto p-4">
            {EMPTY_GROUPS.map((group) => (
              <div key={group.title} className="rounded-2xl border border-dashed border-[#D8D8E8] bg-[#FAFAFA] p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-[#1A1A1A]">{group.title}</h4>
                  <span className="text-xs text-[#AAA]">0개</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#888]">{group.reason}</p>
              </div>
            ))}

            <div className="rounded-2xl border border-[#E8E8E8] bg-[#FCFCFC] p-3">
              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-[#1A1A1A]">일반 카드</h4>
                  <span className="text-xs text-[#888]">{stockCards.length}개</span>
                </div>
                <p className="mt-1 text-xs text-[#888]">
                  숙소와 항공 없이도 먼저 배치할 수 있는 카드들이에요.
                </p>
              </div>
              <div className="space-y-3">
                {stockCards.map((card) => (
                  <TripCard key={card.instance_id} card={card} compact />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <div className="flex min-w-max gap-4 p-6">
            {DAY_COLUMNS.map((day) => (
              <div
                key={day.id}
                className="w-72 flex-shrink-0 rounded-xl border-2 border-dashed border-[#E0E0E0] bg-[#FAFAFA]"
              >
                <div className="rounded-t-xl border-b border-[#E8E8E8] bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[#1A1A1A]">{day.label}</h3>
                      <p className="text-xs text-[#888]">{day.date}</p>
                    </div>
                    <span className="text-sm font-medium text-[#BBB]">0개</span>
                  </div>
                </div>

                <div className="space-y-3 p-3">
                  {day.id === "day1" && (
                    <div className="rounded-2xl border border-dashed border-[#D9D3FF] bg-[#F7F5FF] px-4 py-3">
                      <p className="text-[11px] font-semibold tracking-[0.08em] text-[#8A84B5]">
                        비어 있는 시작점
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#1A1A1A]">도착 미확정</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-[#888]">
                        Day 1 시작 시간은 아직 비어 있어요. 오전 도착인지 오후 도착인지에 따라 배치가 달라질 수 있어요.
                      </p>
                    </div>
                  )}

                  <div className="flex h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-[#E5E5E5] bg-white text-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C0C0C0" strokeWidth="1.5" className="mb-2">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    <p className="text-xs font-medium text-[#999]">숙소와 항공 없이 먼저 배치해보는 영역</p>
                    <p className="mt-1 max-w-[13rem] text-[11px] leading-relaxed text-[#B0B0B0]">
                      이 버전에서는 숙소 고정도, 공항 고정도 없이 Day별 리듬만 먼저 보는 용도예요.
                    </p>
                  </div>

                  {day.id === "day5" && (
                    <div className="rounded-2xl border border-dashed border-[#D7E8F8] bg-[#F5FAFF] px-4 py-3">
                      <p className="text-[11px] font-semibold tracking-[0.08em] text-[#6C8AA3]">
                        비어 있는 마무리
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#1A1A1A]">귀국 미확정</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-[#888]">
                        마지막 날 종료 시간이 아직 비어 있어요. 귀국 시간이 정해져야 마지막 Day 흐름을 확정할 수 있어요.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddTripCardDialog
        open={addCardOpen}
        onOpenChange={setAddCardOpen}
        onSubmit={handleAddCard}
        hasExistingTransport={hasExistingTransport}
      />
    </div>
  );
}
