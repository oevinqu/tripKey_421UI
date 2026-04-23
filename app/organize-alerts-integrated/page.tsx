"use client";

import Link from "next/link";
import { MainHeader, SubHeader } from "@/components/header";
import { TripCard } from "@/components/trip/TripCard";
import { groupTripAlerts } from "@/components/trip/alertDemoData";
import { TripCardData } from "@/types/card";

const ORGANIZE_ALERT_DEMO_CARDS: Record<string, TripCardData[]> = {
  input_required: [
    {
      instance_id: "orgd-1",
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
      question_text: "아직 게스트하우스를 예약 안하셨어요.",
      options: null,
      blocked_reason: null,
      user_context: "교토 숙소 후보를 아직 고르는 중이에요",
      tips: "숙소가 정해지면 Day 3~4 동선이 더 안정적으로 정리돼요.",
      tags: ["숙소", "교토"],
      source: "demo",
      day: null,
      notes: null,
      location: "교토",
    },
  ],
  select_required: [
    {
      instance_id: "orgd-2",
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
      question_text: "도톤보리에서 어디를 갈지 정해주세요.",
      options: null,
      blocked_reason: null,
      user_context: "첫날 저녁은 오사카다운 맛집으로 시작하고 싶어요.",
      tips: "웨이팅 긴 곳은 다른 포토 스팟과 묶어서 가면 좋아요.",
      tags: ["오사카", "도톤보리"],
      source: "demo",
      day: null,
      notes: null,
      location: "오사카",
    },
  ],
  fix_required: [
    {
      instance_id: "orgd-3",
      place_id: null,
      name: "와사카 성",
      category: "etc",
      classification: "open_question",
      placement_status: "blocked",
      processing_status: "failed",
      action_type: "fix_required",
      can_exclude: true,
      allow_duplicate: false,
      is_excluded: false,
      is_ai_generated: true,
      estimated_duration_min: null,
      coordinates: null,
      time_constraint: null,
      question_text: "오타인 것 같아요. 실제 장소명을 확인해주세요.",
      options: null,
      blocked_reason: "오타인 것 같아요",
      user_context: "원문에서 장소명이 정확히 읽히지 않았어요.",
      tips: "정확한 이름만 확인되면 이후 배치가 쉬워져요.",
      tags: ["AI 후보"],
      source: "demo",
      day: null,
      notes: null,
    },
  ],
  review_only: [
    {
      instance_id: "orgd-4",
      place_id: "universal-studios-japan",
      name: "유니버설 스튜디오 재팬",
      category: "place",
      classification: "confirmed",
      placement_status: "ready",
      processing_status: "completed",
      action_type: "review_only",
      can_exclude: true,
      allow_duplicate: false,
      is_excluded: false,
      is_ai_generated: false,
      estimated_duration_min: 480,
      coordinates: null,
      time_constraint: "오픈런",
      question_text: null,
      options: null,
      blocked_reason: null,
      user_context: "하루 종일 놀 예정이에요.",
      tips: "입장권, 익스프레스 패스, 오픈런 준비를 같이 체크하면 좋아요.",
      tags: ["오사카", "테마파크"],
      source: "demo",
      day: null,
      notes: null,
      location: "오사카",
    },
    {
      instance_id: "orgd-5",
      place_id: "nara-deer-park",
      name: "나라 사슴공원",
      category: "activity",
      classification: "confirmed",
      placement_status: "ready",
      processing_status: "completed",
      action_type: "review_only",
      can_exclude: true,
      allow_duplicate: false,
      is_excluded: false,
      is_ai_generated: false,
      estimated_duration_min: 120,
      coordinates: null,
      time_constraint: null,
      question_text: null,
      options: null,
      blocked_reason: null,
      user_context: null,
      tips: "사슴과자 구매 포인트와 이동 시간을 미리 고려해두면 좋아요.",
      tags: ["나라"],
      source: "demo",
      day: null,
      notes: null,
      location: "나라",
    },
  ],
};

const ORGANIZE_CARD_SECTIONS: {
  title: string;
  cards: TripCardData[];
}[] = [
  { title: "입력이 필요한 카드", cards: ORGANIZE_ALERT_DEMO_CARDS.input_required },
  { title: "선택이 필요한 카드", cards: ORGANIZE_ALERT_DEMO_CARDS.select_required },
  { title: "수정이 필요한 카드", cards: ORGANIZE_ALERT_DEMO_CARDS.fix_required },
  { title: "확인만 하면 되는 카드", cards: ORGANIZE_ALERT_DEMO_CARDS.review_only },
];

function AlertColumn({
  title,
  eyebrow,
  items,
  tone,
}: {
  title: string;
  eyebrow: string;
  items: { id: string; message: string }[];
  tone: "orange" | "indigo";
}) {
  const palette =
    tone === "orange"
      ? {
          wrap: "border-[#FED7AA] bg-[#FFF7ED]",
          tag: "text-[#C2410C]",
          card: "text-[#9A3412]",
        }
      : {
          wrap: "border-[#C7D2FE] bg-[#EEF2FF]",
          tag: "text-[#534AB7]",
          card: "text-[#4338CA]",
        };

  return (
    <div className={`rounded-3xl border p-5 ${palette.wrap}`}>
      <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${palette.tag}`}>
        {eyebrow}
      </p>
      <h3 className="mt-2 text-lg font-semibold text-[#1A1A1A]">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className={`rounded-2xl bg-white/90 px-4 py-3 text-sm leading-relaxed ${palette.card}`}>
            {item.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrganizeAlertsIntegratedPage() {
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
          <div className="flex items-center gap-2">
            <Link
              href="/organize-alerts"
              className="rounded-lg border border-[#E0E0E0] bg-white px-4 py-2 text-[13px] font-medium text-[#666] no-underline transition-colors hover:bg-[#F8F8F8]"
            >
              분리 Demo
            </Link>
            <Link
              href="/organize"
              className="rounded-lg border border-[#E0E0E0] bg-white px-4 py-2 text-[13px] font-medium text-[#666] no-underline transition-colors hover:bg-[#F8F8F8]"
            >
              03으로 돌아가기
            </Link>
          </div>
        }
      />

      <div className="flex-1 px-8 py-10 lg:px-12">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-[32px] bg-[linear-gradient(135deg,#1F1847_0%,#4338CA_52%,#7C6CF0_100%)] p-7 text-white shadow-[0_24px_80px_rgba(83,74,183,0.28)]">
            <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">
                  03 Alert Integrated
                </p>
                <h1 className="mt-3 text-[30px] font-semibold leading-tight">
                  Alert를 카드 정리 흐름 안에 직접 섞은 버전
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
                  정리 화면 상단에서 trip-level practical과 insight를 먼저 보여주고, 아래 카드 그룹을 그 맥락 안에서 검토하도록 만든 데모입니다.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-xs text-white/65">실무 알림</p>
                  <p className="mt-2 text-2xl font-semibold">{tripAlerts.practical.length}개</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-xs text-white/65">인사이트</p>
                  <p className="mt-2 text-2xl font-semibold">{tripAlerts.insight.length}개</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm sm:col-span-2">
                  <p className="text-xs text-white/65">화면 의도</p>
                  <p className="mt-2 text-sm text-white/85">
                    카드 검토 전 "이번 여행에서 먼저 알아야 할 것"을 상단에 얹어, alert가 보조 기능이 아니라 정리의 시작점이 되게 합니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <AlertColumn
              title="Practical Alerts"
              eyebrow="Trip Level"
              items={tripAlerts.practical}
              tone="orange"
            />
            <AlertColumn
              title="Insight Alerts"
              eyebrow="Non-blocking Enrichment"
              items={tripAlerts.insight}
              tone="indigo"
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <div className="space-y-5">
              {ORGANIZE_CARD_SECTIONS.map(({ title, cards }) => (
                <div key={title} className="rounded-3xl border border-[#E8E8E8] bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-[#1A1A1A]">{title}</h2>
                      <p className="mt-1 text-xs text-[#888]">
                        alert를 본 뒤 어떤 그룹의 카드를 먼저 처리해야 할지 바로 이어서 판단할 수 있습니다.
                      </p>
                    </div>
                    <span className="rounded-full bg-[#F5F5F5] px-2.5 py-1 text-xs font-medium text-[#666]">
                      {cards.length}개
                    </span>
                  </div>
                  <div className="space-y-3">
                    {cards.map((card) => (
                      <TripCard key={card.instance_id} card={card} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <aside className="space-y-5">
              <div className="rounded-3xl border border-[#E8E8E8] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#1A1A1A]">왜 합치는가</h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#666]">
                  <li>교통 패스, 공항 이동, 환전 같은 실무 정보를 카드 위로 올려 우선순위를 잡게 합니다.</li>
                  <li>성수기, 날씨, 지역 행사 인사이트를 미리 보여줘 카드 선택 판단을 돕습니다.</li>
                  <li>추후 03 상단 summary 영역 확장 시 alert의 정착 위치를 검증할 수 있습니다.</li>
                </ul>
              </div>

              <div className="rounded-3xl border border-[#E5E7EB] bg-[#FAFAFA] p-6">
                <h3 className="text-lg font-semibold text-[#1A1A1A]">화면 메모</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#777]">
                  이 데모는 실제 03을 완전히 대체하기보다, 상단 hero + alert strip + 카드 그룹이 한 세트로 움직일 때의 밀도와 시선을 보기 위한 버전입니다.
                </p>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </div>
  );
}
