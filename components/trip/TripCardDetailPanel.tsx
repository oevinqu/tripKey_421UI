"use client";

import { useEffect, useMemo, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  CATEGORY_CONFIG,
  CLASSIFICATION_COLORS,
  CLASSIFICATION_LABELS,
  Classification,
  PLACEMENT_LABELS,
  TripCardData,
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
  return remainingMinutes === 0 ? `${hours}시간` : `${hours}시간 ${remainingMinutes}분`;
}

function renderCategoryIcon(category: TripCardData["category"]) {
  switch (category) {
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
}

function InfoRow({
  label,
  value,
  icon,
  tone = "default",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone?: "default" | "context" | "tip";
}) {
  const boxClass =
    tone === "context"
      ? "bg-[#EEF2FF]"
      : tone === "tip"
        ? "bg-[#FFFBEB]"
        : "bg-[#F5F5F5]";
  const labelClass =
    tone === "context"
      ? "text-[#666]"
      : tone === "tip"
        ? "text-[#92400E]"
        : "text-[#888]";
  const valueClass =
    tone === "tip" ? "text-[#78350F]" : "text-[#1A1A1A]";

  return (
    <div className="flex items-start gap-3">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${boxClass}`}>
        {icon}
      </div>
      <div>
        <p className={`text-xs ${labelClass}`}>{label}</p>
        <p className={`text-sm ${valueClass}`}>{value}</p>
      </div>
    </div>
  );
}

function AlertBlock({
  title,
  message,
  tone,
  reason,
}: {
  title: string;
  message: string;
  tone: "red" | "yellow" | "gray";
  reason?: string | null;
}) {
  const config =
    tone === "red"
      ? {
          wrapper: "border-[#FECACA] bg-[#FEE2E2]",
          iconBg: "bg-[#DC2626]",
          title: "text-[#DC2626]",
          text: "text-[#991B1B]",
        }
      : tone === "yellow"
        ? {
            wrapper: "border-[#FDE68A] bg-[#FFFBEB]",
            iconBg: "bg-[#F59E0B]",
            title: "text-[#B45309]",
            text: "text-[#92400E]",
          }
        : {
            wrapper: "border-[#E5E7EB] bg-[#F3F4F6]",
            iconBg: "bg-[#6B7280]",
            title: "text-[#4B5563]",
            text: "text-[#6B7280]",
          };

  return (
    <div className={`rounded-xl border p-4 ${config.wrapper}`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.iconBg}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className={`mb-1 text-sm font-bold ${config.title}`}>{title}</h4>
          <p className={`text-sm leading-relaxed ${config.text}`}>{message}</p>
          {reason && <p className={`mt-2 text-xs font-medium ${config.text}`}>사유: {reason}</p>}
        </div>
      </div>
    </div>
  );
}

export function TripCardDetailPanel({
  card,
  open,
  onOpenChange,
  onUpdateCard,
  showDuplicateToggle = false,
}: TripCardDetailPanelProps) {
  const [answerValue, setAnswerValue] = useState("");
  const [memoValue, setMemoValue] = useState("");
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [openQuestionDecision, setOpenQuestionDecision] = useState<"include" | "exclude" | null>(
    null
  );
  const [structuredName, setStructuredName] = useState("");
  const [structuredLocation, setStructuredLocation] = useState("");
  const [structuredPrimaryTime, setStructuredPrimaryTime] = useState("");
  const [structuredSecondaryTime, setStructuredSecondaryTime] = useState("");
  const [structuredFlightNumber, setStructuredFlightNumber] = useState("");

  useEffect(() => {
    setAnswerValue(card?.notes ?? "");
    setMemoValue(card?.memo ?? "");
    setSelectedOptionIds([]);
    setOpenQuestionDecision(null);
    setStructuredName(card?.name ?? "");
    setStructuredLocation(card?.location ?? card?.address ?? "");
    setStructuredPrimaryTime(
      card?.category === "accommodation"
        ? card?.check_in ?? ""
        : card?.time_constraint ?? ""
    );
    setStructuredSecondaryTime(card?.check_out ?? "");
    setStructuredFlightNumber(card?.flight_number ?? "");
  }, [card]);

  const estimatedDurationLabel = useMemo(
    () => formatEstimatedDuration(card?.estimated_duration_min ?? null),
    [card?.estimated_duration_min]
  );

  if (!card) return null;

  const classificationColor = CLASSIFICATION_COLORS[card.classification];
  const categoryConfig = CATEGORY_CONFIG[card.category];
  const isAccommodation = card.category === "accommodation";
  const isTransport = card.category === "transport";
  const isStructuredEditableCategory = isAccommodation || isTransport;
  const memoChanged = (memoValue.trim() || null) !== (card.memo ?? null);
  const structuredValuesChanged =
    structuredName.trim() !== (card.name ?? "").trim() ||
    structuredLocation.trim() !== ((card.location ?? card.address ?? "").trim()) ||
    structuredPrimaryTime.trim() !==
      (
        card.category === "accommodation"
          ? card.check_in ?? ""
          : card.time_constraint ?? ""
      ).trim() ||
    structuredSecondaryTime.trim() !== (card.check_out ?? "").trim() ||
    structuredFlightNumber.trim() !== (card.flight_number ?? "").trim();

  const statusPlacementLabel =
    card.placement_status === "ready"
      ? "배치 가능"
      : card.placement_status === "ready_partial"
        ? "일부 부족"
        : card.placement_status === "needs_input"
          ? "입력 필요"
          : "배치 불가";

  const notesForReviewOnly = card.action_type === "review_only" ? card.notes : null;
  const hasDetailInfo =
    Boolean(card.location) ||
    Boolean(card.address) ||
    Boolean(card.time_constraint) ||
    Boolean(card.check_in) ||
    Boolean(card.check_out) ||
    Boolean(card.flight_number) ||
    Boolean(estimatedDurationLabel) ||
    Boolean(card.user_context) ||
    Boolean(card.tips) ||
    Boolean(card.memo);

  const needsAnswer =
    card.action_type === "input_required" ||
    card.action_type === "select_required" ||
    card.action_type === "fix_required";

  const isBinarySelectAction =
    card.action_type === "select_required" &&
    !!card.options &&
    card.options.length === 2 &&
    card.options.every(
      (option) => option.label === "간다" || option.label === "안 간다"
    );

  const supportsMultiSelect =
    card.action_type === "select_required" &&
    !!card.options &&
    card.options.length > 0 &&
    !isBinarySelectAction;

  const shouldShowAnswerInput =
    card.action_type === "input_required" ||
    card.action_type === "fix_required" ||
    supportsMultiSelect ||
    (card.action_type === "select_required" &&
      (!card.options || card.options.length === 0));
  const shouldShowStructuredChangeInput =
    isStructuredEditableCategory && card.action_type === "review_only";
  const isOpenQuestionReview =
    card.classification === "open_question" && card.action_type === "review_only";

  const confirmDisabled =
    isOpenQuestionReview
      ? openQuestionDecision === null
      : shouldShowStructuredChangeInput
      ? isAccommodation
        ? !structuredName.trim() || !structuredLocation.trim() || !structuredValuesChanged
        : !structuredLocation.trim() || !structuredPrimaryTime.trim() || !structuredValuesChanged
      : needsAnswer && selectedOptionIds.length === 0 && !answerValue.trim();

  const toggleOption = (optionId: string) => {
    if (isBinarySelectAction) {
      setSelectedOptionIds([optionId]);
      return;
    }

    setSelectedOptionIds((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleConfirm = () => {
    if (!onUpdateCard) return;

    const shouldTriggerProcessing =
      shouldShowStructuredChangeInput ||
      card.processing_status === "failed" ||
      card.placement_status === "needs_input";

    const selectedLabels =
      card.options
        ?.filter((option) => selectedOptionIds.includes(option.id))
        .map((option) => option.label) ?? [];

    const combinedAnswer = [selectedLabels.join(", "), answerValue.trim()]
      .filter(Boolean)
      .join(selectedLabels.length > 0 && answerValue.trim() ? "\n" : "");

    const nextName =
      isTransport && !card.name.includes("도착") && !card.name.includes("출발")
        ? `${structuredLocation.trim()} 항공권`
        : structuredName.trim() || card.name;

    const nextClassification =
      card.classification === "open_question" &&
      (!isOpenQuestionReview || openQuestionDecision !== "include")
        ? card.classification
        : ("confirmed" as Classification);

    const updatedCard: TripCardData = {
      ...card,
      classification: nextClassification,
      placement_status:
        isOpenQuestionReview && openQuestionDecision !== "include"
          ? card.placement_status
          : "ready",
      action_type: "review_only",
      processing_status: shouldTriggerProcessing ? "processing" : card.processing_status,
      is_excluded:
        isOpenQuestionReview && openQuestionDecision === "exclude"
          ? true
          : card.is_excluded,
      name: shouldShowStructuredChangeInput ? nextName : card.name,
      location: shouldShowStructuredChangeInput
        ? structuredLocation.trim() || undefined
        : card.location,
      address:
        shouldShowStructuredChangeInput && isAccommodation
          ? structuredLocation.trim() || undefined
          : card.address,
      check_in:
        shouldShowStructuredChangeInput && isAccommodation
          ? structuredPrimaryTime.trim() || null
          : card.check_in,
      check_out:
        shouldShowStructuredChangeInput && isAccommodation
          ? structuredSecondaryTime.trim() || null
          : card.check_out,
      time_constraint:
        shouldShowStructuredChangeInput && isTransport
          ? structuredPrimaryTime.trim() || null
          : card.time_constraint,
      flight_number:
        shouldShowStructuredChangeInput && isTransport
          ? structuredFlightNumber.trim() || null
          : card.flight_number,
      notes:
        needsAnswer
          ? combinedAnswer || answerValue.trim() || card.notes
          : card.notes,
      memo: memoValue.trim() || null,
    };

    onUpdateCard(updatedCard);
    onOpenChange(false);
  };

  const handleSaveMemo = () => {
    if (!onUpdateCard) return;

    onUpdateCard({
      ...card,
      memo: memoValue.trim() || null,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-md">
        <div
          className="absolute left-0 top-0 h-full w-1.5"
          style={{ backgroundColor: classificationColor.border }}
        />

        <SheetHeader className="border-b border-[#EBEBEB] p-6 pb-4">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="rounded-full border px-2 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: classificationColor.bg,
                color: classificationColor.text,
                borderColor: classificationColor.border,
              }}
            >
              {CLASSIFICATION_LABELS[card.classification]}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-[#F5F5F5] px-2 py-0.5 text-xs text-[#888]">
              {renderCategoryIcon(card.category)}
              {categoryConfig.label}
            </span>
          </div>
          <SheetTitle className="text-left text-xl font-semibold text-[#1A1A1A]">
            {card.name}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 p-6">
          <div className="space-y-3">
            {card.placement_status === "blocked" && (
              <AlertBlock
                title="해결이 필요합니다"
                message="이 항목은 배치할 수 없습니다"
                tone="red"
                reason={card.blocked_reason}
              />
            )}

            {card.placement_status === "needs_input" && (
              <AlertBlock
                title="입력이 필요합니다"
                message="정보를 입력하면 배치가 가능해집니다"
                tone="yellow"
              />
            )}

            {card.processing_status === "failed" && (
              <AlertBlock
                title="처리 중 오류가 발생했습니다"
                message="아래에 올바른 정보를 입력해주시면 다시 처리를 시도합니다"
                tone="red"
              />
            )}

            {card.classification === "unassigned" && (
              <AlertBlock
                title="해석할 수 없는 항목이에요"
                message="직접 수정하거나 제외해주세요"
                tone="gray"
              />
            )}
          </div>

          <div className="rounded-xl bg-[#FAFAFA] p-4">
            <h4 className="mb-3 text-sm font-semibold text-[#1A1A1A]">상태 정보</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1 text-xs text-[#888]">분류</p>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  {card.classification === "open_question"
                    ? "질문있음"
                    : card.classification === "unassigned"
                      ? "미배정"
                      : CLASSIFICATION_LABELS[card.classification]}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-[#888]">배치 상태</p>
                <p className="text-sm font-medium text-[#1A1A1A]">{statusPlacementLabel}</p>
              </div>
            </div>
          </div>

          {hasDetailInfo && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-[#1A1A1A]">상세 정보</h4>

              {card.location && (
                <InfoRow
                  label="위치"
                  value={card.address ? `${card.location} · ${card.address}` : card.location}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  }
                />
              )}

              {card.check_in && (
                <InfoRow
                  label="체크인"
                  value={card.check_in}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                  }
                />
              )}

              {card.check_out && (
                <InfoRow
                  label="체크아웃"
                  value={card.check_out}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                  }
                />
              )}

              {!isAccommodation && card.time_constraint && (
                <InfoRow
                  label={isTransport ? "시간" : "시간 제약"}
                  value={card.time_constraint}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                  }
                />
              )}

              {card.flight_number && (
                <InfoRow
                  label="항공편"
                  value={card.flight_number}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <path d="M21 16V8c0-.6-.4-1-1-1h-3l-3-4h-4L7 7H4c-.6 0-1 .4-1 1v8c0 .6.4 1 1 1h16c.6 0 1-.4 1-1z" />
                    </svg>
                  }
                />
              )}

              {estimatedDurationLabel && (
                <InfoRow
                  label="예상 소요 시간"
                  value={estimatedDurationLabel}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <path d="M12 8v4l3 3M12 3a9 9 0 100 18 9 9 0 000-18z" />
                    </svg>
                  }
                />
              )}

              {card.user_context && (
                <InfoRow
                  label="원하셨던 내용"
                  value={card.user_context}
                  tone="context"
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" />
                    </svg>
                  }
                />
              )}

              {card.tips && (
                <InfoRow
                  label="알아두면 좋아요"
                  value={card.tips}
                  tone="tip"
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4m0 4h.01" />
                    </svg>
                  }
                />
              )}
            </div>
          )}

          {card.action_type !== "review_only" && (
            <div className="space-y-4 border-t border-[#EBEBEB] pt-6">
              <h4 className="text-sm font-semibold text-[#1A1A1A]">질문 / 입력</h4>

              {card.question_text && (
                <div className="rounded-xl border border-[#E8E6F5] bg-[#F3F1FE] p-4">
                  <p className="mb-1 text-xs font-medium text-[#534AB7]">질문</p>
                  <p className="text-sm font-medium text-[#3D3592]">{card.question_text}</p>
                </div>
              )}

              {(card.action_type === "select_required" || card.action_type === "fix_required") &&
                card.options &&
                card.options.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {card.options.map((option) => {
                      const isSelected = selectedOptionIds.includes(option.id);

                      return (
                        <button
                          key={option.id}
                          onClick={() => toggleOption(option.id)}
                          className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                            isSelected
                              ? "border-[#534AB7] bg-[#F3F1FE] text-[#534AB7]"
                              : "border-[#E0E0E0] bg-white text-[#666] hover:border-[#534AB7] hover:text-[#534AB7]"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                )}

              {shouldShowAnswerInput && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#1A1A1A]">질문에 대한 답변</label>
                  <textarea
                    value={answerValue}
                    onChange={(e) => setAnswerValue(e.target.value)}
                    placeholder={
                      supportsMultiSelect
                        ? "선택한 내용 외에 더 남기고 싶은 내용을 적어주세요..."
                        : "필요한 내용을 자유롭게 입력해주세요..."
                    }
                    className="w-full resize-none rounded-xl border border-[#E0E0E0] bg-white p-4 text-sm transition-all focus:border-[#534AB7] focus:outline-none focus:ring-2 focus:ring-[#534AB7]/20"
                    rows={4}
                  />

                  {card.action_type === "input_required" &&
                    card.options &&
                    card.options.length > 0 && (
                      <div className="rounded-xl bg-[#FAFAFA] p-3">
                        <p className="mb-2 text-xs font-medium text-[#666]">추천 답변</p>
                        <div className="flex flex-wrap gap-2">
                          {card.options.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => setAnswerValue(option.label)}
                              className="rounded-lg border border-[#E0E0E0] bg-white px-3 py-1.5 text-xs text-[#666] transition-colors hover:border-[#534AB7] hover:text-[#534AB7]"
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          )}

          {card.action_type === "review_only" && notesForReviewOnly && (
            <div className="space-y-3 border-t border-[#EBEBEB] pt-6">
              <h4 className="text-sm font-semibold text-[#1A1A1A]">기록된 답변</h4>
              <div className="rounded-xl bg-[#FAFAFA] p-4">
                <p className="text-sm leading-relaxed text-[#1A1A1A]">{notesForReviewOnly}</p>
              </div>
            </div>
          )}

          {isOpenQuestionReview && (
            <div className="space-y-4 border-t border-[#EBEBEB] pt-6">
              <div>
                <h4 className="text-sm font-semibold text-[#1A1A1A]">포함 여부 선택</h4>
                <p className="mt-1 text-xs leading-relaxed text-[#888]">
                  지금 바로 확정하지 않아도 괜찮아요. 포함하거나 제외할 때만 반영됩니다.
                </p>
              </div>
              {card.question_text && (
                <div className="rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] p-4">
                  <p className="mb-1 text-xs font-medium text-[#1D4ED8]">검토 포인트</p>
                  <p className="text-sm font-medium text-[#1E3A8A]">{card.question_text}</p>
                </div>
              )}
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  onClick={() => setOpenQuestionDecision("include")}
                  className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                    openQuestionDecision === "include"
                      ? "border-[#534AB7] bg-[#F3F1FE] text-[#3D3592]"
                      : "border-[#E0E0E0] bg-white text-[#666] hover:border-[#534AB7]"
                  }`}
                >
                  포함할게요
                </button>
                <button
                  onClick={() => setOpenQuestionDecision("exclude")}
                  className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                    openQuestionDecision === "exclude"
                      ? "border-[#DC2626] bg-[#FEF2F2] text-[#991B1B]"
                      : "border-[#E0E0E0] bg-white text-[#666] hover:border-[#DC2626]"
                  }`}
                >
                  이번엔 제외할게요
                </button>
              </div>
            </div>
          )}

          {shouldShowStructuredChangeInput && (
            <div className="space-y-4 border-t border-[#EBEBEB] pt-6">
              <h4 className="text-sm font-semibold text-[#1A1A1A]">
                {isAccommodation ? "숙소 정보 변경" : "항공권 정보 변경"}
              </h4>
              <div className="rounded-xl border border-[#E0E0E0] bg-[#FAFAFA] p-4">
                <div className={`grid gap-3 ${isAccommodation ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
                  {isAccommodation && (
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[#666]">숙소명</label>
                      <input
                        type="text"
                        value={structuredName}
                        onChange={(e) => setStructuredName(e.target.value)}
                        placeholder="예: 교토역 근처 게스트하우스"
                        className="w-full rounded-lg border border-[#E0E0E0] bg-white px-3 py-2.5 text-sm text-[#1A1A1A] transition-colors placeholder:text-[#B0B0B0] focus:border-[#534AB7] focus:outline-none"
                      />
                    </div>
                  )}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#666]">
                      {isAccommodation ? "위치" : "공항"}
                    </label>
                    <input
                      type="text"
                      value={structuredLocation}
                      onChange={(e) => setStructuredLocation(e.target.value)}
                      placeholder={isAccommodation ? "예: 교토역 도보 5분" : "예: 간사이 국제공항"}
                      className="w-full rounded-lg border border-[#E0E0E0] bg-white px-3 py-2.5 text-sm text-[#1A1A1A] transition-colors placeholder:text-[#B0B0B0] focus:border-[#534AB7] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#666]">
                      {isAccommodation ? "체크인" : "시간"}
                    </label>
                    <input
                      type="text"
                      value={structuredPrimaryTime}
                      onChange={(e) => setStructuredPrimaryTime(e.target.value)}
                      placeholder={isAccommodation ? "예: 5월 10일 15:00" : "예: 도착 11:20"}
                      className="w-full rounded-lg border border-[#E0E0E0] bg-white px-3 py-2.5 text-sm text-[#1A1A1A] transition-colors placeholder:text-[#B0B0B0] focus:border-[#534AB7] focus:outline-none"
                    />
                  </div>
                  {isAccommodation && (
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[#666]">체크아웃</label>
                      <input
                        type="text"
                        value={structuredSecondaryTime}
                        onChange={(e) => setStructuredSecondaryTime(e.target.value)}
                        placeholder="예: 5월 12일 11:00"
                        className="w-full rounded-lg border border-[#E0E0E0] bg-white px-3 py-2.5 text-sm text-[#1A1A1A] transition-colors placeholder:text-[#B0B0B0] focus:border-[#534AB7] focus:outline-none"
                      />
                    </div>
                  )}
                  {isTransport && (
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[#666]">항공편 (선택)</label>
                      <input
                        type="text"
                        value={structuredFlightNumber}
                        onChange={(e) => setStructuredFlightNumber(e.target.value)}
                        placeholder="예: KE123"
                        className="w-full rounded-lg border border-[#E0E0E0] bg-white px-3 py-2.5 text-sm text-[#1A1A1A] transition-colors placeholder:text-[#B0B0B0] focus:border-[#534AB7] focus:outline-none"
                      />
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs text-[#888]">
                  {isAccommodation
                    ? "숙소 이름이나 주소처럼 바뀐 핵심 정보만 적어주세요. 이후 AI가 다시 정리해요."
                    : "공항과 시간 정보를 바탕으로 항공권 맥락을 다시 정리해요."}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2 border-t border-[#EBEBEB] pt-6">
            <label className="block text-sm font-semibold text-[#1A1A1A]">사용자 메모</label>
            <textarea
              value={memoValue}
              onChange={(e) => setMemoValue(e.target.value)}
              placeholder="자유롭게 메모를 남겨주세요..."
              className="w-full resize-none rounded-xl border border-[#E0E0E0] bg-white p-4 text-sm transition-all focus:border-[#534AB7] focus:outline-none focus:ring-2 focus:ring-[#534AB7]/20"
              rows={4}
            />
            {!isStructuredEditableCategory && (
              <p className="text-xs leading-relaxed text-[#888]">
                메모는 04 추천 흐름에 조용히 반영되고, 처리 후에는 AI 맥락 내용만 업데이트돼요.
              </p>
            )}
          </div>

          {showDuplicateToggle && (
            <div className="border-t border-[#EBEBEB] pt-6">
              <div className="flex items-center justify-between rounded-xl bg-[#FAFAFA] p-4">
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">중복 배치 허용</p>
                  <p className="mt-0.5 text-xs text-[#888]">같은 카드를 여러 날에 배치할 수 있습니다</p>
                </div>
                <button
                  onClick={() => onUpdateCard?.({ ...card, allow_duplicate: !card.allow_duplicate, memo: memoValue.trim() || null })}
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
              <div className="rounded-xl bg-[#FAFAFA] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      {card.is_excluded ? "현재 제외된 항목이에요" : "일정에 포함된 항목이에요"}
                    </p>
                    <p className="mt-0.5 text-xs text-[#888]">
                      {card.is_excluded
                        ? "포함하기를 누르면 다시 일정 후보로 돌아와요."
                        : "제외하기를 누르면 일정 후보에서 빠집니다."}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      onUpdateCard?.({
                        ...card,
                        is_excluded: !card.is_excluded,
                        memo: memoValue.trim() || null,
                      })
                    }
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      card.is_excluded
                        ? "bg-[#534AB7] text-white hover:bg-[#4840A0]"
                        : "border border-[#E0E0E0] bg-white text-[#666] hover:bg-[#F5F5F5]"
                    }`}
                  >
                    {card.is_excluded ? "포함하기" : "제외하기"}
                  </button>
                </div>
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
            {!card.is_excluded && isStructuredEditableCategory && (
              <button
                onClick={handleConfirm}
                disabled={confirmDisabled}
                className="flex-1 rounded-xl bg-[#534AB7] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4840A0] disabled:cursor-not-allowed disabled:bg-[#E0E0E0] disabled:text-[#999]"
              >
                {card.action_type === "review_only" ? "변경하기" : "확인하기"}
              </button>
            )}
            {!card.is_excluded && !isStructuredEditableCategory && card.action_type !== "review_only" && (
              <button
                onClick={handleConfirm}
                disabled={confirmDisabled}
                className="flex-1 rounded-xl bg-[#534AB7] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4840A0] disabled:cursor-not-allowed disabled:bg-[#E0E0E0] disabled:text-[#999]"
              >
                확인하기
              </button>
            )}
            {!card.is_excluded && isOpenQuestionReview && (
              <button
                onClick={handleConfirm}
                disabled={confirmDisabled}
                className="flex-1 rounded-xl bg-[#534AB7] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4840A0] disabled:cursor-not-allowed disabled:bg-[#E0E0E0] disabled:text-[#999]"
              >
                선택 반영
              </button>
            )}
            {!card.is_excluded && !isStructuredEditableCategory && (
              <button
                onClick={handleSaveMemo}
                disabled={!memoChanged}
                className="flex-1 rounded-xl border border-[#D8D8E8] bg-white px-4 py-3 text-sm font-semibold text-[#534AB7] transition-colors hover:bg-[#F6F5FF] disabled:cursor-not-allowed disabled:border-[#E5E5E5] disabled:bg-[#F8F8F8] disabled:text-[#AAA]"
              >
                메모 저장
              </button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
