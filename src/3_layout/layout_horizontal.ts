import { LayoutStrategy, Rect, UIComponent, Viewport } from './index';
import { debugStrokeRect } from '../0_config/index';

// 수평 스택 레이아웃: 가운데 정렬로 왼쪽에서 오른쪽으로 나열
// 각 아이템은 동일한 크기(itemSize)로 배치되며, gap 간격을 둡니다.
export function createHorizontalStackLayout(options: {
    itemSize: { w: number; h: number };
    gap?: number;
    valign?: 'center' | 'top' | 'bottom';
}): LayoutStrategy {
    const gap = options.gap ?? 8;
    const itemW = options.itemSize.w;
    const itemH = options.itemSize.h;
    const valign = options.valign ?? 'center';

    function computeOrigin(viewport: Viewport, count: number): { x: number; y: number } {
        const totalW = count * itemW + Math.max(0, count - 1) * gap;
        // 수평 중앙 시작점
        const x = Math.round((viewport.width - totalW) / 2);
        // 수직 정렬
        let y = 0;
        if (valign === 'center') y = Math.round((viewport.height - itemH) / 2);
        else if (valign === 'top') y = 0;
        else y = Math.max(0, viewport.height - itemH);
        return { x, y };
    }

    return {
        compute(components: UIComponent[], viewport: Viewport): UIComponent[] {
            const placed: UIComponent[] = [];
            const { x: baseX, y: baseY } = computeOrigin(viewport, components.length);
            for (let i = 0; i < components.length; i++) {
                const x = baseX + i * (itemW + gap);
                const y = baseY;
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


