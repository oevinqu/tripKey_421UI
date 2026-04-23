export interface AlertCardDemoItem {
  id: string;
  type: string;
  category: "practical" | "insight";
  scope: "trip" | "day";
  day: number | null;
  message: string;
  related_instance_ids: string[] | null;
}

export const ALERT_DEMO_ITEMS: AlertCardDemoItem[] = [
  {
    id: "alert-1",
    type: "transport_pass",
    category: "practical",
    scope: "trip",
    day: null,
    message: "오사카-교토 이동이 있어 간사이 쓰루패스 또는 ICOCA 사용을 검토해보세요.",
    related_instance_ids: ["org-6", "arr-8"],
  },
  {
    id: "alert-2",
    type: "airport_transfer",
    category: "practical",
    scope: "trip",
    day: null,
    message: "간사이 공항에서 난바까지는 라피트, 리무진 버스, 일반 전철 중 하나로 정리할 수 있어요.",
    related_instance_ids: ["arr-11", "arr-12"],
  },
  {
    id: "alert-3",
    type: "todo_cash",
    category: "practical",
    scope: "trip",
    day: null,
    message: "현금 인출과 환전은 출발 전 체크리스트에 넣어두는 게 좋아요.",
    related_instance_ids: null,
  },
  {
    id: "alert-4",
    type: "festival",
    category: "insight",
    scope: "day",
    day: 3,
    message: "5월 12일 교토 시내 행사로 인해 오후 시간대 주요 관광지 주변이 혼잡할 수 있어요.",
    related_instance_ids: ["org-12", "arr-6"],
  },
  {
    id: "alert-5",
    type: "weather",
    category: "insight",
    scope: "day",
    day: 1,
    message: "Day 1 저녁에는 강변 바람이 강할 수 있어 겉옷이 있으면 좋아요.",
    related_instance_ids: ["org-3", "arr-4"],
  },
  {
    id: "alert-6",
    type: "seasonal",
    category: "insight",
    scope: "trip",
    day: null,
    message: "연휴 직전 주간이라 주요 관광지와 인기 맛집 대기 시간이 평소보다 길 수 있어요.",
    related_instance_ids: null,
  },
];

export const groupTripAlerts = () => ({
  practical: ALERT_DEMO_ITEMS.filter(
    (item) => item.scope === "trip" && item.category === "practical"
  ),
  insight: ALERT_DEMO_ITEMS.filter(
    (item) => item.scope === "trip" && item.category === "insight"
  ),
});

export const groupDayAlerts = (day: number) => ({
  practical: ALERT_DEMO_ITEMS.filter(
    (item) => item.scope === "day" && item.day === day && item.category === "practical"
  ),
  insight: ALERT_DEMO_ITEMS.filter(
    (item) => item.scope === "day" && item.day === day && item.category === "insight"
  ),
});
