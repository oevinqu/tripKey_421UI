"use client";

import { useState, useRef, useEffect } from "react";
import { MainHeader, SubHeader } from "@/components/header";

const CITIES = [
  { name: "도쿄", country: "일본", popular: true },
  { name: "오사카", country: "일본", popular: true },
  { name: "교토", country: "일본", popular: true },
  { name: "후쿠오카", country: "일본", popular: false },
  { name: "삿포로", country: "일본", popular: false },
  { name: "방콕", country: "태국", popular: true },
  { name: "치앙마이", country: "태국", popular: false },
  { name: "푸켓", country: "태국", popular: false },
  { name: "싱가포르", country: "싱가포르", popular: true },
  { name: "다낭", country: "베트남", popular: true },
  { name: "호치민", country: "베트남", popular: false },
  { name: "하노이", country: "베트남", popular: false },
  { name: "파리", country: "프랑스", popular: true },
  { name: "런던", country: "영국", popular: true },
  { name: "바르셀로나", country: "스페인", popular: false },
  { name: "로마", country: "이탈리아", popular: false },
  { name: "뉴욕", country: "미국", popular: true },
  { name: "LA", country: "미국", popular: false },
  { name: "하와이", country: "미국", popular: false },
  { name: "발리", country: "인도네시아", popular: true },
  { name: "세부", country: "필리핀", popular: false },
  { name: "타이베이", country: "대만", popular: true },
];

const POPULAR = CITIES.filter((c) => c.popular);

const MONTHS = [
  { value: 1, label: "1월" },
  { value: 2, label: "2월" },
  { value: 3, label: "3월" },
  { value: 4, label: "4월" },
  { value: 5, label: "5월" },
  { value: 6, label: "6월" },
  { value: 7, label: "7월" },
  { value: 8, label: "8월" },
  { value: 9, label: "9월" },
  { value: 10, label: "10월" },
  { value: 11, label: "11월" },
  { value: 12, label: "12월" },
];

interface StepperProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit: string;
  required?: boolean;
  hint?: string;
}

function Stepper({ label, value, onChange, min, max, unit, required, hint }: StepperProps) {
  return (
    <div className="flex-1">
      <label className="block text-sm font-medium text-[#6B6B6B] mb-2.5">
        {label}
        {required && <span className="text-[#E24B4A] ml-0.5">*</span>}
      </label>
      <div className="border border-[#E0E0E0] rounded-xl py-2 flex items-center justify-between bg-white">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className={`w-12 h-12 border-none bg-transparent text-xl ${
            value <= min ? "text-[#D5D5D5] cursor-default" : "text-[#888] cursor-pointer hover:text-[#534AB7]"
          }`}
        >
          -
        </button>
        <div className="text-center min-w-[80px]">
          <span className="text-3xl font-medium text-[#1A1A1A]">{value}</span>
          <span className="text-sm text-[#999] ml-1">{unit}</span>
        </div>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className={`w-12 h-12 border-none bg-transparent text-xl ${
            value >= max ? "text-[#D5D5D5] cursor-default" : "text-[#888] cursor-pointer hover:text-[#534AB7]"
          }`}
        >
          +
        </button>
      </div>
      {hint && <p className="mt-2 text-xs text-[#B0B0B0]">{hint}</p>}
    </div>
  );
}

interface ToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-[#FAFAFA] transition-colors">
      <div>
        <p className="m-0 text-sm text-[#1A1A1A]">{label}</p>
        <p className="mt-0.5 text-xs text-[#B0B0B0]">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-7 rounded-full border-none relative cursor-pointer flex-shrink-0 transition-colors duration-200 ${
          checked ? "bg-[#534AB7]" : "bg-[#D5D5D5]"
        }`}
      >
        <div
          className={`w-6 h-6 rounded-full bg-white absolute top-0.5 transition-[left] duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.12)] ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

interface ChipProps {
  children: React.ReactNode;
  onRemove: () => void;
}

function Chip({ children, onRemove }: ChipProps) {
  return (
    <span className="inline-flex items-center gap-2 bg-[#EDE9FC] text-[#534AB7] text-sm font-medium py-1.5 pl-4 pr-2.5 rounded-full">
      {children}
      <button
        onClick={onRemove}
        className="bg-[rgba(83,74,183,0.15)] border-none text-[#534AB7] w-5 h-5 rounded-full flex items-center justify-center cursor-pointer text-sm leading-none p-0 hover:bg-[rgba(83,74,183,0.25)] transition-colors"
      >
        &times;
      </button>
    </span>
  );
}

// 달력 컴포넌트
interface CalendarProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateSelect: (date: Date) => void;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

function Calendar({ startDate, endDate, onDateSelect, currentMonth, onMonthChange }: CalendarProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isInRange = (day: number) => {
    if (!startDate || !endDate || !day) return false;
    const date = new Date(year, month, day);
    return date > startDate && date < endDate;
  };

  const isStart = (day: number) => {
    if (!startDate || !day) return false;
    const date = new Date(year, month, day);
    return date.getTime() === startDate.getTime();
  };

  const isEnd = (day: number) => {
    if (!endDate || !day) return false;
    const date = new Date(year, month, day);
    return date.getTime() === endDate.getTime();
  };

  const isPast = (day: number) => {
    if (!day) return false;
    const date = new Date(year, month, day);
    return date < today;
  };

  const prevMonth = () => {
    onMonthChange(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    onMonthChange(new Date(year, month + 1, 1));
  };

  const canGoPrev = new Date(year, month, 1) > today;

  return (
    <div className="bg-white">
      {/* 달력 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className={`w-10 h-10 rounded-lg flex items-center justify-center border-none ${
            canGoPrev ? "bg-[#F5F5F5] text-[#666] cursor-pointer hover:bg-[#EBEBEB]" : "bg-transparent text-[#D5D5D5] cursor-default"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="text-lg font-semibold text-[#1A1A1A]">
          {year}년 {month + 1}월
        </span>
        <button
          onClick={nextMonth}
          className="w-10 h-10 rounded-lg flex items-center justify-center border-none bg-[#F5F5F5] text-[#666] cursor-pointer hover:bg-[#EBEBEB]"
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-3">
        {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
          <div key={d} className={`text-center text-sm font-medium py-2 ${i === 0 ? "text-[#E24B4A]" : i === 6 ? "text-[#534AB7]" : "text-[#999]"}`}>
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={idx} className="h-11" />;
          }

          const dayOfWeek = idx % 7;
          const isStartDate = isStart(day);
          const isEndDate = isEnd(day);
          const inRange = isInRange(day);
          const past = isPast(day);

          return (
            <div
              key={idx}
              className={`relative h-11 flex items-center justify-center ${inRange ? "bg-[#F3F1FE]" : ""} ${isStartDate ? "rounded-l-full bg-[#F3F1FE]" : ""} ${isEndDate ? "rounded-r-full bg-[#F3F1FE]" : ""}`}
            >
              <button
                onClick={() => !past && onDateSelect(new Date(year, month, day))}
                disabled={past}
                className={`w-11 h-11 rounded-full flex items-center justify-center text-[15px] border-none transition-colors ${
                  isStartDate || isEndDate
                    ? "bg-[#534AB7] text-white font-medium cursor-pointer"
                    : past
                      ? "bg-transparent text-[#D5D5D5] cursor-default"
                      : dayOfWeek === 0
                        ? "bg-transparent text-[#E24B4A] cursor-pointer hover:bg-[#F5F5F5]"
                        : dayOfWeek === 6
                          ? "bg-transparent text-[#534AB7] cursor-pointer hover:bg-[#F5F5F5]"
                          : "bg-transparent text-[#1A1A1A] cursor-pointer hover:bg-[#F5F5F5]"
                }`}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 월 선택 컴포넌트
interface MonthSelectorProps {
  selectedMonths: number[];
  onMonthToggle: (month: number) => void;
  year: number;
  onYearChange: (year: number) => void;
}

function MonthSelector({ selectedMonths, onMonthToggle, year, onYearChange }: MonthSelectorProps) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="bg-white">
      {/* 연도 선택 */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => onYearChange(year - 1)}
          disabled={year <= currentYear}
          className={`w-10 h-10 rounded-lg flex items-center justify-center border-none ${
            year > currentYear ? "bg-[#F5F5F5] text-[#666] cursor-pointer hover:bg-[#EBEBEB]" : "bg-transparent text-[#D5D5D5] cursor-default"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="text-lg font-semibold text-[#1A1A1A]">{year}년</span>
        <button
          onClick={() => onYearChange(year + 1)}
          className="w-10 h-10 rounded-lg flex items-center justify-center border-none bg-[#F5F5F5] text-[#666] cursor-pointer hover:bg-[#EBEBEB]"
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* 월 그리드 */}
      <div className="grid grid-cols-4 gap-3">
        {MONTHS.map((m) => {
          const isPast = year === currentYear && m.value < currentMonth;
          const isSelected = selectedMonths.includes(m.value);

          return (
            <button
              key={m.value}
              onClick={() => !isPast && onMonthToggle(m.value)}
              disabled={isPast}
              className={`py-4 px-3 rounded-xl text-[15px] font-medium border-2 transition-all ${
                isSelected
                  ? "bg-[#534AB7] text-white border-[#534AB7] shadow-sm"
                  : isPast
                    ? "bg-[#F8F8F8] text-[#D5D5D5] border-transparent cursor-default"
                    : "bg-white text-[#1A1A1A] border-[#E0E0E0] cursor-pointer hover:border-[#534AB7] hover:bg-[#F8F7FE]"
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type DateMode = "exact" | "flexible";

export default function OnboardingPage() {
  const [tripName, setTripName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [showDrop, setShowDrop] = useState(false);
  const [companions, setCompanions] = useState(1);
  const [flightBooked, setFlightBooked] = useState(false);
  const [hotelBooked, setHotelBooked] = useState(false);
  const [apiFail, setApiFail] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // 날짜 선택 모드
  const [dateMode, setDateMode] = useState<DateMode>("exact");

  // 정확한 날짜 모드
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 유연한 날짜 모드
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [flexibleNights, setFlexibleNights] = useState(3);

  const filtered = CITIES.filter((c) => (c.name.includes(search) || c.country.includes(search)) && !selected.includes(c.name));
  const noResult = search.length > 0 && filtered.length === 0;
  const list = search.length > 0 ? filtered : CITIES.filter((c) => !selected.includes(c.name));

  // 날짜 계산
  const calculateDays = () => {
    if (dateMode === "exact" && startDate && endDate) {
      const diff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      return diff + 1;
    }
    if (dateMode === "flexible" && selectedMonths.length > 0) {
      return flexibleNights + 1;
    }
    return 0;
  };

  const days = calculateDays();
  const nights = days > 0 ? days - 1 : 0;

  // 유효성 검사
  const isDateValid = dateMode === "exact" ? startDate !== null && endDate !== null : selectedMonths.length > 0 && flexibleNights > 0;

  const isValid = selected.length > 0 && isDateValid;

  // 날짜 선택 핸들러
  const handleDateSelect = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else {
      if (date < startDate) {
        setStartDate(date);
        setEndDate(null);
      } else {
        setEndDate(date);
      }
    }
  };

  // 월 토글 핸들러
  const handleMonthToggle = (month: number) => {
    if (selectedMonths.includes(month)) {
      setSelectedMonths(selectedMonths.filter((m) => m !== month));
    } else {
      setSelectedMonths([...selectedMonths, month]);
    }
  };

  // 날짜 표시 텍스트
  const getDateDisplayText = () => {
    if (dateMode === "exact") {
      if (startDate && endDate) {
        const format = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
        return `${format(startDate)} ~ ${format(endDate)} (${nights}박 ${days}일)`;
      }
      if (startDate) {
        return "종료일을 선택하세요";
      }
      return "날짜를 선택하세요";
    } else {
      if (selectedMonths.length > 0) {
        const sortedMonths = [...selectedMonths].sort((a, b) => a - b);
        const monthText = sortedMonths.map((m) => `${m}월`).join(", ");
        return `${selectedYear}년 ${monthText} / ${flexibleNights}박 ${flexibleNights + 1}일`;
      }
      return "여행 월을 선택하세요";
    }
  };

  // 초기화 핸들러
  const handleReset = () => {
    setTripName("");
    setSelected([]);
    setStartDate(null);
    setEndDate(null);
    setSelectedMonths([]);
    setFlexibleNights(3);
    setCompanions(1);
    setFlightBooked(false);
    setHotelBooked(false);
  };

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setShowDrop(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F3] font-sans flex flex-col">
      {/* 메인 헤더 */}
      <MainHeader />

      {/* 서브 헤더 - 온보딩은 tripInfo 없음 */}
      <SubHeader
        currentStep={1}
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
                <h1 className="text-2xl font-semibold text-[#1A1A1A]">여행 기본 정보</h1>
                <p className="mt-2 text-base text-[#888]">어디로, 얼마나, 누구와 떠나시나요?</p>
              </div>

              {/* 여행 이름 입력 */}
              <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 lg:p-8">
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">
                    여행 이름
                  </label>
                  <input
                    type="text"
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    placeholder="예: 2024 도쿄 가족여행"
                    className="w-full border border-[#E0E0E0] rounded-xl py-3 px-4 text-base text-[#1A1A1A] bg-white hover:border-[#C0C0C0] focus:border-[#534AB7] focus:outline-none transition-colors placeholder:text-[#999]"
                  />
                  <p className="mt-2 text-xs text-[#B0B0B0]">여행을 구분할 수 있는 이름을 자유롭게 입력하세요</p>
                </div>
              </div>

              {/* 여행지 선택 카드 */}
              <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 lg:p-8">
                <div ref={wrapRef} className="relative">
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">
                    여행지 <span className="text-[#E24B4A]">*</span>
                  </label>
                  <div
                    onClick={() => {
                      inputRef.current?.focus();
                      setShowDrop(true);
                    }}
                    className="border border-[#E0E0E0] rounded-xl py-3 px-4 flex items-center gap-2 flex-wrap min-h-14 cursor-text bg-white hover:border-[#C0C0C0] transition-colors"
                  >
                    {selected.map((c) => (
                      <Chip key={c} onRemove={() => setSelected(selected.filter((x) => x !== c))}>
                        {c}
                      </Chip>
                    ))}
                    <input
                      ref={inputRef}
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setShowDrop(true);
                      }}
                      onFocus={() => setShowDrop(true)}
                      placeholder={selected.length === 0 ? "도시명을 검색하세요" : "도시 추가..."}
                      className="border-none outline-none text-base text-[#1A1A1A] flex-1 min-w-[140px] bg-transparent placeholder:text-[#999]"
                    />
                  </div>
                  <p className="mt-2 text-xs text-[#B0B0B0]">복수 선택 가능 / 1개 이상 필수</p>

                  {showDrop && (
                    <div className="absolute top-[calc(100%-20px)] left-0 right-0 bg-white border border-[#E0E0E0] rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.1)] z-10 max-h-[320px] overflow-y-auto">
                      {noResult && !apiFail && (
                        <div className="py-6 px-5 text-center">
                          <p className="m-0 text-sm text-[#999]">검색 결과가 없어요</p>
                          <p className="mt-1.5 text-xs text-[#B0B0B0]">다른 도시명으로 검색해보세요</p>
                        </div>
                      )}

                      {apiFail && (
                        <div>
                          <div className="py-3 px-5 bg-[#FFF8F0] border-b border-[#F0F0F0]">
                            <span className="text-sm text-[#BA7517]">검색이 일시적으로 안 돼요. 인기 여행지에서 골라보세요</span>
                          </div>
                          {POPULAR.filter((c) => !selected.includes(c.name)).map((c) => (
                            <div
                              key={c.name}
                              onMouseDown={() => {
                                setSelected([...selected, c.name]);
                                setSearch("");
                              }}
                              className="py-3.5 px-5 text-base text-[#333] cursor-pointer border-b border-[#F8F8F8] flex justify-between hover:bg-[#F8F8F8] transition-colors"
                            >
                              <span>{c.name}</span>
                              <span className="text-sm text-[#B0B0B0]">{c.country}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {!noResult && !apiFail && list.length > 0 && (
                        <>
                          {search.length === 0 && <div className="py-2.5 px-5 text-xs text-[#B0B0B0] font-medium bg-[#FAFAFA]">전체 여행지</div>}
                          {list.slice(0, 10).map((c) => (
                            <div
                              key={c.name}
                              onMouseDown={() => {
                                setSelected([...selected, c.name]);
                                setSearch("");
                              }}
                              className="py-3.5 px-5 text-base text-[#333] cursor-pointer border-b border-[#F8F8F8] flex justify-between items-center hover:bg-[#F8F8F8] transition-colors"
                            >
                              <span>{c.name}</span>
                              <span className="text-sm text-[#B0B0B0]">{c.country}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 여행 일정 카드 */}
              <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 lg:p-8">
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-4">
                  여행 일정 <span className="text-[#E24B4A]">*</span>
                </label>

                {/* 모드 선택 탭 */}
                <div className="flex bg-[#F5F5F5] rounded-xl p-1.5 mb-6">
                  <button
                    onClick={() => setDateMode("exact")}
                    className={`flex-1 py-3 px-5 rounded-lg text-sm font-medium border-none cursor-pointer transition-all ${
                      dateMode === "exact" ? "bg-white text-[#1A1A1A] shadow-sm" : "bg-transparent text-[#888] hover:text-[#666]"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2.5">
                      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                        <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M5 1V4M11 1V4M2 7H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      정확한 날짜
                    </span>
                  </button>
                  <button
                    onClick={() => setDateMode("flexible")}
                    className={`flex-1 py-3 px-5 rounded-lg text-sm font-medium border-none cursor-pointer transition-all ${
                      dateMode === "flexible" ? "bg-white text-[#1A1A1A] shadow-sm" : "bg-transparent text-[#888] hover:text-[#666]"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2.5">
                      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                        <path d="M8 3V8L11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      유연한 날짜
                    </span>
                  </button>
                </div>

                {/* 정확한 날짜 모드 */}
                {dateMode === "exact" && (
                  <div className="border border-[#E0E0E0] rounded-xl p-5">
                    <Calendar startDate={startDate} endDate={endDate} onDateSelect={handleDateSelect} currentMonth={currentMonth} onMonthChange={setCurrentMonth} />

                    {/* 선택된 날짜 표시 */}
                    <div className="mt-5 pt-5 border-t border-[#F0F0F0]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-xs text-[#999] mb-1.5">출발</p>
                            <p className={`text-lg font-medium ${startDate ? "text-[#1A1A1A]" : "text-[#D5D5D5]"}`}>
                              {startDate ? `${startDate.getMonth() + 1}월 ${startDate.getDate()}일` : "-"}
                            </p>
                          </div>
                          <div className="text-[#D5D5D5] text-xl">→</div>
                          <div className="text-center">
                            <p className="text-xs text-[#999] mb-1.5">도착</p>
                            <p className={`text-lg font-medium ${endDate ? "text-[#1A1A1A]" : "text-[#D5D5D5]"}`}>
                              {endDate ? `${endDate.getMonth() + 1}월 ${endDate.getDate()}일` : "-"}
                            </p>
                          </div>
                        </div>
                        {startDate && endDate && (
                          <div className="bg-[#F3F1FE] text-[#534AB7] py-2 px-4 rounded-full text-base font-semibold">
                            {nights}박 {days}일
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 유연한 날짜 모드 */}
                {dateMode === "flexible" && (
                  <div className="border border-[#E0E0E0] rounded-xl p-5">
                    <MonthSelector selectedMonths={selectedMonths} onMonthToggle={handleMonthToggle} year={selectedYear} onYearChange={setSelectedYear} />

                    {/* 박 수 선택 */}
                    <div className="mt-5 pt-5 border-t border-[#F0F0F0]">
                      <p className="text-sm font-medium text-[#1A1A1A] mb-4">며칠 동안 여행하시나요?</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        {[2, 3, 4, 5, 6, 7].map((n) => (
                          <button
                            key={n}
                            onClick={() => setFlexibleNights(n)}
                            className={`py-2.5 px-5 rounded-xl text-sm font-medium border-2 transition-all ${
                              flexibleNights === n
                                ? "bg-[#534AB7] text-white border-[#534AB7]"
                                : "bg-white text-[#1A1A1A] border-[#E0E0E0] cursor-pointer hover:border-[#534AB7]"
                            }`}
                          >
                            {n}박 {n + 1}일
                          </button>
                        ))}
                      </div>

                      {/* 직접 입력 */}
                      <div className="mt-4 flex items-center gap-3">
                        <span className="text-sm text-[#999]">또는 직접 입력:</span>
                        <div className="flex items-center border border-[#E0E0E0] rounded-xl overflow-hidden">
                          <button
                            onClick={() => setFlexibleNights(Math.max(1, flexibleNights - 1))}
                            className="w-10 h-10 border-none bg-[#F8F8F8] text-[#888] cursor-pointer hover:bg-[#F0F0F0] text-lg"
                          >
                            -
                          </button>
                          <span className="w-16 text-center text-base font-medium text-[#1A1A1A]">{flexibleNights}박</span>
                          <button
                            onClick={() => setFlexibleNights(Math.min(30, flexibleNights + 1))}
                            className="w-10 h-10 border-none bg-[#F8F8F8] text-[#888] cursor-pointer hover:bg-[#F0F0F0] text-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 선택 요약 */}
                    {selectedMonths.length > 0 && (
                      <div className="mt-5 bg-[#F8F7FE] rounded-xl p-4 flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#EDE9FC] flex items-center justify-center text-sm text-[#534AB7] flex-shrink-0 mt-0.5">i</div>
                        <p className="text-sm text-[#534AB7] leading-relaxed">
                          {selectedYear}년{" "}
                          {[...selectedMonths]
                            .sort((a, b) => a - b)
                            .map((m) => `${m}월`)
                            .join(", ")}{" "}
                          중 {flexibleNights}박 {flexibleNights + 1}일 여행을 계획합니다
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <p className="mt-3 text-xs text-[#B0B0B0]">{dateMode === "exact" ? "시작일과 종료일을 선택하세요" : "여행 가능한 월을 선택하세요 (복수 선택 가능)"}</p>
              </div>

              {/* 동행자 + 예약현황 카드 */}
              <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* 동행자 수 */}
                  <div>
                    <Stepper
                      label="동행자 수"
                      value={companions}
                      onChange={setCompanions}
                      min={1}
                      max={20}
                      unit="명"
                      required
                      hint={companions === 1 ? "1명 = 혼자 여행" : `${companions}명이 함께`}
                    />

                    {companions === 1 && (
                      <div className="mt-4 bg-[#F8F7FE] border border-[#EEEDFE] rounded-xl py-3 px-4 flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#EDE9FC] flex items-center justify-center text-xs text-[#534AB7] flex-shrink-0">i</div>
                        <p className="m-0 text-sm text-[#534AB7]">혼자 여행으로 설정됩니다.</p>
                      </div>
                    )}
                  </div>

                  {/* 예약 현황 */}
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A] mb-3">
                      예약 현황 <span className="text-xs font-normal text-[#B0B0B0] ml-2">선택</span>
                    </p>
                    <div className="bg-[#FAFAFA] rounded-xl">
                      <Toggle label="항공편 예약 완료" description="예약했다면 일정에 반영돼요" checked={flightBooked} onChange={setFlightBooked} />
                      <div className="h-px bg-[#EBEBEB] mx-4" />
                      <Toggle label="숙소 예약 완료" description="예약했다면 일정에 반영돼요" checked={hotelBooked} onChange={setHotelBooked} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽: 요약 사이드바 (1/3) */}
            <div className="lg:col-span-1">
              <div className="sticky top-36">
                {/* 요약 카드 */}
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
                        <p className="text-base font-medium text-[#1A1A1A]">{selected.length > 0 ? selected.join(", ") : "-"}</p>
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
                        <p className="text-base font-medium text-[#1A1A1A]">{isDateValid ? getDateDisplayText() : "-"}</p>
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
                        <p className="text-base font-medium text-[#1A1A1A]">
                          {companions}명 {companions === 1 && <span className="text-sm text-[#999]">(혼자 여행)</span>}
                        </p>
                      </div>
                    </div>

                    {/* 예약 현황 */}
                    {(flightBooked || hotelBooked) && (
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M6 9L8.25 11.25L12.75 6.75" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="9" cy="9" r="6.75" stroke="#666" strokeWidth="1.5" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-[#999] mb-1">예약 완료</p>
                          <p className="text-base font-medium text-[#1A1A1A]">{[flightBooked && "항공편", hotelBooked && "숙소"].filter(Boolean).join(", ")}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 구분선 */}
                  <div className="h-px bg-[#EBEBEB] my-6" />

                  {/* 진행 상태 */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#999]">입력 완료도</span>
                      <span className="text-sm font-medium text-[#534AB7]">{[selected.length > 0, isDateValid, companions > 0].filter(Boolean).length}/3</span>
                    </div>
                    <div className="h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#534AB7] rounded-full transition-all duration-300"
                        style={{
                          width: `${([selected.length > 0, isDateValid, companions > 0].filter(Boolean).length / 3) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* CTA 버튼 */}
                  <button
                    disabled={!isValid}
                    className={`w-full py-4 rounded-xl border-none text-base font-semibold transition-all ${
                      isValid
                        ? "bg-[#534AB7] text-white cursor-pointer shadow-[0_4px_12px_rgba(83,74,183,0.3)] hover:bg-[#4a42a5] active:scale-[0.98]"
                        : "bg-[#E0E0E0] text-[#999] cursor-default"
                    }`}
                  >
                    다음 단계로
                  </button>

                  {!isValid && <p className="mt-3 text-xs text-[#B0B0B0] text-center">여행지와 일정을 입력하면 다음 단계로 진행할 수 있어요</p>}
                </div>

                {/* 개발용 Fallback 시뮬레이션 */}
                <div className="mt-4 py-4 px-5 bg-white rounded-xl border border-dashed border-[#E0E0E0]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="m-0 text-xs font-medium text-[#999]">Fallback 시뮬레이션</p>
                      <p className="mt-0.5 text-xs text-[#C0C0C0]">API 오류 테스트</p>
                    </div>
                    <button
                      onClick={() => {
                        setApiFail(!apiFail);
                        setShowDrop(false);
                      }}
                      className={`py-1.5 px-3.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        apiFail ? "border border-[#E24B4A] bg-[#FFF5F5] text-[#E24B4A]" : "border border-[#E0E0E0] bg-white text-[#999] hover:bg-[#F8F8F8]"
                      }`}
                    >
                      {apiFail ? "API 오류 ON" : "API 정상"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
