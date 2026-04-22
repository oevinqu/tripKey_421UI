"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MainHeader, SubHeader } from "@/components/header";
import { TripCard } from "@/components/trip/TripCard";
import { TripCardDetailPanel } from "@/components/trip/TripCardDetailPanel";
import { TripCardData } from "@/types/card";

const INITIAL_STOCK_CARDS: TripCardData[] = [
  {
    instance_id: "arr-1",
    place_id: "osaka-1",
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
    time_constraint: "오전 9시",
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: "첫날 핵심 일정이에요",
    tips: "입장 직후 인기 어트랙션부터 이동하면 좋아요.",
    tags: ["오사카"],
    source: "ai_summary",
    day: null,
    notes: null,
    location: "오사카",
  },
  {
    instance_id: "arr-2",
    place_id: "osaka-2",
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
    tips: "저녁 피크 시간을 피하면 대기가 줄어요.",
    tags: ["오사카"],
    source: "ai_summary",
    day: null,
    notes: null,
    location: "오사카",
  },
  {
    instance_id: "arr-3",
    place_id: "osaka-3",
    name: "오사카성",
    category: "place",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: true,
    estimated_duration_min: 120,
    coordinates: { lat: 34.6873, lng: 135.5262 },
    time_constraint: "오후",
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
    instance_id: "arr-4",
    place_id: "osaka-4",
    name: "쿠로몬 시장",
    category: "food",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: true,
    estimated_duration_min: 90,
    coordinates: null,
    time_constraint: "점심 전",
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: null,
    tips: "오후에는 문 닫는 가게가 많아요.",
    tags: ["오사카"],
    source: "ai_summary",
    day: null,
    notes: null,
    location: "오사카",
  },
  {
    instance_id: "arr-5",
    place_id: "osaka-5",
    name: "하루카스 300 전망대",
    category: "place",
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
    time_constraint: "해질녘",
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
    instance_id: "arr-6",
    place_id: "osaka-6",
    name: "난바 체크인",
    category: "accommodation",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: true,
    is_excluded: false,
    is_ai_generated: false,
    estimated_duration_min: 30,
    coordinates: null,
    time_constraint: "16시 이후",
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: null,
    tips: "체크인 전 짐 보관 가능 여부를 확인해보세요.",
    tags: ["오사카"],
    source: "booking",
    day: null,
    notes: null,
    location: "오사카",
  },
  {
    instance_id: "arr-7",
    place_id: "kyoto-1",
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
    coordinates: null,
    time_constraint: "오전",
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: null,
    tips: "이른 아침이 가장 여유로워요.",
    tags: ["교토"],
    source: "ai_summary",
    day: null,
    notes: null,
    location: "교토",
  },
  {
    instance_id: "arr-8",
    place_id: "kyoto-2",
    name: "기온 거리 산책",
    category: "activity",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: true,
    estimated_duration_min: 90,
    coordinates: null,
    time_constraint: "해질녘",
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: null,
    tips: null,
    tags: ["교토"],
    source: "ai_summary",
    day: null,
    notes: null,
    location: "교토",
  },
  {
    instance_id: "arr-9",
    place_id: "nara-1",
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
    time_constraint: "오후",
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: null,
    tips: "사슴 센베이는 조금씩만 꺼내는 편이 좋아요.",
    tags: ["나라"],
    source: "ai_summary",
    day: null,
    notes: null,
    location: "나라",
  },
  {
    instance_id: "arr-10",
    place_id: null,
    name: "환전 메모",
    category: "etc",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: true,
    is_excluded: false,
    is_ai_generated: false,
    estimated_duration_min: 20,
    coordinates: null,
    time_constraint: "출국 전",
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: "현금 결제를 대비해 10만 원 정도 환전하려고 하셨어요",
    tips: null,
    tags: ["메모"],
    source: "user_input",
    day: null,
    notes: null,
    location: undefined,
  },
  {
    instance_id: "arr-11",
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
    question_text: "이동 수단을 알려주세요.",
    options: null,
    blocked_reason: null,
    user_context: "짐이 많아 환승이 적은 경로를 선호해요",
    tips: null,
    tags: ["교통"],
    source: "user_input",
    day: null,
    notes: null,
    location: "교토",
  },
  {
    instance_id: "arr-12",
    place_id: null,
    name: "신사이바시 쇼핑",
    category: "activity",
    classification: "open_question",
    placement_status: "ready_partial",
    processing_status: "completed",
    action_type: "input_required",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: true,
    estimated_duration_min: 120,
    coordinates: null,
    time_constraint: null,
    question_text: "쇼핑 예산과 관심 품목을 알려주세요.",
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
    instance_id: "arr-13",
    place_id: null,
    name: "아라시야마 대나무숲",
    category: "place",
    classification: "undecided",
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
    tips: "오전 방문이 더 쾌적해요.",
    tags: ["교토"],
    source: "ai_summary",
    day: null,
    notes: null,
    location: "교토",
  },
  {
    instance_id: "arr-14",
    place_id: null,
    name: "교토 숙소 박수 확인",
    category: "accommodation",
    classification: "open_question",
    placement_status: "ready_partial",
    processing_status: "completed",
    action_type: "select_required",
    can_exclude: true,
    allow_duplicate: true,
    is_excluded: false,
    is_ai_generated: false,
    estimated_duration_min: null,
    coordinates: null,
    time_constraint: "체크인 전",
    question_text: "몇 박을 숙박하시겠어요?",
    options: [
      { id: "one", label: "1박" },
      { id: "two", label: "2박" },
    ],
    blocked_reason: null,
    user_context: null,
    tips: null,
    tags: ["숙소"],
    source: "booking",
    day: null,
    notes: null,
    location: "교토",
  },
  {
    instance_id: "arr-15",
    place_id: null,
    name: "오사카성 보정 요청",
    category: "place",
    classification: "undecided",
    placement_status: "blocked",
    processing_status: "failed",
    action_type: "fix_required",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: true,
    estimated_duration_min: 120,
    coordinates: null,
    time_constraint: null,
    question_text: "방문 목적이나 희망 시간을 다시 입력해주세요.",
    options: null,
    blocked_reason: "방문 시간 정보가 누락되었어요",
    user_context: null,
    tips: null,
    tags: ["오사카"],
    source: "ai_summary",
    day: null,
    notes: null,
    location: "오사카",
  },
  {
    instance_id: "arr-16",
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
    instance_id: "arr-17",
    place_id: null,
    name: "간사이 공항 출발 동선",
    category: "transport",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "pending",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: true,
    is_excluded: false,
    is_ai_generated: true,
    estimated_duration_min: 70,
    coordinates: null,
    time_constraint: "출국 3시간 전",
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: null,
    tips: null,
    tags: ["공항"],
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

const UNAVAILABLE_META = {
  ready: {
    title: "ready",
    description: "위치 정보가 없어 아직 지역 그룹에 올릴 수 없어요",
  },
  input_required: {
    title: "input_required",
    description: "직접 입력이 필요해 드래그할 수 없어요",
  },
  select_required: {
    title: "select_required",
    description: "선택이 필요해 드래그할 수 없어요",
  },
  fix_required: {
    title: "fix_required",
    description: "수정이 필요해 드래그할 수 없어요",
  },
  processing: {
    title: "processing",
    description: "AI 처리 중이라 완료되면 자동으로 available로 이동해요",
  },
} as const;

interface DayColumn {
  id: string;
  label: string;
  date: string;
  cards: TripCardData[];
}

function chunkCards(cards: TripCardData[], size: number) {
  const chunks: TripCardData[][] = [];

  for (let index = 0; index < cards.length; index += size) {
    chunks.push(cards.slice(index, index + size));
  }

  return chunks;
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
    card.placement_status === "ready" &&
    card.processing_status === "completed" &&
    card.action_type === "review_only";

  const stockSections = useMemo(() => {
    const availableCards = stockCards.filter(
      (card) =>
        card.placement_status === "ready" &&
        card.processing_status === "completed" &&
        card.action_type === "review_only" &&
        Boolean(card.location)
    );

    const availableByLocation = availableCards.reduce<Record<string, TripCardData[]>>(
      (accumulator, card) => {
        const key = card.location ?? "기타";
        accumulator[key] = [...(accumulator[key] ?? []), card];
        return accumulator;
      },
      {}
    );

    const availableGroups = Object.entries(availableByLocation).flatMap(([location, cards]) =>
      chunkCards(cards, 5).map((chunk, index) => ({
        id: `${location}-${index + 1}`,
        title: cards.length > 5 ? `${location} ${index + 1}` : location,
        cards: chunk,
      }))
    );

    return {
      available: availableGroups,
      unavailable: {
        ready: stockCards.filter(
          (card) =>
            card.placement_status === "ready" &&
            card.processing_status === "completed" &&
            card.action_type === "review_only" &&
            !card.location
        ),
        input_required: stockCards.filter((card) => card.action_type === "input_required"),
        select_required: stockCards.filter((card) => card.action_type === "select_required"),
        fix_required: stockCards.filter((card) => card.action_type === "fix_required"),
        processing: stockCards.filter(
          (card) =>
            card.processing_status === "pending" ||
            card.processing_status === "processing"
        ),
      },
    };
  }, [stockCards]);

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

  const renderStockCard = (card: TripCardData, source: string) => {
    const isBlocked = card.placement_status === "blocked";
    const isNeedsInput = card.placement_status === "needs_input";
    const isProcessing =
      card.processing_status === "pending" || card.processing_status === "processing";
    const isDraggable = canDrag(card);

    return (
      <div
        key={card.instance_id}
        draggable={isDraggable}
        onDragStart={() => handleDragStart(card, source)}
        onDragEnd={handleDragEnd}
        className={`relative ${isDraggable ? "cursor-grab active:cursor-grabbing" : isProcessing ? "" : "opacity-90"}`}
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

        {card.action_type === "select_required" && (
          <div
            className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-xl bg-white/60 transition-colors hover:bg-white/40"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick(card);
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="rounded-lg border border-[#FDE68A] bg-[#FEF3C7] px-3 py-1.5 text-xs font-semibold text-[#B45309] shadow-sm">
                선택 필요
              </span>
              <span className="text-[10px] text-[#B45309]">클릭하여 선택하기</span>
            </div>
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
              <span className="text-[10px] text-[#DC2626]">클릭하여 수정하기</span>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/65">
            <div className="flex flex-col items-center gap-1">
              <span className="rounded-lg border border-[#C7D2FE] bg-[#EEF2FF] px-3 py-1.5 text-xs font-semibold text-[#534AB7] shadow-sm">
                처리 중
              </span>
              <span className="text-[10px] text-[#534AB7]">완료되면 자동 이동</span>
            </div>
          </div>
        )}
      </div>
    );
  };

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
            <p className="mt-1 text-sm text-[#888]">available/unavailable 구조로 배치 가능한 카드를 정리했어요</p>
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
          className="flex w-[28rem] flex-col border-r border-[#EBEBEB] bg-white"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropOnStock}
        >
          <div className="border-b border-[#EBEBEB] p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[#1A1A1A]">보관함</h2>
              <span className="text-sm text-[#888]">{stockCards.length}개</span>
            </div>
            <p className="mt-1 text-xs text-[#999]">available은 지역별로, unavailable은 상태별로 나누어 보여줍니다</p>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto p-4">
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A1A]">available</h3>
                  <p className="text-xs text-[#888]">즉시 배치 가능한 카드</p>
                </div>
                <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-xs font-medium text-[#534AB7]">
                  {stockSections.available.reduce((sum, group) => sum + group.cards.length, 0)}개
                </span>
              </div>

              {stockSections.available.length > 0 ? (
                stockSections.available.map((group) => (
                  <div key={group.id} className="rounded-2xl border border-[#E8E8E8] bg-[#FAFAFA] p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[#1A1A1A]">{group.title}</h4>
                      <span className="text-xs text-[#888]">{group.cards.length}개</span>
                    </div>
                    <div className="space-y-3">
                      {group.cards.map((card) => renderStockCard(card, "stock"))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[#D8D8D8] bg-[#FAFAFA] p-4 text-xs text-[#888]">
                  현재 available 조건을 만족하는 카드가 없어요.
                </div>
              )}
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A1A]">unavailable</h3>
                  <p className="text-xs text-[#888]">지금은 바로 배치할 수 없는 카드</p>
                </div>
                <span className="rounded-full bg-[#F3F4F6] px-2.5 py-1 text-xs font-medium text-[#6B7280]">
                  {Object.values(stockSections.unavailable).reduce((sum, cards) => sum + cards.length, 0)}개
                </span>
              </div>

              {Object.entries(UNAVAILABLE_META).map(([key, meta]) => {
                const cards = stockSections.unavailable[key as keyof typeof stockSections.unavailable];

                return (
                  <div key={key} className="rounded-2xl border border-[#E8E8E8] bg-[#FCFCFC] p-3">
                    <div className="mb-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-[#1A1A1A]">{meta.title}</h4>
                        <span className="text-xs text-[#888]">{cards.length}개</span>
                      </div>
                      <p className="mt-1 text-xs text-[#888]">{meta.description}</p>
                    </div>

                    {cards.length > 0 ? (
                      <div className="space-y-3">
                        {cards.map((card) => renderStockCard(card, "stock"))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-[#E5E5E5] bg-white px-3 py-4 text-xs text-[#AAA]">
                        이 섹션에는 아직 카드가 없어요.
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
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
