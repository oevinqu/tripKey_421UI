"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MainHeader, SubHeader } from "@/components/header";
import { TripCard } from "@/components/trip/TripCard";
import { TripCardDetailPanel } from "@/components/trip/TripCardDetailPanel";
import {
  TripCardData,
  PlacementStatus,
} from "@/types/card";

// 데모 데이터 - Stock에 있는 카드들
const INITIAL_STOCK_CARDS: TripCardData[] = [
  {
    id: "1",
    title: "유니버설 스튜디오 재팬",
    category: "place",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "idle",
    action_type: "review_only",
    location: "오사카",
    duration: "6-8시간",
    notes: "해리포터 월드 꼭 가기",
  },
  {
    id: "2",
    title: "도톤보리 맛집 투어",
    category: "food",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "idle",
    action_type: "review_only",
    location: "도톤보리",
  },
  {
    id: "3",
    title: "후시미 이나리 신사",
    category: "place",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "idle",
    action_type: "review_only",
    location: "교토",
    duration: "2-3시간",
  },
  {
    id: "4",
    title: "아라시야마 대나무숲",
    category: "place",
    classification: "confirmed",
    placement_status: "ready_partial",
    processing_status: "idle",
    action_type: "select_required",
    location: "교토",
    question_text: "오전과 오후 중 언제 방문하시겠어요?",
    options: [
      { id: "morning", label: "오전 (사람이 적음)" },
      { id: "afternoon", label: "오후 (빛이 예쁨)" },
    ],
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
    id: "6",
    title: "나라 사슴공원",
    category: "activity",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "idle",
    action_type: "review_only",
    location: "나라",
    duration: "3-4시간",
  },
  {
    id: "7",
    title: "금각사 (킨카쿠지)",
    category: "place",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "processing",
    action_type: "review_only",
    location: "교토",
    notes: "최적 방문 시간 분석 중...",
  },
  {
    id: "8",
    title: "이치란 라멘",
    category: "food",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "idle",
    action_type: "review_only",
    location: "도톤보리점",
  },
  {
    id: "9",
    title: "오사카성",
    category: "place",
    classification: "confirmed",
    placement_status: "ready",
    processing_status: "pending",
    action_type: "review_only",
    location: "오사카",
    duration: "2시간",
  },
  {
    id: "10",
    title: "쿠로몬 시장",
    category: "food",
    classification: "open_question",
    placement_status: "blocked",
    processing_status: "failed",
    action_type: "fix_required",
    location: "오사카",
    question_text: "정보 처리 중 오류가 발생했습니다.",
  },
];

// Day Board 초기 데이터
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

  // 배치된 카드 수 계산
  const placedCardsCount = days.reduce((sum, day) => sum + day.cards.length, 0);
  const totalCards = stockCards.length + placedCardsCount;
  const progress = totalCards > 0 ? Math.round((placedCardsCount / totalCards) * 100) : 0;

  // 드래그 가능 여부 체크
  const canDrag = (card: TripCardData) => {
    return card.placement_status !== "blocked";
  };

  // 드래그 시작
  const handleDragStart = (card: TripCardData, source: string) => {
    if (!canDrag(card)) return;
    setDraggedCard(card);
    setDragSource(source);
  };

  // 드래그 종료
  const handleDragEnd = () => {
    setDraggedCard(null);
    setDragSource(null);
  };

  // Day 컬럼에 드롭
  const handleDropOnDay = (dayId: string) => {
    if (!draggedCard || !dragSource) return;

    // Stock에서 가져온 경우
    if (dragSource === "stock") {
      setStockCards((prev) => prev.filter((c) => c.id !== draggedCard.id));
      setDays((prev) =>
        prev.map((day) =>
          day.id === dayId
            ? { ...day, cards: [...day.cards, { ...draggedCard, day: parseInt(dayId.replace("day", "")) }] }
            : day
        )
      );
    } else {
      // 다른 Day에서 가져온 경우
      setDays((prev) =>
        prev.map((day) => {
          if (day.id === dragSource) {
            return { ...day, cards: day.cards.filter((c) => c.id !== draggedCard.id) };
          }
          if (day.id === dayId) {
            return { ...day, cards: [...day.cards, { ...draggedCard, day: parseInt(dayId.replace("day", "")) }] };
          }
          return day;
        })
      );
    }

    handleDragEnd();
  };

  // Stock으로 다시 드롭
  const handleDropOnStock = () => {
    if (!draggedCard || dragSource === "stock") {
      handleDragEnd();
      return;
    }

    // Day에서 Stock으로 이동
    setDays((prev) =>
      prev.map((day) =>
        day.id === dragSource
          ? { ...day, cards: day.cards.filter((c) => c.id !== draggedCard.id) }
          : day
      )
    );
    setStockCards((prev) => [...prev, { ...draggedCard, day: undefined }]);
    handleDragEnd();
  };

  // 카드 클릭 시 상세 패널 열기
  const handleCardClick = (card: TripCardData) => {
    setSelectedCard(card);
    setDetailOpen(true);
  };

  // 카드 업데이트
  const handleUpdateCard = (updatedCard: TripCardData) => {
    // Stock에서 업데이트
    setStockCards((prev) =>
      prev.map((c) => (c.id === updatedCard.id ? updatedCard : c))
    );
    // Days에서 업데이트
    setDays((prev) =>
      prev.map((day) => ({
        ...day,
        cards: day.cards.map((c) => (c.id === updatedCard.id ? updatedCard : c)),
      }))
    );
    setSelectedCard(updatedCard);
  };

  // Polling 시뮬레이션: processing 상태인 카드들의 상태 변화
  useEffect(() => {
    const interval = setInterval(() => {
      const updateProcessingCards = (cards: TripCardData[]) =>
        cards.map((card) => {
          if (card.processing_status === "processing") {
            // 50% 확률로 completed로 변경
            if (Math.random() > 0.5) {
              return { ...card, processing_status: "completed" as const };
            }
          }
          if (card.processing_status === "pending") {
            // 30% 확률로 processing으로 변경
            if (Math.random() > 0.7) {
              return { ...card, processing_status: "processing" as const };
            }
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
    <div className="min-h-screen bg-[#F5F5F3] font-sans flex flex-col">
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

      {/* 진행률 헤더 */}
      <div className="px-8 lg:px-12 py-4 bg-white border-b border-[#EBEBEB]">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#1A1A1A]">일정 배치</h1>
            <p className="text-sm text-[#888] mt-1">카드를 드래그하여 원하는 날짜에 배치하세요</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-[#666]">배치 완료</p>
              <p className="text-lg font-semibold text-[#534AB7]">{placedCardsCount}/{totalCards}</p>
            </div>
            <div className="w-32 h-2 bg-[#E8E8E8] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#534AB7] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 좌측 사이드바: Stock */}
        <div
          className="w-80 bg-white border-r border-[#EBEBEB] flex flex-col"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropOnStock}
        >
          <div className="p-4 border-b border-[#EBEBEB]">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[#1A1A1A]">보관함</h2>
              <span className="text-sm text-[#888]">{stockCards.length}개</span>
            </div>
            <p className="text-xs text-[#999] mt-1">배치할 카드를 오른쪽으로 드래그하세요</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {stockCards.map((card) => {
              const isBlocked = card.placement_status === "blocked";
              return (
                <div
                  key={card.id}
                  draggable={canDrag(card)}
                  onDragStart={() => handleDragStart(card, "stock")}
                  onDragEnd={handleDragEnd}
                  className={`relative ${isBlocked ? "opacity-60" : "cursor-grab active:cursor-grabbing"}`}
                >
                  <TripCard card={card} onClick={() => handleCardClick(card)} compact />
                  
                  {/* 드래그 가능 표시 */}
                  {!isBlocked && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded bg-[#F5F5F5] flex items-center justify-center opacity-60">
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

                  {/* Blocked 상태 표시 */}
                  {isBlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-xl">
                      <span className="text-xs font-medium text-[#DC2626] bg-[#FEE2E2] px-2 py-1 rounded">
                        해결 필요
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {stockCards.length === 0 && (
              <div className="text-center py-12 text-[#999]">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-3 opacity-40">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </svg>
                <p className="text-sm">모든 카드가 배치되었습니다!</p>
              </div>
            )}
          </div>
        </div>

        {/* 메인 영역: Day Board */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 p-6 min-w-max">
            {days.map((day) => (
              <div
                key={day.id}
                className={`w-72 flex-shrink-0 bg-[#FAFAFA] rounded-xl border-2 border-dashed transition-colors ${
                  draggedCard && dragSource !== day.id
                    ? "border-[#534AB7] bg-[#F9F8FF]"
                    : "border-[#E0E0E0]"
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDropOnDay(day.id)}
              >
                {/* Day 헤더 */}
                <div className="p-4 border-b border-[#E8E8E8] bg-white rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[#1A1A1A]">{day.label}</h3>
                      <p className="text-xs text-[#888]">{day.date}</p>
                    </div>
                    <span className="text-sm text-[#534AB7] font-medium">{day.cards.length}개</span>
                  </div>
                </div>

                {/* 카드 리스트 */}
                <div className="p-3 space-y-3 min-h-[400px]">
                  {day.cards.map((card, index) => (
                    <div
                      key={card.id}
                      draggable={canDrag(card)}
                      onDragStart={() => handleDragStart(card, day.id)}
                      onDragEnd={handleDragEnd}
                      className={`relative ${canDrag(card) ? "cursor-grab active:cursor-grabbing" : ""}`}
                    >
                      {/* 시간 순서 표시 */}
                      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#534AB7] text-white text-xs font-medium flex items-center justify-center z-10">
                        {index + 1}
                      </div>
                      <div className="ml-4">
                        <TripCard card={card} onClick={() => handleCardClick(card)} compact />
                      </div>
                    </div>
                  ))}

                  {day.cards.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-32 text-[#B0B0B0]">
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

      {/* 하단 네비게이션 */}
      <div className="px-8 lg:px-12 py-4 bg-white border-t border-[#EBEBEB]">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <Link
            href="/organize"
            className="px-6 py-3 rounded-xl border border-[#E0E0E0] bg-white text-[#666] text-sm font-medium hover:bg-[#F8F8F8] transition-colors no-underline flex items-center gap-2"
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
              className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all no-underline flex items-center gap-2 ${
                stockCards.length === 0
                  ? "bg-[#534AB7] text-white hover:bg-[#4840A0] shadow-md shadow-[#534AB7]/20"
                  : "bg-[#E8E8E8] text-[#999] cursor-not-allowed pointer-events-none"
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

      {/* 상세 패널 */}
      {selectedCard && (
        <TripCardDetailPanel
          card={selectedCard}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          onUpdateCard={handleUpdateCard}
        />
      )}
    </div>
  );
}
