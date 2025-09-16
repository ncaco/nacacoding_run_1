모바일 청첩장 (The Urban)
=================================

개발 스택: Next.js(App Router) + TypeScript + Tailwind(v4)

로컬 실행
```bash
npm install
npm run dev
```

주요 페이지
- `/` 랜딩(히어로/라인업/특징/제작방법/FAQ)
- `/template` 샘플 청첩장 미리보기
- `/template/rsvp` RSVP 폼
- `/api/rsvp` RSVP 수집 API (메모리 저장)

배포 빌드
```bash
npm run build && npm run start
```

테마 컬러는 `src/app/globals.css`의 CSS 변수로 정의되어 있습니다.

배포는 Vercel 사용을 권장합니다.
