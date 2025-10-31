import { createGameScene } from '../1_gameScene';
import { setScene, Scene } from '../../1_frame';
import { Dev, debugStrokeRect } from '../../0_config/index';
import { LayoutStrategy, UIComponent, Viewport } from '../../3_layout';
import { createVerticalStackLayout } from '../../3_layout/layout_vertical';
import { drawText } from '../../4_component/text';
import { drawButton, ButtonRect, isPointInRect } from '../../4_component/button';

export function createStartScene(): Scene {
    if (Dev.enabled) console.log('✅ startScene loaded');

    // 중앙 수직 스택 배치: [텍스트][버튼]
    const layout: LayoutStrategy = createVerticalStackLayout({
        itemSize: { w: 280, h: 56 },
        gap: 16,
        align: 'center',
    });

    let placed: UIComponent[] = [];

    // 배치 대상 컴포넌트 정의
    const components: UIComponent[] = [
        {
            id: 'title',
            frame: { x: 0, y: 0, w: 0, h: 0 },
            render: (ctx) => {
                const { x, y, w, h } = placed[0].frame;
                drawText(ctx, 'Game Title', x + w / 2, y + h / 2, {
                    color: '#000',
                    font: '28px system-ui, sans-serif',
                    align: 'center',
                    baseline: 'middle',
                });
            },
        },
        {
            id: 'start',
            frame: { x: 0, y: 0, w: 0, h: 0 },
            render: (ctx) => {
                const { x, y, w, h } = placed[1].frame;
                drawButton(ctx, { x, y, w, h }, '시작하기', { bgColor: '#fff', textColor: '#000' });
            },
            onClick: () => setScene(createGameScene()),
        },
    ];

    const recompute = (width: number, height: number) => {
        placed = layout.compute(components, { width, height } as Viewport);
    };

    return {
        render: (ctx, width, height) => {
            // 배경(검정)
            ctx.fillStyle = 'rgba(0, 0, 0, 0.0)';
            ctx.fillRect(0, 0, width, height);

            if (placed.length === 0) recompute(width, height);

            // 컴포넌트 렌더링
            placed.forEach((c) => {
                c.render(ctx);
                // 개발 모드라면 각 컴포넌트 프레임 표시
                debugStrokeRect(ctx, c.frame.x, c.frame.y, c.frame.w, c.frame.h);
            });
        },
        onResize: (w, h) => recompute(w, h),
        onClick: (x, y) => {
            const hit = placed.find((c) => c.hitTest?.(x, y));
            hit?.onClick?.();
        },
    };
}


