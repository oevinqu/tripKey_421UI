"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MainHeader, SubHeader } from "@/components/header";
import { AddTripCardDialog } from "@/components/trip/AddTripCardDialog";
import {
  createProcessingTripCard,
  finalizeProcessingTripCard,
  NewTripCardInput,
} from "@/components/trip/addCardUtils";
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
    instance_id: "arr-3",
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
    instance_id: "arr-4",
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
    question_text: "도톤보리에서 방문할 맛집을 선택해주세요",
    options: [
      { id: "food-1", label: "이치란 라멘" },
      { id: "food-2", label: "쿠이다오레" },
      { id: "food-3", label: "타코야키 도라쿠" },
    ],
    blocked_reason: null,
    user_context: "도톤보리 맛집 여러 곳 둘러볼 예정",
    tips: "저녁 시간대는 웨이팅이 길 수 있어요",
    tags: ["맛집", "도톤보리", "오사카"],
    source: "dump",
    day: null,
    notes: null,
    location: "도톤보리",
  },
  {
    instance_id: "arr-5",
    place_id: "glico-sign-osaka",
    name: "글리코상",
    category: "place",
    classification: "open_question",
    placement_status: "ready_partial",
    processing_status: "completed",
    action_type: "select_required",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: false,
    estimated_duration_min: 20,
    coordinates: { lat: 34.6686, lng: 135.5019 },
    time_constraint: null,
    question_text: "궁금한 내용: 글리코상에 가서 사진을 찍으실지 고민중이세요.",
    options: [
      { id: "glico-no", label: "안 간다" },
      { id: "glico-yes", label: "간다" },
    ],
    blocked_reason: null,
    user_context: "궁금한 내용: 글리코상에 가서 사진을 찍으실지 고민중이세요.",
    tips: "도톤보리 동선과 함께 넣으면 짧게 들르기 좋아요",
    tags: ["오사카", "도톤보리", "포토스팟"],
    source: "dump",
    day: null,
    notes: null,
    location: "도톤보리",
  },
  {
    instance_id: "arr-6",
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
    instance_id: "arr-7",
    place_id: null,
    name: "와사카 성",
    category: "place",
    classification: "open_question",
    placement_status: "blocked",
    processing_status: "failed",
    action_type: "fix_required",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: true,
    estimated_duration_min: null,
    coordinates: null,
    time_constraint: null,
    question_text: "오타인 것 같아요. 실제 장소명을 확인해주세요.",
    options: null,
    blocked_reason: "오타인 것 같아요",
    user_context: "AI가 장소명을 잘못 해석했을 가능성이 있어요",
    tips: "정확한 장소명으로 수정하면 이후 배치가 쉬워져요",
    tags: ["오사카", "AI 후보"],
    source: "dump",
    day: null,
    notes: null,
    location: "오사카",
  },
  {
    instance_id: "arr-8",
    place_id: null,
    name: "교토 게스트하우스",
    category: "accommodation",
    classification: "open_question",
    placement_status: "ready_partial",
    processing_status: "completed",
    action_type: "input_required",
    can_exclude: false,
    allow_duplicate: true,
    is_excluded: false,
    is_ai_generated: false,
    estimated_duration_min: 0,
    coordinates: null,
    time_constraint: null,
    question_text: "아직 게스트하우스를 예약 안하셨어요.",
    options: null,
    blocked_reason: null,
    user_context: "교토 숙소로 게스트하우스 예정",
    tips: "예약한 숙소 주소를 입력하면 이후 배치가 쉬워져요",
    tags: ["숙소", "교토"],
    source: "dump",
    day: null,
    notes: null,
    location: "교토",
  },
  {
    instance_id: "arr-9",
    place_id: null,
    name: "오사카 난바 호텔",
    category: "accommodation",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: false,
    allow_duplicate: true,
    is_excluded: false,
    is_ai_generated: false,
    estimated_duration_min: 20,
    coordinates: { lat: 34.6662, lng: 135.5011 },
    time_constraint: "15:00 체크인",
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: "오사카 숙소는 이미 예약된 상태예요",
    tips: "도톤보리와 가까워 첫날 동선이 편해요",
    tags: ["숙소", "오사카"],
    source: "dump",
    day: null,
    notes: null,
    location: "오사카",
    address: "오사카 난바 1-2-3",
  },
  {
    instance_id: "arr-10",
    place_id: null,
    name: "오사카 우메다 호텔",
    category: "accommodation",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: false,
    allow_duplicate: true,
    is_excluded: false,
    is_ai_generated: false,
    estimated_duration_min: 20,
    coordinates: { lat: 34.7038, lng: 135.4975 },
    time_constraint: "11:00 체크아웃",
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: "오사카 마지막 숙소도 예약 완료 상태예요",
    tips: "공항 이동 전 짐 정리 시간을 조금 남겨두면 좋아요",
    tags: ["숙소", "오사카"],
    source: "dump",
    day: null,
    notes: null,
    location: "오사카",
    address: "오사카 우메다 4-5-6",
  },
  {
    instance_id: "arr-11",
    place_id: null,
    name: "간사이 공항 도착",
    category: "transport",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: false,
    allow_duplicate: true,
    is_excluded: false,
    is_ai_generated: false,
    estimated_duration_min: null,
    coordinates: { lat: 34.4347, lng: 135.2440 },
    time_constraint: "도착 11:20",
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: "항공편은 이미 예약된 상태예요",
    tips: null,
    tags: ["공항", "항공편"],
    source: "dump",
    day: null,
    notes: null,
    location: "간사이 공항",
  },
  {
    instance_id: "arr-12",
    place_id: null,
    name: "간사이 공항 출발",
    category: "transport",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: false,
    allow_duplicate: true,
    is_excluded: false,
    is_ai_generated: false,
    estimated_duration_min: null,
    coordinates: { lat: 34.4347, lng: 135.2440 },
    time_constraint: "출발 18:40",
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: "귀국 항공편도 예약된 상태예요",
    tips: null,
    tags: ["공항", "항공편"],
    source: "dump",
    day: null,
    notes: null,
    location: "간사이 공항",
  },
];

const getInitialDayCard = (instanceId: string, day: number) => {
  const card = INITIAL_STOCK_CARDS.find((item) => item.instance_id === instanceId);
  if (!card) {
    throw new Error(`Missing initial day card for ${instanceId}`);
  }

  return { ...card, day };
};

const INITIAL_DAYS = [
  {
    id: "day1",
    label: "Day 1",
    date: "5월 10일 (토)",
    cards: [] as TripCardData[],
  },
  {
    id: "day2",
    label: "Day 2",
    date: "5월 11일 (일)",
    cards: [] as TripCardData[],
  },
  { id: "day3", label: "Day 3", date: "5월 12일 (월)", cards: [] as TripCardData[] },
  {
    id: "day4",
    label: "Day 4",
    date: "5월 13일 (화)",
    cards: [] as TripCardData[],
  },
  {
    id: "day5",
    label: "Day 5",
    date: "5월 14일 (수)",
    cards: [] as TripCardData[],
  },
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

interface EditingDurationState {
  dayId: string;
  index: number;
  value: string;
}

interface EditingTimeState {
  dayId: string;
  index: number;
  value: string;
}

interface FixedDaySlotConfig {
  startTimeCardId?: string;
  endTimeCardId?: string;
  topCardIds?: string[];
  bottomCardIds?: string[];
}

function matchesDestination(card: TripCardData, destination: string | null) {
  if (!destination) return true;

  return (
    card.location?.includes(destination) ||
    card.tags?.some((tag) => tag.includes(destination)) ||
    false
  );
}

const DOTONBORI_SPLIT_REASON =
  "선택한 맛집 후보를 세부 카드로 분리해 정리하고 있어요. processing이 끝나면 바로 배치할 수 있습니다.";
const ACCOMMODATION_PROCESSING_REASON =
  "입력한 숙소 정보를 바탕으로 예약 내용을 정리하고 있어요. 잠시 후 확정 카드로 바뀝니다.";
const FIXED_DAY_SLOTS: Record<string, FixedDaySlotConfig> = {
  day1: {
    startTimeCardId: "arr-11",
    bottomCardIds: ["arr-9"],
  },
  day2: {
    topCardIds: ["arr-9"],
  },
  day4: {
    bottomCardIds: ["arr-10"],
  },
  day5: {
    topCardIds: ["arr-10"],
    endTimeCardId: "arr-12",
  },
};

function buildDotonboriDetailCards(parentCard: TripCardData) {
  const selectedOptions =
    parentCard.options?.filter((option) => parentCard.notes?.includes(option.label)) ?? [];

  return selectedOptions.map((option, index) => ({
    instance_id: `${parentCard.instance_id}-detail-${index + 1}`,
    place_id: null,
    name: option.label,
    category: "food" as const,
    classification: "confirmed" as const,
    placement_status: "ready" as const,
    processing_status: "processing" as const,
    action_type: "review_only" as const,
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: false,
    estimated_duration_min: 60,
    coordinates: parentCard.coordinates,
    time_constraint: null,
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: `${parentCard.name}에서 선택한 세부 후보예요.`,
    tips: null,
    tags: [...(parentCard.tags ?? []), "세부 카드"],
    source: parentCard.source,
    day: null,
    notes: parentCard.notes,
    memo: parentCard.memo ?? null,
    group_label: "도톤보리 맛집 투어",
    group_reason: DOTONBORI_SPLIT_REASON,
    location: parentCard.location,
  }));
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

function getTimeMode(card: TripCardData): "arrival" | "departure" | null {
  if (
    card.name.includes("출발") ||
    card.name.includes("체크아웃") ||
    card.time_constraint?.includes("출발") ||
    card.time_constraint?.includes("체크아웃")
  ) {
    return "departure";
  }

  if (
    card.name.includes("도착") ||
    card.name.includes("체크인") ||
    card.time_constraint?.includes("도착") ||
    card.time_constraint?.includes("체크인")
  ) {
    return "arrival";
  }

  return null;
}

function getEditableTimeInfo(card: TripCardData) {
  if (!isAirportCard(card) && !isAccommodationCard(card)) return null;

  const mode = getTimeMode(card);
  if (!mode) return null;

  const matchedTime = card.time_constraint?.match(/(\d{1,2}:\d{2})/)?.[1] ?? "";

  return {
    mode,
    label: mode === "arrival" ? "도착 예정 시간" : "출발 예정 시간",
    value: matchedTime,
  };
}

function buildSilentMemoContextUpdate(card: TripCardData) {
  const memo = card.memo?.trim();
  if (!memo) return null;

  return {
    user_context: `메모 반영: ${memo}`,
    tips:
      card.category === "food"
        ? "메모를 반영해 식사 동선과 체류 순서를 다시 정리했어요."
        : card.category === "place" || card.category === "activity"
          ? "메모를 반영해 방문 순서와 체류 포인트를 조용히 보정했어요."
          : "메모를 반영해 추천 흐름을 다시 정리했어요.",
  };
}

export default function ArrangePage() {
  const [stockCards, setStockCards] = useState<TripCardData[]>(INITIAL_STOCK_CARDS);
  const [days, setDays] = useState<DayColumn[]>(INITIAL_DAYS);
  const [selectedCard, setSelectedCard] = useState<TripCardData | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [draggedCard, setDraggedCard] = useState<TripCardData | null>(null);
  const [dragSource, setDragSource] = useState<string | null>(null);
  const [draggedCardIndex, setDraggedCardIndex] = useState<number | null>(null);
  const [editingDuration, setEditingDuration] = useState<EditingDurationState | null>(null);
  const [editingTime, setEditingTime] = useState<EditingTimeState | null>(null);
  const [pendingPlacementDecision, setPendingPlacementDecision] =
    useState<PendingPlacementDecision | null>(null);
  const [destinationFilter, setDestinationFilter] = useState<string | null>(null);
  const [addCardOpen, setAddCardOpen] = useState(false);

  const currentStep = 4;

  const fixedCardsByDay = useMemo(() => {
    const cardMap = new Map(stockCards.map((card) => [card.instance_id, card]));

    return days.reduce<
      Record<
        string,
        {
          startTimeCard?: TripCardData;
          endTimeCard?: TripCardData;
          topCards: TripCardData[];
          bottomCards: TripCardData[];
        }
      >
    >((accumulator, day) => {
      const config = FIXED_DAY_SLOTS[day.id] ?? {};

      accumulator[day.id] = {
        startTimeCard: config.startTimeCardId ? cardMap.get(config.startTimeCardId) : undefined,
        endTimeCard: config.endTimeCardId ? cardMap.get(config.endTimeCardId) : undefined,
        topCards: (config.topCardIds ?? [])
          .map((id) => cardMap.get(id))
          .filter((card): card is TripCardData => Boolean(card)),
        bottomCards: (config.bottomCardIds ?? [])
          .map((id) => cardMap.get(id))
          .filter((card): card is TripCardData => Boolean(card)),
      };

      return accumulator;
    }, {});
  }, [days, stockCards]);

  const visibleFixedCardsByDay = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(fixedCardsByDay).map(([dayId, entry]) => [
          dayId,
          {
            startTimeCard:
              entry.startTimeCard && matchesDestination(entry.startTimeCard, destinationFilter)
                ? entry.startTimeCard
                : undefined,
            endTimeCard:
              entry.endTimeCard && matchesDestination(entry.endTimeCard, destinationFilter)
                ? entry.endTimeCard
                : undefined,
            topCards: entry.topCards.filter((card) => matchesDestination(card, destinationFilter)),
            bottomCards: entry.bottomCards.filter((card) =>
              matchesDestination(card, destinationFilter)
            ),
          },
        ])
      ) as Record<string, {
        startTimeCard?: TripCardData;
        endTimeCard?: TripCardData;
        topCards: TripCardData[];
        bottomCards: TripCardData[];
      }>,
    [destinationFilter, fixedCardsByDay]
  );

  const fixedPlacementIds = new Set(
    Object.values(fixedCardsByDay).flatMap((entry) => [
      ...(entry.startTimeCard ? [entry.startTimeCard.instance_id] : []),
      ...(entry.endTimeCard ? [entry.endTimeCard.instance_id] : []),
      ...entry.topCards.map((card) => card.instance_id),
      ...entry.bottomCards.map((card) => card.instance_id),
    ])
  );

  const placedCardIds = new Set(
    [...fixedPlacementIds, ...days.flatMap((day) => day.cards.map((card) => card.instance_id))]
  );
  const visibleStockCount = stockCards.filter(
    (card) => !isAirportCard(card) && matchesDestination(card, destinationFilter)
  ).length;
  const placedCardsCount = placedCardIds.size;
  const totalCards = stockCards.length;
  const progress = totalCards > 0 ? Math.round((placedCardsCount / totalCards) * 100) : 0;

  const canDrag = (card: TripCardData) =>
    (card.placement_status === "ready" ||
      card.placement_status === "ready_partial") &&
    card.processing_status === "completed";

  const updateProcessingCards = (cards: TripCardData[]) =>
    cards.map((card) => {
      if (
        card.source === "manual" &&
        card.processing_status === "processing" &&
        card.processing_started_at &&
        Date.now() - card.processing_started_at >= 2500
      ) {
        return finalizeProcessingTripCard(card);
      }

      if (card.category === "accommodation" && card.processing_status === "processing") {
        if (
          card.processing_started_at &&
          Date.now() - card.processing_started_at >= 3000
        ) {
          return {
            ...card,
            classification: "confirmed" as const,
            placement_status: "ready" as const,
            processing_status: "completed" as const,
            action_type: "review_only" as const,
            address: card.notes ?? card.address,
            notes: null,
            group_label: undefined,
            group_reason: undefined,
            processing_started_at: null,
          };
        }

        return card;
      }

      if (card.processing_status === "processing" && Math.random() > 0.5) {
        return { ...card, processing_status: "completed" as const };
      }

      if (card.processing_status === "pending" && Math.random() > 0.7) {
        return { ...card, processing_status: "processing" as const };
      }

      return card;
    });

  const getPlacements = (cardInstanceId: string) =>
    days.flatMap((day) => {
      const movablePlacements = day.cards.flatMap((card, index) =>
        card.instance_id === cardInstanceId ? [{ dayId: day.id, index, fixed: false }] : []
      );
      const fixedEntry = fixedCardsByDay[day.id];
      const fixedPlacements =
        fixedEntry &&
        [
          fixedEntry.startTimeCard,
          fixedEntry.endTimeCard,
          ...fixedEntry.topCards,
          ...fixedEntry.bottomCards,
        ]
          .filter((card): card is TripCardData => Boolean(card))
          .flatMap((card) =>
            card.instance_id === cardInstanceId
              ? [{ dayId: day.id, index: -1, fixed: true }]
              : []
          );

      return [...movablePlacements, ...(fixedPlacements ?? [])];
    });

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

  const insertCardOnDay = (
    dayList: DayColumn[],
    dayId: string,
    card: TripCardData,
    targetIndex: number
  ) =>
    dayList.map((day) => {
      if (day.id !== dayId) return day;

      const nextCards = [...day.cards];
      nextCards.splice(targetIndex, 0, {
        ...card,
        day: Number.parseInt(dayId.replace("day", ""), 10),
      });

      return {
        ...day,
        cards: nextCards,
      };
    });

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
    const filteredStockCards = stockCards.filter((card) =>
      matchesDestination(card, destinationFilter)
    );
    const visibleStockCards = filteredStockCards.filter((card) => !isAirportCard(card));

    const groupedCardsByLabel = visibleStockCards
      .filter((card) => card.group_label)
      .reduce<Record<string, TripCardData[]>>((accumulator, card) => {
        const key = card.group_label!;
        accumulator[key] = [...(accumulator[key] ?? []), card];
        return accumulator;
      }, {});

    const specialGroups = Object.entries(groupedCardsByLabel).map(([label, cards]) => ({
      id: `special-${label}`,
      title: label,
      reason: cards[0]?.group_reason ?? "묶음 카드예요.",
      cards,
    }));

    const regularStockCards = visibleStockCards.filter((card) => !card.group_label);

    const promotedCards = regularStockCards.filter(
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

    const unpromotedCards = regularStockCards.filter(
      (card) =>
        !(
          (card.placement_status === "ready" ||
            card.placement_status === "ready_partial") &&
          card.processing_status === "completed"
        )
    );

    return {
      special: specialGroups,
      promoted: promotedGroups,
      unpromoted: {
        title: "미승격 카드",
        reason: "needs_input, blocked 상태이거나 아직 AI 처리가 끝나지 않아 바로 배치할 수 없는 카드들이에요.",
        cards: unpromotedCards,
      },
    };
  }, [destinationFilter, stockCards]);

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

  const handleDropOnDay = (dayId: string, targetIndex?: number) => {
    if (!draggedCard || !dragSource) return;

    if (dragSource === "stock") {
      const existingPlacements = getPlacements(draggedCard.instance_id);

      if (existingPlacements.length === 0 || draggedCard.allow_duplicate) {
        setDays((prev) =>
          targetIndex == null
            ? placeCardOnDay(prev, dayId, draggedCard)
            : insertCardOnDay(prev, dayId, draggedCard, targetIndex)
        );
        handleDragEnd();
        return;
      }

      setPendingPlacementDecision({ card: draggedCard, targetDayId: dayId });
      handleDragEnd();
      return;
    }

    if (dragSource === dayId && draggedCardIndex == null) {
      handleDragEnd();
      return;
    }

    if (draggedCardIndex == null) {
      handleDragEnd();
      return;
    }

    if (dragSource === dayId) {
      if (targetIndex == null || targetIndex === draggedCardIndex) {
        handleDragEnd();
        return;
      }

      setDays((prev) =>
        prev.map((day) => {
          if (day.id !== dayId) return day;

          const nextCards = [...day.cards];
          const [movedCard] = nextCards.splice(draggedCardIndex, 1);
          const adjustedIndex =
            draggedCardIndex < targetIndex ? targetIndex - 1 : targetIndex;
          nextCards.splice(adjustedIndex, 0, movedCard);

          return {
            ...day,
            cards: nextCards,
          };
        })
      );
      handleDragEnd();
      return;
    }

    setDays((prev) => {
      const withoutDraggedPlacement = removeCardPlacement(prev, dragSource, draggedCardIndex);
      return targetIndex == null
        ? placeCardOnDay(withoutDraggedPlacement, dayId, draggedCard)
        : insertCardOnDay(withoutDraggedPlacement, dayId, draggedCard, targetIndex);
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
    const existingCard =
      stockCards.find((card) => card.instance_id === updatedCard.instance_id) ??
      days
        .flatMap((day) => day.cards)
        .find((card) => card.instance_id === updatedCard.instance_id) ??
      null;

    if (updatedCard.instance_id === "arr-4" && updatedCard.notes?.trim()) {
      const splitCards = buildDotonboriDetailCards(updatedCard);

      if (splitCards.length > 0) {
        setStockCards((prev) => [
          ...prev.filter((card) => card.instance_id !== updatedCard.instance_id),
          ...splitCards,
        ]);
        setDays((prev) =>
          prev.map((day) => ({
            ...day,
            cards: day.cards.filter((card) => card.instance_id !== updatedCard.instance_id),
          }))
        );
        setSelectedCard(null);
        return;
      }
    }

    if (updatedCard.category === "accommodation" && (updatedCard.notes?.trim() || updatedCard.memo?.trim())) {
      syncCardAcrossBoard({
        ...updatedCard,
        classification: "confirmed",
        placement_status: "ready",
        processing_status: "processing",
        action_type: "review_only",
        group_label: "숙소",
        group_reason: ACCOMMODATION_PROCESSING_REASON,
        processing_started_at: Date.now(),
      });
      return;
    }

    const memoChanged = (updatedCard.memo ?? null) !== (existingCard?.memo ?? null);

    syncCardAcrossBoard(updatedCard);

    if (
      updatedCard.category !== "accommodation" &&
      memoChanged &&
      updatedCard.memo?.trim()
    ) {
      window.setTimeout(() => {
        const silentUpdate = buildSilentMemoContextUpdate(updatedCard);
        if (!silentUpdate) return;

        setStockCards((prev) =>
          prev.map((card) =>
            card.instance_id === updatedCard.instance_id
              ? { ...card, ...silentUpdate }
              : card
          )
        );
        setDays((prev) =>
          prev.map((day) => ({
            ...day,
            cards: day.cards.map((card) =>
              card.instance_id === updatedCard.instance_id
                ? { ...card, ...silentUpdate }
                : card
            ),
          }))
        );
        setSelectedCard((prev) =>
          prev?.instance_id === updatedCard.instance_id
            ? { ...prev, ...silentUpdate }
            : prev
        );
      }, 1800);
    }
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

  const handleAddCard = (input: NewTripCardInput) => {
    setStockCards((prev) => [...prev, createProcessingTripCard("arr-add", input)]);
  };

  const updateDayCardDuration = (dayId: string, index: number, durationValue: string) => {
    const parsed = Number.parseInt(durationValue, 10);
    if (Number.isNaN(parsed) || parsed < 0) {
      setEditingDuration(null);
      return;
    }

    setDays((prev) =>
      prev.map((day) => {
        if (day.id !== dayId) return day;
        return {
          ...day,
          cards: day.cards.map((card, cardIndex) =>
            cardIndex === index ? { ...card, estimated_duration_min: parsed } : card
          ),
        };
      })
    );
    setEditingDuration(null);
  };

  const updateDayCardTimeConstraint = (dayId: string, index: number, timeValue: string) => {
    const trimmed = timeValue.trim();
    const valid = /^\d{1,2}:\d{2}$/.test(trimmed);

    if (!valid) {
      setEditingTime(null);
      return;
    }

    setDays((prev) =>
      prev.map((day) => {
        if (day.id !== dayId) return day;

        return {
          ...day,
          cards: day.cards.map((card, cardIndex) => {
            if (cardIndex !== index) return card;

            const mode = getTimeMode(card);
            if (isAccommodationCard(card)) {
              return {
                ...card,
                time_constraint:
                  mode === "departure" ? `${trimmed} 체크아웃` : `${trimmed} 체크인`,
              };
            }

            return {
              ...card,
              time_constraint: mode === "departure" ? `출발 ${trimmed}` : `도착 ${trimmed}`,
            };
          }),
        };
      })
    );
    setEditingTime(null);
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

  const renderFixedTimeBlock = (
    card: TripCardData,
    tone: "start" | "end"
  ) => {
    const timeValue = card.time_constraint?.match(/(\d{1,2}:\d{2})/)?.[1] ?? "";

    return (
      <div
        key={`${card.instance_id}-${tone}`}
        className={`rounded-2xl border px-3 py-3 ${
          tone === "start"
            ? "border-[#D9D3FF] bg-[#F7F5FF]"
            : "border-[#D7E8F8] bg-[#F5FAFF]"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.08em] text-[#888]">
              {tone === "start" ? "고정 시작 시간" : "고정 마무리 시간"}
            </p>
            <p className="mt-1 text-sm font-semibold text-[#1A1A1A]">
              {tone === "start" ? "간사이 공항 도착" : "간사이 공항 출발"}
            </p>
          </div>
          <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-[#534AB7]">
            {timeValue}
          </span>
        </div>
      </div>
    );
  };

  const renderFixedStayBlock = (
    dayId: string,
    card: TripCardData,
    anchor: "top" | "bottom"
  ) => (
    <div key={`${dayId}-${card.instance_id}-${anchor}`} className="rounded-2xl border border-[#E5E0F8] bg-white p-2 shadow-sm">
      <div className="mb-2 flex items-center justify-between px-1">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.08em] text-[#8A84B5]">
            {anchor === "top" ? "고정 숙소 시작점" : "고정 숙소 마무리"}
          </p>
          <p className="mt-0.5 text-[11px] text-[#888]">
            {anchor === "top"
              ? "이 날은 숙소에서 시작하는 흐름으로 가정했어요."
              : "이 날은 숙소에서 마무리되는 흐름으로 가정했어요."}
          </p>
        </div>
        <span className="rounded-full bg-[#F6F5FF] px-2 py-1 text-[10px] font-semibold text-[#534AB7]">
          고정
        </span>
      </div>
      <TripCard card={card} onClick={() => handleCardClick(card)} compact />
    </div>
  );

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
        destinationFilter={{
          activeDestination: destinationFilter,
          onSelectDestination: setDestinationFilter,
        }}
        rightButtons={
          <button
            onClick={() => setAddCardOpen(true)}
            className="rounded-lg bg-[#534AB7] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#4840A0]"
          >
            카드 추가하기
          </button>
        }
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
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefreshStock}
                  className="flex items-center gap-1 rounded-full border border-[#D8D8E8] bg-white px-2.5 py-1 text-xs font-medium text-[#534AB7] transition-colors hover:bg-[#F6F5FF]"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                    <path d="M21 3v6h-6" />
                  </svg>
                  재정렬
                </button>
                <span className="text-sm text-[#888]">
                  {destinationFilter
                    ? `${visibleStockCount}개`
                    : `${stockCards.filter((card) => !isAirportCard(card)).length}개`}
                </span>
              </div>
            </div>
            {destinationFilter && (
              <p className="mt-2 text-xs font-medium text-[#534AB7]">
                현재 {destinationFilter} 관련 카드만 보고 있어요
              </p>
            )}
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto p-4">
            {stockSections.special.map((group) => (
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
            ))}

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
                {(() => {
                  const fixedEntry = visibleFixedCardsByDay[day.id];
                  const visibleDayCards = day.cards.filter((card) =>
                    matchesDestination(card, destinationFilter)
                  );
                  const totalCount =
                    visibleDayCards.length +
                    (fixedEntry?.startTimeCard ? 1 : 0) +
                    (fixedEntry?.endTimeCard ? 1 : 0) +
                    (fixedEntry?.topCards.length ?? 0) +
                    (fixedEntry?.bottomCards.length ?? 0);

                  return (
                    <>
                <div className="rounded-t-xl border-b border-[#E8E8E8] bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[#1A1A1A]">{day.label}</h3>
                      <p className="text-xs text-[#888]">{day.date}</p>
                    </div>
                    <span className="text-sm font-medium text-[#534AB7]">{totalCount}개</span>
                  </div>
                </div>

                <div className="min-h-[400px] space-y-3 p-3">
                  {fixedEntry?.startTimeCard && renderFixedTimeBlock(fixedEntry.startTimeCard, "start")}

                  {fixedEntry?.topCards.map((card) => renderFixedStayBlock(day.id, card, "top"))}

                  {visibleDayCards.map((card) => {
                    const index = day.cards.findIndex(
                      (dayCard) => dayCard.instance_id === card.instance_id
                    );

                    return (
                    <div
                      key={`${card.instance_id}-${index}`}
                      draggable={canDrag(card)}
                      onDragStart={() => handleDayCardDragStart(card, day.id, index)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDropOnDay(day.id, index);
                      }}
                      className={`relative ${canDrag(card) ? "cursor-grab active:cursor-grabbing" : ""}`}
                    >
                      <TripCard card={card} onClick={() => handleCardClick(card)} compact />
                      <div className="mt-1 pl-2">
                        {getEditableTimeInfo(card) ? (
                          editingTime?.dayId === day.id && editingTime.index === index ? (
                            <input
                              autoFocus
                              value={editingTime.value}
                              onChange={(e) =>
                                setEditingTime({
                                  dayId: day.id,
                                  index,
                                  value: e.target.value,
                                })
                              }
                              onBlur={() =>
                                updateDayCardTimeConstraint(day.id, index, editingTime.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  updateDayCardTimeConstraint(day.id, index, editingTime.value);
                                }
                                if (e.key === "Escape") {
                                  setEditingTime(null);
                                }
                              }}
                              className="w-28 rounded-md border border-[#D8D8D8] bg-white px-2 py-1 text-[11px] text-[#666] focus:border-[#534AB7] focus:outline-none"
                            />
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingTime({
                                  dayId: day.id,
                                  index,
                                  value: getEditableTimeInfo(card)?.value ?? "",
                                });
                              }}
                              className="text-[11px] text-[#888] transition-colors hover:text-[#534AB7]"
                            >
                              {getEditableTimeInfo(card)?.label} {getEditableTimeInfo(card)?.value}
                            </button>
                          )
                        ) : editingDuration?.dayId === day.id && editingDuration.index === index ? (
                          <input
                            autoFocus
                            value={editingDuration.value}
                            onChange={(e) =>
                              setEditingDuration({
                                dayId: day.id,
                                index,
                                value: e.target.value,
                              })
                            }
                            onBlur={() =>
                              updateDayCardDuration(day.id, index, editingDuration.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                updateDayCardDuration(day.id, index, editingDuration.value);
                              }
                              if (e.key === "Escape") {
                                setEditingDuration(null);
                              }
                            }}
                            className="w-24 rounded-md border border-[#D8D8D8] bg-white px-2 py-1 text-[11px] text-[#666] focus:border-[#534AB7] focus:outline-none"
                          />
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingDuration({
                                dayId: day.id,
                                index,
                                value: String(card.estimated_duration_min ?? 0),
                              });
                            }}
                            className="text-[11px] text-[#888] transition-colors hover:text-[#534AB7]"
                          >
                            체류시간 {card.estimated_duration_min ?? 0}분
                          </button>
                        )}
                      </div>
                    </div>
                    );
                  })}

                  {visibleDayCards.length === 0 &&
                    !fixedEntry?.startTimeCard &&
                    !fixedEntry?.endTimeCard &&
                    (fixedEntry?.topCards.length ?? 0) === 0 &&
                    (fixedEntry?.bottomCards.length ?? 0) === 0 && (
                    <div className="flex h-32 flex-col items-center justify-center text-[#B0B0B0]">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      <p className="text-xs">카드를 여기에 드롭하세요</p>
                    </div>
                  )}

                  {fixedEntry?.bottomCards.map((card) => renderFixedStayBlock(day.id, card, "bottom"))}

                  {fixedEntry?.endTimeCard && renderFixedTimeBlock(fixedEntry.endTimeCard, "end")}
                </div>
                    </>
                  );
                })()}
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

      <AddTripCardDialog
        open={addCardOpen}
        onOpenChange={setAddCardOpen}
        onSubmit={handleAddCard}
      />
    </div>
  );
}
