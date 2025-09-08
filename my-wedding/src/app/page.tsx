import AccountList from "./components/AccountList";
import MapActions from "./components/MapActions";
import Gallery from "./components/Gallery";
import ShareActions from "./components/ShareActions";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <main>
        {/* Hero */}
        <section className="px-6 py-16 text-center">
          <p className="text-sm text-gray-500">2025. 11. 15 토요일 오후 1시</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">신랑 홍길동 · 신부 김영희 결혼식</h1>
          <p className="mt-3 text-gray-600">소중한 당신을 초대합니다</p>
        </section>

        {/* 일정 */}
        <section className="px-6 py-10">
          <h2 className="text-xl font-medium">일정</h2>
          <div className="mt-3 text-gray-700">
            <div>· 하객 입장 및 포토: 12:00</div>
            <div>· 예식: 13:00</div>
            <div>· 피로연: 14:00</div>
          </div>
        </section>

        {/* 장소 */}
        <section className="px-6 py-10">
          <h2 className="text-xl font-medium">장소</h2>
          <p className="mt-2 text-gray-700">
            서울 강남구 테헤란로 123, 스카이컨벤션 3층 그랜드홀 (샘플)
          </p>
          <div className="mt-4 aspect-video w-full bg-gray-100 rounded-xl grid place-items-center text-gray-400">
            지도 영역(카카오/네이버 임베드 예정)
          </div>
          {/* 지도 액션 */}
          {/* 실제 장소 좌표에 맞춰 링크만 교체하면 됩니다. */}
          {/* 예시: 카카오맵 장소 공유 링크, 네이버지도 장소 링크 */}
          {/* https://map.kakao.com/link/map/장소명,위도,경도 */}
          {/* https://naver.me/xxxxx */}
          {/* 컴포넌트 분리 */}
          {/* @ts-expect-error Server Component importing Client - allowed for simple props */}
          <MapActions
            kakaoUrl="https://map.kakao.com/link/map/스카이컨벤션,37.498095,127.027610"
            naverUrl="https://naver.me/xxxxxx"
          />
        </section>

        {/* 갤러리 placeholder */}
        <section className="px-6 py-10">
          <h2 className="text-xl font-medium">갤러리</h2>
          {/* @ts-expect-error Server Component importing Client - allowed for simple props */}
          <Gallery
            items={[
              { src: "/next.svg", alt: "샘플 1" },
              { src: "/vercel.svg", alt: "샘플 2" },
              { src: "/globe.svg", alt: "샘플 3" },
            ]}
          />
        </section>

        {/* RSVP */}
        <section className="px-6 py-10">
          <h2 className="text-xl font-medium">참석 의사 전달</h2>
          <p className="mt-2 text-gray-700">아래 버튼을 눌러 폼에 남겨주세요.</p>
          <a
            href="https://forms.gle/your-form-id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex mt-4 h-11 px-5 items-center rounded-full bg-black text-white hover:opacity-90"
          >
            RSVP 작성하기
          </a>
        </section>

        {/* 축의금 안내 (샘플 계좌) */}
        <section className="px-6 py-10">
          <h2 className="text-xl font-medium">축의금 안내</h2>
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
        </section>
      </main>
      <footer className="px-6 py-12 text-center text-sm text-gray-500">
        <div className="mb-4 flex justify-center">
          {/* @ts-expect-error Server Component importing Client - allowed for simple props */}
          <ShareActions title="우리의 결혼식 초대장" text="함께 축하해 주세요" />
        </div>
        감사합니다
      </footer>
    </div>
  );
}
