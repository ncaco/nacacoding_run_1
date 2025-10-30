import { Layout } from './layout';

// 캔버스 설정
class CanvasConfig {
    static readonly WIDTH = 1920;
    static readonly HEIGHT = 1080;
}

// 캔버스 초기화
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// 레이아웃 생성 (자동으로 중앙 배치, 헥사곤도 자동 생성)
const layout = new Layout(CanvasConfig.WIDTH, CanvasConfig.HEIGHT);

// 캔버스 크기 설정
function resizeCanvas(): void {
    canvas.width = CanvasConfig.WIDTH;
    canvas.height = CanvasConfig.HEIGHT;
}

// 레이아웃에 이벤트 연결
layout.attachEvents(canvas);

// 리사이즈 이벤트
window.addEventListener('resize', resizeCanvas);

// 애니메이션 루프
function animate(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    layout.draw(ctx, false);
    requestAnimationFrame(animate);
}

// 초기화 및 시작
resizeCanvas();
animate();

console.log('✅ Interactive Hexagon Canvas initialized!');
