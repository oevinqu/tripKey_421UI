"use client";

import Link from "next/link";
import { MainHeader, SubHeader } from "@/components/header";
import { groupTripAlerts } from "@/components/trip/alertDemoData";

function AlertList({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "practical" | "insight";
  items: ReturnType<typeof groupTripAlerts>["practical"];
}) {
  const palette =
    tone === "practical"
      ? {
          bg: "bg-[#FFF7ED]",
          border: "border-[#FED7AA]",
          badge: "bg-[#F97316]",
          text: "text-[#9A3412]",
        }
      : {
          bg: "bg-[#EEF2FF]",
          border: "border-[#C7D2FE]",
          badge: "bg-[#534AB7]",
          text: "text-[#4338CA]",
        };

  return (
    <section className={`rounded-3xl border ${palette.border} ${palette.bg} p-6`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#1A1A1A]">{title}</h2>
        <span className={`rounded-full ${palette.badge} px-2.5 py-1 text-xs font-semibold text-white`}>
          {items.length}개
        </span>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/70 bg-white/80 p-4">
            <p className={`text-sm leading-relaxed ${palette.text}`}>{item.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function OrganizeAlertsPage() {
  const tripAlerts = groupTripAlerts();

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F3] font-sans">
      <MainHeader />
      <SubHeader
        currentStep={3}
        tripInfo={{
          destinations: ["오사카", "교토", "나라"],
          travelers: 2,
          startDate: "5월 10일",
          endDate: "5월 14일",
        }}
        rightButtons={
          <Link
            href="/organize"
            className="rounded-lg border border-[#E0E0E0] bg-white px-4 py-2 text-[13px] font-medium text-[#666] no-underline transition-colors hover:bg-[#F8F8F8]"
          >
            03으로 돌아가기
          </Link>
        }
      />

      <div className="flex-1 px-8 py-10 lg:px-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#1A1A1A]">03 Alert Demo</h1>
            <p className="mt-2 text-sm text-[#888]">
              03에서는 trip-level alert를 상단 요약 영역에 넣고, Day가 생기기 전 필요한 실무/인사이트를 먼저 검토하는 흐름으로 볼 수 있어요.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <AlertList title="Practical Alerts" tone="practical" items={tripAlerts.practical} />
            <AlertList title="Insight Alerts" tone="insight" items={tripAlerts.insight} />
          </div>
        </div>
      </div>
    </div>
  );
}
