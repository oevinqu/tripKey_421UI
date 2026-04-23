"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CardCategory, CATEGORY_CONFIG } from "@/types/card";
import { NewTripCardInput } from "@/components/trip/addCardUtils";

interface AddTripCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: NewTripCardInput) => void;
  hasExistingTransport?: boolean;
  onBlockedTransportAdd?: () => void;
  initialCategory?: CardCategory;
}

const CATEGORY_ORDER: CardCategory[] = [
  "place",
  "activity",
  "transport",
  "accommodation",
  "food",
  "etc",
];

const DEFAULT_FORM: NewTripCardInput = {
  name: "",
  category: "place",
  location: "",
  estimatedDurationMin: 60,
  timeConstraint: null,
  memo: null,
};

export function AddTripCardDialog({
  open,
  onOpenChange,
  onSubmit,
  hasExistingTransport = false,
  onBlockedTransportAdd,
  initialCategory = "place",
}: AddTripCardDialogProps) {
  const [form, setForm] = useState<NewTripCardInput>(DEFAULT_FORM);
  const [toastMessage, setToastMessage] = useState("");
  const [transportDirection, setTransportDirection] = useState<"departure" | "return">("departure");

  useEffect(() => {
    if (!open) return;

    setForm({
      ...DEFAULT_FORM,
      category: initialCategory,
    });
    setToastMessage("");
    setTransportDirection("departure");
  }, [initialCategory, open]);

  useEffect(() => {
    if (!toastMessage) return;

    const timeout = window.setTimeout(() => {
      setToastMessage("");
    }, 3200);

    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  const timeConstraintPlaceholder = useMemo(() => {
    if (form.category === "accommodation") return "예: 15:00 체크인";
    if (form.category === "transport") {
      return transportDirection === "departure" ? "예: 도착 11:20" : "예: 출발 18:40";
    }
    return "예: 오전 방문, 저녁 식사";
  }, [form.category, transportDirection]);

  const isAccommodation = form.category === "accommodation";
  const isTransport = form.category === "transport";
  const canSubmit =
    isAccommodation
      ? form.name.trim().length > 0 && form.location.trim().length > 0
      : isTransport
        ? form.location.trim().length > 0 && (form.timeConstraint?.trim().length ?? 0) > 0
        : form.name.trim().length > 0 && form.location.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-3xl border-[#EBEBEB] p-0 sm:max-w-xl">
        <DialogHeader className="border-b border-[#EBEBEB] px-6 py-5">
          <DialogTitle className="text-[20px] font-semibold text-[#1A1A1A]">
            카드 추가하기
          </DialogTitle>
          <DialogDescription className="text-sm text-[#666]">
            한 번 입력하면 AI가 먼저 정리한 뒤 카드 목록에 올려드려요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-6 py-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">카테고리</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORY_ORDER.map((category) => {
                const isSelected = form.category === category;
                const isBlockedTransport = category === "transport" && hasExistingTransport;
                return (
                  <button
                    key={category}
                    onClick={() => {
                      if (isBlockedTransport) {
                        onBlockedTransportAdd?.();
                        setToastMessage("항공권 카드를 변경하세요.");
                        return;
                      }
                      setForm((prev) => ({ ...prev, category }));
                    }}
                    className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                      isSelected
                        ? "border-[#534AB7] bg-[#F3F1FE] text-[#534AB7]"
                        : isBlockedTransport
                          ? "cursor-not-allowed border-[#E5E5E5] bg-[#F8F8F8] text-[#AAA]"
                          : "border-[#E0E0E0] bg-white text-[#666] hover:border-[#534AB7]"
                    }`}
                  >
                    {category === "transport" ? "항공권" : CATEGORY_CONFIG[category].label}
                  </button>
                );
              })}
            </div>
            {hasExistingTransport && (
              <p className="mt-2 text-xs text-[#888]">
                항공권 카드는 이미 있어요. 변경이 필요하면 기존 항공권 카드를 열어 수정해주세요.
              </p>
            )}
          </div>

          {isAccommodation ? (
            <div className="rounded-2xl border border-[#E0E0E0] bg-[#FAFAFA] p-4">
              <h3 className="mb-4 text-sm font-semibold text-[#1A1A1A]">숙소 정보</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#666]">숙소명</label>
                  <input
                    type="text"
                    placeholder="예: 신주쿠 프린스 호텔"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-lg border border-[#E0E0E0] bg-white px-3 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#B0B0B0] focus:border-[#534AB7] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#666]">위치</label>
                  <input
                    type="text"
                    placeholder="예: 교토역 도보 5분"
                    value={form.location}
                    onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                    className="w-full rounded-lg border border-[#E0E0E0] bg-white px-3 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#B0B0B0] focus:border-[#534AB7] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#666]">체크인</label>
                  <input
                    type="text"
                    placeholder="예: 5월 10일 15:00"
                    value={form.checkIn ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, checkIn: e.target.value || null }))}
                    className="w-full rounded-lg border border-[#E0E0E0] bg-white px-3 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#B0B0B0] focus:border-[#534AB7] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#666]">체크아웃</label>
                  <input
                    type="text"
                    placeholder="예: 5월 12일 11:00"
                    value={form.checkOut ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, checkOut: e.target.value || null }))}
                    className="w-full rounded-lg border border-[#E0E0E0] bg-white px-3 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#B0B0B0] focus:border-[#534AB7] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ) : isTransport ? (
            <div className="rounded-2xl border border-[#E0E0E0] bg-[#FAFAFA] p-4">
              <h3 className="mb-4 text-sm font-semibold text-[#1A1A1A]">항공권 정보</h3>
              <div className="mb-4 flex gap-2">
                {[
                  { id: "departure" as const, label: "출국" },
                  { id: "return" as const, label: "귀국" },
                ].map((option) => {
                  const selected = transportDirection === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setTransportDirection(option.id)}
                      className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                        selected
                          ? "border-[#534AB7] bg-[#F3F1FE] text-[#534AB7]"
                          : "border-[#E0E0E0] bg-white text-[#666] hover:border-[#534AB7]"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#666]">공항</label>
                  <input
                    type="text"
                    placeholder="예: 인천국제공항"
                    value={form.location}
                    onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                    className="w-full rounded-lg border border-[#E0E0E0] bg-white px-3 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#B0B0B0] focus:border-[#534AB7] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#666]">
                    {transportDirection === "departure" ? "도착 예정 시간" : "출발 예정 시간"}
                  </label>
                  <input
                    type="text"
                    placeholder="예: 09:30"
                    value={form.timeConstraint ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, timeConstraint: e.target.value || null }))}
                    className="w-full rounded-lg border border-[#E0E0E0] bg-white px-3 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#B0B0B0] focus:border-[#534AB7] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#666]">항공편 (선택)</label>
                  <input
                    type="text"
                    placeholder="예: KE123"
                    value={form.flightNumber ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, flightNumber: e.target.value || null }))}
                    className="w-full rounded-lg border border-[#E0E0E0] bg-white px-3 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#B0B0B0] focus:border-[#534AB7] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">카드 이름</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="예: 교토 철학의 길"
                  className="w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-base text-[#1A1A1A] transition-colors placeholder:text-[#999] hover:border-[#C0C0C0] focus:border-[#534AB7] focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">지역</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="예: 교토"
                    className="w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-base text-[#1A1A1A] transition-colors placeholder:text-[#999] hover:border-[#C0C0C0] focus:border-[#534AB7] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">체류시간(분)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.estimatedDurationMin ?? ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        estimatedDurationMin:
                          e.target.value.trim() === ""
                            ? null
                            : Number.parseInt(e.target.value, 10),
                      }))
                    }
                    placeholder="예: 90"
                    className="w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-base text-[#1A1A1A] transition-colors placeholder:text-[#999] hover:border-[#C0C0C0] focus:border-[#534AB7] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">시간 메모</label>
                <input
                  type="text"
                  value={form.timeConstraint ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      timeConstraint: e.target.value || null,
                    }))
                  }
                  placeholder={timeConstraintPlaceholder}
                  className="w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-base text-[#1A1A1A] transition-colors placeholder:text-[#999] hover:border-[#C0C0C0] focus:border-[#534AB7] focus:outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">추가 메모</label>
            <textarea
              value={form.memo ?? ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  memo: e.target.value || null,
                }))
              }
              placeholder="가고 싶은 이유나 기억해둘 내용을 적어주세요."
              className="w-full resize-none rounded-xl border border-[#E0E0E0] bg-white p-4 text-sm transition-all focus:border-[#534AB7] focus:outline-none focus:ring-2 focus:ring-[#534AB7]/20"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="border-t border-[#EBEBEB] px-6 py-5">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-xl border border-[#E0E0E0] px-4 py-3 text-sm font-medium text-[#666] transition-colors hover:bg-[#F5F5F5]"
          >
            닫기
          </button>
          <button
            onClick={() => {
              if (!canSubmit) return;
              onSubmit({
                ...form,
                name: isTransport
                  ? `${form.location.trim()} ${transportDirection === "departure" ? "출국" : "귀국"} 항공권`
                  : form.name.trim(),
                location: form.location.trim(),
                memo: form.memo?.trim() || null,
                timeConstraint: isTransport
                  ? `${transportDirection === "departure" ? "도착" : "출발"} ${form.timeConstraint?.trim() || ""}`.trim()
                  : form.timeConstraint?.trim() || null,
                checkIn: form.checkIn?.trim() || null,
                checkOut: form.checkOut?.trim() || null,
                flightNumber: form.flightNumber?.trim() || null,
              });
              onOpenChange(false);
            }}
            disabled={!canSubmit}
            className="rounded-xl bg-[#534AB7] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4840A0] disabled:cursor-not-allowed disabled:bg-[#E0E0E0] disabled:text-[#999]"
          >
            처리 요청하기
          </button>
        </DialogFooter>
      </DialogContent>
      {toastMessage && (
        <div className="pointer-events-none fixed bottom-8 left-1/2 z-[80] -translate-x-1/2 rounded-xl bg-[#1A1A1A] px-5 py-3 text-sm font-medium text-white shadow-lg">
          {toastMessage}
        </div>
      )}
    </Dialog>
  );
}
