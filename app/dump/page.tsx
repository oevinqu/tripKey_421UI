"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MainHeader, SubHeader } from "@/components/header";

const URL_REGEX = /https?:\/\/[^\s]+|www\.[^\s]+/gi;

const PLACEHOLDER = `예시:
도쿄 여행 3박 4일 계획중이야
신주쿠, 시부야, 하라주쿠 가고 싶고
라멘 맛집이랑 카페 많이 가고 싶어
둘째 날은 디즈니랜드 갈 예정
마지막 날 아침에 츠키지 시장 가서 초밥 먹고 싶음`;

const AI_TAGS = [
  { label: "장소", icon: "map-pin" },
  { label: "일정", icon: "calendar" },
  { label: "시간", icon: "clock" },
  { label: "맛집", icon: "utensils" },
  { label: "이동", icon: "route" },
];

const INPUT_TIPS = [
  "방문하고 싶은 장소와 시간대를 자유롭게 적어주세요",
  "꼭 가고 싶은 맛집이나 카페가 있다면 함께 적어주세요",
  "여행 스타일이나 선호하는 분위기도 알려주시면 좋아요",
];

// 아이콘 컴포넌트
function TagIcon({ type }: { type: string }) {
  switch (type) {
    case "map-pin":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 12.5C13.1046 12.5 14 11.6046 14 10.5C14 9.39543 13.1046 8.5 12 8.5C10.8954 8.5 10 9.39543 10 10.5C10 11.6046 10.8954 12.5 12 12.5Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 21C12 21 18 15.5 18 10.5C18 7.18629 15.3137 4.5 12 4.5C8.68629 4.5 6 7.18629 6 10.5C6 15.5 12 21 12 21Z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "calendar":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 9H21M7 3V5M17 3V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "clock":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "utensils":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M3 3V12C3 13.1046 3.89543 14 5 14H6C7.10457 14 8 13.1046 8 12V3M5.5 3V7M18 3V21M18 3C18 3 21 5 21 8C21 11 18 11 18 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "route":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="18" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6 8V14C6 15.1046 6.89543 16 8 16H16C17.1046 16 18 15.1046 18 14V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

// 토스트 컴포넌트
function Toast({
  message,
  visible,
  onHide,
}: {
  message: string;
  visible: boolean;
  onHide: () => void;
}) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onHide, 4000);
      return () => clearTimeout(t);
    }
  }, [visible, onHide]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white px-5 py-3 rounded-xl text-sm font-medium shadow-lg z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#F59E0B" strokeWidth="1.5" />
        <path d="M12 8V12M12 16H12.01" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {message}
    </div>
  );
}

interface FlightInfo {
  id: string;
  type: "departure" | "return";
  airport: string;
  flightNumber: string;
  time: string;
}

interface AccommodationInfo {
  id: string;
  name: string;
  location: string;
  checkIn: string;
  checkOut: string;
}

export default function DumpPage() {
  const [text, setText] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [maxReachedShown, setMaxReachedShown] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentStep = 2;

  // 항공편 정보
  const [flightExpanded, setFlightExpanded] = useState(false);
  const [flights, setFlights] = useState<FlightInfo[]>([
    { id: "1", type: "departure", airport: "", flightNumber: "", time: "" },
    { id: "2", type: "return", airport: "", flightNumber: "", time: "" },
  ]);

  // 숙박 정보
  const [accommodationExpanded, setAccommodationExpanded] = useState(false);
  const [accommodations, setAccommodations] = useState<AccommodationInfo[]>([
    { id: "1", name: "", location: "", checkIn: "", checkOut: "" },
  ]);

  const updateFlight = (id: string, field: keyof FlightInfo, value: string) => {
    setFlights((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const addAccommodation = () => {
    setAccommodations((prev) => [
      ...prev,
      { id: String(Date.now()), name: "", location: "", checkIn: "", checkOut: "" },
    ]);
  };

  const removeAccommodation = (id: string) => {
    if (accommodations.length > 1) {
      setAccommodations((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const updateAccommodation = (id: string, field: keyof AccommodationInfo, value: string) => {
    setAccommodations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const len = text.length;
  const isValid = len >= 10;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let val = e.target.value;

    if (URL_REGEX.test(val) && !URL_REGEX.test(text)) {
      val = val.replace(URL_REGEX, "");
      setToast({
        visible: true,
        message: "URL은 입력할 수 없어요. AI가 링크 내용을 읽을 수 없으니 텍스트로 직접 적어주세요.",
      });
    }
    URL_REGEX.lastIndex = 0;

    if (val.length > 3000) {
      val = val.slice(0, 3000);
      if (!maxReachedShown) {
        setMaxReachedShown(true);
      }
    } else {
      setMaxReachedShown(false);
    }

    setText(val);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = e.clipboardData.getData("text");
    if (URL_REGEX.test(pasted)) {
      e.preventDefault();
      const cleaned = pasted.replace(URL_REGEX, "");
      URL_REGEX.lastIndex = 0;
      const ta = textareaRef.current;
      if (ta) {
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const newText = text.slice(0, start) + cleaned + text.slice(end);
        setText(newText.slice(0, 3000));
      }
      setToast({
        visible: true,
        message: "URL은 입력할 수 없어요. AI가 링크 내용을 읽을 수 없으니 텍스트로 직접 적어주세요.",
      });
    }
  };

  const handleReset = () => {
    setText("");
    setMaxReachedShown(false);
    setFlights([
      { id: "1", type: "departure", airport: "", flightNumber: "", time: "" },
      { id: "2", type: "return", airport: "", flightNumber: "", time: "" },
    ]);
    setAccommodations([
      { id: "1", name: "", location: "", checkIn: "", checkOut: "" },
    ]);
    textareaRef.current?.focus();
  };

  const charCountColor =
    len >= 3000 ? "text-[#DC2626]" : len >= 2700 ? "text-[#F59E0B]" : "text-[#888]";

  return (
    <div className="min-h-screen bg-[#F5F5F3] font-sans flex flex-col">
      {/* 메인 헤더 */}
      <MainHeader />

      {/* 서브 헤더 */}
      <SubHeader
        currentStep={currentStep}
        tripInfo={{
          destinations: ["오사카", "교토", "나라"],
          travelers: 2,
          startDate: "5월 10일",
          endDate: "5월 14일",
        }}
        rightButtons={
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-[#666] border border-[#E0E0E0] rounded-lg hover:bg-[#F8F8F8] transition-colors bg-white cursor-pointer"
          >
            초기화
          </button>
        }
      />

      {/* 메인 콘텐츠 영역 - 2컬럼 레이아웃 */}
      <div className="flex-1 px-8 lg:px-12 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 왼쪽: 메인 폼 영역 (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* 페이지 타이틀 */}
              <div className="mb-2">
                <h1 className="text-2xl font-semibold text-[#1A1A1A]">정보를 던지세요</h1>
                <p className="mt-2 text-base text-[#888]">메모, 카톡 대화, 검색 기록 등 여행과 관련된 정보를 자유롭게 붙여넣어 주세요</p>
              </div>

          {/* 보조 정보 입력 카드 */}
              <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 lg:p-8">
                <h2 className="text-sm font-semibold text-[#1A1A1A] mb-4">보조 정보 (선택)</h2>

                {/* 항공편 정보 입력 섹션 */}
                <div className="mb-4 border border-[#E0E0E0] rounded-xl overflow-hidden">
            <button
              onClick={() => setFlightExpanded(!flightExpanded)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M21 16V8C21 7.44772 20.5523 7 20 7H17L14 3H10L7 7H4C3.44772 7 3 7.44772 3 8V16C3 16.5523 3.44772 17 4 17H20C20.5523 17 21 16.5523 21 16Z" stroke="#534AB7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 17L6 21H18L21 17" stroke="#534AB7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="font-semibold text-[#1A1A1A] text-sm">항공편 정보</span>
                  <span className="text-xs text-[#888] ml-2">(선택)</span>
                </div>
              </div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className={`text-[#888] transition-transform duration-200 ${flightExpanded ? "rotate-180" : ""}`}
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {flightExpanded && (
              <div className="px-5 pb-5 border-t border-[#F0F0F0]">
                <div className="pt-4 space-y-4">
                  {flights.map((flight) => (
                    <div key={flight.id} className="p-4 bg-[#FAFAFA] rounded-lg border border-[#EBEBEB]">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${flight.type === "departure" ? "bg-[#DBEAFE] text-[#1D4ED8]" : "bg-[#FEE2E2] text-[#DC2626]"}`}>
                          {flight.type === "departure" ? "출발" : "귀국"}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-[#666] mb-1.5">공항</label>
                          <input
                            type="text"
                            placeholder="예: 인천국제공항"
                            value={flight.airport}
                            onChange={(e) => updateFlight(flight.id, "airport", e.target.value)}
                            className="w-full px-3 py-2.5 border border-[#E0E0E0] rounded-lg text-sm bg-white focus:outline-none focus:border-[#534AB7] transition-colors placeholder:text-[#B0B0B0]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#666] mb-1.5">항공편</label>
                          <input
                            type="text"
                            placeholder="예: KE123"
                            value={flight.flightNumber}
                            onChange={(e) => updateFlight(flight.id, "flightNumber", e.target.value)}
                            className="w-full px-3 py-2.5 border border-[#E0E0E0] rounded-lg text-sm bg-white focus:outline-none focus:border-[#534AB7] transition-colors placeholder:text-[#B0B0B0]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#666] mb-1.5">시간</label>
                          <input
                            type="text"
                            placeholder="예: 09:30"
                            value={flight.time}
                            onChange={(e) => updateFlight(flight.id, "time", e.target.value)}
                            className="w-full px-3 py-2.5 border border-[#E0E0E0] rounded-lg text-sm bg-white focus:outline-none focus:border-[#534AB7] transition-colors placeholder:text-[#B0B0B0]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 숙박 정보 입력 섹션 */}
                <div className="border border-[#E0E0E0] rounded-xl overflow-hidden">
            <button
              onClick={() => setAccommodationExpanded(!accommodationExpanded)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M3 21H21M4 21V10L12 3L20 10V21M9 21V14H15V21" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="font-semibold text-[#1A1A1A] text-sm">숙박 정보</span>
                  <span className="text-xs text-[#888] ml-2">(선택)</span>
                </div>
              </div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className={`text-[#888] transition-transform duration-200 ${accommodationExpanded ? "rotate-180" : ""}`}
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {accommodationExpanded && (
              <div className="px-5 pb-5 border-t border-[#F0F0F0]">
                <div className="pt-4 space-y-4">
                  {accommodations.map((acc, index) => (
                    <div key={acc.id} className="p-4 bg-[#FAFAFA] rounded-lg border border-[#EBEBEB]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-[#FEF3C7] text-[#92400E]">
                          숙소 {index + 1}
                        </span>
                        {accommodations.length > 1 && (
                          <button
                            onClick={() => removeAccommodation(acc.id)}
                            className="text-xs text-[#DC2626] hover:text-[#B91C1C] transition-colors flex items-center gap-1"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            삭제
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-[#666] mb-1.5">숙소명</label>
                          <input
                            type="text"
                            placeholder="예: 신주쿠 프린스 호텔"
                            value={acc.name}
                            onChange={(e) => updateAccommodation(acc.id, "name", e.target.value)}
                            className="w-full px-3 py-2.5 border border-[#E0E0E0] rounded-lg text-sm bg-white focus:outline-none focus:border-[#534AB7] transition-colors placeholder:text-[#B0B0B0]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#666] mb-1.5">위치</label>
                          <input
                            type="text"
                            placeholder="예: 신주쿠역 도보 5분"
                            value={acc.location}
                            onChange={(e) => updateAccommodation(acc.id, "location", e.target.value)}
                            className="w-full px-3 py-2.5 border border-[#E0E0E0] rounded-lg text-sm bg-white focus:outline-none focus:border-[#534AB7] transition-colors placeholder:text-[#B0B0B0]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#666] mb-1.5">체크인</label>
                          <input
                            type="text"
                            placeholder="예: 5월 10일 15:00"
                            value={acc.checkIn}
                            onChange={(e) => updateAccommodation(acc.id, "checkIn", e.target.value)}
                            className="w-full px-3 py-2.5 border border-[#E0E0E0] rounded-lg text-sm bg-white focus:outline-none focus:border-[#534AB7] transition-colors placeholder:text-[#B0B0B0]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#666] mb-1.5">체크아웃</label>
                          <input
                            type="text"
                            placeholder="예: 5월 12일 11:00"
                            value={acc.checkOut}
                            onChange={(e) => updateAccommodation(acc.id, "checkOut", e.target.value)}
                            className="w-full px-3 py-2.5 border border-[#E0E0E0] rounded-lg text-sm bg-white focus:outline-none focus:border-[#534AB7] transition-colors placeholder:text-[#B0B0B0]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addAccommodation}
                    className="w-full py-3 border-2 border-dashed border-[#E0E0E0] rounded-lg text-sm text-[#666] hover:border-[#534AB7] hover:text-[#534AB7] hover:bg-[#F9F8FF] transition-colors flex items-center justify-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    숙소 추가
                  </button>
                </div>
              </div>
            )}
                </div>
              </div>

              {/* 텍스트 입력 카드 */}
              <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 lg:p-8">
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">
                  여행 정보 <span className="text-[#E24B4A]">*</span>
                </label>
                <div className="border border-[#E0E0E0] rounded-xl overflow-hidden hover:border-[#534AB7] transition-colors focus-within:border-[#534AB7] focus-within:ring-2 focus-within:ring-[#534AB7]/20">
                  <textarea
                ref={textareaRef}
                value={text}
                onChange={handleChange}
                onPaste={handlePaste}
                maxLength={3000}
                placeholder={PLACEHOLDER}
                className="w-full min-h-[280px] lg:min-h-[320px] p-6 text-[15px] leading-relaxed text-[#1A1A1A] bg-white resize-none outline-none placeholder:text-[#B0B0B0]"
                  />
                  <div className="flex justify-end px-6 pb-4 bg-white">
                    <span className={`text-sm font-medium ${charCountColor}`}>
                      {len.toLocaleString()}/3,000
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-[#B0B0B0]">메모, 카톡 대화, 검색 기록 등을 자유롭게 붙여넣어 주세요 (최소 10자 이상)</p>
              </div>

          {/* AI 태그 섹션 */}
              <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 lg:p-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-[#F3F1FE] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3L14.5 8.5L21 9.5L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9.5L9.5 8.5L12 3Z" stroke="#534AB7" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm text-[#666] font-medium">
                AI가 이런 정보도 함께 정리해요
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {AI_TAGS.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#E8E8E8] rounded-full text-sm text-[#333] bg-white hover:border-[#534AB7] hover:bg-[#F9F8FF] transition-colors cursor-default"
                >
                  <span className="text-[#888]">
                    <TagIcon type={tag.icon} />
                  </span>
                  {tag.label}
                </span>
              ))}
            </div>
          </div>

          {/* 입력 팁 섹션 */}
              <div className="bg-[#F3F1FE] rounded-2xl border border-[#E8E6F5] p-6 lg:p-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-[#534AB7] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21C9 21 9 15 12 15C15 15 15 21 15 21M12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-semibold text-[#3D3592]">입력 팁</span>
            </div>
            <ul className="space-y-2.5">
              {INPUT_TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#534AB7]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#534AB7] mt-2 shrink-0" />
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

              {/* 다음 단계 버튼 - 모바일용 */}
              <div className="lg:hidden mt-6 flex items-center justify-between">
                <Link
                  href="/onboarding"
                  className="px-6 py-3 rounded-lg border border-[#E0E0E0] bg-white text-[#666] text-[15px] font-medium hover:bg-[#F5F5F5] transition-colors no-underline flex items-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  이전
                </Link>
                <Link
                  href="/places"
                  className={`px-8 py-3 rounded-lg text-[15px] font-semibold transition-all no-underline flex items-center gap-2 ${isValid
                      ? "bg-[#534AB7] text-white hover:bg-[#4840A0] shadow-md shadow-[#534AB7]/20"
                      : "bg-[#E8E8E8] text-[#999] cursor-not-allowed pointer-events-none"
                    }`}
                >
                  다음
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* 오른쪽: 요약 사이드바 (1/3) */}
            <div className="lg:col-span-1">
              <div className="sticky top-36">
                {/* 여행 요약 카드 */}
                <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 lg:p-8">
                  <h3 className="text-lg font-semibold text-[#1A1A1A] mb-5">여행 요약</h3>

                  <div className="space-y-4">
                    {/* 여행지 */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path
                            d="M9 9.75C10.0355 9.75 10.875 8.91053 10.875 7.875C10.875 6.83947 10.0355 6 9 6C7.96447 6 7.125 6.83947 7.125 7.875C7.125 8.91053 7.96447 9.75 9 9.75Z"
                            stroke="#666"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M9 16.5C9 16.5 14.25 12.375 14.25 7.875C14.25 4.97657 11.8984 2.625 9 2.625C6.10157 2.625 3.75 4.97657 3.75 7.875C3.75 12.375 9 16.5 9 16.5Z"
                            stroke="#666"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-[#999] mb-1">여행지</p>
                        <p className="text-base font-medium text-[#1A1A1A]">오사카, 교토, 나라</p>
                      </div>
                    </div>

                    {/* 일정 */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <rect x="2.25" y="3.375" width="13.5" height="12.375" rx="2" stroke="#666" strokeWidth="1.5" />
                          <path d="M5.625 1.125V4.5M12.375 1.125V4.5M2.25 7.875H15.75" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-[#999] mb-1">일정</p>
                        <p className="text-base font-medium text-[#1A1A1A]">5월 10일 ~ 5월 14일 (4박 5일)</p>
                      </div>
                    </div>

                    {/* 동행자 */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <circle cx="9" cy="6" r="3" stroke="#666" strokeWidth="1.5" />
                          <path d="M3 15.75C3 12.4363 5.68629 9.75 9 9.75C12.3137 9.75 15 12.4363 15 15.75" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-[#999] mb-1">동행자</p>
                        <p className="text-base font-medium text-[#1A1A1A]">2명</p>
                      </div>
                    </div>

                    {/* 공항 / 시간 정보 */}
                    {flights.some(f => f.airport || f.flightNumber || f.time) && (
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M21 16V8C21 7.44772 20.5523 7 20 7H17L14 3H10L7 7H4C3.44772 7 3 7.44772 3 8V16C3 16.5523 3.44772 17 4 17H20C20.5523 17 21 16.5523 21 16Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-[#999] mb-1">공항 / 시간</p>
                          <div className="space-y-1">
                            {flights.filter(f => f.airport || f.time).map(f => (
                              <p key={f.id} className="text-sm text-[#1A1A1A]">
                                <span className={`text-xs mr-1 ${f.type === 'departure' ? 'text-[#1D4ED8]' : 'text-[#DC2626]'}`}>
                                  {f.type === 'departure' ? '출발' : '도착'}
                                </span>
                                {[f.airport, f.time].filter(Boolean).join(" · ")}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 숙박 정보 */}
                    {accommodations.some(a => a.name || a.location) && (
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M3 21H21M4 21V10L12 3L20 10V21M9 21V14H15V21" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-[#999] mb-1">숙소</p>
                          <div className="space-y-1">
                            {accommodations.filter(a => a.name).map(a => (
                              <p key={a.id} className="text-sm text-[#1A1A1A]">{a.name}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 입력된 내용 */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M14 3V7C14 7.55228 14.4477 8 15 8H19" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H14L19 8V19C19 20.1046 18.1046 21 17 21Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9 13H15M9 17H13" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-[#999] mb-1">입력된 내용</p>
                        <p className="text-base font-medium text-[#1A1A1A]">
                          {len > 0 ? `${len.toLocaleString()}자` : '-'}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* 구분선 */}
                  <div className="h-px bg-[#EBEBEB] my-6" />

                  {/* 진행 상태 */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#999]">입력 완료도</span>
                      <span className="text-sm font-medium text-[#534AB7]">{isValid ? '준비 완료' : '최소 10자 이상 입력'}</span>
                    </div>
                    <div className="h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#534AB7] rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((len / 10) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* 이전/다음 버튼 */}
                  <div className="space-y-3">
                    <Link
                      href="/places"
                      className={`block w-full py-4 rounded-xl border-none text-base font-semibold text-center transition-all no-underline ${
                        isValid
                          ? "bg-[#534AB7] text-white cursor-pointer shadow-[0_4px_12px_rgba(83,74,183,0.3)] hover:bg-[#4a42a5] active:scale-[0.98]"
                          : "bg-[#E0E0E0] text-[#999] cursor-default pointer-events-none"
                      }`}
                    >
                      다음 단계로
                    </Link>
                    <Link
                      href="/onboarding"
                      className="block w-full py-3 rounded-xl border border-[#E0E0E0] bg-white text-[#666] text-sm font-medium text-center hover:bg-[#F8F8F8] transition-colors no-underline"
                    >
                      이전 단계
                    </Link>
                  </div>

                  {!isValid && <p className="mt-3 text-xs text-[#B0B0B0] text-center">여행 정보를 10자 이상 입력하면 다음 단계로 진행할 수 있어요</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 토스트 */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
}
