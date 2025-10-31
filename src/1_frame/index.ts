import { debugStrokeRect, FrameConfig } from '../0_config/index';

// 캔버스 설정
class CanvasConfig {
    static readonly WIDTH = 1920;
    static readonly HEIGHT = 1080;
}

// 뷰포트 기준 모바일 판단
function isMobileViewport(): boolean {
	return window.innerWidth <= 768 || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

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

export function setScene(scene: Scene): void {
    currentScene = scene;
}

export function initFrame(): void {
    // 캔버스 초기화
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

    // 캔버스 크기 설정
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

		// 씬에 리사이즈 통지 (프레임 크기 기준)
		currentScene?.onResize?.(frameWidth, frameHeight);
    }

    // 리사이즈 이벤트
    window.addEventListener('resize', resizeCanvas);

    // 입력 이벤트를 씬에 위임 (캔버스 좌표로 변환)
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

    // 애니메이션 루프
    function animate(): void {
        // DPR 스케일 적용 상태에서 전체 클리어
        const w = canvas.width;
        const h = canvas.height;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, w, h);
        ctx.restore();
        // 현재 씬 렌더링 (프레임 기준 크기 전달)
        if (currentScene) {
            ctx.save();
            // 프레임 영역으로 이동 및 클리핑
            ctx.translate(frameOffsetX, frameOffsetY);
            ctx.beginPath();
            ctx.rect(0, 0, frameWidth, frameHeight);
            ctx.clip();
            currentScene.render(ctx, frameWidth, frameHeight);
            ctx.restore();
        }
        // 개발용 프레임 테두리 (전역 좌표)
        debugStrokeRect(ctx, frameOffsetX, frameOffsetY, frameWidth, frameHeight);
        
        requestAnimationFrame(animate);
    }

    // DOM 씬 컨테이너는 사용하지 않음 (Canvas 2D 전면 사용)

    // 초기화 및 시작
    resizeCanvas();
    animate();

    // 프레임 초기화 로그는 개발 유틸로 이동하거나 생략
}


