export class Hexagon {
    private size: number;
    private centerX: number;
    private centerY: number;
    private rotation: number;
    private color: string;

    constructor(
        centerX: number,
        centerY: number,
        size: number = 200,
        color: string = '#4ECDC4'
    ) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.size = size;
        this.rotation = 0;
        this.color = color;
    }

    setRotation(angle: number): void {
        this.rotation = angle;
    }

    getRotation(): number {
        return this.rotation;
    }

    setCenter(x: number, y: number): void {
        this.centerX = x;
        this.centerY = y;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.centerX, this.centerY);
        ctx.rotate((this.rotation * Math.PI) / 180);

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = this.size * Math.cos(angle);
            const y = this.size * Math.sin(angle);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();

        const gradient = ctx.createLinearGradient(
            -this.size, -this.size,
            this.size, this.size
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, this.adjustColorBrightness(this.color, -30));
        
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.restore();
    }

    private adjustColorBrightness(color: string, amount: number): string {
        const hex = color.replace('#', '');
        const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
        const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
        const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
}

