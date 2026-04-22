// 분류 상태: 확정됨 / 질문있음 / 미결정 / 미배치
export type Classification = 'confirmed' | 'open_question' | 'undecided' | 'unassigned';

// 배치 가능 상태: 준비됨 / 일부준비 / 차단됨
export type PlacementStatus = 'ready' | 'ready_partial' | 'blocked';

// 처리 상태: 대기 / 보류 / 처리중 / 완료 / 실패
export type ProcessingStatus = 'idle' | 'pending' | 'processing' | 'completed' | 'failed';

// 필요한 액션 유형: 입력필요 / 선택필요 / 수정필요 / 확인만
export type ActionType = 'input_required' | 'select_required' | 'fix_required' | 'review_only';

// 카테고리
export type CardCategory = 'place' | 'activity' | 'transport' | 'accommodation' | 'food';

export interface CardOption {
  id: string;
  label: string;
}

export interface TripCardData {
  id: string;
  title: string;
  category: CardCategory;
  
  // 상태 축
  classification: Classification;
  placement_status: PlacementStatus;
  processing_status: ProcessingStatus;
  action_type: ActionType;
  
  // 메타 정보
  location?: string;
  address?: string;
  time_slot?: string;
  duration?: string;
  notes?: string;
  image_url?: string;
  
  // 질문 관련
  question_text?: string;
  options?: CardOption[];
  
  // 추가 정보
  tags?: string[];
  source?: string;
  day?: number;
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
  confirmed: { bg: '#DCFCE7', text: '#166534', border: '#22C55E' },
  open_question: { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
  undecided: { bg: '#DBEAFE', text: '#1E40AF', border: '#3B82F6' },
  unassigned: { bg: '#F3F4F6', text: '#4B5563', border: '#9CA3AF' },
};

// 분류별 라벨
export const CLASSIFICATION_LABELS: Record<Classification, string> = {
  confirmed: '확정됨',
  open_question: '질문 필요',
  undecided: '미결정',
  unassigned: '미배치',
};

// 배치 상태별 라벨
export const PLACEMENT_LABELS: Record<PlacementStatus, string> = {
  ready: '준비됨',
  ready_partial: '일부 준비',
  blocked: '차단됨',
};

// 카테고리별 아이콘/라벨
export const CATEGORY_CONFIG: Record<CardCategory, { label: string; icon: string }> = {
  place: { label: '장소', icon: 'map-pin' },
  activity: { label: '활동', icon: 'activity' },
  transport: { label: '이동', icon: 'car' },
  accommodation: { label: '숙소', icon: 'home' },
  food: { label: '맛집', icon: 'utensils' },
};
