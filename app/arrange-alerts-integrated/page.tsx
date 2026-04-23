"use client";

import Link from "next/link";
import { MainHeader, SubHeader } from "@/components/header";
import { TripCard } from "@/components/trip/TripCard";
import { groupDayAlerts, groupTripAlerts } from "@/components/trip/alertDemoData";
import { TripCardData } from "@/types/card";

const STOCK_GROUPS: { title: string; reason: string; cards: TripCardData[] }[] = [
  {
    title: "숙소",
    reason: "숙소는 일정의 시작/끝 구조에 영향이 커서 stock 안에서도 독립 그룹으로 다룹니다.",
    cards: [
      {
        instance_id: "arrdemo-1",
        place_id: null,
        name: "교토 게스트하우스",
        category: "accommodation",
        classification: "open_question",
        placement_status: "ready_partial",
        processing_status: "completed",
        action_type: "input_required",
        can_exclude: false,
        allow_duplicate: true,
        is_excluded: false,
        is_ai_generated: false,
        estimated_duration_min: 0,
        coordinates: null,
        time_constraint: null,
        question_text: null,
        options: null,
        blocked_reason: null,
        user_context: "교토 숙소는 아직 미예약 상태예요.",
        tips: "숙소 위치가 정해지면 Day 3~4 이동 시간이 크게 바뀔 수 있어요.",
        tags: ["숙소", "교토"],
        source: "demo",
        day: null,
        notes: null,
        location: "교토",
      },
    ],
  },
  {
    title: "오사카",
    reason: "바로 배치 가능한 오사카 카드입니다.",
    cards: [
      {
        instance_id: "arrdemo-2",
        place_id: null,
        name: "도톤보리 맛집 투어",
        category: "food",
        classification: "undecided",
        placement_status: "ready_partial",
        processing_status: "completed",
        action_type: "select_required",
        can_exclude: true,
        allow_duplicate: false,
        is_excluded: false,
        is_ai_generated: false,
        estimated_duration_min: 120,
        coordinates: null,
        time_constraint: "저녁 식사",
        question_text: null,
        options: null,
        blocked_reason: null,
        user_context: "첫날 저녁 오사카다운 분위기를 넣고 싶어요.",
        tips: "공항 도착 후 피로도가 크면 난바 중심으로 좁히는 것도 좋아요.",
        tags: ["오사카", "도톤보리"],
        source: "demo",
        day: null,
        notes: null,
        location: "오사카",
      },
      {
        instance_id: "arrdemo-3",
        place_id: null,
        name: "글리코상",
        category: "place",
        classification: "open_question",
        placement_status: "ready_partial",
        processing_status: "completed",
        action_type: "select_required",
        can_exclude: true,
        allow_duplicate: false,
        is_excluded: false,
        is_ai_generated: false,
        estimated_duration_min: 20,
        coordinates: null,
        time_constraint: null,
        question_text: null,
        options: null,
        blocked_reason: null,
        user_context: "짧게 사진만 찍고 지나갈지 고민 중이에요.",
        tips: "도톤보리와 붙여두면 짧게 소비되는 포토 스팟으로 배치하기 좋아요.",
        tags: ["오사카"],
        source: "demo",
        day: null,
        notes: null,
        location: "오사카",
      },
    ],
  },
];

const DAY_BOARD: {
  day: number;
  title: string;
  summary: string;
  cards: TripCardData[];
}[] = [
  {
    day: 1,
    title: "Day 1",
    summary: "공항 도착 후 난바 체크인, 저녁에는 도톤보리권 진입을 가정한 흐름",
    cards: [
      {
        instance_id: "arrday-1",
        place_id: null,
        name: "오사카 난바 호텔",
        category: "accommodation",
        classification: "confirmed",
        placement_status: "ready",
        processing_status: "completed",
        action_type: "review_only",
        can_exclude: false,
        allow_duplicate: true,
        is_excluded: false,
        is_ai_generated: false,
        estimated_duration_min: 20,
        coordinates: null,
        time_constraint: "15:00 체크인",
        question_text: null,
        options: null,
        blocked_reason: null,
        user_context: "첫날 숙소는 난바권으로 예약 완료",
        tips: null,
        tags: ["숙소"],
        source: "demo",
        day: 1,
        notes: null,
        location: "오사카",
      },
    ],
  },
  {
    day: 3,
    title: "Day 3",
    summary: "교토 당일권에서 행사/혼잡 insight가 실제 배치 판단에 영향을 주는 날",
    cards: [
      {
        instance_id: "arrday-2",
        place_id: null,
        name: "아라시야마 대나무숲",
        category: "place",
        classification: "open_question",
        placement_status: "ready_partial",
        processing_status: "completed",
        action_type: "select_required",
        can_exclude: true,
        allow_duplicate: false,
        is_excluded: false,
        is_ai_generated: true,
        estimated_duration_min: 60,
        coordinates: null,
        time_constraint: "오전",
        question_text: null,
        options: null,
        blocked_reason: null,
        user_context: "교토에서 자연 위주의 한 구간을 넣고 싶어요.",
        tips: "행사 혼잡을 피하려면 오전에 먼저 보내는 쪽이 유리해요.",
        tags: ["교토"],
        source: "demo",
        day: 3,
        notes: null,
        location: "교토",
      },
    ],
  },
  {
    day: 5,
    title: "Day 5",
    summary: "체크아웃과 공항 출발이 있어 practical alert가 실제 보드 해석에 함께 개입하는 날",
    cards: [
      {
        instance_id: "arrday-3",
        place_id: null,
        name: "간사이 공항 출발",
        category: "transport",
        classification: "confirmed",
        placement_status: "ready",
        processing_status: "completed",
        action_type: "review_only",
        can_exclude: false,
        allow_duplicate: true,
        is_excluded: false,
        is_ai_generated: false,
        estimated_duration_min: null,
        coordinates: null,
        time_constraint: "출발 18:40",
        question_text: null,
        options: null,
        blocked_reason: null,
        user_context: "귀국 항공편은 이미 예약된 상태예요.",
        tips: null,
        tags: ["공항"],
        source: "demo",
        day: 5,
        notes: null,
        location: "간사이 공항",
      },
    ],
  },
];

export default function ArrangeAlertsIntegratedPage() {
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
          <div className="flex items-center gap-2">
            <Link
              href="/arrange-alerts"
              className="rounded-lg border border-[#E0E0E0] bg-white px-4 py-2 text-[13px] font-medium text-[#666] no-underline transition-colors hover:bg-[#F8F8F8]"
            >
              분리 Demo
            </Link>
            <Link
              href="/arrange"
              className="rounded-lg border border-[#E0E0E0] bg-white px-4 py-2 text-[13px] font-medium text-[#666] no-underline transition-colors hover:bg-[#F8F8F8]"
            >
              04로 돌아가기
            </Link>
          </div>
        }
      />

      <div className="flex-1 px-8 py-10 lg:px-12">
        <div className="mx-auto max-w-[1500px] space-y-8">
          <section className="rounded-[32px] bg-[linear-gradient(135deg,#16324F_0%,#1E4B7A_54%,#4DA2D9_100%)] p-7 text-white shadow-[0_24px_80px_rgba(41,87,138,0.28)]">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">
                  04 Alert Integrated
                </p>
                <h1 className="mt-3 text-[30px] font-semibold leading-tight">
                  Stock과 Day 보드 안에 alert를 직접 묻어 넣은 버전
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
                  stock 옆 practical, day 컬럼 상단 insight, 공항/숙소 구조까지 한 화면에서 동시에 보며 04의 실제 밀도를 확인하기 위한 데모입니다.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-xs text-white/65">Stock 실무 알림</p>
                  <p className="mt-2 text-2xl font-semibold">{tripAlerts.practical.length}개</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-xs text-white/65">Day Insight 예시</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {DAY_BOARD.reduce((count, day) => count + groupDayAlerts(day.day).insight.length, 0)}개
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm sm:col-span-2">
                  <p className="text-xs text-white/65">화면 의도</p>
                  <p className="mt-2 text-sm text-white/85">
                    practical은 전체 배치 판단에, insight는 특정 Day의 순서/혼잡 판단에 쓰이도록 계층을 나눕니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="space-y-5">
              <div className="rounded-3xl border border-[#E8E8E8] bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-[#1A1A1A]">카드 목록</h2>
                <p className="mt-2 text-sm text-[#888]">practical alert를 stock 입구에 두어, 배치 전에 꼭 확인할 내용을 먼저 보여줍니다.</p>
              </div>

              <div className="rounded-3xl border border-[#FED7AA] bg-[#FFF7ED] p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C2410C]">
                  Practical Alerts
                </p>
                <div className="mt-4 space-y-3">
                  {tripAlerts.practical.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-white/90 p-4 text-sm leading-relaxed text-[#9A3412]">
                      {item.message}
                    </div>
                  ))}
                </div>
              </div>

              {STOCK_GROUPS.map((group) => (
                <div key={group.title} className="rounded-3xl border border-[#E8E8E8] bg-white p-5 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-[#1A1A1A]">{group.title}</h3>
                    <p className="mt-1 text-xs text-[#888]">{group.reason}</p>
                  </div>
                  <div className="space-y-3">
                    {group.cards.map((card) => (
                      <TripCard key={card.instance_id} card={card} compact />
                    ))}
                  </div>
                </div>
              ))}
            </aside>

            <main className="overflow-x-auto">
              <div className="flex min-w-max gap-5 pb-2">
                {DAY_BOARD.map((day) => {
                  const alerts = groupDayAlerts(day.day);

                  return (
                    <div key={day.day} className="w-80 shrink-0 space-y-4">
                      <div className="rounded-3xl border border-[#E8E8E8] bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h2 className="text-lg font-semibold text-[#1A1A1A]">{day.title}</h2>
                            <p className="mt-2 text-sm leading-relaxed text-[#888]">{day.summary}</p>
                          </div>
                          <span className="rounded-full bg-[#F5F5F5] px-2.5 py-1 text-xs font-medium text-[#666]">
                            {day.cards.length}개
                          </span>
                        </div>
                      </div>

                      {alerts.insight.length > 0 && (
                        <div className="space-y-3">
                          {alerts.insight.map((item) => (
                            <div key={item.id} className="rounded-3xl border border-[#C7D2FE] bg-[#EEF2FF] p-4 shadow-sm">
                              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#534AB7]">
                                Day Insight
                              </p>
                              <p className="mt-2 text-sm leading-relaxed text-[#4338CA]">
                                {item.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="rounded-3xl border border-[#E8E8E8] bg-white p-5 shadow-sm">
                        <div className="space-y-3">
                          {day.cards.map((card) => (
                            <div key={card.instance_id}>
                              <TripCard card={card} compact />
                              <p className="mt-2 pl-2 text-[11px] text-[#888]">
                                {card.time_constraint ?? `체류시간 ${card.estimated_duration_min ?? 0}분`}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
