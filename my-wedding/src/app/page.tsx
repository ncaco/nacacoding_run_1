import AccountList from "./components/AccountList";
import LeafletMap from "./components/LeafletMap";
import Gallery from "./components/Gallery";
import ShareActions from "./components/ShareActions";
import HeroImage from "./components/HeroImage";
import WeddingCalendar from "./components/WeddingCalendar";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <main>
        {/* Hero */}
        <section className="px-4 sm:px-6 pt-6 sm:pt-8 pb-4 text-center">
          <div className="mx-auto max-w-4xl card px-4 sm:px-6 py-4 sm:py-6">
            <p className="text-xs sm:text-sm text-gray-700">2025. 11. 15 토요일 오후 1시</p>
            <h1 className="section-title mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1f1516]">신랑 홍길동 · 신부 김영희</h1>
            <p className="mt-3 text-sm sm:text-base text-gray-800">함께하는 이 순간을 초대합니다</p>
          </div>
          <div className="mx-auto max-w-4xl card p-1 sm:p-2 overflow-hidden mt-3 sm:mt-4">
            <HeroImage src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop" alt="웨딩 사진" />
          </div>
        </section>

        {/* 일정 */}
        <section className="px-4 sm:px-6 py-6 sm:py-10">
          <div className="mx-auto max-w-4xl card px-4 sm:px-6 py-6 sm:py-8">
            <h2 className="section-title text-xl sm:text-2xl">일정</h2>
            <div className="mt-3 sm:mt-4">
              <WeddingCalendar />
            </div>
          </div>
        </section>

        {/* 장소 */}
        <section className="px-4 sm:px-6 py-6 sm:py-10">
          <div className="mx-auto max-w-4xl card px-4 sm:px-6 py-6 sm:py-8">
            <h2 className="section-title text-xl sm:text-2xl">장소</h2>
            <p className="mt-2 text-sm sm:text-base text-gray-700">
              부산 해운대구 센텀중앙로 79, 센텀사이언스파크 컨벤션홀
            </p>
            <LeafletMap lat={35.17410} lng={129.12649} label="센텀사이언스파크 컨벤션홀" />
          </div>
        </section>

        {/* 갤러리 */}
        <section className="px-4 sm:px-6 py-6 sm:py-10">
          <div className="mx-auto max-w-4xl card px-4 sm:px-6 py-6 sm:py-8">
            <h2 className="section-title text-xl sm:text-2xl">갤러리</h2>
            <Gallery
              items={[
                { src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1600&auto=format&fit=crop", alt: "웨딩 1" },
                { src: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop", alt: "웨딩 2" },
                { src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop", alt: "웨딩 3" },
                { src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1600&auto=format&fit=crop", alt: "웨딩 4" },
                { src: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop", alt: "웨딩 5" },
                { src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop", alt: "웨딩 6" },
                { src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1600&auto=format&fit=crop", alt: "웨딩 7" },
                { src: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop", alt: "웨딩 8" },
                { src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop", alt: "웨딩 9" },
                { src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1600&auto=format&fit=crop", alt: "웨딩 10" },
                { src: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop", alt: "웨딩 11" },
                { src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop", alt: "웨딩 12" },
              ]}
            />
          </div>
        </section>

        {/* RSVP 섹션 제거 (요청에 따라 숨김) */}

        {/* 축의금 안내 (샘플 계좌) */}
        <section className="px-4 sm:px-6 py-6 sm:py-10">
          <div className="mx-auto max-w-4xl card px-4 sm:px-6 py-6 sm:py-8">
            <h2 className="section-title text-xl sm:text-2xl">축의금 안내 (샘플 계좌)</h2>
            <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              <AccountList
                title="신랑측"
                accounts={[
                  { label: "신랑 홍길동", bank: "카카오뱅크", number: "3333-00-1234567" },
                  { label: "신랑 아버지 홍판서", bank: "농협", number: "301-0000-1234-56" },
                  { label: "신랑 어머니 이숙자", bank: "국민", number: "787801-01-123456" },
                ]}
              />
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
      <footer className="px-4 sm:px-6 py-8 sm:py-12 text-center text-xs sm:text-sm text-gray-600">
        <div className="mb-3 sm:mb-4 flex justify-center">
          <ShareActions title="우리의 결혼식 초대장" text="함께 축하해 주세요" />
        </div>
        감사합니다
      </footer>
    </div>
  );
}
