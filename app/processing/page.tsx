"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// 진행 단계 정의 (비활성화된 상태로 표시)
const STEPS = [
  { id: 1, label: "온보딩", path: "/onboarding" },
  { id: 2, label: "덤프", path: "/dump" },
  { id: 3, label: "장소선택", path: "/places" },
  { id: 4, label: "배치", path: "/arrange" },
  { id: 5, label: "확정", path: "/" },
];

// 여행 정보
const TRIP_INFO = {
  destinations: ["오사카", "교토", "나라"],
  travelers: 2,
  startDate: "5월 10일",
  endDate: "5월 14일",
};

// AI 처리 단계
const PROCESSING_STEPS = [
  { text: "입력한 정보를 분석하고 있어요", duration: 2500 },
  { text: "장소를 지역별로 묶고 있어요", duration: 2500 },
  { text: "인사이트를 정리하고 있어요", duration: 2000 },
];

function Spinner({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="animate-spin">
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="#534AB7"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="50 20"
        opacity="0.3"
      />
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="#534AB7"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="15 55"
      />
    </svg>
  );
}

// 비활성화된 메인 헤더
function DisabledMainHeader() {
  return (
    <header className="bg-white border-b border-[#EBEBEB] px-8 lg:px-12 h-16 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#534AB7] flex items-center justify-center">
          <span className="text-white text-base font-bold">T</span>
        </div>
        <span className="text-[17px] font-semibold text-[#1A1A1A]">TripKey</span>
      </div>

      {/* 프로필 - 비활성화 */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-[#888]">분석 중...</span>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#534AB7] flex items-center justify-center opacity-50 cursor-not-allowed">
          <span className="text-white text-sm font-semibold">K</span>
        </div>
      </div>
    </header>
  );
}

// 비활성화된 서브 헤더
function DisabledSubHeader() {
  const currentStep = 2; // 덤프 단계에서 처리 중

  // 가나다순 정렬
  const sortedDestinations = [...TRIP_INFO.destinations].sort((a, b) => a.localeCompare(b, "ko"));
  const firstDestination = sortedDestinations[0];
  const remainingCount = sortedDestinations.length - 1;

  return (
    <div className="h-14 bg-white border-b border-[#EBEBEB] px-8 lg:px-12 flex items-center justify-between shrink-0">
      {/* 왼쪽: 여행 정보 */}
      <div className="flex items-center gap-4 min-w-[280px] opacity-50">
        <div className="flex items-center gap-1.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#666]">
            <path d="M12 12.5C13.1046 12.5 14 11.6046 14 10.5C14 9.39543 13.1046 8.5 12 8.5C10.8954 8.5 10 9.39543 10 10.5C10 11.6046 10.8954 12.5 12 12.5Z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 21C12 21 18 15.5 18 10.5C18 7.18629 15.3137 4.5 12 4.5C8.68629 4.5 6 7.18629 6 10.5C6 15.5 12 21 12 21Z" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span className="font-medium text-sm text-[#666]">{firstDestination}</span>
          {remainingCount > 0 && (
            <span className="px-1.5 py-0.5 bg-[#F3F1FE] text-[#534AB7] text-xs font-medium rounded-full">
              +{remainingCount}
            </span>
          )}
        </div>
        <div className="w-px h-4 bg-[#E0E0E0]" />
        <div className="flex items-center gap-1.5 text-sm text-[#666]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 20C6 16.6863 8.68629 14 12 14C15.3137 14 18 16.6863 18 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>{TRIP_INFO.travelers}인</span>
        </div>
        <div className="w-px h-4 bg-[#E0E0E0]" />
        <div className="flex items-center gap-1.5 text-sm text-[#666]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 9H21M7 3V5M17 3V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>{TRIP_INFO.startDate} ~ {TRIP_INFO.endDate}</span>
        </div>
      </div>

      {/* 중앙: 단계 표시 - 비활성화 */}
      <div className="flex items-center gap-1">
        {STEPS.map((step, idx) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium cursor-not-allowed ${
                step.id < currentStep
                  ? "text-[#534AB7] opacity-50"
                  : step.id === currentStep
                    ? "bg-[#534AB7] text-white"
                    : "text-[#B0B0B0]"
              }`}
            >
              {step.id < currentStep ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span className="w-4 text-center">{step.id}</span>
              )}
              <span>{step.label}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`w-4 lg:w-6 h-[2px] mx-0.5 ${step.id < currentStep ? "bg-[#534AB7] opacity-50" : "bg-[#E8E8E8]"}`} />
            )}
          </div>
        ))}
      </div>

      {/* 오른쪽: 버튼 영역 - 비활성화 */}
      <div className="flex items-center gap-3 min-w-[200px] justify-end">
        <span className="text-sm text-[#999]">처리가 완료될 때까지 기다려주세요</span>
      </div>
    </div>
  );
}

type Phase = "loading" | "done" | "fail_parse" | "fail_zero" | "fail_group";
type SimMode = "normal" | "fail_parse" | "fail_zero" | "fail_group";

export default function ProcessingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("loading");
  const [stepIdx, setStepIdx] = useState(0);
  const [dots, setDots] = useState("");
  const [simMode, setSimMode] = useState<SimMode>("normal");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (phase !== "loading") return;

    if (simMode === "fail_parse") {
      timerRef.current = setTimeout(() => setPhase("fail_parse"), 3000);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }
    if (simMode === "fail_zero") {
      timerRef.current = setTimeout(() => setPhase("fail_zero"), 3000);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }
    if (simMode === "fail_group") {
      timerRef.current = setTimeout(() => setPhase("fail_group"), 4000);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }

    if (stepIdx < PROCESSING_STEPS.length - 1) {
      timerRef.current = setTimeout(() => setStepIdx((i) => i + 1), PROCESSING_STEPS[stepIdx].duration);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    } else {
      timerRef.current = setTimeout(() => setPhase("done"), PROCESSING_STEPS[stepIdx].duration);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }
  }, [phase, stepIdx, simMode]);

  useEffect(() => {
    if (phase !== "loading") return;
    const iv = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 500);
    return () => clearInterval(iv);
  }, [phase]);

  // 완료 시 자동 이동
  useEffect(() => {
    if (phase === "done") {
      const timeout = setTimeout(() => {
        router.push("/places");
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [phase, router]);

  const reset = (mode: SimMode) => {
    setPhase("loading");
    setStepIdx(0);
    setDots("");
    setSimMode(mode);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col">
      {/* 비활성화된 메인 헤더 */}
      <DisabledMainHeader />

      {/* 비활성화된 서브 헤더 */}
      <DisabledSubHeader />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[560px] bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-10 lg:p-14 flex flex-col items-center text-center">
          
          {/* 로딩 상태 */}
          {phase === "loading" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 w-full">
              {/* 로고 */}
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-[#534AB7] flex items-center justify-center mx-auto mb-10 shadow-[0_8px_32px_rgba(83,74,183,0.25)]">
                <span className="text-white text-3xl lg:text-4xl font-bold">T</span>
              </div>

              {/* 스피너 */}
              <div className="mb-8">
                <Spinner size={48} />
              </div>

              {/* 단계 텍스트 */}
              <p
                key={stepIdx}
                className="m-0 text-xl lg:text-2xl font-medium text-[#1A1A1A] animate-in fade-in slide-in-from-bottom-1 duration-300 min-h-[32px]"
              >
                {PROCESSING_STEPS[stepIdx].text}
              </p>

              {/* 단계 인디케이터 */}
              <div className="flex gap-3 justify-center mt-8">
                {PROCESSING_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className="h-2.5 rounded-full transition-all duration-300"
                    style={{
                      width: i === stepIdx ? 32 : 10,
                      background: i <= stepIdx ? "#534AB7" : "#E0E0E0",
                      opacity: i === stepIdx ? 1 : i < stepIdx ? 0.5 : 0.3,
                    }}
                  />
                ))}
              </div>

              <p className="mt-10 text-sm text-[#B0B0B0]">잠시만 기다려주세요{dots}</p>
            </div>
          )}

          {/* 완료 상태 */}
          {phase === "done" && (
            <div className="animate-in zoom-in-95 duration-300 w-full">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-8">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="lg:w-11 lg:h-11">
                  <path d="M5 13l4 4L19 7" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="m-0 text-xl lg:text-2xl font-semibold text-[#1A1A1A]">분석이 완료되었어요</p>
              <p className="mt-3 text-base text-[#888]">장소선택 화면으로 이동합니다...</p>
            </div>
          )}

          {/* 파싱 전체 실패 */}
          {phase === "fail_parse" && (
            <div className="animate-in zoom-in-95 duration-300 w-full">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-[#FFEBEE] flex items-center justify-center mx-auto mb-8">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="lg:w-11 lg:h-11">
                  <path d="M12 9v4m0 4h.01" stroke="#C62828" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="10" stroke="#C62828" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <p className="m-0 text-xl lg:text-2xl font-semibold text-[#1A1A1A]">분석에 실패했어요</p>
              <p className="mt-3 text-base text-[#888]">다시 시도해주세요</p>
              <button
                onClick={() => router.push("/dump")}
                className="mt-8 px-10 py-3.5 rounded-xl border-none bg-[#534AB7] text-white text-base font-medium cursor-pointer shadow-[0_4px_16px_rgba(83,74,183,0.3)] hover:bg-[#4840a0] transition-colors"
              >
                덤프 화면으로 돌아가기
              </button>
            </div>
          )}

          {/* 장소 0개 */}
          {phase === "fail_zero" && (
            <div className="animate-in zoom-in-95 duration-300 w-full">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-[#FFF8E1] flex items-center justify-center mx-auto mb-8">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="lg:w-11 lg:h-11">
                  <path d="M12 9v4m0 4h.01" stroke="#F57F17" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#F57F17" strokeWidth="1.8" fill="none" />
                </svg>
              </div>
              <p className="m-0 text-xl lg:text-2xl font-semibold text-[#1A1A1A]">장소를 찾지 못했어요</p>
              <p className="mt-3 mb-8 text-base text-[#888] leading-relaxed">
                URL이나 링크 대신 장소명을 직접 적어주세요.<br />
                AI는 링크 내용을 읽을 수 없어요.
              </p>
              <button
                onClick={() => router.push("/dump")}
                className="px-10 py-3.5 rounded-xl border border-[#E0E0E0] bg-white text-[#666] text-base font-medium cursor-pointer hover:bg-[#F9F9F9] transition-colors"
              >
                덤프 화면으로 돌아가기
              </button>
            </div>
          )}

          {/* 그룹화 실패 */}
          {phase === "fail_group" && (
            <div className="animate-in zoom-in-95 duration-300 w-full">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-[#FFF3E0] flex items-center justify-center mx-auto mb-8">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="lg:w-11 lg:h-11">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#E65100" strokeWidth="1.8" fill="none" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#E65100" strokeWidth="1.8" fill="none" strokeDasharray="3 2" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#E65100" strokeWidth="1.8" fill="none" strokeDasharray="3 2" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="#E65100" strokeWidth="1.8" fill="none" strokeDasharray="3 2" />
                </svg>
              </div>
              <p className="m-0 text-xl lg:text-2xl font-semibold text-[#1A1A1A]">장소는 찾았지만 그룹화에 실패했어요</p>
              <p className="mt-3 text-base text-[#888] leading-relaxed">
                모든 장소가 미분류로 추가됩니다.<br />
                다음 화면에서 직접 정리할 수 있어요.
              </p>
              <button
                onClick={() => router.push("/places")}
                className="mt-8 px-10 py-3.5 rounded-xl border-none bg-[#534AB7] text-white text-base font-medium cursor-pointer shadow-[0_4px_16px_rgba(83,74,183,0.3)] hover:bg-[#4840a0] transition-colors"
              >
                장소선택 화면으로 이동
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 시뮬레이션 패널 (개발용) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-xl border border-dashed border-[#D0D0D0] px-6 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] w-full max-w-[600px] z-50">
        <p className="mb-3 text-sm font-medium text-[#666]">상태 시뮬레이션 (개발용)</p>
        <div className="flex gap-3 flex-wrap">
          {([
            { label: "정상 흐름", mode: "normal" },
            { label: "파싱 전체 실패", mode: "fail_parse" },
            { label: "장소 0개", mode: "fail_zero" },
            { label: "그룹화 실패", mode: "fail_group" },
          ] as const).map((item) => (
            <button
              key={item.mode}
              onClick={() => reset(item.mode)}
              className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                simMode === item.mode && phase === "loading"
                  ? "border border-[#534AB7] bg-[#F8F7FE] text-[#534AB7]"
                  : "border border-[#E0E0E0] bg-white text-[#888] hover:bg-[#F9F9F9]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
