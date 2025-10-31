## 캔버스 아키텍처 개요

본 프로젝트의 렌더링/상호작용 구조는 다음과 같은 계층으로 구성됩니다:

- **Canvas**: 브라우저의 `HTMLCanvasElement` 한 개. 렌더링 표면.
- **Frame**: 디바이스/뷰포트 변화에 반응하여 캔버스 크기와 DPR 스케일을 조정하고, 입력 이벤트를 현재 Scene에 위임. 렌더 루프 관리.
- **Scene**: 화면의 논리 단위. 각 Scene은 자체 `render` 및 입력 핸들러를 제공. 씬 전환은 `setScene`으로 수행.
- **Layout**: 씬 내부에서 컴포넌트 배치를 책임지는 전략. 뷰포트 크기 변화에 따른 배치 계산을 제공.
- **Component**: 버튼, 텍스트, 모달 등 개별 UI 기능 단위. 그리기와(필요 시) 히트 테스트/상호작용을 제공.

### 데이터 흐름

1. Frame이 디바이스 픽셀 비율(DPR)과 뷰포트 크기에 맞춰 캔버스를 설정하고 렌더 루프를 실행합니다.
2. 각 프레임에서 Frame은 현재 Scene의 `render(ctx, width, height)`를 호출합니다.
3. Scene은 자신의 Layout 전략을 통해 컴포넌트들의 배치를 계산하고, 컴포넌트의 `render`를 호출합니다.
4. 입력 이벤트(click, keydown 등)는 Frame이 Scene으로 위임하고, Scene은 필요 시 레이아웃/컴포넌트로 재위임합니다.

### 계약(Contracts)

- Frame → Scene
  - `render(ctx, width, height)`는 CSS 픽셀 기준 `width/height`를 인자로 받습니다.
  - `onResize(width, height)`로 뷰포트 기반 레이아웃 재계산을 수행할 수 있습니다.
  - 입력 이벤트(`onClick`, `onKeyDown`)는 Scene이 보유한 핸들러로 위임됩니다.

- Scene → Layout
  - `layout.compute(components, viewport)`는 컴포넌트들의 배치(Rect/좌표)를 반환합니다.
  - Scene은 해당 배치를 사용해 컴포넌트 렌더/히트 테스트를 수행합니다.

- Scene/Layout → Component
  - 컴포넌트는 `render(ctx)`로 그리기를 수행하고, 필요 시 `hitTest(x,y)`와 `onClick()`을 제공합니다.

### 디렉터리 구조 제안

```
src/
  0_frame/            # Frame 초기화 및 루프, 이벤트 위임
  1_scene/            # Scene 별 디렉터리
    <sceneName>/
      index.ts
  2_layout/           # 레이아웃 전략과 타입
    index.ts          # Layout/Component 타입 정의와 헬퍼
    layout_center.ts  # 중앙 배치(그리드/스택) 레이아웃 구현
  3_component/        # 버튼, 텍스트, 모달 등 컴포넌트
```

### 예시: 중앙 배치 레이아웃

- 뷰포트 중앙 정렬 기준으로 N×M 그리드로 컴포넌트를 배치.
- Scene은 `onResize`에서 레이아웃을 재계산하고, `render`에서 배치된 좌표로 컴포넌트를 그립니다.

### 설계 원칙

- Frame은 디바이스 적응(DPR/리사이징)과 이벤트 위임만 담당하고, 도메인 로직은 Scene 이하에서 처리합니다.
- Scene은 레이아웃 전략에 의존하되, 특정 컴포넌트 구현에 강결합되지 않도록 구성합니다.
- Component는 그리기와 상호작용 단위를 명확히 분리하고, 가능한 순수 렌더 헬퍼를 유지합니다.

---

본 문서는 변경되는 구현에 맞춰 계속 갱신되어야 합니다.


