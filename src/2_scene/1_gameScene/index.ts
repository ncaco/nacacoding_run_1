import { setScene, Scene } from '../../1_frame';
import { Dev, debugStrokeRect } from '../../0_config/index';
import { createStartScene } from '../0_startScene';
import { LayoutStrategy, UIComponent, Viewport } from '../../3_layout';
import { createVerticalStackLayout } from '../../3_layout/layout_vertical';
import { drawButton } from '../../4_component/button';

export function createGameScene(): Scene {
    if (Dev.enabled) console.log('✅ gameScene loaded');

    let isPaused = false;

    // 일시정지 모달 내 버튼들을 수직 스택으로 배치
    const modalButtonLayout: LayoutStrategy = createVerticalStackLayout({
        itemSize: { w: 200, h: 40 },
        gap: 10,
        align: 'center',
    });

    let modalButtonsPlaced: UIComponent[] = [];
    const modalButtonComponents: UIComponent[] = [
        {
            id: 'continue',
            frame: { x: 0, y: 0, w: 0, h: 0 },
            render: (ctx) => {
                const { x, y, w, h } = modalButtonsPlaced[0].frame;
                drawButton(ctx, { x, y, w, h }, '이어하기', { bgColor: '#fff', textColor: '#000' });
            },
            onClick: () => { isPaused = false; },
        },
        {
            id: 'restart',
            frame: { x: 0, y: 0, w: 0, h: 0 },
            render: (ctx) => {
                const { x, y, w, h } = modalButtonsPlaced[1].frame;
                drawButton(ctx, { x, y, w, h }, '다시하기', { bgColor: '#fff', textColor: '#000' });
            },
            onClick: () => setScene(createGameScene()),
        },
        {
            id: 'exit',
            frame: { x: 0, y: 0, w: 0, h: 0 },
            render: (ctx) => {
                const { x, y, w, h } = modalButtonsPlaced[2].frame;
                drawButton(ctx, { x, y, w, h }, '나가기', { bgColor: '#fff', textColor: '#000' });
            },
            onClick: () => setScene(createStartScene()),
        },
    ];

    const render = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        // 배경(흰색)
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, width, height);

        // 제목(검정)
        ctx.fillStyle = '#000';
        ctx.font = '28px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Game Scene', width / 2, height / 2 - 40);

        if (isPaused) {
            // 오버레이
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0, 0, width, height);

            // 모달 박스
            const modalW = 280;
            const modalH = 200;
            const modalX = Math.round(width / 2 - modalW / 2);
            const modalY = Math.round(height / 2 - modalH / 2);
            ctx.fillStyle = '#fff';
            ctx.fillRect(modalX, modalY, modalW, modalH);
            debugStrokeRect(ctx, modalX, modalY, modalW, modalH);

            // 제목
            ctx.fillStyle = '#000';
            ctx.font = '20px system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText('일시정지', modalX + modalW / 2, modalY + 16);

            // 버튼들(수직 스택 레이아웃으로 배치)
            const innerViewport: Viewport = { width: modalW, height: modalH - 60 };
            modalButtonsPlaced = modalButtonLayout.compute(modalButtonComponents, innerViewport).map((c) => {
                const fx = c.frame.x + modalX;
                const fy = c.frame.y + modalY + 60;
                const fw = c.frame.w;
                const fh = c.frame.h;
                return {
                    ...c,
                    frame: { x: fx, y: fy, w: fw, h: fh },
                    hitTest: (x: number, y: number) => x >= fx && x <= fx + fw && y >= fy && y <= fy + fh
                } as UIComponent;
            });
            // 렌더링
            modalButtonsPlaced.forEach((c) => c.render(ctx));
        }
    };

    const onClick = (x: number, y: number) => {
        if (!isPaused) return;
        const hit = modalButtonsPlaced.find((c) => c.hitTest?.(x, y));
        hit?.onClick?.();
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
            if (!isPaused) isPaused = true;
        }
    };

    return { render, onClick, onKeyDown };
}


