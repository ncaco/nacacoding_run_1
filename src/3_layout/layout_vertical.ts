import { LayoutStrategy, Rect, UIComponent, Viewport } from './index';
import { debugStrokeRect } from '../0_config/index';

// 수직 스택 레이아웃: 가운데 정렬로 위에서 아래로 나열
// 각 아이템은 동일한 크기(itemSize)로 배치되며, gap 간격을 둡니다.
export function createVerticalStackLayout(options: {
    itemSize: { w: number; h: number };
    gap?: number;
    align?: 'center' | 'left' | 'right';
}): LayoutStrategy {
    const gap = options.gap ?? 8;
    const itemW = options.itemSize.w;
    const itemH = options.itemSize.h;
    const align = options.align ?? 'center';

    function computeOrigin(viewport: Viewport, count: number): { x: number; y: number } {
        const totalH = count * itemH + Math.max(0, count - 1) * gap;
        // 수직 중앙 시작점
        const y = Math.round((viewport.height - totalH) / 2);
        // 수평 정렬
        let x = 0;
        if (align === 'center') x = Math.round((viewport.width - itemW) / 2);
        else if (align === 'left') x = 0;
        else x = Math.max(0, viewport.width - itemW);
        return { x, y };
    }

    return {
        compute(components: UIComponent[], viewport: Viewport): UIComponent[] {
            const placed: UIComponent[] = [];
            const { x: baseX, y: baseY } = computeOrigin(viewport, components.length);
            for (let i = 0; i < components.length; i++) {
                const x = baseX;
                const y = baseY + i * (itemH + gap);
                const frame: Rect = { x, y, w: itemW, h: itemH };
                const c = components[i];
                placed.push({
                    ...c,
                    frame,
                    render: (ctx) => {
                        c.render(ctx);
                        debugStrokeRect(ctx, frame.x, frame.y, frame.w, frame.h);
                    },
                    hitTest: c.hitTest ?? ((px, py) => px >= x && px <= x + itemW && py >= y && py <= y + itemH),
                });
            }
            return placed;
        },
    };
}


