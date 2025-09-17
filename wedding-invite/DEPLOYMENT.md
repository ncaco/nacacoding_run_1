# 배포 가이드

## 정적 내보내기 (Static Export)

- 사전 요구사항: Node.js 18+, npm
- 빌드 및 내보내기

```bash
npm run export
```

- 결과물: `out/` 폴더에 정적 파일이 생성됩니다.
- 로컬 미리보기

```bash
npm run preview
```

- 임의의 정적 호스팅(예: GitHub Pages, S3, Naver Cloud) 등에 `out/` 폴더 내용을 업로드하세요.

## Vercel 배포

- `output: "export"` 설정은 필요 시 제거 가능합니다. SSR/ISR을 원한다면 `next.config.ts`에서 `output`을 삭제하세요.
- Vercel에 연결 후 기본 빌드 커맨드:
  - Build Command: `npm run build`
  - Output Directory: (기본값)

정적 사이트로 유지하려면, `Build Command: npm run export`와 `Output Directory: out`으로 설정하면 됩니다.

## 도메인 연결

- 배포 후 사용자 도메인을 연결하고 `metadataBase`를 실제 도메인으로 업데이트하세요.
