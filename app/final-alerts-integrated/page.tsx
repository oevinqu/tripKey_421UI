"use client";

import { useState } from "react";
import Link from "next/link";
import { MainHeader, SubHeader } from "@/components/header";
import { groupDayAlerts, groupTripAlerts } from "@/components/trip/alertDemoData";

const FINAL_DAY_CONTEXT: Record<
  number,
  {
    title: string;
    summary: string;
    totalTravel: string;
    totalDuration: string;
    checklist: string[];
    cards: {
      id: string;
      name: string;
      time: string;
      category: string;
      location: string;
      context?: string;
      tip?: string;
    }[];
  }
> = {
  1: {
    title: "Day 1 - 오사카 첫 진입",
    summary: "공항 도착 이후 난바 체크인, 저녁에는 도톤보리권을 느슨하게 보는 첫날 흐름",
    totalTravel: "42분",
    totalDuration: "7시간 30분",
    checklist: ["공항-난바 이동 수단 재확인", "체크인 시간 맞춰 숙소 도착", "도톤보리 웨이팅 대비"],
    cards: [
      {
        id: "fd1",
        name: "오사카 난바 호텔",
        time: "15:00",
        category: "숙소",
        location: "오사카",
        context: "첫날 피로도가 높을 수 있어 체크인 이후 주변 중심으로 움직이고 싶어요.",
      },
      {
        id: "fd2",
        name: "도톤보리 맛집 투어",
        time: "18:00",
        category: "맛집",
        location: "오사카",
        tip: "웨이팅 긴 곳은 Day 1 무리해서 다 넣지 말고 후보만 정하는 편이 좋아요.",
      },
    ],
  },
  2: {
    title: "Day 2 - 유니버설 집중",
    summary: "하루를 거의 테마파크에 몰아 쓰는 날이라 별도 day alert는 적고 준비물 위주 점검이 중요함",
    totalTravel: "12분",
    totalDuration: "10시간 20분",
    checklist: ["입장권 저장", "익스프레스 패스 확인", "저녁 귀가 동선 체크"],
    cards: [
      {
        id: "fd3",
        name: "유니버설 스튜디오 재팬",
        time: "09:00",
        category: "장소",
        location: "오사카",
        context: "하루 종일 놀 예정이라 초반 동선이 특히 중요해요.",
      },
    ],
  },
  3: {
    title: "Day 3 - 교토 당일권",
    summary: "행사와 혼잡 인사이트가 실제 방문 순서를 바꾸는 대표적인 날",
    totalTravel: "1시간 18분",
    totalDuration: "9시간 10분",
    checklist: ["아침 일찍 출발", "혼잡 시간 전 주요 포인트 방문", "교통패스 준비"],
    cards: [
      {
        id: "fd4",
        name: "아라시야마 대나무숲",
        time: "07:30",
        category: "장소",
        location: "교토",
        context: "교토 자연 스팟은 이른 시간대가 더 좋다고 느껴요.",
        tip: "행사 혼잡을 피하려면 오전 먼저 투입하는 게 안정적이에요.",
      },
      {
        id: "fd5",
        name: "기온 거리 산책",
        time: "15:00",
        category: "활동",
        location: "교토",
      },
    ],
  },
  4: {
    title: "Day 4 - 이동 완충 Day",
    summary: "숙소 변경이 실제 day 구조를 크게 바꾸는 완충 구간",
    totalTravel: "38분",
    totalDuration: "6시간 30분",
    checklist: ["숙소 변경 정보 확인", "짐 이동 시간 확보", "우메다권 저녁 동선 가볍게 정리"],
    cards: [
      {
        id: "fd6",
        name: "오사카 우메다 호텔",
        time: "16:00",
        category: "숙소",
        location: "오사카",
        context: "마지막 숙소를 우메다로 옮기면 출국 전 동선이 조금 더 안정적일 수 있어요.",
      },
    ],
  },
  5: {
    title: "Day 5 - 귀국",
    summary: "체크아웃, 공항 이동, 출발 고정 시간이 실제로 가장 중요한 날",
    totalTravel: "55분",
    totalDuration: "5시간 20분",
    checklist: ["체크아웃 시간 재확인", "공항 이동 수단 확정", "출발 2시간 전 도착 목표"],
    cards: [
      {
        id: "fd7",
        name: "간사이 공항 출발",
        time: "18:40",
        category: "이동",
        location: "간사이 공항",
        tip: "우메다 기준 출발 시간이 빠듯하면 열차보다 버스가 더 편할 수 있어요.",
      },
    ],
  },
};

export default function FinalAlertsIntegratedPage() {
  const [activeDay, setActiveDay] = useState(1);
  const tripAlerts = groupTripAlerts();
  const dayAlerts = groupDayAlerts(activeDay);
  const activeDayData = FINAL_DAY_CONTEXT[activeDay];

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F7F5] font-sans">
      <MainHeader />
      <SubHeader
        currentStep={5}
        tripInfo={{
          destinations: ["오사카", "교토", "나라"],
          travelers: 2,
          startDate: "5월 10일",
          endDate: "5월 14일",
        }}
        rightButtons={
          <div className="flex items-center gap-2">
            <Link
              href="/final-alerts"
              className="rounded-lg border border-[#E0E0E0] bg-white px-4 py-2 text-[13px] font-medium text-[#666] no-underline transition-colors hover:bg-[#F8F8F8]"
            >
              분리 Demo
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-[#E0E0E0] bg-white px-4 py-2 text-[13px] font-medium text-[#666] no-underline transition-colors hover:bg-[#F8F8F8]"
            >
              05로 돌아가기
            </Link>
          </div>
        }
      />

      <div className="flex-1 px-8 py-10 lg:px-12">
        <div className="mx-auto max-w-[1500px] space-y-8">
          <section className="rounded-[32px] bg-[linear-gradient(135deg,#1F2937_0%,#374151_52%,#6B7280_100%)] p-7 text-white shadow-[0_24px_80px_rgba(55,65,81,0.25)]">
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                  05 Alert Integrated
                </p>
                <h1 className="mt-3 text-[30px] font-semibold leading-tight">
                  최종 리뷰 화면 안에 alert까지 자연스럽게 포함한 버전
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/78">
                  여행 전반 practical/insight는 좌측에 두고, Day별 review 안에서는 그날 필요한 인사이트를 체크리스트와 카드 맥락 위에 직접 얹은 형태입니다.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-xs text-white/60">여행 전반 alert</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {tripAlerts.practical.length + tripAlerts.insight.length}개
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-xs text-white/60">Day {activeDay} alert</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {dayAlerts.practical.length + dayAlerts.insight.length}개
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm sm:col-span-2">
                  <p className="text-xs text-white/60">화면 의도</p>
                  <p className="mt-2 text-sm text-white/82">
                    예쁜 일정표보다, 최종 확정 직전에 놓치기 쉬운 실무와 맥락을 함께 보는 밀도를 검증합니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="space-y-5">
              <div className="rounded-3xl border border-[#E8E8E8] bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#1A1A1A]">여행 전반 Alert</h2>
                <p className="mt-2 text-sm text-[#888]">
                  context summary와 체크리스트 바로 아래에 실무 알림과 인사이트가 이어지는 구조입니다.
                </p>
              </div>

              <div className="rounded-3xl border border-[#FED7AA] bg-[#FFF7ED] p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C2410C]">
                  Practical
                </p>
                <div className="mt-4 space-y-3">
                  {tripAlerts.practical.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-white/90 p-4 text-sm leading-relaxed text-[#9A3412]">
                      {item.message}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-[#C7D2FE] bg-[#EEF2FF] p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#534AB7]">
                  Trip Insight
                </p>
                <div className="mt-4 space-y-3">
                  {tripAlerts.insight.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-white/90 p-4 text-sm leading-relaxed text-[#4338CA]">
                      {item.message}
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <main className="space-y-6">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {Object.keys(FINAL_DAY_CONTEXT).map((key) => {
                  const day = Number(key);
                  return (
                    <button
                      key={day}
                      onClick={() => setActiveDay(day)}
                      className={`rounded-xl px-5 py-3 text-sm font-medium transition-colors ${activeDay === day
                        ? "bg-[#1A1A1A] text-white"
                        : "border border-[#E4E4E4] bg-white text-[#666] hover:bg-[#F9F9F9]"
                        }`}
                    >
                      Day {day}
                    </button>
                  );
                })}
              </div>

              <div className="rounded-3xl border border-[#E8E8E8] bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-[#1A1A1A]">{activeDayData.title}</h2>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#666]">
                      {activeDayData.summary}
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-[#F6F5FF] px-4 py-3 text-right">
                      <p className="text-xs text-[#7A74C7]">총 이동시간</p>
                      <p className="mt-1 text-xl font-semibold text-[#534AB7]">{activeDayData.totalTravel}</p>
                    </div>
                    <div className="rounded-2xl bg-[#FFF7ED] px-4 py-3 text-right">
                      <p className="text-xs text-[#C2410C]">총 소요시간</p>
                      <p className="mt-1 text-xl font-semibold text-[#9A3412]">{activeDayData.totalDuration}</p>
                    </div>
                  </div>
                </div>
              </div>

              {dayAlerts.insight.length > 0 && (
                <div className="rounded-3xl border border-[#C7D2FE] bg-[#EEF2FF] p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#534AB7]">
                    Day Insight
                  </p>
                  <div className="mt-4 space-y-3">
                    {dayAlerts.insight.map((item) => (
                      <div key={item.id} className="rounded-2xl bg-white/90 p-4 text-sm leading-relaxed text-[#4338CA]">
                        {item.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <section className="rounded-3xl border border-[#E8E8E8] bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-[#1A1A1A]">카드 맥락 기반 일정</h3>
                  <div className="mt-4 space-y-4">
                    {activeDayData.cards.map((card, index) => (
                      <div key={card.id} className="rounded-2xl border border-[#ECECEC] bg-[#FCFCFC] p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1A1A1A] text-[13px] font-semibold text-white">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-[16px] font-semibold text-[#1A1A1A]">{card.name}</p>
                              <span className="rounded-full bg-[#F2F2F2] px-2 py-0.5 text-[11px] text-[#666]">
                                {card.category}
                              </span>
                            </div>
                            <p className="mt-1 text-[13px] text-[#888]">
                              {card.time} · {card.location}
                            </p>
                            {card.context && (
                              <div className="mt-3 rounded-xl bg-[#F6F5FF] px-3 py-2">
                                <p className="text-[11px] font-semibold text-[#7A74C7]">사용자 맥락</p>
                                <p className="mt-1 text-[13px] text-[#4C4794]">{card.context}</p>
                              </div>
                            )}
                            {card.tip && (
                              <div className="mt-2 rounded-xl bg-[#FFFBEB] px-3 py-2">
                                <p className="text-[11px] font-semibold text-[#A16207]">AI 팁</p>
                                <p className="mt-1 text-[13px] text-[#854D0E]">{card.tip}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-3xl border border-[#E8E8E8] bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[#1A1A1A]">Day 체크리스트</h3>
                    <span className="text-xs text-[#888]">{activeDayData.checklist.length}개</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {activeDayData.checklist.map((item) => (
                      <div key={item} className="rounded-2xl bg-[#FAFAFA] px-4 py-3 text-sm text-[#333]">
                        {item}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
