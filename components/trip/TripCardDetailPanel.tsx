"use client";

import { useEffect, useState } from "react";
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
  showDuplicateToggle?: boolean;
}

function formatEstimatedDuration(minutes: number | null): string | null {
  if (minutes == null) return null;
  if (minutes < 60) return `${minutes}분`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes === 0
    ? `${hours}시간`
    : `${hours}시간 ${remainingMinutes}분`;
}

export function TripCardDetailPanel({
  card,
  open,
  onOpenChange,
  onUpdateCard,
  showDuplicateToggle = false,
}: TripCardDetailPanelProps) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue(card?.notes ?? "");
  }, [card]);

  if (!card) return null;

  const classificationColor = CLASSIFICATION_COLORS[card.classification];
  const categoryConfig = CATEGORY_CONFIG[card.category];
  const estimatedDurationLabel = formatEstimatedDuration(card.estimated_duration_min);

  const handleConfirm = () => {
    if (!onUpdateCard) return;

    const updatedCard: TripCardData = {
      ...card,
      classification: "confirmed" as Classification,
      placement_status: "ready",
      action_type: "review_only",
    };

    if (
      (card.action_type === "input_required" ||
        card.action_type === "select_required" ||
        card.action_type === "fix_required") &&
      inputValue
    ) {
      updatedCard.notes = inputValue;
      if (card.processing_status === "failed") {
        updatedCard.processing_status = "pending";
      }
    }

    onUpdateCard(updatedCard);
    setInputValue("");
    onOpenChange(false);
  };

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
      case "etc":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        );
    }
  };

  const needsInputForConfirmation =
    (card.action_type === "input_required" ||
      card.action_type === "select_required" ||
      card.action_type === "fix_required") &&
    !inputValue.trim();

  const hasInfoSection =
    Boolean(card.location) ||
    Boolean(card.address) ||
    Boolean(card.time_constraint) ||
    Boolean(estimatedDurationLabel) ||
    Boolean(card.user_context) ||
    Boolean(card.notes) ||
    Boolean(card.tips);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-md">
        <SheetHeader className="border-b border-[#EBEBEB] p-6 pb-4">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: classificationColor.bg,
                color: classificationColor.text,
              }}
            >
              {CLASSIFICATION_LABELS[card.classification]}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-[#F5F5F5] px-2 py-0.5 text-xs text-[#888]">
              {renderCategoryIcon()}
              {categoryConfig.label}
            </span>
          </div>
          <SheetTitle className="text-left text-xl font-semibold text-[#1A1A1A]">
            {card.name}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 p-6">
          <div className="rounded-xl bg-[#FAFAFA] p-4">
            <h4 className="mb-3 text-sm font-semibold text-[#1A1A1A]">상태 정보</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1 text-xs text-[#888]">분류</p>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  {CLASSIFICATION_LABELS[card.classification]}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-[#888]">배치 상태</p>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  {PLACEMENT_LABELS[card.placement_status]}
                </p>
              </div>
            </div>
          </div>

          {hasInfoSection && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-[#1A1A1A]">상세 정보</h4>

              {card.location && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#F5F5F5]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#888]">위치</p>
                    <p className="text-sm text-[#1A1A1A]">{card.location}</p>
                    {card.address && (
                      <p className="mt-0.5 text-xs text-[#888]">{card.address}</p>
                    )}
                  </div>
                </div>
              )}

              {card.time_constraint && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#F5F5F5]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#888]">시간</p>
                    <p className="text-sm text-[#1A1A1A]">{card.time_constraint}</p>
                  </div>
                </div>
              )}

              {estimatedDurationLabel && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#F5F5F5]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#888]">소요 시간</p>
                    <p className="text-sm text-[#1A1A1A]">{estimatedDurationLabel}</p>
                  </div>
                </div>
              )}

              {card.user_context && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#EEF2FF]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#888]">맥락</p>
                    <p className="text-sm text-[#1A1A1A]">{card.user_context}</p>
                  </div>
                </div>
              )}

              {card.notes && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#F5F5F5]">
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

              {card.tips && (
                <div className="flex items-start gap-2 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-3">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="2"
                    className="mt-0.5 shrink-0"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4m0 4h.01" />
                  </svg>
                  <div>
                    <p className="mb-0.5 text-xs font-medium text-[#92400E]">AI 팁</p>
                    <p className="text-xs text-[#78350F]">{card.tips}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {card.placement_status === "blocked" && (
            <div className="rounded-xl border border-[#FECACA] bg-[#FEE2E2] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#DC2626]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="mb-1 text-sm font-bold text-[#DC2626]">해결이 필요합니다</h4>
                  <p className="text-sm leading-relaxed text-[#991B1B]">
                    이 항목은 필수 정보가 누락되어 일정에 배치할 수 없습니다. 아래 질문에 답변해주시면 배치가 가능해집니다.
                  </p>
                  {card.blocked_reason && (
                    <p className="mt-2 text-xs font-medium text-[#991B1B]">
                      사유: {card.blocked_reason}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {card.placement_status === "needs_input" && (
            <div className="rounded-xl border border-[#FED7AA] bg-[#FFEDD5] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#EA580C]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="mb-1 text-sm font-bold text-[#EA580C]">사용자 입력이 필요합니다</h4>
                  <p className="text-sm leading-relaxed text-[#9A3412]">
                    이 항목은 직접 입력해주셔야 일정에 배치할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {card.placement_status === "ready_partial" && (
            <div className="rounded-xl border border-[#FCD34D] bg-[#FEF3C7] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#F59E0B]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="mb-1 text-sm font-bold text-[#92400E]">추가 정보가 필요합니다</h4>
                  <p className="text-sm leading-relaxed text-[#78350F]">
                    배치는 가능하지만, 아래 질문에 답변해주시면 더 정확한 일정을 만들 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {card.classification !== "confirmed" && (
            <div className="mt-6 border-t border-[#EBEBEB] pt-6">
              {card.question_text && (
                <div className="mb-4 rounded-xl border border-[#E8E6F5] bg-[#F3F1FE] p-4">
                  <div className="flex items-start gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" className="mt-0.5 shrink-0">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01" />
                    </svg>
                    <div>
                      <p className="mb-1 text-xs font-medium text-[#534AB7]">질문</p>
                      <p className="text-sm font-medium text-[#3D3592]">{card.question_text}</p>
                    </div>
                  </div>
                </div>
              )}

              {(card.action_type === "input_required" || card.action_type === "select_required") && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-[#1A1A1A]">답변 입력</label>
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="자유롭게 답변을 입력해주세요..."
                    className="w-full resize-none rounded-xl border border-[#E0E0E0] bg-white p-4 text-sm transition-all focus:border-[#534AB7] focus:outline-none focus:ring-2 focus:ring-[#534AB7]/20"
                    rows={4}
                  />
                  <p className="text-xs text-[#999]">
                    질문에 대한 답변을 자유롭게 작성해주세요. 작성 후 확정하기를 누르면 반영됩니다.
                  </p>

                  {card.options && card.options.length > 0 && (
                    <div className="mt-3 rounded-lg bg-[#F5F5F5] p-3">
                      <p className="mb-2 text-xs text-[#666]">참고할 수 있는 옵션:</p>
                      <div className="flex flex-wrap gap-2">
                        {card.options.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => setInputValue(option.label)}
                            className="rounded-lg border border-[#E0E0E0] bg-white px-3 py-1.5 text-xs transition-colors hover:border-[#534AB7] hover:text-[#534AB7]"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {card.action_type === "fix_required" && (
                <div className="space-y-3">
                  <div className="rounded-xl border border-[#FECACA] bg-[#FEE2E2] p-4">
                    <div className="flex items-start gap-2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" className="mt-0.5 shrink-0">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M15 9l-6 6M9 9l6 6" />
                      </svg>
                      <div>
                        <p className="mb-1 text-sm font-medium text-[#DC2626]">처리 중 오류가 발생했습니다</p>
                        <p className="text-xs text-[#991B1B]">
                          아래에 올바른 정보를 입력해주시면 다시 처리를 시도합니다.
                        </p>
                      </div>
                    </div>
                  </div>
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="수정할 내용을 입력해주세요..."
                    className="w-full resize-none rounded-xl border border-[#E0E0E0] bg-white p-4 text-sm transition-all focus:border-[#534AB7] focus:outline-none focus:ring-2 focus:ring-[#534AB7]/20"
                    rows={4}
                  />
                </div>
              )}

              {card.processing_status === "processing" && (
                <div className="rounded-xl border border-[#C7D2FE] bg-[#EEF2FF] p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full border-2 border-[#534AB7] border-t-transparent animate-spin" />
                    <p className="text-sm font-medium text-[#534AB7]">AI가 정보를 처리하고 있습니다...</p>
                  </div>
                </div>
              )}

              {card.processing_status === "pending" && (
                <div className="rounded-xl border border-[#FCD34D] bg-[#FEF3C7] p-4">
                  <div className="flex items-center gap-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                    <p className="text-sm font-medium text-[#92400E]">처리 대기 중입니다</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {showDuplicateToggle && (
            <div className="border-t border-[#EBEBEB] pt-6">
              <div className="flex items-center justify-between rounded-xl bg-[#FAFAFA] p-4">
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">중복 배치 허용</p>
                  <p className="mt-0.5 text-xs text-[#888]">같은 카드를 여러 날에 배치할 수 있습니다</p>
                </div>
                <button
                  onClick={() => onUpdateCard?.({ ...card, allow_duplicate: !card.allow_duplicate })}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    card.allow_duplicate ? "bg-[#534AB7]" : "bg-[#E0E0E0]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      card.allow_duplicate ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {card.can_exclude && (
            <div className="border-t border-[#EBEBEB] pt-6">
              <div className="flex items-center justify-between rounded-xl bg-[#FAFAFA] p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.is_excluded ? "bg-[#F3F4F6]" : "bg-[#DCFCE7]"}`}>
                    {card.is_excluded ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      {card.is_excluded ? "이 항목은 제외됨" : "이 항목은 포함됨"}
                    </p>
                    <p className="text-xs text-[#888]">
                      {card.is_excluded ? "일정에서 제외된 상태입니다" : "일정에 포함될 예정입니다"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onUpdateCard?.({
                      ...card,
                      is_excluded: !card.is_excluded,
                    });
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    card.is_excluded
                      ? "bg-[#534AB7] text-white hover:bg-[#4840A0]"
                      : "border border-[#E0E0E0] bg-white text-[#666] hover:bg-[#F5F5F5]"
                  }`}
                >
                  {card.is_excluded ? "다시 포함" : "제외하기"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 border-t border-[#EBEBEB] bg-white p-6 pt-4">
          <div className="flex gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl border border-[#E0E0E0] px-4 py-3 text-sm font-medium text-[#666] transition-colors hover:bg-[#F5F5F5]"
            >
              닫기
            </button>
            {card.classification !== "confirmed" && !card.is_excluded && (
              <button
                onClick={handleConfirm}
                disabled={needsInputForConfirmation}
                className="flex-1 rounded-xl bg-[#534AB7] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4840A0] disabled:cursor-not-allowed disabled:bg-[#E0E0E0] disabled:text-[#999]"
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
