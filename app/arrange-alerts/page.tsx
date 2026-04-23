"use client";

import Link from "next/link";
import { MainHeader, SubHeader } from "@/components/header";
import { groupDayAlerts, groupTripAlerts } from "@/components/trip/alertDemoData";

const DAYS = [
  { day: 1, title: "Day 1" },
  { day: 2, title: "Day 2" },
  { day: 3, title: "Day 3" },
  { day: 4, title: "Day 4" },
  { day: 5, title: "Day 5" },
];

export default function ArrangeAlertsPage() {
  const tripAlerts = groupTripAlerts();

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F3] font-sans">
      <MainHeader />
      <SubHeader
        currentStep={4}
        tripInfo={{
          destinations: ["오사카", "교토", "나라"],
          travelers: 2,
          startDate: "5월 10일",
          endDate: "5월 14일",
        }}
        rightButtons={
          <Link
            href="/arrange"
            className="rounded-lg border border-[#E0E0E0] bg-white px-4 py-2 text-[13px] font-medium text-[#666] no-underline transition-colors hover:bg-[#F8F8F8]"
          >
            04로 돌아가기
          </Link>
        }
      />

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[360px] shrink-0 border-r border-[#EBEBEB] bg-white p-6">
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">04 Alert Demo</h1>
          <p className="mt-2 text-sm text-[#888]">
            04에서는 trip-level practical을 stock 옆에 두고, Day별 insight는 각 컬럼 위에 작게 배치하는 흐름을 볼 수 있어요.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-[#FED7AA] bg-[#FFF7ED] p-5">
              <h2 className="text-base font-semibold text-[#9A3412]">Trip Practical</h2>
              <div className="mt-3 space-y-3">
                {tripAlerts.practical.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-white/90 p-4 text-sm text-[#9A3412]">
                    {item.message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-x-auto p-6">
          <div className="flex min-w-max gap-4">
            {DAYS.map((day) => {
              const dayAlerts = groupDayAlerts(day.day);

              return (
                <div
                  key={day.day}
                  className="w-72 shrink-0 rounded-3xl border border-[#E8E8E8] bg-white p-5"
                >
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-[#1A1A1A]">{day.title}</h2>
                    <p className="mt-1 text-xs text-[#888]">Day별 alert가 있으면 배치 전에 먼저 보이게 하는 예시예요.</p>
                  </div>

                  {dayAlerts.insight.length > 0 ? (
                    <div className="space-y-3">
                      {dayAlerts.insight.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-[#C7D2FE] bg-[#EEF2FF] p-4"
                        >
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#534AB7]">
                            Insight
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-[#4338CA]">
                            {item.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[#DDD] bg-[#FAFAFA] px-4 py-10 text-center text-sm text-[#AAA]">
                      이 Day에는 독립 인사이트가 없어요.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
