import { debugStrokeRect } from '../0_config/index';


export type ButtonRect = { x: number; y: number; w: number; h: number };
export type ButtonStyle = {
    bgColor?: string;     // 기본 '#fff'
    textColor?: string;   // 기본 '#000'
    borderColor?: string; // 기본 '#000'
    font?: string;        // 기본 '16px system-ui, sans-serif'
};


export function drawButton(
    ctx: CanvasRenderingContext2D,
    rect: ButtonRect,
    label: string,
    style?: ButtonStyle
): void {
    const { x, y, w, h } = rect;
    const bg = style?.bgColor ?? '#fff';
    const fg = style?.textColor ?? '#000';
    const font = style?.font ?? '16px system-ui, sans-serif';

    // box
    ctx.fillStyle = bg;
    ctx.fillRect(x, y, w, h);
    // 개발 모드에서만 점선 테두리
    debugStrokeRect(ctx, x, y, w, h);

    // label
    const prevAlign = ctx.textAlign;
    const prevBaseline = ctx.textBaseline;
    const prevFill = ctx.fillStyle;
    const prevFont = ctx.font;
    ctx.fillStyle = fg;
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + w / 2, y + h / 2);
    ctx.textAlign = prevAlign;
    ctx.textBaseline = prevBaseline;
    ctx.fillStyle = prevFill as string;
    ctx.font = prevFont;
}

export function isPointInRect(rect: ButtonRect, x: number, y: number): boolean {
    return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}


