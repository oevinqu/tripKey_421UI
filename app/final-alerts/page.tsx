"use client";

import { useState } from "react";
import Link from "next/link";
import { MainHeader, SubHeader } from "@/components/header";
import { groupDayAlerts, groupTripAlerts } from "@/components/trip/alertDemoData";

const DAYS = [1, 2, 3, 4, 5];

export default function FinalAlertsPage() {
  const [activeDay, setActiveDay] = useState(1);
  const tripAlerts = groupTripAlerts();
  const dayAlerts = groupDayAlerts(activeDay);

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
          <Link
            href="/"
            className="rounded-lg border border-[#E0E0E0] bg-white px-4 py-2 text-[13px] font-medium text-[#666] no-underline transition-colors hover:bg-[#F8F8F8]"
          >
            05로 돌아가기
          </Link>
        }
      />

      <div className="flex flex-1">
        <aside className="w-[360px] shrink-0 border-r border-[#EBEBEB] bg-white p-6">
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">05 Alert Demo</h1>
          <p className="mt-2 text-sm text-[#888]">
            05에서는 trip-level alert를 좌측에 두고, Day별 alert는 탭 전환에 맞춰 우측에서 함께 검토하는 구성이 자연스러워요.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-[#FED7AA] bg-[#FFF7ED] p-5">
              <h2 className="text-base font-semibold text-[#9A3412]">Practical Alerts</h2>
              <div className="mt-3 space-y-3">
                {tripAlerts.practical.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-white/90 p-4 text-sm text-[#9A3412]">
                    {item.message}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[#C7D2FE] bg-[#EEF2FF] p-5">
              <h2 className="text-base font-semibold text-[#4338CA]">Trip Insight</h2>
              <div className="mt-3 space-y-3">
                {tripAlerts.insight.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-white/90 p-4 text-sm text-[#4338CA]">
                    {item.message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-6 flex gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`rounded-xl px-5 py-3 text-sm font-medium transition-colors ${
                  activeDay === day
                    ? "bg-[#1A1A1A] text-white"
                    : "border border-[#E4E4E4] bg-white text-[#666] hover:bg-[#F9F9F9]"
                }`}
              >
                Day {day}
              </button>
            ))}
          </div>

          <div className="rounded-3xl border border-[#E8E8E8] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Day {activeDay} Alert Review</h2>
            <p className="mt-2 text-sm text-[#888]">
              Day별 체크리스트와 카드 맥락 사이에 alert를 자연스럽게 섞어 넣는 예시예요.
            </p>

            <div className="mt-6 space-y-4">
              {dayAlerts.practical.length === 0 && dayAlerts.insight.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#DDD] bg-[#FAFAFA] px-4 py-10 text-center text-sm text-[#AAA]">
                  이 Day에는 추가 alert가 없어요.
                </div>
              ) : (
                <>
                  {dayAlerts.practical.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-[#FED7AA] bg-[#FFF7ED] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#C2410C]">
                        Practical
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[#9A3412]">{item.message}</p>
                    </div>
                  ))}
                  {dayAlerts.insight.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-[#C7D2FE] bg-[#EEF2FF] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#534AB7]">
                        Insight
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[#4338CA]">{item.message}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
