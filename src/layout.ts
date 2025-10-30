import { Hexagon } from './hexagon';

export class Layout {
    // 레이아웃 기본 설정
    static readonly CONFIG = {
        width: 800,
        height: 600,
        borderColor: '#000000',
        borderWidth: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
    };

    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private backgroundColor: string;
    private canvas: HTMLCanvasElement | null = null;
    private isDragging: boolean = false;
    private lastMouseX: number = 0;
    private lastMouseY: number = 0;
    private hexagon: Hexagon;

    constructor(
        canvasWidth: number,
        canvasHeight: number,
        width: number = Layout.CONFIG.width,
        height: number = Layout.CONFIG.height,
        backgroundColor: string = Layout.CONFIG.backgroundColor
    ) {
        // 캔버스 중앙에 레이아웃 배치
        this.x = (canvasWidth - width) / 2;
        this.y = (canvasHeight - height) / 2;
        this.width = width;
        this.height = height;
        this.backgroundColor = backgroundColor;
        
        // 레이아웃 중심에 정육각형 생성
        this.hexagon = new Hexagon(this.getCenterX(), this.getCenterY());
    }

    getCenterX(): number {
        return this.x + this.width / 2;
    }

    getCenterY(): number {
        return this.y + this.height / 2;
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    setSize(canvasWidth: number, canvasHeight: number): void {
        // 새로운 캔버스 크기 기준으로 레이아웃 재계산
        this.x = (canvasWidth - this.width) / 2;
        this.y = (canvasHeight - this.height) / 2;
        
        // 헥사곤 위치도 업데이트
        this.hexagon.setCenter(this.getCenterX(), this.getCenterY());
    }

    isInside(x: number, y: number): boolean {
        return x >= this.x && 
               x <= this.x + this.width && 
               y >= this.y && 
               y <= this.y + this.height;
    }

    draw(ctx: CanvasRenderingContext2D, debug: boolean = false): void {
        // 레이아웃 테두리 그리기 (항상)
        ctx.save();
        ctx.strokeStyle = Layout.CONFIG.borderColor;
        ctx.lineWidth = Layout.CONFIG.borderWidth;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.restore();
        
        // 디버그 모드일 때 배경 채우기
        if (debug) {
            ctx.save();
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        }
        
        // 헥사곤 그리기
        this.hexagon.draw(ctx);
    }

    attachEvents(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
        
        canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        canvas.addEventListener('mousemove', this.handleMouseMoveWithCursor.bind(this));
        canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));
        
        canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        canvas.addEventListener('touchend', this.handleMouseUp.bind(this));
    }

    private handleMouseDown(e: MouseEvent): void {
        if (!this.canvas) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        if (this.isInside(mouseX, mouseY)) {
            this.isDragging = true;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        }
    }

    private handleMouseMoveWithCursor(e: MouseEvent): void {
        // 커서 업데이트
        this.updateCursor(e);
        
        // 드래그 중일 때만 회전
        if (!this.isDragging) return;
        
        const deltaX = e.clientX - this.lastMouseX;
        const deltaY = e.clientY - this.lastMouseY;
        
        // 헥사곤 회전
        this.hexagon.setRotation(this.hexagon.getRotation() + (deltaX + deltaY) * 0.5);
        
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
    }

    private handleMouseUp(): void {
        this.isDragging = false;
        this.updateCursor();
    }

    private updateCursor(e?: MouseEvent): void {
        if (!this.canvas) return;
        
        if (this.isDragging) {
            this.canvas.style.cursor = 'grabbing';
            return;
        }
        
        if (e) {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            if (this.isInside(mouseX, mouseY)) {
                this.canvas.style.cursor = 'grab';
            } else {
                this.canvas.style.cursor = 'default';
            }
        } else {
            this.canvas.style.cursor = 'default';
        }
    }

    private handleTouchStart(e: TouchEvent): void {
        if (!this.canvas) return;
        
        e.preventDefault();
        if (e.touches.length > 0) {
            const rect = this.canvas.getBoundingClientRect();
            const touchX = e.touches[0].clientX - rect.left;
            const touchY = e.touches[0].clientY - rect.top;
            
            if (this.isInside(touchX, touchY)) {
                this.isDragging = true;
                this.lastMouseX = e.touches[0].clientX;
                this.lastMouseY = e.touches[0].clientY;
            }
        }
    }

    private handleTouchMove(e: TouchEvent): void {
        if (!this.isDragging || e.touches.length === 0) return;
        
        e.preventDefault();
        
        const deltaX = e.touches[0].clientX - this.lastMouseX;
        const deltaY = e.touches[0].clientY - this.lastMouseY;
        
        // 헥사곤 회전
        this.hexagon.setRotation(this.hexagon.getRotation() + (deltaX + deltaY) * 0.5);
        
        this.lastMouseX = e.touches[0].clientX;
        this.lastMouseY = e.touches[0].clientY;
    }
}

