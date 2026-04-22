import { TripCardData } from "@/types/card";

export function getTripCardDetailLockReason(card: TripCardData): string | null {
  if (card.processing_status === "processing") {
    return "AI가 아직 이 항목을 정리 중이라 상세 패널을 열 수 없어요.";
  }

  return null;
}

export function canOpenTripCardDetail(card: TripCardData): boolean {
  return getTripCardDetailLockReason(card) === null;
}
