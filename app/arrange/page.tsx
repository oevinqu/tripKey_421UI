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
    user_context: "하루 종일 놀 예정이에요",
    tips: "오픈런 추천, 인기 어트랙션은 오전에 먼저 방문하세요",
    tags: ["테마파크", "오사카"],
    source: "dump",
    day: null,
    notes: null,
    location: "오사카",
  },
  {
    instance_id: "arr-2",
    place_id: null,
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
    estimated_duration_min: 120,
    coordinates: { lat: 34.6687, lng: 135.5013 },
    time_constraint: null,
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: "도톤보리 맛집 여러 곳 둘러볼 예정",
    tips: "저녁 시간대는 웨이팅이 길 수 있어요",
    tags: ["맛집", "도톤보리", "오사카"],
    source: "dump",
    day: null,
    notes: null,
    location: "오사카",
  },
  {
    instance_id: "arr-3",
    place_id: "osaka-castle",
    name: "오사카성",
    category: "place",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: false,
    estimated_duration_min: 120,
    coordinates: { lat: 34.6873, lng: 135.5262 },
    time_constraint: null,
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: null,
    tips: null,
    tags: ["오사카"],
    source: "dump",
    day: null,
    notes: null,
    location: "오사카",
  },
  {
    instance_id: "arr-4",
    place_id: "kuromon-market",
    name: "쿠로몬 시장",
    category: "food",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: false,
    estimated_duration_min: 90,
    coordinates: null,
    time_constraint: null,
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: null,
    tips: "오후에는 문 닫는 가게가 많아요",
    tags: ["시장", "오사카"],
    source: "dump",
    day: null,
    notes: null,
    location: "오사카",
  },
  {
    instance_id: "arr-5",
    place_id: "abeno-harukas-300",
    name: "하루카스 300 전망대",
    category: "place",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: false,
    estimated_duration_min: 90,
    coordinates: { lat: 34.6454, lng: 135.5136 },
    time_constraint: null,
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: null,
    tips: "날씨 맑은 날 방문 추천",
    tags: ["전망대", "오사카"],
    source: "dump",
    day: null,
    notes: null,
    location: "오사카",
  },
  {
    instance_id: "arr-6",
    place_id: null,
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
    estimated_duration_min: 0,
    coordinates: null,
    time_constraint: null,
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: "오사카 숙소로 난바 근처를 잡았어요",
    tips: null,
    tags: ["숙소", "오사카"],
    source: "dump",
    day: null,
    notes: null,
    location: "오사카",
  },
  {
    instance_id: "arr-7",
    place_id: "fushimi-inari",
    name: "후시미 이나리 신사",
    category: "place",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: false,
    estimated_duration_min: 120,
    coordinates: null,
    time_constraint: null,
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: null,
    tips: "이른 아침이 가장 여유로워요",
    tags: ["교토", "신사"],
    source: "dump",
    day: null,
    notes: null,
    location: "교토",
  },
  {
    instance_id: "arr-8",
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
    user_context: null,
    tips: null,
    tags: ["교토", "산책"],
    source: "dump",
    day: null,
    notes: null,
    location: "교토",
  },
  {
    instance_id: "arr-9",
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
    user_context: null,
    tips: "사슴 전용 과자 판매소 근처는 혼잡할 수 있어요",
    tags: ["나라", "동물"],
    source: "dump",
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
    allow_duplicate: false,
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
    source: "dump",
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
    time_constraint: null,
    question_text: "이동 수단을 알려주세요",
    options: null,
    blocked_reason: null,
    user_context: "짐이 많아 환승이 적은 경로를 선호해요",
    tips: null,
    tags: ["교통"],
    source: "dump",
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
    question_text: "쇼핑 예산과 관심 품목을 알려주세요",
    options: null,
    blocked_reason: null,
    user_context: null,
    tips: null,
    tags: ["오사카"],
    source: "dump",
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
    estimated_duration_min: 60,
    coordinates: { lat: 35.0094, lng: 135.6722 },
    time_constraint: null,
    question_text: "아라시야마 대나무숲을 일정에 포함할까요?",
    options: [
      { id: "bamboo-1", label: "포함할게요" },
      { id: "bamboo-2", label: "다른 날로 미룰게요" },
      { id: "bamboo-3", label: "제외할게요" },
    ],
    blocked_reason: null,
    user_context: null,
    tips: "이른 아침 방문 시 한산해요",
    tags: ["교토", "자연"],
    source: "dump",
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
    time_constraint: null,
    question_text: "몇 박을 숙박하시겠어요?",
    options: [
      { id: "one", label: "1박" },
      { id: "two", label: "2박" },
    ],
    blocked_reason: null,
    user_context: null,
    tips: null,
    tags: ["숙소"],
    source: "dump",
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
    is_ai_generated: false,
    estimated_duration_min: null,
    coordinates: null,
    time_constraint: null,
    question_text: "방문 목적이나 희망 시간을 다시 입력해주세요",
    options: null,
    blocked_reason: "방문 시간 정보가 누락되었어요",
    user_context: null,
    tips: null,
    tags: ["오사카"],
    source: "dump",
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
    is_ai_generated: false,
    estimated_duration_min: 90,
    coordinates: null,
    time_constraint: null,
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: null,
    tips: null,
    tags: ["교토"],
    source: "dump",
    day: null,
    notes: null,
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
    is_ai_generated: false,
    estimated_duration_min: 70,
    coordinates: null,
    time_constraint: null,
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: null,
    tips: null,
    tags: ["공항"],
    source: "dump",
    day: null,
    notes: null,
    location: "간사이 공항",
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

interface PendingPlacementDecision {
  card: TripCardData;
  targetDayId: string;
}

function chunkCards(cards: TripCardData[], size: number) {
  const chunks: TripCardData[][] = [];

  for (let index = 0; index < cards.length; index += size) {
    chunks.push(cards.slice(index, index + size));
  }

  return chunks;
}

function isAirportCard(card: TripCardData) {
  return (
    card.category === "transport" &&
    ((card.name?.includes("공항") ?? false) || (card.location?.includes("공항") ?? false))
  );
}

function isAccommodationCard(card: TripCardData) {
  return card.category === "accommodation";
}

export default function ArrangePage() {
  const [stockCards, setStockCards] = useState<TripCardData[]>(INITIAL_STOCK_CARDS);
  const [days, setDays] = useState<DayColumn[]>(INITIAL_DAYS);
  const [selectedCard, setSelectedCard] = useState<TripCardData | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [draggedCard, setDraggedCard] = useState<TripCardData | null>(null);
  const [dragSource, setDragSource] = useState<string | null>(null);
  const [draggedCardIndex, setDraggedCardIndex] = useState<number | null>(null);
  const [pendingPlacementDecision, setPendingPlacementDecision] =
    useState<PendingPlacementDecision | null>(null);

  const currentStep = 4;

  const placedCardIds = new Set(
    days.flatMap((day) => day.cards.map((card) => card.instance_id))
  );
  const placedCardsCount = placedCardIds.size;
  const totalCards = stockCards.length;
  const progress = totalCards > 0 ? Math.round((placedCardsCount / totalCards) * 100) : 0;

  const canDrag = (card: TripCardData) =>
    (card.placement_status === "ready" ||
      card.placement_status === "ready_partial") &&
    card.processing_status === "completed";

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

  const getPlacements = (cardInstanceId: string) =>
    days.flatMap((day) =>
      day.cards.flatMap((card, index) =>
        card.instance_id === cardInstanceId ? [{ dayId: day.id, index }] : []
      )
    );

  const isCardPlaced = (cardInstanceId: string) => getPlacements(cardInstanceId).length > 0;

  const placeCardOnDay = (dayList: DayColumn[], dayId: string, card: TripCardData) =>
    dayList.map((day) =>
      day.id === dayId
        ? {
            ...day,
            cards: [
              ...day.cards,
              { ...card, day: Number.parseInt(dayId.replace("day", ""), 10) },
            ],
          }
        : day
    );

  const removeCardPlacement = (
    dayList: DayColumn[],
    sourceDayId: string,
    sourceIndex: number
  ) =>
    dayList.map((day) =>
      day.id === sourceDayId
        ? {
            ...day,
            cards: day.cards.filter((_, index) => index !== sourceIndex),
          }
        : day
    );

  const removeAllCardPlacements = (dayList: DayColumn[], cardInstanceId: string) =>
    dayList.map((day) => ({
      ...day,
      cards: day.cards.filter((card) => card.instance_id !== cardInstanceId),
    }));

  const syncCardAcrossBoard = (updatedCard: TripCardData) => {
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
    setSelectedCard((prev) =>
      prev?.instance_id === updatedCard.instance_id ? updatedCard : prev
    );
  };

  const stockSections = useMemo(() => {
    const promotedCards = stockCards.filter(
      (card) =>
        (card.placement_status === "ready" ||
          card.placement_status === "ready_partial") &&
        card.processing_status === "completed"
    );

    const airportCards = promotedCards.filter(isAirportCard);
    const accommodationCards = promotedCards.filter(
      (card) => isAccommodationCard(card) && !isAirportCard(card)
    );
    const regionCards = promotedCards.filter(
      (card) => !isAirportCard(card) && !isAccommodationCard(card)
    );

    const availableByLocation = regionCards.reduce<Record<string, TripCardData[]>>(
      (accumulator, card) => {
        const key = card.location ?? "기타";
        accumulator[key] = [...(accumulator[key] ?? []), card];
        return accumulator;
      },
      {}
    );

    const regionGroups = Object.entries(availableByLocation).flatMap(([location, cards]) =>
      chunkCards(cards, 5).map((chunk, index) => {
        const isSplit = cards.length > 5;

        return {
          id: `${location}-${index + 1}`,
          title: isSplit ? `${location} ${index + 1}` : location,
          reason: isSplit
            ? `${location} 지역 카드가 5개를 넘어 묶음을 나눈 그룹이에요.`
            : `${location} 기준으로 바로 배치 가능한 카드를 묶은 그룹이에요.`,
          cards: chunk,
        };
      })
    );

    const promotedGroups = [
      ...(airportCards.length > 0
        ? [
            {
              id: "airport",
              title: "공항",
              reason: "공항 이동과 출발/도착 카드는 별도 흐름으로 관리하기 위해 따로 묶었어요.",
              cards: airportCards,
            },
          ]
        : []),
      ...(accommodationCards.length > 0
        ? [
            {
              id: "accommodation",
              title: "숙소",
              reason: "숙소 카드는 체크인/체크아웃 기준이 달라 지역 그룹과 분리했어요.",
              cards: accommodationCards,
            },
          ]
        : []),
      ...regionGroups,
    ];

    const unpromotedCards = stockCards.filter(
      (card) =>
        !(
          (card.placement_status === "ready" ||
            card.placement_status === "ready_partial") &&
          card.processing_status === "completed"
        )
    );

    return {
      promoted: promotedGroups,
      unpromoted: {
        title: "미승격 카드",
        reason: "needs_input, blocked 상태이거나 아직 AI 처리가 끝나지 않아 바로 배치할 수 없는 카드들이에요.",
        cards: unpromotedCards,
      },
    };
  }, [stockCards]);

  const handleDragStart = (card: TripCardData, source: string) => {
    if (!canDrag(card)) return;
    setDraggedCard(card);
    setDragSource(source);
    setDraggedCardIndex(null);
  };

  const handleDayCardDragStart = (card: TripCardData, source: string, index: number) => {
    if (!canDrag(card)) return;
    setDraggedCard(card);
    setDragSource(source);
    setDraggedCardIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDragSource(null);
    setDraggedCardIndex(null);
  };

  const handleDropOnDay = (dayId: string) => {
    if (!draggedCard || !dragSource) return;

    if (dragSource === "stock") {
      const existingPlacements = getPlacements(draggedCard.instance_id);

      if (existingPlacements.length === 0 || draggedCard.allow_duplicate) {
        setDays((prev) => placeCardOnDay(prev, dayId, draggedCard));
        handleDragEnd();
        return;
      }

      setPendingPlacementDecision({ card: draggedCard, targetDayId: dayId });
      handleDragEnd();
      return;
    }

    if (dragSource === dayId) {
      handleDragEnd();
      return;
    }

    if (draggedCardIndex == null) {
      handleDragEnd();
      return;
    }

    setDays((prev) => {
      const withoutDraggedPlacement = removeCardPlacement(prev, dragSource, draggedCardIndex);
      return placeCardOnDay(withoutDraggedPlacement, dayId, draggedCard);
    });

    handleDragEnd();
  };

  const handleDuplicatePlacement = () => {
    if (!pendingPlacementDecision) return;

    const updatedCard = { ...pendingPlacementDecision.card, allow_duplicate: true };
    syncCardAcrossBoard(updatedCard);
    setDays((prev) => placeCardOnDay(prev, pendingPlacementDecision.targetDayId, updatedCard));
    setPendingPlacementDecision(null);
  };

  const handleMovePlacement = () => {
    if (!pendingPlacementDecision) return;

    setDays((prev) => {
      const clearedDays = removeAllCardPlacements(prev, pendingPlacementDecision.card.instance_id);
      return placeCardOnDay(clearedDays, pendingPlacementDecision.targetDayId, pendingPlacementDecision.card);
    });
    setPendingPlacementDecision(null);
  };

  const handleDropOnStock = () => {
    if (!draggedCard || !dragSource || dragSource === "stock") {
      handleDragEnd();
      return;
    }

    if (draggedCardIndex == null) {
      handleDragEnd();
      return;
    }

    setDays((prev) => removeCardPlacement(prev, dragSource, draggedCardIndex));
    handleDragEnd();
  };

  const handleCardClick = (card: TripCardData) => {
    setSelectedCard(card);
    setDetailOpen(true);
  };

  const handleUpdateCard = (updatedCard: TripCardData) => {
    syncCardAcrossBoard(updatedCard);
  };

  const handleRefreshStock = () => {
    setStockCards((prev) => updateProcessingCards(prev));
    setDays((prev) =>
      prev.map((day) => ({
        ...day,
        cards: updateProcessingCards(day.cards),
      }))
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleRefreshStock();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const renderStockCard = (card: TripCardData, source: string) => {
    const isBlocked = card.placement_status === "blocked";
    const isNeedsInput = card.placement_status === "needs_input";
    const isProcessing =
      card.processing_status === "pending" || card.processing_status === "processing";
    const isDraggable = canDrag(card);
    const placementCount = getPlacements(card.instance_id).length;
    const isPlaced = placementCount > 0;
    const ghostClass = isPlaced
      ? card.allow_duplicate
        ? "opacity-75"
        : "opacity-45 saturate-0"
      : "";

    return (
      <div
        key={card.instance_id}
        draggable={isDraggable}
        onDragStart={() => handleDragStart(card, source)}
        onDragEnd={handleDragEnd}
        className={`relative ${ghostClass} ${isDraggable ? "cursor-grab active:cursor-grabbing" : isProcessing ? "" : "opacity-90"}`}
      >
        <TripCard card={card} onClick={() => handleCardClick(card)} compact />

        {isPlaced && (
          <div className="absolute bottom-2 right-2 rounded-full border border-[#D8D8D8] bg-white/90 px-2 py-0.5 text-[10px] font-medium text-[#666]">
            {card.allow_duplicate ? `중복 배치 ${placementCount}` : "이미 배치됨"}
          </div>
        )}

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
              <h2 className="font-semibold text-[#1A1A1A]">카드 목록</h2>
              <span className="text-sm text-[#888]">{stockCards.length}개</span>
            </div>
            <p className="mt-1 text-xs text-[#999]">승격된 카드와 미승격 카드로 단순화해 보여줍니다</p>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto p-4">
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A1A]">승격된 카드</h3>
                  <p className="text-xs text-[#888]">ready 또는 ready_partial 이고 처리가 완료되어 바로 배치할 수 있는 카드</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRefreshStock}
                    className="flex items-center gap-1 rounded-full border border-[#D8D8E8] bg-white px-2.5 py-1 text-xs font-medium text-[#534AB7] transition-colors hover:bg-[#F6F5FF]"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                      <path d="M21 3v6h-6" />
                    </svg>
                    새로고침
                  </button>
                  <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-xs font-medium text-[#534AB7]">
                    {stockSections.promoted.reduce((sum, group) => sum + group.cards.length, 0)}개
                  </span>
                </div>
              </div>

              {stockSections.promoted.length > 0 ? (
                stockSections.promoted.map((group) => (
                  <div key={group.id} className="rounded-2xl border border-[#E8E8E8] bg-[#FAFAFA] p-3">
                    <div className="mb-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-[#1A1A1A]">{group.title}</h4>
                        <span className="text-xs text-[#888]">{group.cards.length}개</span>
                      </div>
                      <p className="mt-1 text-xs text-[#888]">{group.reason}</p>
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
                  <h3 className="text-sm font-semibold text-[#1A1A1A]">미승격 카드</h3>
                  <p className="text-xs text-[#888]">아직 배치 가능 상태로 올라오지 않은 카드</p>
                </div>
                <span className="rounded-full bg-[#F3F4F6] px-2.5 py-1 text-xs font-medium text-[#6B7280]">
                  {stockSections.unpromoted.cards.length}개
                </span>
              </div>

              <div className="rounded-2xl border border-[#E8E8E8] bg-[#FCFCFC] p-3">
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-[#1A1A1A]">{stockSections.unpromoted.title}</h4>
                    <span className="text-xs text-[#888]">{stockSections.unpromoted.cards.length}개</span>
                  </div>
                  <p className="mt-1 text-xs text-[#888]">{stockSections.unpromoted.reason}</p>
                </div>

                {stockSections.unpromoted.cards.length > 0 ? (
                  <div className="space-y-3">
                    {stockSections.unpromoted.cards.map((card) => renderStockCard(card, "stock"))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-[#E5E5E5] bg-white px-3 py-4 text-xs text-[#AAA]">
                    현재 미승격 카드는 없어요.
                  </div>
                )}
              </div>
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
                      key={`${card.instance_id}-${index}`}
                      draggable={canDrag(card)}
                      onDragStart={() => handleDayCardDragStart(card, day.id, index)}
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
              {stockCards.filter((card) => !isCardPlaced(card.instance_id)).length}개 카드가 아직 배치되지 않았습니다
            </span>
            <Link
              href="/"
              className={`flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold no-underline transition-all ${
                stockCards.every((card) => isCardPlaced(card.instance_id))
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

      {pendingPlacementDecision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[#1A1A1A]">이미 배치된 카드예요</h3>
              <p className="mt-1 text-sm text-[#666]">
                <span className="font-medium text-[#1A1A1A]">
                  {pendingPlacementDecision.card.name}
                </span>
                는 이미 다른 Day에 있어요. 중복으로 둘지, 기존 위치에서 옮길지 선택해주세요.
              </p>
            </div>

            <div className="rounded-2xl bg-[#FAFAFA] p-4 text-sm text-[#666]">
              <p className="font-medium text-[#1A1A1A]">
                현재 {getPlacements(pendingPlacementDecision.card.instance_id).length}곳에 배치되어 있어요
              </p>
              <p className="mt-1 text-xs text-[#888]">
                중복 배치를 선택하면 이 카드의 `allow_duplicate`가 자동으로 켜집니다.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setPendingPlacementDecision(null)}
                className="flex-1 rounded-2xl border border-[#E0E0E0] px-4 py-3 text-sm font-medium text-[#666] transition-colors hover:bg-[#F8F8F8]"
              >
                취소
              </button>
              <button
                onClick={handleMovePlacement}
                className="flex-1 rounded-2xl border border-[#D8D8E8] bg-white px-4 py-3 text-sm font-semibold text-[#534AB7] transition-colors hover:bg-[#F6F5FF]"
              >
                이동할게요
              </button>
              <button
                onClick={handleDuplicatePlacement}
                className="flex-1 rounded-2xl bg-[#534AB7] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4840A0]"
              >
                중복 배치할게요
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
