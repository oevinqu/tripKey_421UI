"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MainHeader, SubHeader } from "@/components/header";
import { TripCard } from "@/components/trip/TripCard";
import { TripCardDetailPanel } from "@/components/trip/TripCardDetailPanel";
import { TripCardData } from "@/types/card";

const INITIAL_STOCK_CARDS: TripCardData[] = [
  {
    instance_id: "stock-1",
    place_id: "ChIJ123USJ",
    name: "유니버설 스튜디오 재팬",
    category: "place",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: true,
    estimated_duration_min: 420,
    coordinates: { lat: 34.6654, lng: 135.4323 },
    time_constraint: "오전 9시 입장 추천",
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: "첫날 핵심 일정으로 계획하고 있어요",
    tips: "오전 인기 어트랙션부터 이동하면 효율적이에요.",
    tags: ["테마파크"],
    source: "ai_summary",
    day: null,
    notes: "해리포터 월드 꼭 가기",
    location: "오사카",
  },
  {
    instance_id: "stock-2",
    place_id: "ChIJd8BlQ2kAWDUR4V4rH7j0P7Q",
    name: "도톤보리 맛집 투어",
    category: "food",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: true,
    estimated_duration_min: 150,
    coordinates: { lat: 34.6687, lng: 135.5019 },
    time_constraint: "저녁 추천",
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: null,
    tips: null,
    tags: ["맛집"],
    source: "ai_summary",
    day: null,
    notes: null,
    location: "도톤보리",
  },
  {
    instance_id: "stock-3",
    place_id: "ChIJJ2o6vQJxAWARQJfgf7D4o6E",
    name: "후시미 이나리 신사",
    category: "place",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: true,
    estimated_duration_min: 180,
    coordinates: { lat: 34.9671, lng: 135.7727 },
    time_constraint: "오전",
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: null,
    tips: "이른 시간 방문이 좋아요.",
    tags: ["교토"],
    source: "ai_summary",
    day: null,
    notes: null,
    location: "교토",
  },
  {
    instance_id: "stock-4",
    place_id: null,
    name: "아라시야마 대나무숲",
    category: "place",
    classification: "open_question",
    placement_status: "ready_partial",
    processing_status: "completed",
    action_type: "select_required",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: true,
    estimated_duration_min: 150,
    coordinates: null,
    time_constraint: "오전 또는 오후",
    question_text: "오전과 오후 중 언제 방문하시겠어요?",
    options: [
      { id: "morning", label: "오전 (사람이 적음)" },
      { id: "afternoon", label: "오후 (빛이 예쁨)" },
    ],
    blocked_reason: null,
    user_context: null,
    tips: "한낮보다 오전이나 늦은 오후가 더 쾌적해요.",
    tags: ["교토"],
    source: "ai_summary",
    day: null,
    notes: null,
    location: "교토",
  },
  {
    instance_id: "stock-5",
    place_id: null,
    name: "교토역 → 오사카 이동",
    category: "transport",
    classification: "open_question",
    placement_status: "needs_input",
    processing_status: "completed",
    action_type: "input_required",
    can_exclude: true,
    allow_duplicate: true,
    is_excluded: false,
    is_ai_generated: false,
    estimated_duration_min: 55,
    coordinates: null,
    time_constraint: "저녁 이동",
    question_text: "이동 수단을 알려주세요 (신칸센, 특급열차 등)",
    options: null,
    blocked_reason: null,
    user_context: "짐이 많아 환승이 적은 경로를 선호해요",
    tips: null,
    tags: ["교통"],
    source: "user_input",
    day: null,
    notes: null,
    location: "교토역",
  },
  {
    instance_id: "stock-6",
    place_id: null,
    name: "나라 사슴공원",
    category: "activity",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: true,
    estimated_duration_min: 210,
    coordinates: null,
    time_constraint: null,
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: null,
    tips: null,
    tags: ["나라"],
    source: "ai_summary",
    day: null,
    notes: "사슴 센베이 구매",
    location: "나라",
  },
  {
    instance_id: "stock-7",
    place_id: null,
    name: "금각사 (킨카쿠지)",
    category: "place",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "processing",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: true,
    estimated_duration_min: 90,
    coordinates: null,
    time_constraint: null,
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: null,
    tips: null,
    tags: ["교토"],
    source: "ai_summary",
    day: null,
    notes: "최적 방문 시간 분석 중...",
    location: "교토",
  },
  {
    instance_id: "stock-8",
    place_id: null,
    name: "이치란 라멘",
    category: "food",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: true,
    estimated_duration_min: 60,
    coordinates: null,
    time_constraint: "저녁",
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: null,
    tips: null,
    tags: ["라멘"],
    source: "ai_summary",
    day: null,
    notes: null,
    location: "도톤보리점",
  },
  {
    instance_id: "stock-9",
    place_id: "ChIJ4cS1L9gAWDUR4P4LtB3R6CA",
    name: "오사카성",
    category: "place",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "pending",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: true,
    estimated_duration_min: 120,
    coordinates: { lat: 34.6873, lng: 135.5262 },
    time_constraint: null,
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: null,
    tips: null,
    tags: ["오사카"],
    source: "ai_summary",
    day: null,
    notes: null,
    location: "오사카",
  },
  {
    instance_id: "stock-10",
    place_id: null,
    name: "쿠로몬 시장",
    category: "food",
    classification: "open_question",
    placement_status: "blocked",
    processing_status: "failed",
    action_type: "fix_required",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: true,
    estimated_duration_min: 90,
    coordinates: null,
    time_constraint: "아침 또는 점심",
    question_text: "정보 처리 중 오류가 발생했습니다.",
    options: null,
    blocked_reason: "방문 시간 정보가 부족해 동선을 만들 수 없어요",
    user_context: null,
    tips: null,
    tags: ["시장"],
    source: "ai_summary",
    day: null,
    notes: null,
    location: "오사카",
  },
];

const INITIAL_DAYS = [
  { id: "day1", label: "Day 1", date: "5월 10일 (토)", cards: [] as TripCardData[] },
  { id: "day2", label: "Day 2", date: "5월 11일 (일)", cards: [] as TripCardData[] },
  { id: "day3", label: "Day 3", date: "5월 12일 (월)", cards: [] as TripCardData[] },
  { id: "day4", label: "Day 4", date: "5월 13일 (화)", cards: [] as TripCardData[] },
  { id: "day5", label: "Day 5", date: "5월 14일 (수)", cards: [] as TripCardData[] },
];

interface DayColumn {
  id: string;
  label: string;
  date: string;
  cards: TripCardData[];
}

export default function ArrangePage() {
  const [stockCards, setStockCards] = useState<TripCardData[]>(INITIAL_STOCK_CARDS);
  const [days, setDays] = useState<DayColumn[]>(INITIAL_DAYS);
  const [selectedCard, setSelectedCard] = useState<TripCardData | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [draggedCard, setDraggedCard] = useState<TripCardData | null>(null);
  const [dragSource, setDragSource] = useState<string | null>(null);

  const currentStep = 4;

  const placedCardsCount = days.reduce((sum, day) => sum + day.cards.length, 0);
  const totalCards = stockCards.length + placedCardsCount;
  const progress = totalCards > 0 ? Math.round((placedCardsCount / totalCards) * 100) : 0;

  const canDrag = (card: TripCardData) =>
    card.placement_status !== "blocked" && card.placement_status !== "needs_input";

  const handleDragStart = (card: TripCardData, source: string) => {
    if (!canDrag(card)) return;
    setDraggedCard(card);
    setDragSource(source);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDragSource(null);
  };

  const handleDropOnDay = (dayId: string) => {
    if (!draggedCard || !dragSource) return;

    if (dragSource === "stock") {
      setStockCards((prev) =>
        prev.filter((card) => card.instance_id !== draggedCard.instance_id)
      );
      setDays((prev) =>
        prev.map((day) =>
          day.id === dayId
            ? {
                ...day,
                cards: [
                  ...day.cards,
                  { ...draggedCard, day: Number.parseInt(dayId.replace("day", ""), 10) },
                ],
              }
            : day
        )
      );
    } else {
      setDays((prev) =>
        prev.map((day) => {
          if (day.id === dragSource) {
            return {
              ...day,
              cards: day.cards.filter(
                (card) => card.instance_id !== draggedCard.instance_id
              ),
            };
          }

          if (day.id === dayId) {
            return {
              ...day,
              cards: [
                ...day.cards,
                { ...draggedCard, day: Number.parseInt(dayId.replace("day", ""), 10) },
              ],
            };
          }

          return day;
        })
      );
    }

    handleDragEnd();
  };

  const handleDropOnStock = () => {
    if (!draggedCard || dragSource === "stock") {
      handleDragEnd();
      return;
    }

    setDays((prev) =>
      prev.map((day) =>
        day.id === dragSource
          ? {
              ...day,
              cards: day.cards.filter(
                (card) => card.instance_id !== draggedCard.instance_id
              ),
            }
          : day
      )
    );
    setStockCards((prev) => [...prev, { ...draggedCard, day: null }]);
    handleDragEnd();
  };

  const handleCardClick = (card: TripCardData) => {
    setSelectedCard(card);
    setDetailOpen(true);
  };

  const handleUpdateCard = (updatedCard: TripCardData) => {
    setStockCards((prev) =>
      prev.map((card) =>
        card.instance_id === updatedCard.instance_id ? updatedCard : card
      )
    );
    setDays((prev) =>
      prev.map((day) => ({
        ...day,
        cards: day.cards.map((card) =>
          card.instance_id === updatedCard.instance_id ? updatedCard : card
        ),
      }))
    );
    setSelectedCard(updatedCard);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const updateProcessingCards = (cards: TripCardData[]) =>
        cards.map((card) => {
          if (card.processing_status === "processing" && Math.random() > 0.5) {
            return { ...card, processing_status: "completed" as const };
          }

          if (card.processing_status === "pending" && Math.random() > 0.7) {
            return { ...card, processing_status: "processing" as const };
          }

          return card;
        });

      setStockCards(updateProcessingCards);
      setDays((prev) =>
        prev.map((day) => ({
          ...day,
          cards: updateProcessingCards(day.cards),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F3] font-sans">
      <MainHeader />
      <SubHeader
        currentStep={currentStep}
        tripInfo={{
          destinations: ["오사카", "교토", "나라"],
          travelers: 2,
          startDate: "5월 10일",
          endDate: "5월 14일",
        }}
      />

      <div className="border-b border-[#EBEBEB] bg-white px-8 py-4 lg:px-12">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#1A1A1A]">일정 배치</h1>
            <p className="mt-1 text-sm text-[#888]">카드를 드래그하여 원하는 날짜에 배치하세요</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-[#666]">배치 완료</p>
              <p className="text-lg font-semibold text-[#534AB7]">{placedCardsCount}/{totalCards}</p>
            </div>
            <div className="h-2 w-32 overflow-hidden rounded-full bg-[#E8E8E8]">
              <div
                className="h-full rounded-full bg-[#534AB7] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          className="flex w-80 flex-col border-r border-[#EBEBEB] bg-white"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropOnStock}
        >
          <div className="border-b border-[#EBEBEB] p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[#1A1A1A]">보관함</h2>
              <span className="text-sm text-[#888]">{stockCards.length}개</span>
            </div>
            <p className="mt-1 text-xs text-[#999]">배치할 카드를 오른쪽으로 드래그하세요</p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {stockCards.map((card) => {
              const isBlocked = card.placement_status === "blocked";
              const isNeedsInput = card.placement_status === "needs_input";
              const isDraggable = canDrag(card);

              return (
                <div
                  key={card.instance_id}
                  draggable={isDraggable}
                  onDragStart={() => handleDragStart(card, "stock")}
                  onDragEnd={handleDragEnd}
                  className={`relative ${isDraggable ? "cursor-grab active:cursor-grabbing" : "opacity-60"}`}
                >
                  <TripCard card={card} onClick={() => handleCardClick(card)} compact />

                  {isDraggable && (
                    <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded bg-[#F5F5F5] opacity-60">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                        <circle cx="9" cy="5" r="1" />
                        <circle cx="9" cy="12" r="1" />
                        <circle cx="9" cy="19" r="1" />
                        <circle cx="15" cy="5" r="1" />
                        <circle cx="15" cy="12" r="1" />
                        <circle cx="15" cy="19" r="1" />
                      </svg>
                    </div>
                  )}

                  {isBlocked && (
                    <div
                      className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-xl bg-white/60 transition-colors hover:bg-white/40"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(card);
                      }}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="rounded-lg border border-[#FECACA] bg-[#FEE2E2] px-3 py-1.5 text-xs font-semibold text-[#DC2626] shadow-sm">
                          해결 필요
                        </span>
                        <span className="text-[10px] text-[#DC2626]">클릭하여 해결하기</span>
                      </div>
                    </div>
                  )}

                  {isNeedsInput && (
                    <div
                      className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-xl bg-white/60 transition-colors hover:bg-white/40"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(card);
                      }}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="rounded-lg border border-[#FED7AA] bg-[#FFEDD5] px-3 py-1.5 text-xs font-semibold text-[#EA580C] shadow-sm">
                          입력 필요
                        </span>
                        <span className="text-[10px] text-[#EA580C]">클릭하여 입력하기</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {stockCards.length === 0 && (
              <div className="py-12 text-center text-[#999]">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-3 opacity-40">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </svg>
                <p className="text-sm">모든 카드가 배치되었습니다!</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <div className="flex min-w-max gap-4 p-6">
            {days.map((day) => (
              <div
                key={day.id}
                className={`w-72 flex-shrink-0 rounded-xl border-2 border-dashed bg-[#FAFAFA] transition-colors ${
                  draggedCard && dragSource !== day.id
                    ? "border-[#534AB7] bg-[#F9F8FF]"
                    : "border-[#E0E0E0]"
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDropOnDay(day.id)}
              >
                <div className="rounded-t-xl border-b border-[#E8E8E8] bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[#1A1A1A]">{day.label}</h3>
                      <p className="text-xs text-[#888]">{day.date}</p>
                    </div>
                    <span className="text-sm font-medium text-[#534AB7]">{day.cards.length}개</span>
                  </div>
                </div>

                <div className="min-h-[400px] space-y-3 p-3">
                  {day.cards.map((card, index) => (
                    <div
                      key={card.instance_id}
                      draggable={canDrag(card)}
                      onDragStart={() => handleDragStart(card, day.id)}
                      onDragEnd={handleDragEnd}
                      className={`relative ${canDrag(card) ? "cursor-grab active:cursor-grabbing" : ""}`}
                    >
                      <div className="absolute -left-1 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-[#534AB7] text-xs font-medium text-white">
                        {index + 1}
                      </div>
                      <div className="ml-4">
                        <TripCard card={card} onClick={() => handleCardClick(card)} compact />
                      </div>
                    </div>
                  ))}

                  {day.cards.length === 0 && (
                    <div className="flex h-32 flex-col items-center justify-center text-[#B0B0B0]">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      <p className="text-xs">카드를 여기에 드롭하세요</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[#EBEBEB] bg-white px-8 py-4 lg:px-12">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between">
          <Link
            href="/organize"
            className="flex items-center gap-2 rounded-xl border border-[#E0E0E0] bg-white px-6 py-3 text-sm font-medium text-[#666] no-underline transition-colors hover:bg-[#F8F8F8]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" />
            </svg>
            이전 단계
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-sm text-[#888]">
              {stockCards.length}개 카드가 아직 배치되지 않았습니다
            </span>
            <Link
              href="/"
              className={`flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold no-underline transition-all ${
                stockCards.length === 0
                  ? "bg-[#534AB7] text-white shadow-md shadow-[#534AB7]/20 hover:bg-[#4840A0]"
                  : "pointer-events-none cursor-not-allowed bg-[#E8E8E8] text-[#999]"
              }`}
            >
              일정 확정하기
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {selectedCard && (
        <TripCardDetailPanel
          card={selectedCard}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          onUpdateCard={handleUpdateCard}
          showDuplicateToggle={true}
        />
      )}
    </div>
  );
}
