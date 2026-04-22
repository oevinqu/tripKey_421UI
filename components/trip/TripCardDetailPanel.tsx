"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  TripCardData,
  CLASSIFICATION_COLORS,
  CLASSIFICATION_LABELS,
  PLACEMENT_LABELS,
  CATEGORY_CONFIG,
  Classification,
} from "@/types/card";

interface TripCardDetailPanelProps {
  card: TripCardData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateCard?: (card: TripCardData) => void;
}

export function TripCardDetailPanel({
  card,
  open,
  onOpenChange,
  onUpdateCard,
}: TripCardDetailPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  if (!card) return null;

  const classificationColor = CLASSIFICATION_COLORS[card.classification];
  const categoryConfig = CATEGORY_CONFIG[card.category];

  const handleConfirm = () => {
    if (!onUpdateCard) return;

    const updatedCard: TripCardData = {
      ...card,
      classification: "confirmed" as Classification,
      placement_status: "ready",
      action_type: "review_only",
    };

    // 자유 입력창 내용을 notes에 저장
    if ((card.action_type === "input_required" || card.action_type === "select_required") && inputValue) {
      updatedCard.notes = inputValue;
    }

    onUpdateCard(updatedCard);
    setInputValue("");
    setSelectedOption(null);
    onOpenChange(false);
  };

  // 카테고리 아이콘 렌더링
  const renderCategoryIcon = () => {
    switch (card.category) {
      case "place":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        );
      case "activity":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
          </svg>
        );
      case "transport":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2-4H8L6 10l-2.5 1.1c-.8.2-1.5 1-1.5 1.9v3c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        );
      case "accommodation":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21h18M4 21V10l8-6 8 6v11M9 21v-6h6v6" />
          </svg>
        );
      case "food":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
          </svg>
        );
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 overflow-y-auto">
        {/* 헤더 */}
        <SheetHeader className="p-6 pb-4 border-b border-[#EBEBEB]">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: classificationColor.bg,
                color: classificationColor.text,
              }}
            >
              {CLASSIFICATION_LABELS[card.classification]}
            </span>
            <span className="flex items-center gap-1 text-xs text-[#888] bg-[#F5F5F5] px-2 py-0.5 rounded-full">
              {renderCategoryIcon()}
              {categoryConfig.label}
            </span>
          </div>
          <SheetTitle className="text-xl font-semibold text-[#1A1A1A] text-left">
            {card.title}
          </SheetTitle>
        </SheetHeader>

        {/* 콘텐츠 */}
        <div className="p-6 space-y-6">
          {/* 상태 섹션 */}
          <div className="bg-[#FAFAFA] rounded-xl p-4">
            <h4 className="text-sm font-semibold text-[#1A1A1A] mb-3">상태 정보</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-[#888] mb-1">분류</p>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  {CLASSIFICATION_LABELS[card.classification]}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#888] mb-1">배치 상태</p>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  {PLACEMENT_LABELS[card.placement_status]}
                </p>
              </div>
            </div>
          </div>

          {/* 정보 섹션 */}
          {(card.location || card.address || card.time_slot || card.duration || card.notes) && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-[#1A1A1A]">상세 정보</h4>
              
              {card.location && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#888]">위치</p>
                    <p className="text-sm text-[#1A1A1A]">{card.location}</p>
                    {card.address && (
                      <p className="text-xs text-[#888] mt-0.5">{card.address}</p>
                    )}
                  </div>
                </div>
              )}

              {card.time_slot && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#888]">시간</p>
                    <p className="text-sm text-[#1A1A1A]">{card.time_slot}</p>
                  </div>
                </div>
              )}

              {card.duration && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#888]">소요 시간</p>
                    <p className="text-sm text-[#1A1A1A]">{card.duration}</p>
                  </div>
                </div>
              )}

              {card.notes && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <path d="M14 3v4a1 1 0 001 1h4M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
                      <line x1="9" y1="13" x2="15" y2="13" />
                      <line x1="9" y1="17" x2="13" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#888]">메모</p>
                    <p className="text-sm text-[#1A1A1A]">{card.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 질문/액션 섹션 */}
          {card.classification !== "confirmed" && (
            <div className="border-t border-[#EBEBEB] pt-6">
              {/* 질문 표시 */}
              {card.question_text && (
                <div className="mb-4 p-4 bg-[#FEF3C7] rounded-xl">
                  <div className="flex items-start gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" className="shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01" />
                    </svg>
                    <p className="text-sm text-[#92400E] font-medium">{card.question_text}</p>
                  </div>
                </div>
              )}

              {/* 자유 입력창 - 질문에 대한 답변 */}
              {(card.action_type === "input_required" || card.action_type === "select_required") && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-[#1A1A1A]">
                    답변 입력
                  </label>
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="자유롭게 답변을 입력해주세요..."
                    className="w-full p-4 border border-[#E0E0E0] rounded-xl text-sm resize-none focus:outline-none focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20 transition-all bg-white"
                    rows={4}
                  />
                  <p className="text-xs text-[#999]">
                    질문에 대한 답변을 자유롭게 작성해주세요. 작성 후 확정하기를 누르면 반영됩니다.
                  </p>

                  {/* 선택지가 있는 경우 힌트로 표시 */}
                  {card.options && card.options.length > 0 && (
                    <div className="mt-3 p-3 bg-[#F5F5F5] rounded-lg">
                      <p className="text-xs text-[#666] mb-2">참고할 수 있는 옵션:</p>
                      <div className="flex flex-wrap gap-2">
                        {card.options.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => setInputValue(option.label)}
                            className="text-xs px-3 py-1.5 bg-white border border-[#E0E0E0] rounded-lg hover:border-[#534AB7] hover:text-[#534AB7] transition-colors"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 수정 필요 메시지 (fix_required) */}
              {card.action_type === "fix_required" && (
                <div className="p-4 bg-[#FEE2E2] rounded-xl">
                  <p className="text-sm text-[#DC2626]">
                    이 항목은 수정이 필요합니다. 정보를 확인하고 수정해주세요.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="sticky bottom-0 p-6 pt-4 border-t border-[#EBEBEB] bg-white">
          <div className="flex gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 py-3 px-4 rounded-xl border border-[#E0E0E0] text-sm font-medium text-[#666] hover:bg-[#F5F5F5] transition-colors"
            >
              닫기
            </button>
            {card.classification !== "confirmed" && (
              <button
                onClick={handleConfirm}
                disabled={
                  (card.action_type === "input_required" || card.action_type === "select_required") && !inputValue
                }
                className="flex-1 py-3 px-4 rounded-xl bg-[#534AB7] text-sm font-semibold text-white hover:bg-[#4840A0] transition-colors disabled:bg-[#E0E0E0] disabled:text-[#999] disabled:cursor-not-allowed"
              >
                확정하기
              </button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
