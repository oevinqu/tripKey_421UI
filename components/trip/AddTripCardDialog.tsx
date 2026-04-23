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
}: AddTripCardDialogProps) {
  const [form, setForm] = useState<NewTripCardInput>(DEFAULT_FORM);

  useEffect(() => {
    if (!open) {
      setForm(DEFAULT_FORM);
    }
  }, [open]);

  const timeConstraintPlaceholder = useMemo(() => {
    if (form.category === "accommodation") return "예: 15:00 체크인";
    if (form.category === "transport") return "예: 도착 11:20";
    return "예: 오전 방문, 저녁 식사";
  }, [form.category]);

  const canSubmit = form.name.trim().length > 0 && form.location.trim().length > 0;

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
            <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">카드 이름</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="예: 교토 철학의 길"
              className="w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-base text-[#1A1A1A] transition-colors placeholder:text-[#999] hover:border-[#C0C0C0] focus:border-[#534AB7] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">카테고리</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORY_ORDER.map((category) => {
                const isSelected = form.category === category;
                return (
                  <button
                    key={category}
                    onClick={() => setForm((prev) => ({ ...prev, category }))}
                    className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                      isSelected
                        ? "border-[#534AB7] bg-[#F3F1FE] text-[#534AB7]"
                        : "border-[#E0E0E0] bg-white text-[#666] hover:border-[#534AB7]"
                    }`}
                  >
                    {CATEGORY_CONFIG[category].label}
                  </button>
                );
              })}
            </div>
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
                name: form.name.trim(),
                location: form.location.trim(),
                memo: form.memo?.trim() || null,
                timeConstraint: form.timeConstraint?.trim() || null,
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
    </Dialog>
  );
}
