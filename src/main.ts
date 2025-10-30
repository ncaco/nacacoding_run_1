import { Hexagon } from './hexagon';

// 캔버스 초기화
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// CSS에서 배경색 가져오기
const backgroundColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--background-color').trim();

// 캔버스 크기 설정
function resizeCanvas(): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    hexagon.setCenter(canvas.width / 2, canvas.height / 2);
}

// 정육각형 생성 (도형 설정은 Hexagon.CONFIG에서 관리)
const hexagon = new Hexagon(
    window.innerWidth / 2,
    window.innerHeight / 2
);

// 드래그 상태
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

// 마우스 이벤트
canvas.addEventListener('mousedown', (e: MouseEvent) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
});

canvas.addEventListener('mousemove', (e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastMouseX;
    const deltaY = e.clientY - lastMouseY;
    
    hexagon.setRotation(hexagon.getRotation() + (deltaX + deltaY) * 0.5);
    
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('mouseleave', () => {
    isDragging = false;
});

// 터치 이벤트 (모바일 지원)
canvas.addEventListener('touchstart', (e: TouchEvent) => {
    e.preventDefault();
    if (e.touches.length > 0) {
        isDragging = true;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
    }
});

canvas.addEventListener('touchmove', (e: TouchEvent) => {
    e.preventDefault();
    if (!isDragging || e.touches.length === 0) return;
    
    const deltaX = e.touches[0].clientX - lastMouseX;
    const deltaY = e.touches[0].clientY - lastMouseY;
    
    hexagon.setRotation(hexagon.getRotation() + (deltaX + deltaY) * 0.5);
    
    lastMouseX = e.touches[0].clientX;
    lastMouseY = e.touches[0].clientY;
});

canvas.addEventListener('touchend', () => {
    isDragging = false;
});

// 리사이즈 이벤트
window.addEventListener('resize', resizeCanvas);

// 애니메이션 루프
function animate(): void {
    // 배경 그리기 (CSS에서 정의된 색상 사용)
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 정육각형 그리기
    hexagon.draw(ctx);
    
    requestAnimationFrame(animate);
}

// 초기화 및 시작
resizeCanvas();
animate();

console.log('✅ Interactive Hexagon Canvas initialized!');
