"use client";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { CopyField } from "@/components/ui/CopyField";

export default function Home() {
  const weddingDate = "2025년 10월 18일 (토) 오후 1시";
  const weddingPlace = "서울시 OO구 OO웨딩홀 3층 그랜드홀";
  const account = "국민 123456-12-123456 (김OO)";

  return (
    <div className="min-h-dvh bg-[url('/window.svg')] bg-[length:180px] bg-center bg-no-repeat sm:bg-[length:260px]">
      <main className="mx-auto max-w-md px-5 py-8">
        <section className="text-center py-8">
          <div className="text-[40px] leading-none">💍</div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">우리 결혼합니다</h1>
          <p className="mt-1 text-sm text-foreground/70">김OO · 박OO</p>
        </section>

        <Card className="mt-2">
          <CardTitle>초대의 글</CardTitle>
          <CardContent>
            두 사람이 서로의 반쪽이 되어 한 길을 걸으려 합니다.
            따뜻한 마음으로 축복해 주시면 큰 기쁨이 되겠습니다.
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardTitle>일시 · 장소</CardTitle>
          <CardContent>
            <div className="text-sm">
              <div className="flex items-center gap-2">
                <span className="text-foreground/70 w-14">일시</span>
                <span className="font-medium">{weddingDate}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-foreground/70 w-14">장소</span>
                <span className="font-medium">{weddingPlace}</span>
              </div>
            </div>
            <div className="mt-4">
              <Button className="w-full" onClick={() => {
                const query = encodeURIComponent(weddingPlace);
                window.open(`https://map.naver.com/p/search/${query}`);
              }}>네이버지도 열기</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardTitle>마음 전하실 곳</CardTitle>
          <CardContent>
            <CopyField label="신랑측 계좌" value={account} />
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-foreground/60">
          초대장 링크를 통해 참석 여부를 알려주세요.
        </div>

        <div className="mt-4 flex gap-3">
          <Button variant="secondary" className="flex-1">참석</Button>
          <Button variant="ghost" className="flex-1">불참</Button>
        </div>
      </main>
    </div>
  );
}
