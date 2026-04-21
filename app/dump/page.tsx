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

export default function DumpPage() {
  const [text, setText] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [maxReachedShown, setMaxReachedShown] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentStep = 2;

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
    textareaRef.current?.focus();
  };

  const charCountColor =
    len >= 3000 ? "text-[#DC2626]" : len >= 2700 ? "text-[#F59E0B]" : "text-[#888]";

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
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
            className="px-4 py-2 rounded-lg border border-[#E0E0E0] bg-white text-[#666] text-[13px] hover:bg-[#F5F5F5] transition-colors flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M1 4V10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3.51 15C4.15 17.54 5.85 19.61 8.17 20.68C10.5 21.75 13.2 21.73 15.5 20.64C17.8 19.55 19.49 17.48 20.13 14.96C20.77 12.44 20.31 9.76 18.87 7.57C17.44 5.38 15.14 3.87 12.55 3.45C9.96 3.03 7.32 3.73 5.28 5.38L1 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            초기화
          </button>
        }
      />

      {/* 메인 컨텐츠 */}
      <main className="flex-1 px-8 lg:px-12 py-10 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* 타이틀 섹션 */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A] mb-3">
              정보를 던지세요
            </h1>
            <p className="text-[#666] text-base lg:text-lg leading-relaxed">
              메모, 카톡 대화, 검색 기록 등 여행과 관련된 정보를 자유롭게 붙여넣어 주세요
            </p>
          </div>

          {/* URL 제한 안내 배너 */}
          <div className="mb-6 bg-[#FEF3C7] border border-[#FCD34D] rounded-xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F59E0B] flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
                <path d="M12 8V12M12 16H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-[#92400E] font-semibold text-sm mb-1">URL/링크는 입력할 수 없어요</p>
              <p className="text-[#A16207] text-sm leading-relaxed">
                AI가 링크 내용을 직접 읽을 수 없기 때문에, 링크 대신 해당 내용을 텍스트로 복사해서 붙여넣어 주세요.
                예: 블로그 글의 장소명, 영업시간, 주소 등을 직접 적어주시면 됩니다.
              </p>
            </div>
          </div>

          {/* 텍스트 입력 영역 */}
          <div className="mb-6">
            <div className="bg-white border border-[#E0E0E0] rounded-xl overflow-hidden hover:border-[#534AB7] transition-colors focus-within:border-[#534AB7] focus-within:ring-2 focus-within:ring-[#534AB7]/20 shadow-sm">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={handleChange}
                onPaste={handlePaste}
                maxLength={3000}
                placeholder={PLACEHOLDER}
                className="w-full min-h-[280px] lg:min-h-[320px] p-6 text-[15px] leading-relaxed text-[#1A1A1A] bg-transparent resize-none outline-none placeholder:text-[#B0B0B0]"
              />
              <div className="flex justify-end px-6 pb-4">
                <span className={`text-sm font-medium ${charCountColor}`}>
                  {len.toLocaleString()}/3,000
                </span>
              </div>
            </div>
          </div>

          {/* AI 태그 섹션 */}
          <div className="mb-6 bg-white border border-[#E8E8E8] rounded-xl p-5 shadow-sm">
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
          <div className="bg-[#F3F1FE] border border-[#E8E6F5] rounded-xl p-5">
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

          {/* 다음 단계 버튼 */}
          <div className="mt-10 flex items-center justify-between">
            <Link
              href="/onboarding"
              className="px-6 py-3 rounded-lg border border-[#E0E0E0] bg-white text-[#666] text-[15px] font-medium hover:bg-[#F5F5F5] transition-colors no-underline flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              이전 단계
            </Link>
            <Link
              href="/places"
              className={`px-8 py-3 rounded-lg text-[15px] font-semibold transition-all no-underline flex items-center gap-2 ${
                isValid
                  ? "bg-[#534AB7] text-white hover:bg-[#4840A0] shadow-md shadow-[#534AB7]/20"
                  : "bg-[#E8E8E8] text-[#999] cursor-not-allowed pointer-events-none"
              }`}
            >
              다음 단계로
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      {/* 토스트 */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
}
