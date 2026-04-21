"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MainHeader, SubHeader } from "@/components/header";

// 여행 정보 (온보딩에서 입력받은 정보)
const TRIP_INFO = {
  destinations: ["오사카", "교토", "나라"],
  travelers: 2,
  startDate: "5월 10일",
  endDate: "5월 14일",
};

const CHECKLIST_ITEMS = [
  { id: "ck1", label: "여권 유효기간 확인", always: true },
  { id: "ck2", label: "항공권 출력 / 모바일 저장", condition: "flight" },
  { id: "ck3", label: "숙소 바우처 준비", condition: "hotel" },
  { id: "ck4", label: "여행자 보험 가입", always: true },
  { id: "ck5", label: "교통패스 예약", always: true },
  { id: "ck6", label: "환전", always: true },
];

const DAYS = [
  {
    day: 1,
    label: "Day 1 - 오사카 남부",
    insight: {
      totalTravel: "32분",
      note: "전 구간 도보 이동 가능. 편한 신발 권장.",
    },
    places: [
      {
        id: "p1",
        name: "도톤보리",
        category: "관광지",
        stay: 90,
        startTime: "10:00",
        remind: ["야간 조명은 18시 이후 점등"],
      },
      { travel: { mode: "도보", min: 8 } },
      {
        id: "p2",
        name: "리쿠로 오지상 본점",
        category: "식당",
        stay: 60,
        startTime: "11:38",
        remind: ["오후 매진 잦음, 오전 방문 권장"],
      },
      {
        travel: {
          mode: "도보",
          min: 12,
          detail: {
            route: "사카이스지 직진",
            fare: null,
            interval: null,
            alt: null,
          },
        },
      },
      {
        id: "p3",
        name: "구로몬 시장",
        category: "관광지",
        stay: 90,
        startTime: "13:30",
        remind: ["오후 2시 이후 폐점 가게 많음"],
      },
      { travel: { mode: "도보", min: 6 } },
      {
        id: "p4",
        name: "이치란 라멘 도톤보리",
        category: "식당",
        stay: 60,
        startTime: "15:06",
        remind: [],
      },
    ],
    checklist: [
      { id: "dc1", label: "편한 신발 착용", from: "도보 이동 많음" },
      { id: "dc2", label: "리쿠로 오전 방문", from: "리쿠로 오지상 본점" },
      { id: "dc3", label: "구로몬 시장 14시 전 도착", from: "구로몬 시장" },
    ],
  },
  {
    day: 2,
    label: "Day 2 - 유니버셜",
    insight: { totalTravel: "0분", note: "하루 종일 파크 내 활동." },
    places: [
      {
        id: "p5",
        name: "유니버셜 스튜디오 재팬",
        category: "관광지",
        stay: 90,
        startTime: "09:00",
        remind: ["익스프레스 패스 사전 구매 권장", "입장권 모바일 저장 확인"],
      },
    ],
    checklist: [
      { id: "dc4", label: "익스프레스 패스 확인", from: "유니버셜 스튜디오" },
      { id: "dc5", label: "입장권 모바일 저장", from: "유니버셜 스튜디오" },
    ],
  },
  {
    day: 3,
    label: "Day 3 - 교토 당일치기",
    insight: {
      totalTravel: "1시간 15분",
      note: "대중교통 환승 2회. 교통패스 활용 권장.",
    },
    places: [
      {
        id: "p6",
        name: "아라시야마 대나무숲",
        category: "관광지",
        stay: 90,
        startTime: "07:30",
        remind: ["오전 8시 이전 도착 시 인파 적음"],
      },
      {
        travel: {
          mode: "버스",
          min: 35,
          detail: {
            route: "28번 버스 - 가와라마치",
            fare: "460원",
            interval: "15분 간격",
            alt: "택시 25분 약 4,500원",
          },
        },
      },
      {
        id: "p7",
        name: "기요미즈데라",
        category: "관광지",
        stay: 90,
        startTime: "10:35",
        remind: ["계단 많음, 편한 신발 필수"],
      },
      { travel: { mode: "도보", min: 15 } },
      {
        id: "p8",
        name: "니시키 시장",
        category: "식당",
        stay: 60,
        startTime: "12:20",
        remind: [],
      },
      {
        travel: {
          mode: "전철",
          min: 20,
          detail: {
            route: "케이한 본선 - 후시미이나리역",
            fare: "280원",
            interval: "10분 간격",
            alt: "택시 15분 약 2,800원",
          },
        },
      },
      {
        id: "p9",
        name: "후시미 이나리 타이샤",
        category: "관광지",
        stay: 90,
        startTime: "14:00",
        remind: ["24시간 개방", "정상까지 왕복 2시간"],
      },
    ],
    checklist: [
      { id: "dc6", label: "아라시야마 07:30 출발", from: "아라시야마 대나무숲" },
      { id: "dc7", label: "교통패스 준비", from: "대중교통 환승 2회" },
    ],
  },
  { day: 4, label: "Day 4", places: [], insight: null, checklist: [] },
  { day: 5, label: "Day 5", places: [], insight: null, checklist: [] },
];

interface TravelInfo {
  mode: string;
  min: number;
  detail?: {
    route: string;
    fare: string | null;
    interval: string | null;
    alt: string | null;
  };
}



function TravelSegment({
  travel,
  noVerify,
}: {
  travel: TravelInfo;
  noVerify: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasDetail = !!travel.detail;

  return (
    <div className="pl-6 my-1 ml-4 border-l-2 border-[#E8E8E8]">
      <div
        onClick={() => hasDetail && setExpanded(!expanded)}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
          hasDetail ? "cursor-pointer hover:bg-[#F9F9F7]" : "cursor-default"
        } ${expanded ? "bg-[#F9F9F7]" : "bg-transparent"}`}
      >
        <span
          className={`text-[12px] font-semibold px-2 py-1 rounded ${
            travel.mode === "도보"
              ? "bg-[#F0FDF4] text-[#16A34A]"
              : travel.mode === "택시"
                ? "bg-[#FFF5F5] text-[#DC2626]"
                : "bg-[#EFF6FF] text-[#2563EB]"
          }`}
        >
          {travel.mode}
        </span>
        <span className="text-[13px] text-[#888]">{travel.min}분</span>
        {noVerify && (
          <span className="text-[11px] px-2 py-1 rounded bg-[#FFF8E1] text-[#F57F17]">
            AI 예측
          </span>
        )}
        {hasDetail && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            className={`ml-auto transition-transform ${expanded ? "rotate-180" : "rotate-0"}`}
          >
            <path d="M4 6l4 4 4-4" stroke="#CCC" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          </svg>
        )}
      </div>
      {expanded && travel.detail && (
        <div className="px-4 pt-2 pb-4 text-[13px] text-[#888] leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex flex-col gap-1.5 bg-[#FAFAFA] rounded-lg p-3">
            <span><span className="text-[#B0B0B0] mr-3 inline-block w-10">노선</span>{travel.detail.route}</span>
            {travel.detail.fare && <span><span className="text-[#B0B0B0] mr-3 inline-block w-10">요금</span>{travel.detail.fare}</span>}
            {travel.detail.interval && <span><span className="text-[#B0B0B0] mr-3 inline-block w-10">배차</span>{travel.detail.interval}</span>}
            {travel.detail.alt && <span><span className="text-[#B0B0B0] mr-3 inline-block w-10">대안</span>{travel.detail.alt}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

// 체크리스트 아이템 타입
interface ChecklistItem {
  id: string;
  label: string;
  always?: boolean;
  condition?: string;
  from?: string;
}

// 체크리스트 편집 모달
function ChecklistEditModal({
  isOpen,
  onClose,
  checklist,
  onSave,
  title,
  availablePlaces,
}: {
  isOpen: boolean;
  onClose: () => void;
  checklist: ChecklistItem[];
  onSave: (items: ChecklistItem[]) => void;
  title: string;
  availablePlaces?: { id: string; name: string }[];
}) {
  const [items, setItems] = useState<ChecklistItem[]>(checklist);
  const [newItem, setNewItem] = useState("");
  const [newItemPlace, setNewItemPlace] = useState("");

  useEffect(() => {
    setItems(checklist);
  }, [checklist, isOpen]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    if (newItem.trim()) {
      setItems([
        ...items,
        {
          id: `custom-${Date.now()}`,
          label: newItem.trim(),
          always: true,
          from: newItemPlace || undefined,
        },
      ]);
      setNewItem("");
      setNewItemPlace("");
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, newLabel: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, label: newLabel } : item)));
  };

  const handleUpdateItemPlace = (id: string, placeName: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, from: placeName || undefined } : item)));
  };

  const showPlaceSelector = availablePlaces && availablePlaces.length > 0;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-[#F0F0F0] flex items-center justify-between">
          <h3 className="text-[18px] font-semibold text-[#1A1A1A] m-0">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 max-h-[450px] overflow-y-auto">
          {/* 헤더 라벨 */}
          {showPlaceSelector && (
            <div className="flex items-center gap-3 mb-3 text-[12px] text-[#888] font-medium">
              <span className="flex-1 pl-4">체크리스트 항목</span>
              <span className="w-48 pl-3">연결된 장소</span>
              <span className="w-10"></span>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 group">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleUpdateItem(item.id, e.target.value)}
                  className="flex-1 px-4 py-3 text-[14px] border border-[#E8E8E8] rounded-lg focus:outline-none focus:border-[#534AB7] transition-colors"
                />
                {showPlaceSelector && (
                  <select
                    value={item.from || ""}
                    onChange={(e) => handleUpdateItemPlace(item.id, e.target.value)}
                    className="w-48 px-3 py-3 text-[13px] border border-[#E8E8E8] rounded-lg focus:outline-none focus:border-[#534AB7] transition-colors bg-white text-[#333] appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                      paddingRight: "36px",
                    }}
                  >
                    <option value="">장소 없음</option>
                    {availablePlaces.map((place) => (
                      <option key={place.id} value={place.name}>
                        {place.name}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2.5 text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors opacity-50 group-hover:opacity-100"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* 새 항목 추가 */}
          <div className="mt-5 pt-5 border-t border-[#F0F0F0]">
            <p className="text-[12px] text-[#888] font-medium mb-3">새 항목 추가</p>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                placeholder="체크리스트 내용 입력..."
                className="flex-1 px-4 py-3 text-[14px] border border-[#E8E8E8] rounded-lg focus:outline-none focus:border-[#534AB7] transition-colors"
              />
              {showPlaceSelector && (
                <select
                  value={newItemPlace}
                  onChange={(e) => setNewItemPlace(e.target.value)}
                  className="w-48 px-3 py-3 text-[13px] border border-[#E8E8E8] rounded-lg focus:outline-none focus:border-[#534AB7] transition-colors bg-white text-[#333] appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    paddingRight: "36px",
                  }}
                >
                  <option value="">장소 없음</option>
                  {availablePlaces.map((place) => (
                    <option key={place.id} value={place.name}>
                      {place.name}
                    </option>
                  ))}
                </select>
              )}
              <button
                onClick={handleAddItem}
                disabled={!newItem.trim()}
                className="px-5 py-3 bg-[#534AB7] text-white text-[14px] rounded-lg hover:bg-[#4840A0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                추가
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#F0F0F0] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-[14px] text-[#666] border border-[#E0E0E0] rounded-lg hover:bg-[#F9F9F9] transition-colors"
          >
            취소
          </button>
          <button
            onClick={() => {
              onSave(items);
              onClose();
            }}
            className="px-5 py-2.5 text-[14px] text-white bg-[#534AB7] rounded-lg hover:bg-[#4840A0] transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SCR05() {
  const [activeDay, setActiveDay] = useState(1);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [dayChecks, setDayChecks] = useState<Record<string, boolean>>({});
  const [noVerify] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [exporting, setExporting] = useState(false);
  const hasFlight = true;
  const hasHotel = true;

  // 체크리스트 상태 관리
  const [mainChecklist, setMainChecklist] = useState(CHECKLIST_ITEMS);
  const [daysData, setDaysData] = useState(DAYS);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDayChecklist, setEditingDayChecklist] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  };

  const toggleCheck = (id: string) => setChecks({ ...checks, [id]: !checks[id] });
  const toggleDayCheck = (id: string) => setDayChecks({ ...dayChecks, [id]: !dayChecks[id] });

  const visibleChecklist = mainChecklist.filter((item) => {
    if (item.always) return true;
    if (item.condition === "flight" && hasFlight) return true;
    if (item.condition === "hotel" && hasHotel) return true;
    return false;
  });

  const activeDayData = daysData.find((d) => d.day === activeDay);

  const handleExportPDF = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      showToast("PDF가 다운로드되었어요");
    }, 1500);
  };

  const handleShare = () => {
    showToast("링크가 복사되었어요");
  };

  const handleSaveMainChecklist = (items: ChecklistItem[]) => {
    setMainChecklist(items);
    showToast("체크리스트가 저장되었어요");
  };

  const handleSaveDayChecklist = (items: ChecklistItem[]) => {
    if (editingDayChecklist !== null) {
      setDaysData(
        daysData.map((day) =>
          day.day === editingDayChecklist
            ? { ...day, checklist: items.map((item) => ({ ...item, from: item.from || "" })) }
            : day
        )
      );
      showToast("Day 체크리스트가 저장되었어요");
    }
  };

  const currentStep = 5; // 현재 확정 단계

  return (
    <div className="min-h-screen bg-[#F7F7F5] font-sans flex flex-col">
      {/* 메인 헤더 */}
      <MainHeader />

      {/* 서브 헤더 */}
      <SubHeader
        currentStep={currentStep}
        tripInfo={TRIP_INFO}
        rightButtons={
          <>
            <Link
              href="/arrange"
              className="px-4 py-2 rounded-lg border border-[#E0E0E0] bg-white text-[#666] text-[13px] hover:bg-[#F9F9F9] transition-colors no-underline"
            >
              배치로 돌아가기
            </Link>
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className={`px-4 py-2 rounded-lg border-none bg-[#1A1A1A] text-white text-[13px] font-medium flex items-center gap-2 transition-opacity ${
                exporting ? "opacity-70 cursor-default" : "cursor-pointer hover:bg-[#333]"
              }`}
            >
              {exporting ? (
                <svg width="14" height="14" viewBox="0 0 24 24" className="animate-spin">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="#fff" strokeWidth="2.5" strokeDasharray="15 55" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {exporting ? "생성 중..." : "PDF 다운로드"}
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-lg border-none bg-[#534AB7] text-white text-[13px] font-medium cursor-pointer flex items-center gap-2 hover:bg-[#4840A0] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M4 12v6a2 2 0 002 2h12a2 2 0 002-2v-6M16 6l-4-4-4 4M12 2v13" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              공유하기
            </button>
          </>
        }
      />

      {/* Desktop Content - Two Column Layout */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Checklist */}
        <aside className="w-[340px] bg-white border-r border-[#EBEBEB] flex flex-col shrink-0">
          <div className="p-6 border-b border-[#F0F0F0]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-semibold text-[#1A1A1A] m-0">출발 전 체크리스트</h2>
              <button
                onClick={() => setEditModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-[#666] hover:bg-[#F5F5F5] rounded-lg transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                편집
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {visibleChecklist.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    checks[item.id] ? "bg-[#F9FBF9]" : "hover:bg-[#FAFAFA]"
                  }`}
                >
                  <div
                    onClick={() => toggleCheck(item.id)}
                    className={`w-5 h-5 rounded-md shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                      checks[item.id]
                        ? "bg-[#534AB7] border-none"
                        : "bg-white border-[1.5px] border-[#D0D0D0]"
                    }`}
                  >
                    {checks[item.id] && (
                      <svg width="12" height="12" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-[14px] flex-1 transition-all ${
                      checks[item.id] ? "text-[#B0B0B0] line-through" : "text-[#333]"
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.condition && (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#F0F0F0] text-[#999]">
                      {item.condition === "flight" ? "항공편" : "숙소"}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Day Checklist in Sidebar */}
          {activeDayData && activeDayData.checklist && activeDayData.checklist.length > 0 && (
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-semibold text-[#1A1A1A] m-0">Day {activeDayData.day} 체크리스트</h3>
                <button
                  onClick={() => setEditingDayChecklist(activeDayData.day)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[12px] text-[#666] hover:bg-[#F5F5F5] rounded-md transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  편집
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {activeDayData.checklist.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                      dayChecks[item.id] ? "bg-[#F0FDF4]" : "hover:bg-[#FAFAFA]"
                    }`}
                  >
                    <div
                      onClick={() => toggleDayCheck(item.id)}
                      className={`w-[18px] h-[18px] rounded-[5px] shrink-0 flex items-center justify-center cursor-pointer ${
                        dayChecks[item.id]
                          ? "bg-[#16A34A] border-none"
                          : "bg-white border-[1.5px] border-[#D0D0D0]"
                      }`}
                    >
                      {dayChecks[item.id] && (
                        <svg width="10" height="10" viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className={`text-[14px] block ${dayChecks[item.id] ? "text-[#B0B0B0] line-through" : "text-[#333]"}`}>
                        {item.label}
                      </span>
                      <span className="text-[11px] text-[#B0B0B0]">{item.from}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Day에 체크리스트가 없을 때 */}
          {activeDayData && (!activeDayData.checklist || activeDayData.checklist.length === 0) && (
            <div className="p-6">
              <button
                onClick={() => setEditingDayChecklist(activeDayData.day)}
                className="w-full py-3 border border-dashed border-[#D0D0D0] rounded-lg text-[13px] text-[#888] hover:bg-[#FAFAFA] hover:border-[#534AB7] hover:text-[#534AB7] transition-all flex items-center justify-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Day {activeDayData.day} 체크리스트 추가
              </button>
            </div>
          )}
        </aside>

        {/* Main Content - Schedule */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* 동선 미검증 안내 */}
            {noVerify && (
              <div className="bg-[#FFF8E1] border border-[#FDE68A] rounded-xl px-5 py-4 mb-6 flex items-center gap-3 max-w-4xl">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9v4m0 4h.01M12 3l9.5 16.5H2.5L12 3z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="m-0 text-[14px] text-[#92400E]">
                  이동시간은 AI 예측값이에요. 동선 검증을 하면 더 정확한 시간을 확인할 수 있어요.
                </p>
              </div>
            )}

            {/* Day tabs */}
            <div className="flex gap-2 mb-6">
              {daysData.map((d) => (
                <button
                  key={d.day}
                  onClick={() => setActiveDay(d.day)}
                  className={`px-6 py-3 rounded-xl text-[14px] font-medium cursor-pointer transition-all ${
                    activeDay === d.day
                      ? "bg-[#534AB7] text-white shadow-md"
                      : "bg-white text-[#666] border border-[#EBEBEB] hover:bg-[#F9F9F9] hover:border-[#D0D0D0]"
                  }`}
                >
                  Day {d.day}
                </button>
              ))}
            </div>

            {/* Day content */}
            {activeDayData && (
              <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden shadow-sm animate-in fade-in duration-300 max-w-4xl">
                {/* 빈 Day */}
                {activeDayData.places.length === 0 ? (
                  <div className="px-8 py-16 text-center">
                    <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="#C0C0C0" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <p className="m-0 text-[16px] text-[#999] mb-5">이 Day에 일정이 없어요</p>
                    <button className="px-6 py-3 rounded-lg border border-[#E0E0E0] bg-white text-[#666] text-[14px] cursor-pointer hover:bg-[#F9F9F9] transition-colors">
                      배치로 돌아가기
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Day 헤더 */}
                    <div className="px-8 pt-6 pb-5 border-b border-[#F0F0F0]">
                      <h2 className="m-0 text-[20px] font-semibold text-[#1A1A1A]">{activeDayData.label}</h2>
                    </div>

                    {/* Day 인사이트 */}
                    {activeDayData.insight && (
                      <div className="px-8 py-4 border-b border-[#F0F0F0] bg-[#F9F9F7]">
                        <div className="flex items-center gap-6 text-[14px]">
                          <div className="flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="#666" strokeWidth="1.5"/>
                              <path d="M12 6v6l4 2" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            <span className="text-[#999]">총 이동시간</span>
                            <span className="font-semibold text-[#333]">{activeDayData.insight.totalTravel}</span>
                          </div>
                          <span className="text-[#E0E0E0]">|</span>
                          <span className="text-[#666]">{activeDayData.insight.note}</span>
                        </div>
                      </div>
                    )}

                    {/* 장소 목록 */}
                    <div className="px-8 py-6">
                      {activeDayData.places.map((item, idx) => {
                        if ("travel" in item && item.travel) {
                          return <TravelSegment key={`t-${idx}`} travel={item.travel} noVerify={noVerify} />;
                        }
                        const placeItem = item as {
                          id: string;
                          name: string;
                          category: string;
                          stay: number;
                          startTime: string;
                          remind: string[];
                        };
                        return (
                          <div key={placeItem.id} className="flex gap-4 py-4 group">
                            {/* 순서 번호 */}
                            <div
                              className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold ${
                                placeItem.category === "식당"
                                  ? "bg-[#FFF8E1] text-[#F59E0B]"
                                  : "bg-[#F3E8FF] text-[#8B5CF6]"
                              }`}
                            >
                              {activeDayData.places.filter((p, pi) => !("travel" in p) && pi <= idx).length}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <span className="text-[17px] font-medium text-[#1A1A1A]">{placeItem.name}</span>
                                <span className={`text-[12px] px-2 py-0.5 rounded-full ${
                                  placeItem.category === "식당" 
                                    ? "bg-[#FFF8E1] text-[#B45309]" 
                                    : "bg-[#F3E8FF] text-[#7C3AED]"
                                }`}>
                                  {placeItem.category}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 mt-1.5 text-[14px] text-[#888]">
                                <span className="flex items-center gap-1.5">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                  </svg>
                                  {placeItem.startTime}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 8v4l3 3M12 3a9 9 0 100 18 9 9 0 000-18z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                  </svg>
                                  {placeItem.stay}분 체류
                                </span>
                              </div>
                              {placeItem.remind && placeItem.remind.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {placeItem.remind.map((r, ri) => (
                                    <div
                                      key={ri}
                                      className="text-[13px] text-[#92400E] bg-[#FFFBEB] px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 9v4m0 4h.01M12 3l9.5 16.5H2.5L12 3z" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
                                      </svg>
                                      {r}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Toast */}
      {toast.visible && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#333] text-white px-6 py-3.5 rounded-xl text-[14px] font-medium shadow-xl z-[100] animate-in fade-in slide-in-from-bottom-2 duration-300 whitespace-nowrap">
          {toast.message}
        </div>
      )}

      {/* 메인 체크리스트 편집 모달 */}
      <ChecklistEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        checklist={mainChecklist}
        onSave={handleSaveMainChecklist}
        title="출발 전 체크리스트 편집"
      />

      {/* Day 체크리스트 편집 모달 */}
      <ChecklistEditModal
        isOpen={editingDayChecklist !== null}
        onClose={() => setEditingDayChecklist(null)}
        checklist={
          editingDayChecklist !== null
            ? daysData.find((d) => d.day === editingDayChecklist)?.checklist || []
            : []
        }
        onSave={handleSaveDayChecklist}
        title={`Day ${editingDayChecklist} 체크리스트 편집`}
        availablePlaces={
          editingDayChecklist !== null
            ? daysData
                .find((d) => d.day === editingDayChecklist)
                ?.places.filter((p): p is { id: string; name: string; category: string; stay: number; startTime: string; remind: string[] } => "id" in p && "name" in p)
                .map((p) => ({ id: p.id, name: p.name })) || []
            : []
        }
      />
    </div>
  );
}
