"use client";

import {
  TripCardData,
  CLASSIFICATION_COLORS,
  CLASSIFICATION_LABELS,
  CATEGORY_CONFIG,
} from "@/types/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  canOpenTripCardDetail,
  getTripCardDetailLockReason,
} from "./tripCardState";

interface TripCardProps {
  card: TripCardData;
  onClick?: () => void;
  compact?: boolean;
}

export function TripCard({ card, onClick, compact = false }: TripCardProps) {
  const classificationColor = CLASSIFICATION_COLORS[card.classification];
  const categoryConfig = CATEGORY_CONFIG[card.category];
  
  const isBlocked = card.placement_status === "blocked";
  const isProcessing = card.processing_status === "processing";
  const isExcluded = card.is_excluded === true;
  const needsAttention = card.placement_status === "ready_partial" || card.placement_status === "blocked";
  const isClickable = canOpenTripCardDetail(card) && !isExcluded;
  const disabledReason = getTripCardDetailLockReason(card);

  // 카테고리 아이콘 렌더링
  const renderCategoryIcon = () => {
    switch (card.category) {
      case "place":
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        );
      case "activity":
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
          </svg>
        );
      case "transport":
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2-4H8L6 10l-2.5 1.1c-.8.2-1.5 1-1.5 1.9v3c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        );
      case "accommodation":
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21h18M4 21V10l8-6 8 6v11M9 21v-6h6v6" />
          </svg>
        );
      case "food":
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
          </svg>
        );
    }
  };

  const cardContent = (
    <div
      onClick={isClickable ? onClick : undefined}
      className={`
        relative flex bg-white rounded-xl border overflow-hidden transition-all
        ${isExcluded 
          ? "opacity-50 cursor-default border-[#E0E0E0] bg-[#F5F5F5]"
          : isProcessing
          ? "opacity-70 cursor-not-allowed border-[#E0E0E0]" 
          : "cursor-pointer border-[#EBEBEB] hover:border-[#534AB7] hover:shadow-md"
        }
        ${compact ? "p-3" : "p-4"}
      `}
    >
      {/* 좌측 색상 바 */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ backgroundColor: classificationColor.border }}
      />

      {/* 로딩 오버레이 */}
      {isProcessing && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-xl">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-[#534AB7] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-[#666]">처리 중...</span>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className="flex-1 pl-3">
        {/* 상단: 배지 + 경고 아이콘 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {/* 분류 배지 */}
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: classificationColor.bg,
                color: classificationColor.text,
              }}
            >
              {CLASSIFICATION_LABELS[card.classification]}
            </span>
            
            {/* 카테고리 배지 */}
            <span className="flex items-center gap-1 text-xs text-[#888] bg-[#F5F5F5] px-2 py-0.5 rounded-full">
              {renderCategoryIcon()}
              {categoryConfig.label}
            </span>

            {/* 처리 상태 배지 */}
            {card.processing_status === "processing" && (
              <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#534AB7]">
                <div className="w-2 h-2 border border-[#534AB7] border-t-transparent rounded-full animate-spin" />
                처리 중
              </span>
            )}
            {card.processing_status === "pending" && (
              <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E]">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" />
                </svg>
                대기 중
              </span>
            )}
            {card.processing_status === "failed" && (
              <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626]">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
                실패
              </span>
            )}
            {isExcluded && (
              <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#6B7280]">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
                제외됨
              </span>
            )}
          </div>

          {/* 경고/주의 아이콘 */}
          {needsAttention && (
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isBlocked ? "bg-[#FEE2E2]" : "bg-[#FEF3C7]"
              }`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isBlocked ? "#DC2626" : "#F59E0B"}
                strokeWidth="2"
              >
                <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
        </div>

        {/* 제목 */}
        <h3 className={`font-semibold text-[#1A1A1A] ${compact ? "text-sm" : "text-base"}`}>
          {card.title}
        </h3>

        {/* 부가 정보 */}
        {!compact && (
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#888]">
            {card.location && (
              <span className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {card.location}
              </span>
            )}
            {card.time_slot && (
              <span className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                {card.time_slot}
              </span>
            )}
            {card.duration && (
              <span className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                </svg>
                {card.duration}
              </span>
            )}
          </div>
        )}

        {/* 질문 텍스트 (있을 경우) */}
        {card.question_text && card.classification === "open_question" && !compact && (
          <div className="mt-3 p-2 bg-[#FEF3C7] rounded-lg">
            <p className="text-xs text-[#92400E] flex items-start gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01" />
              </svg>
              {card.question_text}
            </p>
          </div>
        )}
      </div>

      {/* 우측 화살표 (클릭 가능할 때만) */}
      {isClickable && !isExcluded && (
        <div className="flex items-center pl-2 text-[#CCCCCC]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </div>
      )}
    </div>
  );

  if (!disabledReason) {
    return cardContent;
  }

  return (
    <HoverCard openDelay={120} closeDelay={80}>
      <HoverCardTrigger asChild>
        {cardContent}
      </HoverCardTrigger>
      <HoverCardContent
        align="start"
        side="bottom"
        sideOffset={10}
        className="w-[280px] border-[#1A1A1A] bg-[#1A1A1A] p-3 text-white shadow-xl"
      >
        <div className="flex items-start gap-2">
          {isProcessing ? (
            <div className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FBBF24"
              strokeWidth="2"
              className="mt-0.5 flex-shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4m0 4h.01" />
            </svg>
          )}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-white">상세 패널이 잠겨 있어요</p>
            <p className="text-xs leading-relaxed text-white/85">{disabledReason}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

// 스켈레톤 컴포넌트
export function TripCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`bg-white rounded-xl border border-[#EBEBEB] ${compact ? "p-3" : "p-4"}`}>
      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <Skeleton className={`${compact ? "h-4 w-32" : "h-5 w-48"}`} />
      {!compact && (
        <div className="mt-2 flex gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      )}
    </div>
  );
}
