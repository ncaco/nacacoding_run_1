import { ButtonRect, ButtonStyle, drawButton } from './button';
import { drawText, TextStyle } from './text';
import { debugStrokeRect } from '../0_config/index';

export type ModalSpec = {
    title?: string;
    box: { x: number; y: number; w: number; h: number };
    buttons: Array<{ key: string; label: string; rect: ButtonRect; style?: ButtonStyle }>;
};

export type ModalStyle = {
    backdropColor?: string; // 기본 'rgba(0,0,0,0.5)'
    boxBgColor?: string;    // 기본 '#fff'
    boxBorderColor?: string;// 기본 '#000'
    titleStyle?: TextStyle; // 기본 { color:'#000', font:'20px system-ui, sans-serif', align:'center', baseline:'top' }
};

export function drawModal(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    spec: ModalSpec,
    style?: ModalStyle
): void {
    const backdrop = style?.backdropColor ?? 'rgba(0,0,0,0.5)';
    const boxBg = style?.boxBgColor ?? '#fff';
    const boxBorder = style?.boxBorderColor ?? '#000';

    // backdrop
    ctx.fillStyle = backdrop;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // box
    const { x, y, w, h } = spec.box;
    ctx.fillStyle = boxBg;
    ctx.fillRect(x, y, w, h);
    // 개발 모드에서만 점선 테두리
    debugStrokeRect(ctx, x, y, w, h);

    // title
    if (spec.title) {
        drawText(ctx, spec.title, x + w / 2, y + 16, {
            color: style?.titleStyle?.color ?? '#000',
            font: style?.titleStyle?.font ?? '20px system-ui, sans-serif',
            align: style?.titleStyle?.align ?? 'center',
            baseline: style?.titleStyle?.baseline ?? 'top',
        });
    }

    // buttons
    for (const btn of spec.buttons) {
        drawButton(ctx, btn.rect, btn.label, btn.style);
    }
}


