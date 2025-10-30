# Interactive Hexagon Canvas

TypeScript로 만든 마우스로 회전 가능한 정육각형 캔버스 애플리케이션입니다.

## 🎨 기능

- **마우스 드래그**: 정육각형을 마우스로 드래그하여 자유롭게 회전
- **터치 지원**: 모바일 기기에서도 터치로 회전 가능
- **전체 화면**: 캔버스가 화면 전체를 차지하며, 반응형으로 리사이징
- **심플한 디자인**: 순수한 배경과 정육각형만 표시
- **색상 분리**: 배경색과 도형 색상을 독립적으로 설정 가능

## 🚀 시작하기

### 필요 사항

- Node.js (v14 이상)
- npm 또는 yarn

### 설치

```bash
npm install
```

### 개발 모드 실행

```bash
# Webpack 개발 서버 실행 (HMR 지원)
npm run dev
```

자동으로 브라우저가 열리고 `http://localhost:8080`에서 실행됩니다.

### 빌드

```bash
# 프로덕션 빌드
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

## 📂 프로젝트 구조

```
.
├── src/
│   ├── main.ts              # 메인 로직 (캔버스, 이벤트, 애니메이션)
│   └── hexagon.ts           # 정육각형 그리기 로직
├── styles/
│   └── main.css             # 스타일시트
├── dist/                    # 빌드 결과물 (자동 생성)
├── index.html               # 메인 HTML 파일
├── tsconfig.json            # TypeScript 설정
├── webpack.config.js        # Webpack 설정
├── package.json             # npm 패키지 설정
└── README.md                # 프로젝트 문서
```

## 🏗️ 아키텍처

심플한 구조로 설계되었습니다:

- **main.ts**: 캔버스 초기화, 이벤트 처리, 애니메이션 루프 (단일 파일에 모든 로직)
- **hexagon.ts**: 정육각형 도형의 렌더링 로직만 담당
- **main.css**: 최소한의 스타일 정의

## 🎮 사용법

1. 웹 브라우저에서 `http://localhost:8080` 접속
2. 캔버스의 정육각형을 마우스로 드래그하여 회전
3. 화면 크기를 조정하면 정육각형이 자동으로 중앙에 위치

### 색상 커스터마이징

**배경색** - `styles/main.css` 파일에서 설정:
```css
:root {
    --background-color: #000000;  /* 배경색 설정 */
}
```

**도형 설정** - `src/hexagon.ts` 파일의 생성자 기본값에서 설정:
```typescript
constructor(
    centerX: number,
    centerY: number,
    size: number = 200,           // 도형 크기
    color: string = '#4ECDC4'     // 도형 색상 (민트)
)
```

예시:
- 흰색 배경에 빨간 도형: 
  - `main.css`: `--background-color: #FFFFFF;`
  - `hexagon.ts`: `color: '#FF0000'`
- 파란색 배경에 노란 도형:
  - `main.css`: `--background-color: #0000FF;`
  - `hexagon.ts`: `color: '#FFFF00'`

## 🛠️ 기술 스택

- **TypeScript**: 타입 안정성을 갖춘 JavaScript
- **HTML5 Canvas**: 2D 그래픽 렌더링
- **CSS3**: 모던 스타일링 및 애니메이션

## 📝 라이선스

MIT License

