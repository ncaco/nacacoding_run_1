import { debugStrokeRect, FrameConfig } from '../0_config/index';

export type Scene = {
    render: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
    onClick?: (x: number, y: number) => void;
    onKeyDown?: (e: KeyboardEvent) => void;
    onResize?: (width: number, height: number) => void;
};

let currentScene: Scene | null = null;
let frameWidth = 0;
let frameHeight = 0;
let frameOffsetX = 0;
let frameOffsetY = 0;
let frameClip: Path2D | null = null;

export function setScene(scene: Scene): void {
    currentScene = scene;
}

export function initFrame(): void {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;

    // 뷰포트 전체 채우기: CSS 크기는 100%, 프레임(백킹 스토어)은 px
    document.body.style.margin = '0';
    canvas.style.position = 'fixed';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.transform = '';
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    function resizeCanvas(): void {
    	const devicePixelRatio = window.devicePixelRatio || 1;

		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		canvas.width = Math.floor(viewportWidth * devicePixelRatio);
		canvas.height = Math.floor(viewportHeight * devicePixelRatio);

    	// 컨텍스트 스케일을 DPR에 맞춰 조정 (중복 스케일 방지 위해 초기화 후 스케일)
    	ctx.setTransform(1, 0, 0, 1, 0, 0);
    	ctx.scale(devicePixelRatio, devicePixelRatio);

		// 프레임(논리 렌더 영역) 계산: 가로는 min/max 클램프, 세로는 뷰포트 높이 사용
		frameWidth = Math.max(FrameConfig.minWidth, Math.min(viewportWidth, FrameConfig.maxWidth));
		frameHeight = viewportHeight;
		frameOffsetX = Math.floor((viewportWidth - frameWidth) / 2);
		frameOffsetY = 0;

		// 프레임 클리핑 경로 준비 (리사이즈 시 1회 생성)
		frameClip = new Path2D();
		frameClip.rect(0, 0, frameWidth, frameHeight);

		// 씬에 리사이즈 통지 (프레임 크기 기준)
		currentScene?.onResize?.(frameWidth, frameHeight);
    }

    // 리사이즈 디바운스 (rAF)
    let resizeScheduled = false;
    window.addEventListener('resize', () => {
        if (resizeScheduled) return;
        resizeScheduled = true;
        requestAnimationFrame(() => { resizeScheduled = false; resizeCanvas(); });
    });

    canvas.addEventListener('click', (ev) => {
        if (!currentScene) return;
        const rect = canvas.getBoundingClientRect();
        const x = ev.clientX - rect.left; // CSS 픽셀 기준
        const y = ev.clientY - rect.top;
        const fx = x - frameOffsetX;
        const fy = y - frameOffsetY;
        if (fx >= 0 && fx <= frameWidth && fy >= 0 && fy <= frameHeight) {
            currentScene.onClick?.(fx, fy);
        }
    });
    window.addEventListener('keydown', (e) => {
        currentScene?.onKeyDown?.(e);
    });

    function animate(): void {
        const w = canvas.width;
        const h = canvas.height;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, w, h);
        ctx.restore();
        if (currentScene) {
            ctx.save();
            ctx.translate(frameOffsetX, frameOffsetY);
            if (frameClip) {
                ctx.clip(frameClip);
            } else {
                ctx.beginPath();
                ctx.rect(0, 0, frameWidth, frameHeight);
                ctx.clip();
            }
            currentScene.render(ctx, frameWidth, frameHeight);
            ctx.restore();
        }
        debugStrokeRect(ctx, frameOffsetX, frameOffsetY, frameWidth, frameHeight);
        
        requestAnimationFrame(animate);
    }

    resizeCanvas();
    animate();
}


