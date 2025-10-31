export type Viewport = { width: number; height: number };

export type Rect = { x: number; y: number; w: number; h: number };

// 상호작용 가능한 최소 컴포넌트 계약
export interface UIComponent {
    id: string;
    frame: Rect; // 배치 결과(레이아웃이 계산)
    render: (ctx: CanvasRenderingContext2D) => void;
    hitTest?: (x: number, y: number) => boolean;
    onClick?: () => void;
}

// 레이아웃 전략 계약
export interface LayoutStrategy {
    compute: (components: UIComponent[], viewport: Viewport) => UIComponent[];
}

// 유틸: 기본 히트 테스트 생성
export function createRectHitTest(rect: Rect): (x: number, y: number) => boolean {
    return (x: number, y: number) => x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}


