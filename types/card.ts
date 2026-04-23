// 분류 상태: 확정됨 / 질문있음 / 미결정 / 미배치
export type Classification = "confirmed" | "open_question" | "undecided" | "unassigned";

// 배치 가능 상태: 준비됨 / 일부준비 / 입력필요 / 차단됨
export type PlacementStatus = "ready" | "ready_partial" | "needs_input" | "blocked";

// 처리 상태: 대기 / 처리중 / 완료 / 실패
export type ProcessingStatus = "pending" | "processing" | "completed" | "failed";

// 필요한 액션 유형: 입력필요 / 선택필요 / 수정필요 / 확인만
export type ActionType = "input_required" | "select_required" | "fix_required" | "review_only";

// 카테고리
export type CardCategory =
  | "place"
  | "activity"
  | "transport"
  | "accommodation"
  | "food"
  | "etc";

export interface CardOption {
  id: string;
  label: string;
}

export interface TripCardData {
  instance_id: string;
  place_id: string | null;
  name: string;
  category: CardCategory;
  classification: Classification;
  placement_status: PlacementStatus;
  processing_status: ProcessingStatus;
  action_type: ActionType;
  can_exclude: boolean;
  allow_duplicate: boolean;
  is_excluded: boolean;
  is_ai_generated: boolean;
  estimated_duration_min: number | null;
  coordinates: { lat: number; lng: number } | null;
  time_constraint: string | null;
  question_text: string | null;
  options: CardOption[] | null;
  blocked_reason: string | null;
  user_context: string | null;
  tips: string | null;
  tags: string[] | null;
  source: string | null;
  day: number | null;
  notes: string | null;
  memo?: string | null;
  group_label?: string;
  group_reason?: string;
  processing_started_at?: number | null;

  // 기존 UI에서 사용 중인 선택 필드
  location?: string;
  address?: string;
  image_url?: string;
}

// 그룹 데이터 모델
export interface CardGroup {
  id: string;
  title: string;
  description?: string;
  cards: TripCardData[];
}

// 분류별 색상 매핑
export const CLASSIFICATION_COLORS: Record<Classification, { bg: string; text: string; border: string }> = {
  confirmed: { bg: "#DCFCE7", text: "#166534", border: "#22C55E" },
  open_question: { bg: "#DBEAFE", text: "#1E40AF", border: "#3B82F6" },
  undecided: { bg: "#FEF3C7", text: "#92400E", border: "#F59E0B" },
  unassigned: { bg: "#F3F4F6", text: "#4B5563", border: "#9CA3AF" },
};

// 분류별 라벨
export const CLASSIFICATION_LABELS: Record<Classification, string> = {
  confirmed: "확정됨",
  open_question: "질문 필요",
  undecided: "미결정",
  unassigned: "미배치",
};

// 배치 상태별 라벨
export const PLACEMENT_LABELS: Record<PlacementStatus, string> = {
  ready: "준비됨",
  ready_partial: "일부 준비",
  needs_input: "입력 필요",
  blocked: "차단됨",
};

// 처리 상태별 라벨
export const PROCESSING_LABELS: Record<ProcessingStatus, string> = {
  pending: "대기 중",
  processing: "처리 중",
  completed: "완료",
  failed: "실패",
};

// 카테고리별 아이콘/라벨
export const CATEGORY_CONFIG: Record<CardCategory, { label: string; icon: string }> = {
  place: { label: "장소", icon: "map-pin" },
  activity: { label: "활동", icon: "activity" },
  transport: { label: "이동", icon: "car" },
  accommodation: { label: "숙소", icon: "home" },
  food: { label: "맛집", icon: "utensils" },
  etc: { label: "기타", icon: "more-horizontal" },
};
