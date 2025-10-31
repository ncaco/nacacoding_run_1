export type TextStyle = {
    color?: string;
    font?: string;           // 예: '16px system-ui, sans-serif'
    align?: CanvasTextAlign; // 'left' | 'right' | 'center' | ...
    baseline?: CanvasTextBaseline; // 'top' | 'middle' | 'alphabetic' 등
};

export function drawText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    style?: TextStyle
): void {
    const prevFill = ctx.fillStyle;
    const prevFont = ctx.font;
    const prevAlign = ctx.textAlign;
    const prevBaseline = ctx.textBaseline;

    if (style?.color) ctx.fillStyle = style.color;
    if (style?.font) ctx.font = style.font;
    if (style?.align) ctx.textAlign = style.align;
    if (style?.baseline) ctx.textBaseline = style.baseline;

    ctx.fillText(text, x, y);

    ctx.fillStyle = prevFill as string;
    ctx.font = prevFont;
    ctx.textAlign = prevAlign;
    ctx.textBaseline = prevBaseline;
}


