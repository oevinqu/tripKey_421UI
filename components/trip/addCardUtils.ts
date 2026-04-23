import { CardCategory, TripCardData } from "@/types/card";

export interface NewTripCardInput {
  name: string;
  category: CardCategory;
  location: string;
  estimatedDurationMin: number | null;
  timeConstraint: string | null;
  memo: string | null;
  checkIn?: string | null;
  checkOut?: string | null;
  flightNumber?: string | null;
}

export function getDefaultAllowDuplicate(category: CardCategory) {
  return category === "accommodation" || category === "transport";
}

export function createProcessingTripCard(
  prefix: string,
  input: NewTripCardInput
): TripCardData {
  const trimmedName = input.name.trim();
  const trimmedLocation = input.location.trim();
  const trimmedMemo = input.memo?.trim() || null;
  const trimmedTimeConstraint = input.timeConstraint?.trim() || null;
  const trimmedCheckIn = input.checkIn?.trim() || null;
  const trimmedCheckOut = input.checkOut?.trim() || null;
  const trimmedFlightNumber = input.flightNumber?.trim() || null;

  return {
    instance_id: `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    place_id: null,
    name: trimmedName,
    category: input.category,
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "processing",
    action_type: "review_only",
    can_exclude: input.category !== "accommodation" && input.category !== "transport",
    allow_duplicate: getDefaultAllowDuplicate(input.category),
    is_excluded: false,
    is_ai_generated: false,
    estimated_duration_min: input.estimatedDurationMin,
    coordinates: null,
    time_constraint: trimmedTimeConstraint,
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: null,
    tips: null,
    tags: trimmedLocation ? [trimmedLocation] : null,
    source: "manual",
    day: null,
    notes: null,
    memo: trimmedMemo,
    check_in: trimmedCheckIn,
    check_out: trimmedCheckOut,
    flight_number: trimmedFlightNumber,
    location: trimmedLocation || undefined,
    processing_started_at: Date.now(),
  };
}

export function finalizeProcessingTripCard(card: TripCardData): TripCardData {
  const memo = card.memo?.trim();
  const location = card.location?.trim();

  const contextParts = [location ? `${location}에 추가한 카드예요.` : null, memo].filter(Boolean);

  const tipsByCategory: Record<CardCategory, string> = {
    place: "추가한 장소 기준으로 방문 흐름과 체류 포인트를 정리했어요.",
    activity: "추가한 활동 기준으로 이동 흐름과 체류 리듬을 정리했어요.",
    transport: "추가한 이동 정보 기준으로 앞뒤 동선을 맞춰볼 수 있어요.",
    accommodation: "추가한 숙소 정보 기준으로 체크인과 동선 연결을 정리했어요.",
    food: "추가한 맛집 기준으로 식사 타이밍과 주변 동선을 정리했어요.",
    etc: "추가한 메모를 바탕으로 일정 맥락에 반영할 준비를 마쳤어요.",
  };

  return {
    ...card,
    processing_status: "completed",
    user_context: contextParts.length > 0 ? contextParts.join(" ") : card.user_context,
    tips: tipsByCategory[card.category],
    processing_started_at: null,
  };
}
