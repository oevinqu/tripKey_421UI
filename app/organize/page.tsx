"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MainHeader, SubHeader } from "@/components/header";
import { TripCard, TripCardSkeleton } from "@/components/trip/TripCard";
import { TripCardDetailPanel } from "@/components/trip/TripCardDetailPanel";
import { canOpenTripCardDetail } from "@/components/trip/tripCardState";
import { TripCardData, CardGroup } from "@/types/card";

// 데모 데이터 - 모든 상태 조합을 확인할 수 있도록 구성
const DEMO_CARDS: TripCardData[] = [
  // ========== 정리된 항목 (confirmed + ready) ==========
  {
    id: "1",
    title: "유니버설 스튜디오 재팬",
    category: "place",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "idle",
    action_type: "review_only",
    location: "오사카",
    time_slot: "오전 9시",
    duration: "6-8시간",
    notes: "해리포터 월드 꼭 가기",
    day: 1,
  },
  {
    id: "6",
    title: "나라 사슴공원",
    category: "activity",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "idle",
    action_type: "review_only",
    location: "나라",
    duration: "3-4시간",
    notes: "사슴 센베이 구매",
    day: 3,
  },
  {
    id: "9",
    title: "이치란 라멘",
    category: "food",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "idle",
    action_type: "review_only",
    location: "도톤보리점",
    time_slot: "저녁",
    day: 1,
  },
  {
    id: "10",
    title: "오사카 숙소",
    category: "accommodation",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "idle",
    action_type: "review_only",
    location: "난바역 도보 5분",
    notes: "신주쿠 프린스 호텔",
  },

  // ========== 질문 필요 (ready_partial / blocked) ==========
  {
    id: "2",
    title: "도톤보리 맛집 투어",
    category: "food",
    classification: "open_question",
    placement_status: "ready_partial",
    processing_status: "idle",
    action_type: "select_required",
    location: "도톤보리",
    question_text: "점심과 저녁 중 언제 방문하시겠어요?",
    options: [
      { id: "lunch", label: "점심 (12:00-14:00)" },
      { id: "dinner", label: "저녁 (18:00-20:00)" },
    ],
    day: 1,
  },
  {
    id: "5",
    title: "교토역 → 오사카 이동",
    category: "transport",
    classification: "open_question",
    placement_status: "blocked",
    processing_status: "idle",
    action_type: "input_required",
    question_text: "이동 수단을 알려주세요 (신칸센, 특급열차 등)",
  },
  {
    id: "8",
    title: "신사이바시 쇼핑",
    category: "activity",
    classification: "unassigned",
    placement_status: "ready_partial",
    processing_status: "idle",
    action_type: "input_required",
    location: "오사카",
    question_text: "쇼핑 예산과 관심 품목을 알려주세요",
  },

  // ========== 확인 필요 (undecided) ==========
  {
    id: "3",
    title: "후시미 이나리 신사",
    category: "place",
    classification: "undecided",
    placement_status: "ready_partial",
    processing_status: "idle",
    action_type: "select_required",
    location: "교토",
    question_text: "몇일차에 방문하시겠어요?",
    options: [
      { id: "day2", label: "2일차 (5월 11일)" },
      { id: "day3", label: "3일차 (5월 12일)" },
    ],
  },
  {
    id: "4",
    title: "아라시야마 대나무숲",
    category: "place",
    classification: "undecided",
    placement_status: "ready_partial",
    processing_status: "idle",
    action_type: "select_required",
    location: "교토",
    question_text: "몇일차에 방문하시겠어요?",
    options: [
      { id: "day2", label: "2일차 (5월 11일)" },
      { id: "day3", label: "3일차 (5월 12일)" },
    ],
  },

  // ========== 처리 상태별 (processing_status) ==========
  {
    id: "11",
    title: "오사카 공항 → 난바 이동",
    category: "transport",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "processing",
    action_type: "review_only",
    location: "간사이 공항",
    notes: "AI가 최적 경로를 분석 중입니다...",
  },
  {
    id: "12",
    title: "쿠로몬 시장",
    category: "food",
    classification: "open_question",
    placement_status: "ready_partial",
    processing_status: "pending",
    action_type: "input_required",
    location: "오사카",
    question_text: "아침 식사로 방문할까요?",
  },
  {
    id: "13",
    title: "오사카성",
    category: "place",
    classification: "undecided",
    placement_status: "blocked",
    processing_status: "failed",
    action_type: "fix_required",
    location: "오사카",
    question_text: "정보 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
  },

  // ========== 다양한 카테고리 ==========
  {
    id: "14",
    title: "간사이 공항 출발",
    category: "transport",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "completed",
    action_type: "review_only",
    location: "간사이 공항",
    time_slot: "오후 6시",
    day: 5,
  },
  {
    id: "15",
    title: "교토 게스트하우스",
    category: "accommodation",
    classification: "open_question",
    placement_status: "ready_partial",
    processing_status: "idle",
    action_type: "select_required",
    location: "교토",
    question_text: "몇 박을 숙박하시겠어요?",
    options: [
      { id: "1night", label: "1박" },
      { id: "2night", label: "2박" },
    ],
  },
  {
    id: "16",
    title: "기온 거리 산책",
    category: "activity",
    classification: "undecided",
    placement_status: "ready",
    processing_status: "idle",
    action_type: "review_only",
    location: "교토",
    duration: "1-2시간",
    notes: "게이샤 거리 구경",
  },

  // ========== 제외된 항목 (is_excluded) ==========
  {
    id: "17",
    title: "하루카스 300 전망대",
    category: "place",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "idle",
    action_type: "review_only",
    location: "오사카",
    duration: "1시간",
    notes: "일정상 시간이 부족하여 제외",
    is_excluded: true,
  },
  {
    id: "18",
    title: "덴포잔 대관람차",
    category: "activity",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "idle",
    action_type: "review_only",
    location: "오사카",
    duration: "30분",
    is_excluded: true,
  },
];

export default function OrganizePage() {
  const [cards, setCards] = useState<TripCardData[]>(DEMO_CARDS);
  const [selectedCard, setSelectedCard] = useState<TripCardData | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const currentStep = 3;

  // 그룹 접기/펼치기 상태
  const [expandedGroups, setExpandedGroups] = useState({
    needsQuestion: true,
    needsConfirmation: true,
    organized: true,
    excluded: false,
  });

  const toggleGroup = (group: keyof typeof expandedGroups) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  // 그룹별 카드 분류
  const groupedCards = useMemo(() => {
    const activeCards = cards.filter((c) => !c.is_excluded);
    const excludedCards = cards.filter((c) => c.is_excluded);
    
    const needsQuestion = activeCards.filter(
      (c) => c.placement_status === "ready_partial" || c.placement_status === "blocked"
    );
    const needsConfirmation = activeCards.filter(
      (c) => c.classification === "undecided" && c.placement_status !== "blocked" && c.placement_status !== "ready_partial"
    );
    const organized = activeCards.filter(
      (c) => c.placement_status === "ready" && c.classification === "confirmed"
    );

    return { needsQuestion, needsConfirmation, organized, excluded: excludedCards };
  }, [cards]);

  // ready 상태 비율 계산 (제외된 카드는 제외)
  const readyProgress = useMemo(() => {
    const activeCards = cards.filter((c) => !c.is_excluded);
    if (activeCards.length === 0) return 100;
    const readyCount = activeCards.filter((c) => c.placement_status === "ready" && c.classification === "confirmed").length;
    return Math.round((readyCount / activeCards.length) * 100);
  }, [cards]);

  const handleCardClick = (card: TripCardData) => {
    if (!canOpenTripCardDetail(card)) return;
    setSelectedCard(card);
    setPanelOpen(true);
  };

  const handleUpdateCard = (updatedCard: TripCardData) => {
    setCards((prev) =>
      prev.map((c) => (c.id === updatedCard.id ? updatedCard : c))
    );
    setSelectedCard(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3] font-sans flex flex-col">
      {/* 메인 헤더 */}
      <MainHeader />

      {/* 서브 헤더 */}
      <SubHeader
        currentStep={currentStep}
        tripInfo={{
          destinations: ["오사카", "교토", "나라"],
          travelers: 2,
          startDate: "5월 10일",
          endDate: "5월 14일",
        }}
      />

      {/* 메인 콘텐츠 영역 - 2컬럼 레이아웃 */}
      <div className="flex-1 px-8 lg:px-12 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 왼쪽: 카드 리스트 영역 (2/3) */}
            <div className="lg:col-span-2 space-y-8">
              {/* 페이지 타이틀 + 프로그레스 */}
              <div className="mb-2">
                <h1 className="text-2xl font-semibold text-[#1A1A1A]">정보 정리하기</h1>
                <p className="mt-2 text-base text-[#888]">
                  AI가 분석한 여행 정보를 확인하고 질문에 답변해주세요
                </p>

                {/* 프로그레스 바 */}
                <div className="mt-4 bg-white rounded-xl border border-[#EBEBEB] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#1A1A1A]">정리 진행률</span>
                    <span className="text-sm font-semibold text-[#534AB7]">{readyProgress}%</span>
                  </div>
                  <div className="h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#534AB7] rounded-full transition-all duration-500"
                      style={{ width: `${readyProgress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-[#888]">
                    전체 {cards.length}개 중 {groupedCards.organized.length}개 정리 완료
                  </p>
                </div>
              </div>

              {/* 질문이 필요한 항목 */}
              {groupedCards.needsQuestion.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
                  <button
                    onClick={() => toggleGroup("needsQuestion")}
                    className="w-full p-6 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <h2 className="text-base font-semibold text-[#1A1A1A]">질문이 필요한 항목</h2>
                        <p className="text-xs text-[#888]">{groupedCards.needsQuestion.length}개의 항목에 답변이 필요해요</p>
                      </div>
                    </div>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      className={`text-[#888] transition-transform duration-200 ${expandedGroups.needsQuestion ? "rotate-180" : ""}`}
                    >
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {expandedGroups.needsQuestion && (
                    <div className="px-6 pb-6 space-y-3">
                      {groupedCards.needsQuestion.map((card) => (
                        <TripCard
                          key={card.id}
                          card={card}
                          onClick={() => handleCardClick(card)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 확인이 필요한 항목 */}
              {groupedCards.needsConfirmation.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
                  <button
                    onClick={() => toggleGroup("needsConfirmation")}
                    className="w-full p-6 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                          <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <h2 className="text-base font-semibold text-[#1A1A1A]">확인이 필요한 항목</h2>
                        <p className="text-xs text-[#888]">{groupedCards.needsConfirmation.length}개의 항목을 확인해주세요</p>
                      </div>
                    </div>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      className={`text-[#888] transition-transform duration-200 ${expandedGroups.needsConfirmation ? "rotate-180" : ""}`}
                    >
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {expandedGroups.needsConfirmation && (
                    <div className="px-6 pb-6 space-y-3">
                      {groupedCards.needsConfirmation.map((card) => (
                        <TripCard
                          key={card.id}
                          card={card}
                          onClick={() => handleCardClick(card)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 정리된 항목 */}
              {groupedCards.organized.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
                  <button
                    onClick={() => toggleGroup("organized")}
                    className="w-full p-6 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <h2 className="text-base font-semibold text-[#1A1A1A]">정리된 항목</h2>
                        <p className="text-xs text-[#888]">{groupedCards.organized.length}개의 항목이 준비됐어요</p>
                      </div>
                    </div>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      className={`text-[#888] transition-transform duration-200 ${expandedGroups.organized ? "rotate-180" : ""}`}
                    >
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {expandedGroups.organized && (
                    <div className="px-6 pb-6 space-y-3">
                      {groupedCards.organized.map((card) => (
                        <TripCard
                          key={card.id}
                          card={card}
                          onClick={() => handleCardClick(card)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 제외된 항목 */}
              {groupedCards.excluded.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
                  <button
                    onClick={() => toggleGroup("excluded")}
                    className="w-full p-6 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <h2 className="text-base font-semibold text-[#6B7280]">제외된 항목</h2>
                        <p className="text-xs text-[#888]">{groupedCards.excluded.length}개의 항목이 제외됨</p>
                      </div>
                    </div>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      className={`text-[#888] transition-transform duration-200 ${expandedGroups.excluded ? "rotate-180" : ""}`}
                    >
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {expandedGroups.excluded && (
                    <div className="px-6 pb-6 space-y-3">
                      {groupedCards.excluded.map((card) => (
                        <TripCard
                          key={card.id}
                          card={card}
                          onClick={() => handleCardClick(card)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 모바일용 네비게이션 */}
              <div className="lg:hidden mt-6 flex items-center justify-between">
                <Link
                  href="/dump"
                  className="px-6 py-3 rounded-lg border border-[#E0E0E0] bg-white text-[#666] text-[15px] font-medium hover:bg-[#F5F5F5] transition-colors no-underline flex items-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  이전
                </Link>
                <Link
                  href="/schedule"
                  className={`px-8 py-3 rounded-lg text-[15px] font-semibold transition-all no-underline flex items-center gap-2 ${readyProgress === 100
                    ? "bg-[#534AB7] text-white hover:bg-[#4840A0] shadow-md shadow-[#534AB7]/20"
                    : "bg-[#E8E8E8] text-[#999] cursor-not-allowed pointer-events-none"
                    }`}
                >
                  다음
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* 오른쪽: 요약 사이드바 (1/3) */}
            <div className="lg:col-span-1">
              <div className="sticky top-36">
                {/* 여행 요약 카드 */}
                <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 lg:p-8">
                  <h3 className="text-lg font-semibold text-[#1A1A1A] mb-5">여행 요약</h3>

                  <div className="space-y-4">
                    {/* 여행지 */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-[#999] mb-1">여행지</p>
                        <p className="text-base font-medium text-[#1A1A1A]">오사카, 교토, 나라</p>
                      </div>
                    </div>

                    {/* 일정 */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-[#999] mb-1">일정</p>
                        <p className="text-base font-medium text-[#1A1A1A]">5월 10일 ~ 5월 14일</p>
                        <p className="text-xs text-[#888]">4박 5일</p>
                      </div>
                    </div>

                    {/* 동행자 */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-[#999] mb-1">동행자</p>
                        <p className="text-base font-medium text-[#1A1A1A]">2명</p>
                      </div>
                    </div>

                    {/* 카드 현황 */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
                          <rect x="3" y="5" width="18" height="14" rx="2" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-[#999] mb-1">전체 카드</p>
                        <p className="text-base font-medium text-[#1A1A1A]">{cards.length}개</p>
<div className="mt-1 flex flex-wrap gap-1">
                          {groupedCards.needsQuestion.length > 0 && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-[#FEF3C7] text-[#92400E]">
                              질문 {groupedCards.needsQuestion.length}
                            </span>
                          )}
                          {groupedCards.needsConfirmation.length > 0 && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-[#DBEAFE] text-[#1E40AF]">
                              확인 {groupedCards.needsConfirmation.length}
                            </span>
                          )}
                          <span className="text-xs px-1.5 py-0.5 rounded bg-[#DCFCE7] text-[#166534]">
                            완료 {groupedCards.organized.length}
                          </span>
                          {groupedCards.excluded.length > 0 && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-[#F3F4F6] text-[#6B7280]">
                              제외 {groupedCards.excluded.length}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 구분선 */}
                  <div className="h-px bg-[#EBEBEB] my-6" />

                  {/* 진행 상태 */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#999]">정리 완료도</span>
                      <span className="text-sm font-medium text-[#534AB7]">
                        {readyProgress === 100 ? "모두 완료!" : `${readyProgress}% 완료`}
                      </span>
                    </div>
                    <div className="h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#534AB7] rounded-full transition-all duration-500"
                        style={{ width: `${readyProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* 이전/다음 버튼 */}
                  <div className="space-y-3">
                    <Link
                      href="/schedule"
                      className={`block w-full py-4 rounded-xl border-none text-base font-semibold text-center transition-all no-underline ${readyProgress === 100
                        ? "bg-[#534AB7] text-white cursor-pointer shadow-[0_4px_12px_rgba(83,74,183,0.3)] hover:bg-[#4a42a5] active:scale-[0.98]"
                        : "bg-[#E0E0E0] text-[#999] cursor-default pointer-events-none"
                        }`}
                    >
                      다음 단계로
                    </Link>
                    <Link
                      href="/dump"
                      className="block w-full py-3 rounded-xl border border-[#E0E0E0] bg-white text-[#666] text-sm font-medium text-center hover:bg-[#F8F8F8] transition-colors no-underline"
                    >
                      이전 단계
                    </Link>
                  </div>

                  {readyProgress < 100 && (
                    <p className="mt-3 text-xs text-[#B0B0B0] text-center">
                      모든 항목을 정리하면 다음 단계로 진행할 수 있어요
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 상세 패널 */}
      <TripCardDetailPanel
        card={selectedCard}
        open={panelOpen}
        onOpenChange={setPanelOpen}
        onUpdateCard={handleUpdateCard}
      />
    </div>
  );
}
