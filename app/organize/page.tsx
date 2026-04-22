"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MainHeader, SubHeader } from "@/components/header";
import { TripCard } from "@/components/trip/TripCard";
import { TripCardDetailPanel } from "@/components/trip/TripCardDetailPanel";
import { canOpenTripCardDetail } from "@/components/trip/tripCardState";
import { TripCardData } from "@/types/card";

const DEMO_CARDS: TripCardData[] = [
  {
    instance_id: "card-1",
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
    user_context: "첫날 메인 일정으로 가장 오래 머물고 싶어 하셨어요",
    tips: "오전 입장 직후 인기 어트랙션부터 이동하면 대기 시간을 줄일 수 있어요.",
    tags: ["테마파크", "오사카"],
    source: "ai_summary",
    day: 1,
    notes: "해리포터 월드 꼭 가기",
    location: "오사카",
    address: "2 Chome-1-33 Sakurajima, Konohana Ward, Osaka",
  },
  {
    instance_id: "card-2",
    place_id: "ChIJd8BlQ2kAWDUR4V4rH7j0P7Q",
    name: "도톤보리 맛집 투어",
    category: "food",
    classification: "open_question",
    placement_status: "ready_partial",
    processing_status: "completed",
    action_type: "select_required",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: true,
    estimated_duration_min: 150,
    coordinates: { lat: 34.6687, lng: 135.5019 },
    time_constraint: "점심 또는 저녁",
    question_text: "점심과 저녁 중 언제 방문하시겠어요?",
    options: [
      { id: "lunch", label: "점심 (12:00-14:00)" },
      { id: "dinner", label: "저녁 (18:00-20:00)" },
    ],
    blocked_reason: null,
    user_context: "현지 맛집을 한 번에 모아보고 싶다고 하셨어요",
    tips: "저녁에는 대기가 길 수 있어 점심 방문이 더 여유로울 수 있어요.",
    tags: ["맛집", "도톤보리"],
    source: "user_note",
    day: 1,
    notes: null,
    location: "도톤보리",
  },
  {
    instance_id: "card-3",
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
    time_constraint: "저녁 이동 예정",
    question_text: "이동 수단을 알려주세요 (신칸센, 특급열차 등)",
    options: null,
    blocked_reason: null,
    user_context: "짐이 많아서 환승이 적은 경로를 선호한다고 하셨어요",
    tips: null,
    tags: ["교통"],
    source: "user_input",
    day: null,
    notes: null,
    location: "교토역",
  },
  {
    instance_id: "card-4",
    place_id: "ChIJJ2o6vQJxAWARQJfgf7D4o6E",
    name: "후시미 이나리 신사",
    category: "place",
    classification: "undecided",
    placement_status: "ready_partial",
    processing_status: "completed",
    action_type: "select_required",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: true,
    estimated_duration_min: 180,
    coordinates: { lat: 34.9671, lng: 135.7727 },
    time_constraint: "오전 방문 추천",
    question_text: "몇 일차에 방문하시겠어요?",
    options: [
      { id: "day2", label: "2일차 (5월 11일)" },
      { id: "day3", label: "3일차 (5월 12일)" },
    ],
    blocked_reason: null,
    user_context: null,
    tips: "이른 오전에 가면 사진 촬영 동선이 훨씬 편해요.",
    tags: ["교토"],
    source: "ai_summary",
    day: null,
    notes: null,
    location: "교토",
  },
  {
    instance_id: "card-5",
    place_id: "ChIJ4cS1L9gAWDUR4P4LtB3R6CA",
    name: "오사카성",
    category: "place",
    classification: "undecided",
    placement_status: "blocked",
    processing_status: "failed",
    action_type: "fix_required",
    can_exclude: false,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: true,
    estimated_duration_min: 120,
    coordinates: { lat: 34.6873, lng: 135.5262 },
    time_constraint: null,
    question_text: "정보 처리 중 오류가 발생했습니다. 방문 목적이나 희망 시간을 다시 입력해주세요.",
    options: null,
    blocked_reason: "방문 희망 시간 정보가 충돌하고 있어요",
    user_context: "야경보다 낮 풍경을 더 선호한다고 하셨어요",
    tips: null,
    tags: ["오사카"],
    source: "ai_summary",
    day: null,
    notes: null,
    location: "오사카",
  },
  {
    instance_id: "card-6",
    place_id: null,
    name: "기온 거리 산책",
    category: "activity",
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
    time_constraint: "해질녘",
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: "저녁 산책 코스를 원하셨어요",
    tips: null,
    tags: ["산책"],
    source: "ai_summary",
    day: 2,
    notes: "AI가 동선 정리 중입니다",
    location: "교토",
  },
  {
    instance_id: "card-7",
    place_id: null,
    name: "교토 게스트하우스",
    category: "accommodation",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: true,
    is_excluded: false,
    is_ai_generated: false,
    estimated_duration_min: null,
    coordinates: null,
    time_constraint: "체크인 16시 이후",
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: null,
    tips: "체크인 전 짐 보관 가능 여부를 미리 확인하면 좋아요.",
    tags: ["숙소"],
    source: "booking",
    day: 2,
    notes: "2박 예정",
    location: "교토",
  },
  {
    instance_id: "card-8",
    place_id: null,
    name: "현금 인출 메모",
    category: "etc",
    classification: "unassigned",
    placement_status: "needs_input",
    processing_status: "completed",
    action_type: "input_required",
    can_exclude: false,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: false,
    estimated_duration_min: 20,
    coordinates: null,
    time_constraint: null,
    question_text: "어느 지역에서 현금을 인출할지 입력해주세요.",
    options: null,
    blocked_reason: null,
    user_context: "첫날에 트래블카드 충전도 함께 하려는 계획이 있었어요",
    tips: null,
    tags: ["메모"],
    source: "user_input",
    day: null,
    notes: null,
    location: undefined,
  },
  {
    instance_id: "card-9",
    place_id: "ChIJ7X_8YQkAWDURmL44B9K0fH8",
    name: "하루카스 300 전망대",
    category: "place",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: true,
    is_ai_generated: true,
    estimated_duration_min: 60,
    coordinates: { lat: 34.6468, lng: 135.5136 },
    time_constraint: "해질녘",
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: null,
    tips: null,
    tags: ["전망대"],
    source: "ai_summary",
    day: null,
    notes: "일정상 시간이 부족해 제외",
    location: "오사카",
  },
  {
    instance_id: "card-10",
    place_id: null,
    name: "쇼핑 후보 메모",
    category: "etc",
    classification: "unassigned",
    placement_status: "ready_partial",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: true,
    is_ai_generated: false,
    estimated_duration_min: 45,
    coordinates: null,
    time_constraint: null,
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: "면세점과 드럭스토어를 같이 보고 싶어 하셨어요",
    tips: null,
    tags: ["쇼핑"],
    source: "user_input",
    day: null,
    notes: "우선순위 낮음",
    location: undefined,
  },
];

const GROUP_META = {
  input_required: {
    title: "입력이 필요한 카드들",
    description: "직접 입력이 있어야 다음 단계로 넘어갈 수 있어요",
    countLabel: "입력이 필요해요",
    bg: "#FFEDD5",
    stroke: "#EA580C",
    text: "#9A3412",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2">
        <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  select_required: {
    title: "선택이 필요한 카드들",
    description: "옵션을 골라주면 AI가 일정 배치를 마무리해요",
    countLabel: "선택이 필요해요",
    bg: "#FEF3C7",
    stroke: "#F59E0B",
    text: "#92400E",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01" />
      </svg>
    ),
  },
  fix_required: {
    title: "수정이 필요한 카드들",
    description: "정보를 수정해주면 다시 처리할 수 있어요",
    countLabel: "수정이 필요해요",
    bg: "#FEE2E2",
    stroke: "#DC2626",
    text: "#991B1B",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9l-6 6M9 9l6 6" />
      </svg>
    ),
  },
  review_only: {
    title: "확인만 하면 되는 카드들",
    description: "이미 정리가 거의 끝난 카드들이에요",
    countLabel: "검토만 남았어요",
    bg: "#DCFCE7",
    stroke: "#22C55E",
    text: "#166534",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
  },
  excluded_general: {
    title: "제외된 항목",
    description: "일반 카드 중 현재 제외된 항목입니다",
    countLabel: "제외됨",
    bg: "#F3F4F6",
    stroke: "#6B7280",
    text: "#4B5563",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      </svg>
    ),
  },
  excluded_unassigned: {
    title: "미분류 제외 항목",
    description: "미분류 상태로 제외된 항목입니다",
    countLabel: "제외됨",
    bg: "#F3F4F6",
    stroke: "#9CA3AF",
    text: "#6B7280",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      </svg>
    ),
  },
} as const;

type GroupKey = keyof typeof GROUP_META;

export default function OrganizePage() {
  const [cards, setCards] = useState<TripCardData[]>(DEMO_CARDS);
  const [selectedCard, setSelectedCard] = useState<TripCardData | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const currentStep = 3;

  const [expandedGroups, setExpandedGroups] = useState<Record<GroupKey, boolean>>({
    input_required: true,
    select_required: true,
    fix_required: true,
    review_only: true,
    excluded_general: true,
    excluded_unassigned: false,
  });

  const groupedCards = useMemo(() => {
    const activeCards = cards.filter((c) => !c.is_excluded);
    const excludedCards = cards.filter((c) => c.is_excluded);

    return {
      input_required: activeCards.filter((c) => c.action_type === "input_required"),
      select_required: activeCards.filter((c) => c.action_type === "select_required"),
      fix_required: activeCards.filter((c) => c.action_type === "fix_required"),
      review_only: activeCards.filter((c) => c.action_type === "review_only"),
      excluded: {
        general: excludedCards.filter((c) => c.classification !== "unassigned"),
        unassigned: excludedCards.filter((c) => c.classification === "unassigned"),
      },
    };
  }, [cards]);

  const readyProgress = useMemo(() => {
    const activeCards = cards.filter((c) => !c.is_excluded);
    if (activeCards.length === 0) return 100;
    const doneCount = activeCards.filter((c) => c.action_type === "review_only").length;
    return Math.round((doneCount / activeCards.length) * 100);
  }, [cards]);

  const canProceedTo04 = useMemo(() => {
    const blockingCards = cards.filter(
      (c) => c.classification === "unassigned" && !c.is_excluded && !c.can_exclude
    );
    return blockingCards.length === 0;
  }, [cards]);

  const blockingUnassignedCount = useMemo(
    () =>
      cards.filter(
        (c) => c.classification === "unassigned" && !c.is_excluded && !c.can_exclude
      ).length,
    [cards]
  );

  const toggleGroup = (group: GroupKey) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const handleCardClick = (card: TripCardData) => {
    if (!canOpenTripCardDetail(card)) return;
    setSelectedCard(card);
    setPanelOpen(true);
  };

  const handleUpdateCard = (updatedCard: TripCardData) => {
    setCards((prev) =>
      prev.map((card) =>
        card.instance_id === updatedCard.instance_id ? updatedCard : card
      )
    );
    setSelectedCard(updatedCard);
  };

  const renderGroupSection = (
    key: GroupKey,
    cardsInGroup: TripCardData[]
  ) => {
    if (cardsInGroup.length === 0) return null;

    const meta = GROUP_META[key];

    return (
      <div className="overflow-hidden rounded-2xl border border-[#EBEBEB] bg-white">
        <button
          onClick={() => toggleGroup(key)}
          className="flex w-full items-center justify-between p-6 transition-colors hover:bg-[#FAFAFA]"
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: meta.bg }}
            >
              {meta.icon}
            </div>
            <div className="text-left">
              <h2 className="text-base font-semibold text-[#1A1A1A]">{meta.title}</h2>
              <p className="text-xs text-[#888]">
                {cardsInGroup.length}개의 카드가 {meta.countLabel}
              </p>
            </div>
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className={`text-[#888] transition-transform duration-200 ${expandedGroups[key] ? "rotate-180" : ""}`}
          >
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {expandedGroups[key] && (
          <div className="space-y-3 px-6 pb-6">
            {cardsInGroup.map((card) => (
              <TripCard
                key={card.instance_id}
                card={card}
                onClick={() => handleCardClick(card)}
              />
            ))}
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

      <div className="flex-1 px-8 py-10 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <div className="mb-2">
                <h1 className="text-2xl font-semibold text-[#1A1A1A]">정보 정리하기</h1>
                <p className="mt-2 text-base text-[#888]">
                  action type 기준으로 카드를 정리하고, 필요한 입력을 완료해주세요
                </p>

                <div className="mt-4 rounded-xl border border-[#EBEBEB] bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-[#1A1A1A]">정리 진행률</span>
                    <span className="text-sm font-semibold text-[#534AB7]">{readyProgress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#F0F0F0]">
                    <div
                      className="h-full rounded-full bg-[#534AB7] transition-all duration-500"
                      style={{ width: `${readyProgress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-[#888]">
                    활성 카드 {cards.filter((card) => !card.is_excluded).length}개 중 {groupedCards.review_only.length}개 확인 완료
                  </p>
                </div>
              </div>

              {renderGroupSection("input_required", groupedCards.input_required)}
              {renderGroupSection("select_required", groupedCards.select_required)}
              {renderGroupSection("fix_required", groupedCards.fix_required)}
              {renderGroupSection("review_only", groupedCards.review_only)}
              {renderGroupSection("excluded_general", groupedCards.excluded.general)}
              {renderGroupSection("excluded_unassigned", groupedCards.excluded.unassigned)}

              <div className="mt-6 flex items-center justify-between lg:hidden">
                <Link
                  href="/dump"
                  className="flex items-center gap-2 rounded-lg border border-[#E0E0E0] bg-white px-6 py-3 text-[15px] font-medium text-[#666] no-underline transition-colors hover:bg-[#F5F5F5]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  이전
                </Link>
                <Link
                  href="/arrange"
                  className={`flex items-center gap-2 rounded-lg px-8 py-3 text-[15px] font-semibold no-underline transition-all ${
                    canProceedTo04
                      ? "bg-[#534AB7] text-white shadow-md shadow-[#534AB7]/20 hover:bg-[#4840A0]"
                      : "pointer-events-none cursor-not-allowed bg-[#E8E8E8] text-[#999]"
                  }`}
                >
                  다음
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-36">
                <div className="rounded-2xl border border-[#EBEBEB] bg-white p-6 lg:p-8">
                  <h3 className="mb-5 text-lg font-semibold text-[#1A1A1A]">여행 요약</h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#F5F5F5]">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="mb-1 text-xs text-[#999]">여행지</p>
                        <p className="text-base font-medium text-[#1A1A1A]">오사카, 교토, 나라</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#F5F5F5]">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="mb-1 text-xs text-[#999]">일정</p>
                        <p className="text-base font-medium text-[#1A1A1A]">5월 10일 ~ 5월 14일</p>
                        <p className="text-xs text-[#888]">4박 5일</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#F5F5F5]">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="mb-1 text-xs text-[#999]">동행자</p>
                        <p className="text-base font-medium text-[#1A1A1A]">2명</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#F5F5F5]">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
                          <rect x="3" y="5" width="18" height="14" rx="2" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="mb-1 text-xs text-[#999]">전체 카드</p>
                        <p className="text-base font-medium text-[#1A1A1A]">{cards.length}개</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {groupedCards.input_required.length > 0 && (
                            <span className="rounded bg-[#FFEDD5] px-1.5 py-0.5 text-xs text-[#9A3412]">
                              입력 {groupedCards.input_required.length}
                            </span>
                          )}
                          {groupedCards.select_required.length > 0 && (
                            <span className="rounded bg-[#FEF3C7] px-1.5 py-0.5 text-xs text-[#92400E]">
                              선택 {groupedCards.select_required.length}
                            </span>
                          )}
                          {groupedCards.fix_required.length > 0 && (
                            <span className="rounded bg-[#FEE2E2] px-1.5 py-0.5 text-xs text-[#991B1B]">
                              수정 {groupedCards.fix_required.length}
                            </span>
                          )}
                          <span className="rounded bg-[#DCFCE7] px-1.5 py-0.5 text-xs text-[#166534]">
                            완료 {groupedCards.review_only.length}
                          </span>
                          {(groupedCards.excluded.general.length > 0 || groupedCards.excluded.unassigned.length > 0) && (
                            <span className="rounded bg-[#F3F4F6] px-1.5 py-0.5 text-xs text-[#6B7280]">
                              제외 {groupedCards.excluded.general.length + groupedCards.excluded.unassigned.length}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="my-6 h-px bg-[#EBEBEB]" />

                  <div className="mb-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-[#999]">정리 완료도</span>
                      <span className="text-sm font-medium text-[#534AB7]">
                        {readyProgress === 100 ? "모두 완료!" : `${readyProgress}% 완료`}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#F0F0F0]">
                      <div
                        className="h-full rounded-full bg-[#534AB7] transition-all duration-500"
                        style={{ width: `${readyProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link
                      href="/arrange"
                      className={`block w-full rounded-xl py-4 text-center text-base font-semibold no-underline transition-all ${
                        canProceedTo04
                          ? "bg-[#534AB7] text-white shadow-[0_4px_12px_rgba(83,74,183,0.3)] hover:bg-[#4a42a5] active:scale-[0.98]"
                          : "pointer-events-none cursor-default bg-[#E0E0E0] text-[#999]"
                      }`}
                    >
                      다음 단계로
                    </Link>
                    <Link
                      href="/dump"
                      className="block w-full rounded-xl border border-[#E0E0E0] bg-white py-3 text-center text-sm font-medium text-[#666] no-underline transition-colors hover:bg-[#F8F8F8]"
                    >
                      이전 단계
                    </Link>
                  </div>

                  {!canProceedTo04 && (
                    <p className="mt-3 text-center text-xs text-[#B45309]">
                      미분류 카드 {blockingUnassignedCount}개는 제외할 수 없어, 먼저 입력 또는 확인이 필요합니다.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TripCardDetailPanel
        card={selectedCard}
        open={panelOpen}
        onOpenChange={setPanelOpen}
        onUpdateCard={handleUpdateCard}
      />
    </div>
  );
}
