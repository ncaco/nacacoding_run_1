import Button from "@/components/ui/Button";
import { Card, CardMuted, CardTitle } from "@/components/ui/Card";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import CopyField from "@/components/ui/CopyField";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      {/* 인사/커버 */}
      <section className="container-gap pt-14 pb-14">
        <div className="relative overflow-hidden rounded-[28px] border border-sand">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_400px_at_20%_-40%,#ffffff,transparent)]" />
          <div className="relative p-8 md:p-12 bg-peach">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">THE URBAN WEDDING</p>
            <h1 className="mt-2 text-4xl md:text-5xl font-[600] text-ink" style={{fontFamily:'var(--font-serif-kr)'}}>김철수 · 김영미 결혼식에 초대합니다</h1>
            <p className="mt-4 text-neutral-700 leading-relaxed max-w-2xl">두 사람이 서로의 가장 친한 친구가 되어 새로운 출발을 하려 합니다. 바쁘시더라도 참석하시어 축복해 주시면 감사하겠습니다.</p>
            <div className="mt-8 flex gap-3">
              <Button href="#info" asChild variant="primary">예식 정보 보기</Button>
              <Button href="#parents" asChild variant="outline">혼주 정보</Button>
            </div>
          </div>
        </div>
      </section>

      {/* 예식 정보 */}
      <section id="info" className="container-gap py-12">
        <h2 className="section-title">예식 정보</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Card>
            <CardTitle>일시</CardTitle>
            <CardMuted className="mt-1">2025년 10월 18일 토요일 오후 1시 30분</CardMuted>
          </Card>
          <Card>
            <CardTitle>장소</CardTitle>
            <CardMuted className="mt-1">서울 더어반 웨딩홀 2층 루나홀</CardMuted>
          </Card>
        </div>
      </section>

      {/* 왜 더 어반인가요 */}
      {/* 혼주 정보 */}
      <section id="parents" className="container-gap py-12">
        <h2 className="section-title">혼주 정보</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Card>
            <CardTitle>신랑측</CardTitle>
            <CardMuted className="mt-1">신랑 김철수 · 신랑부모</CardMuted>
          </Card>
          <Card>
            <CardTitle>신부측</CardTitle>
            <CardMuted className="mt-1">신부 김영미 · 신부부모</CardMuted>
          </Card>
        </div>
      </section>

      {/* 제작 방법 */}
      <section className="container-gap py-12">
        <h2 className="section-title">제작 방법</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-4">
          <Card><CardTitle>1. 템플릿 선택</CardTitle><CardMuted className="mt-1">선호 스타일 선택</CardMuted></Card>
          <Card><CardTitle>2. 정보 입력</CardTitle><CardMuted className="mt-1">신랑·신부·예식 정보</CardMuted></Card>
          <Card><CardTitle>3. 섹션 설정</CardTitle><CardMuted className="mt-1">갤러리/지도/계좌/RSVP</CardMuted></Card>
          <Card><CardTitle>4. 공유</CardTitle><CardMuted className="mt-1">링크 전달로 끝</CardMuted></Card>
        </div>
      </section>

      {/* 계좌/복사 섹션 */}
      <section className="container-gap py-12">
        <h2 className="section-title">마음 전하실 곳</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <CopyField label="신랑측(국민)" value="1234-56-789012 홍길동" />
          <CopyField label="신부측(신한)" value="110-123-456789 김민지" />
        </div>
      </section>

      {/* FAQ */}
      {/* 자주 묻는 질문 */}
      <section className="container-gap py-14 pb-20">
        <h2 className="section-title">자주 묻는 질문</h2>
        <div className="mt-6">
          <Accordion>
            <AccordionItem title="무료로 만들 수 있나요?">기본 템플릿은 무료로 생성 및 공유가 가능합니다.</AccordionItem>
            <AccordionItem title="모바일 공유는 어떻게 하나요?">상단 주소창의 링크를 복사해 문자/카톡으로 전달하면 됩니다.</AccordionItem>
            <AccordionItem title="식장 약도는 어디 있나요?">장소 섹션에 지도 이미지를 추가하거나 지도 링크를 첨부할 수 있습니다.</AccordionItem>
          </Accordion>
        </div>
      </section>
    </main>
  );
}


