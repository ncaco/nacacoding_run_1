"use client";
import { Card, CardContent } from "@/components/ui/Card";
import { CopyField } from "@/components/ui/CopyField";
import { ShareButton } from "@/components/ui/ShareButton";
import { CalendarActions } from "@/components/ui/CalendarActions";
import { MapActions } from "@/components/ui/MapActions";
import { Section } from "@/components/Section";
import { Hero } from "@/components/Hero";
import { Gallery } from "@/components/Gallery";
// import { Accounts } from "@/components/Accounts"; // no longer used: 부모님 계좌는 각 측 카드 내부로 이동
import { CalendarIcon, MapPinIcon, PhoneIcon } from "@/components/ui/icons";
import { AccountCard } from "@/components/AccountCard";
import { Timeline } from "@/components/Timeline";

export default function Home() {
  const weddingDate = "2025년 11월 22일 (토) 오후 1시 30분";
  const weddingPlace = "서울 강남구 삼성로 123 라움 웨딩홀 2층 가든홀";
  const account = "우리 1002-123-456789 (김하준)";
  const brideAccount = "신한 110-987-654321 (박서연)";
  const heroSrc = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1600&auto=format&fit=crop";
  const galleryItems = [
    { src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop" },
    { src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop" },
    { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop" },
    { src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop" },
    { src: "https://images.unsplash.com/photo-1516280030429-27679b3dc9cf?q=80&w=800&auto=format&fit=crop" },
    { src: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=800&auto=format&fit=crop" },
  ];
  const timeline = [
    { time: "12:50", label: "하객 입장" },
    { time: "13:00", label: "예식 시작" },
    { time: "13:40", label: "부케/행진" },
    { time: "14:00", label: "피로연" },
  ];
  const phoneSelf = { groom: "010-1111-2222", bride: "010-3333-4444" } as const;
  const phoneParents = {
    groom: { "아버님": "010-1234-5678", "어머님": "010-8765-4321" },
    bride: { "아버님": "010-2222-3333", "어머님": "010-9876-5432" },
  } as const;
  const accountsParents = {
    groom: [
      {
        groupTitle: "혼주",
        accounts: [
          { label: "아버님", value: "국민 123456-12-000001 (김영수)" },
          { label: "어머님", value: "우리 1002-000-111111 (이미애)" },
        ],
      },
    ],
    bride: [
      {
        groupTitle: "혼주",
        accounts: [
          { label: "아버님", value: "신한 110-222-333333 (박성호)" },
          { label: "어머님", value: "하나 123-910000-44444 (최윤정)" },
        ],
      },
    ],
  } as const;

  return (
    <div className="min-h-dvh bg-[radial-gradient(115%_95%_at_50%_-10%,#f1f5ff_0%,#ffffff_40%),linear-gradient(180deg,#ffffff_0%,#f9fafb_100%)] dark:bg-[radial-gradient(115%_95%_at_50%_-10%,#0b1220_0%,#0a0a0a_40%),linear-gradient(180deg,#0a0a0a_0%,#111111_100%)]">
      <main className="mx-auto max-w-xl px-6 py-10">
        <section className="text-center pb-8">
          <span className="inline-flex items-center rounded-full bg-black/5 dark:bg-white/10 px-3 py-1 text-xs font-medium tracking-wide">Invitation</span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>김하준 & 박서연</h1>
          <p className="mt-3 text-base text-foreground/70">{weddingDate}</p>
          <p className="text-base text-foreground/70">{weddingPlace}</p>
        </section>

        <Section fullBleed>
          <Hero src={heroSrc} caption="우리의 시작, 함께해 주세요" />
        </Section>

        <Section title="초대의 글">
          <Card>
            <CardContent>
              두 사람이 서로의 반쪽이 되어 한 길을 걸으려 합니다.
              따뜻한 마음으로 축복해 주시면 큰 기쁨이 되겠습니다.
            </CardContent>
          </Card>
        </Section>

        <Section title="일시 · 장소">
          <Card>
            <CardContent>
              <div className="text-[15px]">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-foreground/70"><CalendarIcon size={18} /></div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-foreground/60">일시</div>
                    <div className="font-medium leading-6">{weddingDate}</div>
                  </div>
                </div>
                <div className="my-3 h-px bg-black/10 dark:bg-white/10" />
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-foreground/70"><MapPinIcon size={18} /></div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-foreground/60">장소</div>
                    <div className="font-medium leading-6">{weddingPlace}</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <CalendarActions
                  title="김하준 · 박서연 결혼식"
                  description="함께해 주시면 감사하겠습니다."
                  location={weddingPlace}
                  start={new Date("2025-11-22T13:30:00")}
                  end={new Date("2025-11-22T15:00:00")}
                />
                <MapActions query={weddingPlace} />
              </div>
            </CardContent>
          </Card>
        </Section>

        <Section title="갤러리" subtitle="준비된 사진으로 미리 분위기를 전해 드려요" fullBleed>
          <div className="px-5">
            <Gallery items={galleryItems} />
          </div>
        </Section>

        <Section title="타임라인">
          <Card>
            <CardContent>
              <Timeline items={timeline} />
            </CardContent>
          </Card>
        </Section>

        

        <Section title="마음 전하실 곳" subtitle="축하의 뜻을 전해 주시는 분들을 위해 안내드립니다">
          <div className="space-y-4">
            <AccountCard
              sideLabel="신랑측"
              primaryLabel="신랑측 계좌"
              primaryAccount={account}
              primaryPhone={phoneSelf.groom}
              parents={accountsParents.groom[0].accounts.map((acc) => {
                const name = (acc.value.match(/\(([^)]+)\)\s*$/) || [])[1];
                return {
                  roleLabel: `${acc.label}${name ? ` · ${name}` : ""}`,
                  accountValue: acc.value,
                  phone: phoneParents.groom[acc.label as keyof typeof phoneParents.groom],
                };
              })}
            />
            <AccountCard
              sideLabel="신부측"
              primaryLabel="신부측 계좌"
              primaryAccount={brideAccount}
              primaryPhone={phoneSelf.bride}
              parents={accountsParents.bride[0].accounts.map((acc) => {
                const name = (acc.value.match(/\(([^)]+)\)\s*$/) || [])[1];
                return {
                  roleLabel: `${acc.label}${name ? ` · ${name}` : ""}`,
                  accountValue: acc.value,
                  phone: phoneParents.bride[acc.label as keyof typeof phoneParents.bride],
                };
              })}
            />
          </div>
        </Section>

        <footer className="mt-10 flex items-center justify-between">
          <p className="text-xs text-foreground/60">함께해 주셔서 감사합니다</p>
          <ShareButton title="우리 결혼합니다" text="김하준 · 박서연 결혼식 초대장" />
        </footer>
      </main>
    </div>
  );
}
