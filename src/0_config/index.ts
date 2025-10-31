export const Dev = { enabled: true };

export function debugStrokeRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    if (!Dev.enabled) return;
    ctx.save();
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 1;
    // 테두리를 기준 위치에서 바깥쪽(-1)으로 한 픽셀 오프셋
    ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
    ctx.restore();
}

// 프레임(논리 렌더 영역) 크기 제한
export const FrameConfig = {
    maxWidth: 1080,
    minWidth: 320,
};