import AccountList from "./components/AccountList";
import MapActions from "./components/MapActions";
import Gallery from "./components/Gallery";
import ShareActions from "./components/ShareActions";
import HeroImage from "./components/HeroImage";
import WeddingCalendar from "./components/WeddingCalendar";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <main>
        {/* Hero */}
        <section className="px-6 pt-8 pb-4 text-center">
          <div className="mx-auto max-w-4xl card px-6 py-6">
            <p className="text-sm text-gray-600">2025. 11. 15 토요일 오후 1시</p>
            <h1 className="section-title mt-2 text-4xl font-semibold">신랑 홍길동 · 신부 김영희</h1>
            <p className="mt-3 text-gray-700">함께하는 이 순간을 초대합니다</p>
          </div>
          <div className="mx-auto max-w-4xl card p-2 overflow-hidden mt-4">
            {/* @ts-expect-error Server Component importing Client - allowed for simple props */}
            <HeroImage src="/hero-sample.jpg" alt="웨딩 사진" />
          </div>
        </section>

        {/* 일정 */}
        <section className="px-6 py-10">
          <div className="mx-auto max-w-4xl card px-6 py-8">
            <h2 className="section-title text-2xl">일정</h2>
            <div className="mt-4">
              {/* @ts-expect-error Server Component importing Client - allowed for simple props */}
              <WeddingCalendar />
            </div>
          </div>
        </section>

        {/* 장소 */}
        <section className="px-6 py-10">
          <div className="mx-auto max-w-4xl card px-6 py-8">
            <h2 className="section-title text-2xl">장소</h2>
            <p className="mt-2 text-gray-700">
              서울 강남구 테헤란로 123, 스카이컨벤션 3층 그랜드홀 (샘플)
            </p>
            <div className="mt-4 aspect-video w-full rounded-xl grid place-items-center text-gray-500 border border-[#f5d7df] bg-[#fff2f6]">
              지도 영역(카카오/네이버 임베드 예정)
            </div>
            {/* @ts-expect-error Server Component importing Client - allowed for simple props */}
            <MapActions
              kakaoUrl="https://map.kakao.com/link/map/스카이컨벤션,37.498095,127.027610"
              naverUrl="https://naver.me/xxxxxx"
            />
          </div>
        </section>

        {/* 갤러리 */}
        <section className="px-6 py-10">
          <div className="mx-auto max-w-4xl card px-6 py-8">
            <h2 className="section-title text-2xl">갤러리</h2>
            {/* @ts-expect-error Server Component importing Client - allowed for simple props */}
            <Gallery
              items={[
                { src: "/next.svg", alt: "샘플 1" },
                { src: "/vercel.svg", alt: "샘플 2" },
                { src: "/globe.svg", alt: "샘플 3" },
              ]}
            />
          </div>
        </section>

        {/* RSVP 섹션 제거 (요청에 따라 숨김) */}

        {/* 축의금 안내 (샘플 계좌) */}
        <section className="px-6 py-10">
          <div className="mx-auto max-w-4xl card px-6 py-8">
            <h2 className="section-title text-2xl">축의금 안내 (샘플 계좌)</h2>
            <div className="mt-4 space-y-3">
              {/* @ts-expect-error Server Component importing Client - allowed for simple props */}
              <AccountList
                title="신랑측"
                accounts={[
                  { label: "신랑 홍길동", bank: "카카오뱅크", number: "3333-00-1234567" },
                  { label: "신랑 아버지 홍판서", bank: "농협", number: "301-0000-1234-56" },
                  { label: "신랑 어머니 이숙자", bank: "국민", number: "787801-01-123456" },
                ]}
              />
              {/* @ts-expect-error Server Component importing Client - allowed for simple props */}
              <AccountList
                title="신부측"
                accounts={[
                  { label: "신부 김영희", bank: "신한", number: "110-123-456789" },
                  { label: "신부 아버지 김대성", bank: "우리", number: "1002-123-456789" },
                  { label: "신부 어머니 박정희", bank: "기업", number: "010-123456-01-012" },
                ]}
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="px-6 py-12 text-center text-sm text-gray-600">
        <div className="mb-4 flex justify-center">
          {/* @ts-expect-error Server Component importing Client - allowed for simple props */}
          <ShareActions title="우리의 결혼식 초대장" text="함께 축하해 주세요" />
        </div>
        감사합니다
      </footer>
    </div>
  );
}
