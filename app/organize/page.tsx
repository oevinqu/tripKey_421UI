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
import { canOpenTripCardDetail } from "@/components/trip/tripCardState";
import { TripCardData } from "@/types/card";

const DEMO_CARDS: TripCardData[] = [
  {
    instance_id: "org-1",
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
    instance_id: "org-5",
    place_id: "gion-district-kyoto",
    name: "기온 거리 산책",
    category: "activity",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "processing",
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
    instance_id: "org-6",
    place_id: null,
    name: "교토 게스트하우스",
    category: "accommodation",
    classification: "open_question",
    placement_status: "ready_partial",
    processing_status: "completed",
    action_type: "review_only",
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
    instance_id: "org-11",
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
    instance_id: "org-3",
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
    instance_id: "org-13",
    place_id: "glico-sign-osaka",
    name: "글리코상",
    category: "place",
    classification: "open_question",
    placement_status: "ready_partial",
    processing_status: "completed",
    action_type: "review_only",
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
    instance_id: "org-12",
    place_id: null,
    name: "아라시야마 대나무숲",
    category: "place",
    classification: "open_question",
    placement_status: "ready_partial",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: false,
    is_ai_generated: true,
    estimated_duration_min: 60,
    coordinates: { lat: 35.0094, lng: 135.6722 },
    time_constraint: null,
    question_text: "AI가 생성한 장소예요. 실제로 존재하는지 확인해주세요.",
    options: [
      { id: "bamboo-1", label: "실제로 있는 장소예요" },
      { id: "bamboo-2", label: "조금 더 확인이 필요해요" },
      { id: "bamboo-3", label: "제외할게요" },
    ],
    blocked_reason: null,
    user_context: "AI가 교토 자연 명소 후보로 제안했어요",
    tips: "실제 장소 확인 후 포함 여부를 정하면 돼요",
    tags: ["교토", "자연", "AI 후보"],
    source: "dump",
    day: null,
    notes: null,
    location: "교토",
  },
  {
    instance_id: "org-4",
    place_id: null,
    name: "와사카 성",
    category: "etc",
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
    tags: ["AI 후보"],
    source: "dump",
    day: null,
    notes: null,
    location: undefined,
  },
  {
    instance_id: "org-9",
    place_id: "abeno-harukas-300",
    name: "하루카스 300 전망대",
    category: "place",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    can_exclude: true,
    allow_duplicate: false,
    is_excluded: true,
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
    instance_id: "org-10",
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
    is_ai_generated: true,
    estimated_duration_min: null,
    coordinates: null,
    time_constraint: null,
    question_text: null,
    options: null,
    blocked_reason: null,
    user_context: "쇼핑 관련 메모가 있었어요",
    tips: null,
    tags: ["쇼핑"],
    source: "dump",
    day: null,
    notes: null,
    location: undefined,
  },
];

const GROUP_META = {
  input_required: {
    title: "입력이 필요한 카드들",
    countLabel: "입력이 필요해요",
    bg: "#FFEDD5",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2">
        <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  select_required: {
    title: "선택이 필요한 카드들",
    countLabel: "선택이 필요해요",
    bg: "#DBEAFE",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01" />
      </svg>
    ),
  },
  fix_required: {
    title: "수정이 필요한 카드들",
    countLabel: "수정이 필요해요",
    bg: "#FEE2E2",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9l-6 6M9 9l6 6" />
      </svg>
    ),
  },
  review_only: {
    title: "확인만 하면 되는 카드들",
    countLabel: "검토만 남았어요",
    bg: "#DCFCE7",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
  },
  excluded: {
    title: "제외된 항목",
    countLabel: "제외됨",
    bg: "#F3F4F6",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      </svg>
    ),
  },
} as const;

type GroupKey = keyof typeof GROUP_META;

function matchesDestination(card: TripCardData, destination: string | null) {
  if (!destination) return true;

  return (
    card.location?.includes(destination) ||
    card.tags?.some((tag) => tag.includes(destination)) ||
    false
  );
}

export default function OrganizePage() {
  const [cards, setCards] = useState<TripCardData[]>(DEMO_CARDS);
  const [selectedCard, setSelectedCard] = useState<TripCardData | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [destinationFilter, setDestinationFilter] = useState<string | null>(null);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const currentStep = 3;

  const [expandedGroups, setExpandedGroups] = useState<Record<GroupKey, boolean>>({
    input_required: true,
    select_required: true,
    fix_required: true,
    review_only: true,
    excluded: true,
  });

  const groupedCards = useMemo(() => {
    const activeCards = cards.filter((c) => !c.is_excluded && matchesDestination(c, destinationFilter));
    const excludedCards = cards.filter((c) => c.is_excluded && matchesDestination(c, destinationFilter));
    const sortedExcludedCards = [...excludedCards].sort((left, right) => {
      if (left.classification === "unassigned" && right.classification !== "unassigned") {
        return 1;
      }
      if (left.classification !== "unassigned" && right.classification === "unassigned") {
        return -1;
      }

      return left.name.localeCompare(right.name, "ko");
    });

    return {
      input_required: activeCards.filter((c) => c.action_type === "input_required"),
      select_required: activeCards.filter((c) => c.action_type === "select_required"),
      fix_required: activeCards.filter((c) => c.action_type === "fix_required"),
      review_only: activeCards.filter((c) => c.action_type === "review_only"),
      excluded: sortedExcludedCards,
    };
  }, [cards, destinationFilter]);

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

  const hasExistingTransport = useMemo(
    () => cards.some((card) => card.category === "transport" && !card.is_excluded),
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

  const handleAddCard = (input: NewTripCardInput) => {
    setCards((prev) => [...prev, createProcessingTripCard("org-add", input)]);
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCards((prev) =>
        prev.map((card) => {
          if (
            card.source === "manual" &&
            card.processing_status === "processing" &&
            card.processing_started_at &&
            Date.now() - card.processing_started_at >= 2500
          ) {
            return finalizeProcessingTripCard(card);
          }

          return card;
        })
      );
    }, 1500);

    return () => window.clearInterval(interval);
  }, []);

  const renderGroupSection = (key: GroupKey, cardsInGroup: TripCardData[]) => {
    if (cardsInGroup.length === 0) return null;

    const meta = GROUP_META[key];
    const allowExcludedClick = key === "excluded";

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
                allowExcludedClick={allowExcludedClick}
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
        destinationFilter={{
          activeDestination: destinationFilter,
          onSelectDestination: setDestinationFilter,
        }}
        rightButtons={
          <div className="flex items-center gap-2">
            <Link
              href="/organize-alerts"
              className="rounded-lg border border-[#E0E0E0] bg-white px-4 py-2 text-[13px] font-medium text-[#666] no-underline transition-colors hover:bg-[#F8F8F8]"
            >
              Alert Demo
            </Link>
            <Link
              href="/organize-alerts-integrated"
              className="rounded-lg border border-[#E0E0E0] bg-white px-4 py-2 text-[13px] font-medium text-[#666] no-underline transition-colors hover:bg-[#F8F8F8]"
            >
              Alert 합친 Demo
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

      <div className="flex-1 px-8 py-10 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <div className="mb-2">
                <h1 className="text-2xl font-semibold text-[#1A1A1A]">정보 정리하기</h1>
                <p className="mt-2 text-base text-[#888]">
                  모든 상태 케이스를 확인할 수 있도록 목데이터를 확장해두었습니다
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
                  {destinationFilter && (
                    <p className="mt-2 text-xs font-medium text-[#534AB7]">
                      현재 {destinationFilter} 관련 카드만 보고 있어요
                    </p>
                  )}
                </div>
              </div>

              {renderGroupSection("input_required", groupedCards.input_required)}
              {renderGroupSection("select_required", groupedCards.select_required)}
              {renderGroupSection("fix_required", groupedCards.fix_required)}
              {renderGroupSection("review_only", groupedCards.review_only)}
              {renderGroupSection("excluded", groupedCards.excluded)}

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
                          <span className="rounded bg-[#FFEDD5] px-1.5 py-0.5 text-xs text-[#9A3412]">
                            입력 {groupedCards.input_required.length}
                          </span>
                          <span className="rounded bg-[#FEF3C7] px-1.5 py-0.5 text-xs text-[#92400E]">
                            선택 {groupedCards.select_required.length}
                          </span>
                          <span className="rounded bg-[#FEE2E2] px-1.5 py-0.5 text-xs text-[#991B1B]">
                            수정 {groupedCards.fix_required.length}
                          </span>
                          <span className="rounded bg-[#DCFCE7] px-1.5 py-0.5 text-xs text-[#166534]">
                            완료 {groupedCards.review_only.length}
                          </span>
                          <span className="rounded bg-[#F3F4F6] px-1.5 py-0.5 text-xs text-[#6B7280]">
                            제외 {groupedCards.excluded.length}
                          </span>
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

      <AddTripCardDialog
        open={addCardOpen}
        onOpenChange={setAddCardOpen}
        onSubmit={handleAddCard}
        hasExistingTransport={hasExistingTransport}
      />
    </div>
  );
}
