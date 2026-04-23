"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// 진행 단계 정의
export const STEPS = [
  { id: 1, label: "온보딩", path: "/onboarding" },
  { id: 2, label: "덤프", path: "/dump" },
  { id: 3, label: "정리", path: "/organize" },
  { id: 4, label: "배치", path: "/arrange" },
  { id: 5, label: "확정", path: "/" },
];

// 메인 헤더 컴포넌트
export function MainHeader() {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-[#EBEBEB] px-8 lg:px-12 flex items-center justify-between sticky top-0 z-50">
      {/* 로고 */}
      <Link href="/" className="flex items-center gap-3 no-underline">
        <div className="w-10 h-10 rounded-xl bg-[#534AB7] flex items-center justify-center shadow-sm">
          <span className="text-white text-lg font-bold">T</span>
        </div>
        <span className="text-xl font-bold text-[#1A1A1A]">TripKey</span>
      </Link>

      {/* 프로필 영역 */}
      <div ref={profileRef} className="relative">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-[#534AB7] transition-colors cursor-pointer bg-gradient-to-br from-[#534AB7] to-[#7C6DD8] flex items-center justify-center"
        >
          <span className="text-white text-sm font-semibold">KY</span>
        </button>

        {profileOpen && (
          <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[#EBEBEB] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 border-b border-[#F0F0F0]">
              <p className="text-sm font-semibold text-[#1A1A1A]">김여행</p>
              <p className="text-xs text-[#888] mt-0.5">trip@example.com</p>
            </div>
            <div className="py-1">
              <button className="w-full px-4 py-2.5 text-left text-sm text-[#333] hover:bg-[#F8F8F8] transition-colors flex items-center gap-3 border-none bg-transparent cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="#666" strokeWidth="1.5" />
                  <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                마이페이지
              </button>
              <button className="w-full px-4 py-2.5 text-left text-sm text-[#333] hover:bg-[#F8F8F8] transition-colors flex items-center gap-3 border-none bg-transparent cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke="#666" strokeWidth="1.5" />
                  <path d="M9 9H15M9 13H12" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                내 여행 목록
              </button>
              <button className="w-full px-4 py-2.5 text-left text-sm text-[#333] hover:bg-[#F8F8F8] transition-colors flex items-center gap-3 border-none bg-transparent cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" stroke="#666" strokeWidth="1.5" />
                  <path d="M12 2V4M12 20V22M2 12H4M20 12H22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                설정
              </button>
            </div>
            <div className="border-t border-[#F0F0F0] py-1">
              <button className="w-full px-4 py-2.5 text-left text-sm text-[#E53E3E] hover:bg-[#FFF5F5] transition-colors flex items-center gap-3 border-none bg-transparent cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="#E53E3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                로그아웃
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// 서브 헤더 컴포넌트
interface SubHeaderProps {
  currentStep: number;
  tripInfo?: {
    destinations: string[]; // 여러 지역 지원
    travelers: number;
    startDate: string;
    endDate: string;
  };
  rightButtons?: React.ReactNode;
  destinationFilter?: {
    activeDestination: string | null;
    onSelectDestination: (destination: string | null) => void;
  };
}

// 여러 지역 표시 컴포넌트
function DestinationDisplay({
  destinations,
  destinationFilter,
}: {
  destinations: string[];
  destinationFilter?: SubHeaderProps["destinationFilter"];
}) {
  const [isHovered, setIsHovered] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsHovered(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // 가나다순 정렬
  const sortedDestinations = [...destinations].sort((a, b) => a.localeCompare(b, 'ko'));
  const firstDestination = destinationFilter?.activeDestination ?? sortedDestinations[0];
  const remainingCount = sortedDestinations.length - 1;
  const isFiltered = Boolean(destinationFilter?.activeDestination);

  return (
    <div 
      ref={wrapperRef}
      className="relative flex items-center gap-1.5"
    >
      <button
        onClick={() => setIsHovered((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-lg px-1.5 py-1 transition-colors hover:bg-[#F8F8F8]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#666] shrink-0">
          <path d="M12 12.5C13.1046 12.5 14 11.6046 14 10.5C14 9.39543 13.1046 8.5 12 8.5C10.8954 8.5 10 9.39543 10 10.5C10 11.6046 10.8954 12.5 12 12.5Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 21C12 21 18 15.5 18 10.5C18 7.18629 15.3137 4.5 12 4.5C8.68629 4.5 6 7.18629 6 10.5C6 15.5 12 21 12 21Z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span className="font-medium text-sm text-[#666]">{firstDestination}</span>
        {sortedDestinations.length > 1 && (
          <span
            className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${
              isFiltered ? "bg-[#534AB7] text-white" : "bg-[#F3F1FE] text-[#534AB7]"
            }`}
          >
            {isFiltered ? "필터됨" : `+${remainingCount}`}
          </span>
        )}
      </button>
      
      {/* 호버 시 전체 지역 목록 표시 */}
      {isHovered && sortedDestinations.length > 1 && (
        <div className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[#EBEBEB] py-2 z-50 min-w-[160px] animate-in fade-in slide-in-from-top-2 duration-150">
          <p className="px-3 py-1.5 text-xs text-[#999] font-medium">지역 필터</p>
          {destinationFilter && (
            <button
              onClick={() => {
                destinationFilter.onSelectDestination(null);
                setIsHovered(false);
              }}
              className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                destinationFilter.activeDestination === null
                  ? "bg-[#F3F1FE] text-[#534AB7]"
                  : "text-[#333] hover:bg-[#F9F9F9]"
              }`}
            >
              전체 보기
            </button>
          )}
          {sortedDestinations.map((dest, idx) => (
            <button
              key={idx} 
              onClick={() => {
                destinationFilter?.onSelectDestination(dest);
                setIsHovered(false);
              }}
              className={`w-full px-3 py-2 flex items-center gap-2 text-sm text-left transition-colors ${
                destinationFilter?.activeDestination === dest
                  ? "bg-[#F3F1FE] text-[#534AB7]"
                  : "text-[#333] hover:bg-[#F9F9F9]"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#534AB7]">
                <path d="M12 12.5C13.1046 12.5 14 11.6046 14 10.5C14 9.39543 13.1046 8.5 12 8.5C10.8954 8.5 10 9.39543 10 10.5C10 11.6046 10.8954 12.5 12 12.5Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 21C12 21 18 15.5 18 10.5C18 7.18629 15.3137 4.5 12 4.5C8.68629 4.5 6 7.18629 6 10.5C6 15.5 12 21 12 21Z" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              {dest}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function SubHeader({ currentStep, tripInfo, rightButtons, destinationFilter }: SubHeaderProps) {
  return (
    <div className="h-14 bg-white border-b border-[#EBEBEB] px-8 lg:px-12 flex items-center justify-between sticky top-16 z-40">
      {/* 왼쪽: 여행 정보 (tripInfo가 있을 때만 표시) */}
      <div className="flex items-center gap-4 min-w-[280px]">
        {tripInfo ? (
          <>
            <DestinationDisplay destinations={tripInfo.destinations} destinationFilter={destinationFilter} />
            <div className="w-px h-4 bg-[#E0E0E0]" />
            <div className="flex items-center gap-1.5 text-sm text-[#666]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 20C6 16.6863 8.68629 14 12 14C15.3137 14 18 16.6863 18 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>{tripInfo.travelers}인</span>
            </div>
            <div className="w-px h-4 bg-[#E0E0E0]" />
            <div className="flex items-center gap-1.5 text-sm text-[#666]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 9H21M7 3V5M17 3V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>{tripInfo.startDate} ~ {tripInfo.endDate}</span>
            </div>
          </>
        ) : (
          <span className="text-sm text-[#999]">새 여행 만들기</span>
        )}
      </div>

      {/* 중앙: 단계 표시 */}
      <div className="flex items-center gap-1">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <Link
              href={step.path}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors no-underline ${
                step.id < currentStep
                  ? "text-[#534AB7] hover:bg-[#F3F1FE]"
                  : step.id === currentStep
                    ? "bg-[#534AB7] text-white"
                    : "text-[#888] hover:bg-[#F5F5F5]"
              }`}
            >
              {step.id < currentStep && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {step.label}
            </Link>
            {index < STEPS.length - 1 && (
              <div className={`w-8 h-px mx-1 ${step.id < currentStep ? "bg-[#534AB7]" : "bg-[#E0E0E0]"}`} />
            )}
          </div>
        ))}
      </div>

      {/* 오른쪽: 버튼 영역 */}
      <div className="flex items-center gap-3 min-w-[200px] justify-end">
        {rightButtons}
      </div>
    </div>
  );
}
