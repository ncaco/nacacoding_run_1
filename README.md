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
│   ├── layout.ts            # 가상 레이아웃 영역 관리
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

완전히 모듈화된 구조로 설계되었습니다:

- **main.ts**: 캔버스 초기화 및 애니메이션 루프만 담당 (40줄) - 최소한의 오케스트레이션
- **layout.ts**: 레이아웃 영역 + 헥사곤 생성/관리 + 이벤트 처리 + 자체 설정 + 커서 관리 (212줄)
- **hexagon.ts**: 정육각형 도형의 렌더링 로직 + 자체 설정 (76줄)
- **main.css**: 스타일 정의

### 레이아웃 시스템
- 레이아웃은 캔버스 내 가상의 영역을 정의합니다
- **모든 것을 레이아웃에서 관리합니다:**
  - 헥사곤 생성 및 관리
  - 마우스/터치 이벤트 처리
  - 헥사곤 회전 로직
  - 렌더링 (헥사곤 포함)
  - **자체 설정 관리** (크기, 색상, 테두리 등)
  - **동적 커서 변경** (레이아웃 영역 내에서만 grab/grabbing)
- 마우스/터치 이벤트는 레이아웃 영역 내에서만 동작합니다
- 마우스 커서는 위치에 따라 자동으로 변경됩니다:
  - 레이아웃 밖: `default`
  - 레이아웃 안: `grab`
  - 드래그 중: `grabbing`
- 헥사곤은 레이아웃 생성 시 자동으로 중심에 배치됩니다
- **캔버스**: 1920x1080 (`CanvasConfig` 클래스에서 설정)
- **레이아웃**: 800x600 (`Layout.CONFIG`에서 설정), 자동으로 캔버스 중앙 배치
- 레이아웃 크기 변경 시 헥사곤 위치도 자동 조정됩니다
- 디버그 모드(`layout.draw(ctx, true)`)로 레이아웃 경계를 시각화할 수 있습니다

## 🎮 사용법

1. 웹 브라우저에서 `http://localhost:8080` 접속
2. 중앙의 레이아웃 영역 내에서 정육각형을 마우스로 드래그하여 회전
3. 각 컴포넌트의 설정은 해당 컴포넌트 파일에서 조정:
   - **캔버스 크기**: `src/main.ts`의 `CanvasConfig` 클래스
   - **레이아웃 크기/색상**: `src/layout.ts`의 `Layout.CONFIG`
   - **도형 크기/색상**: `src/hexagon.ts`의 생성자 기본값

### 색상 커스터마이징

**배경색** - `styles/main.css` 파일에서 설정:
```css
:root {
    --background-color: transparent;  /* 배경색 설정 (현재: 투명) */
}
```

**캔버스 크기** - `src/main.ts` 파일에서 설정:
```typescript
class CanvasConfig {
    static readonly WIDTH = 1920;
    static readonly HEIGHT = 1080;
}
```

**레이아웃 설정** - `src/layout.ts` 파일에서 설정:
```typescript
static readonly CONFIG = {
    width: 800,                 // 레이아웃 너비
    height: 600,                // 레이아웃 높이
    borderColor: '#000000',     // 테두리 색상
    borderWidth: 1,             // 테두리 두께
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
};
```

**도형 설정** - `src/hexagon.ts` 파일에서 설정:
```typescript
constructor(
    centerX: number,
    centerY: number,
    size: number = 200,           // 도형 크기
    color: string = '#4ECDC4'     // 도형 색상 (민트)
)
```

예시:
- 흰색 배경: `main.css`: `--background-color: #FFFFFF;`
- 검정 배경: `main.css`: `--background-color: #000000;`
- 투명 배경: `main.css`: `--background-color: transparent;` (현재 설정)

## 🛠️ 기술 스택

- **TypeScript**: 타입 안정성을 갖춘 JavaScript
- **HTML5 Canvas**: 2D 그래픽 렌더링
- **CSS3**: 모던 스타일링 및 애니메이션

## 📝 라이선스

MIT License

