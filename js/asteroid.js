export class Asteroid {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.reset();
    }

    reset() {
        // Spawn randomly from left or right side
        const side = Math.random() > 0.5 ? 1 : -1;
        this.x = side === 1 ? -50 : this.canvasWidth + 50;
        this.y = Math.random() * (this.canvasHeight * 0.6); // Fly in upper 60%
        
        this.vx = (2 + Math.random() * 2) * side;
        this.vy = (Math.random() - 0.5) * 1;
        this.size = 8 + Math.random() * 8;
        this.rotation = 0;
        this.rotSpeed = (Math.random() - 0.5) * 0.1;
        this.active = false;
        
        // Randomly activate every few seconds
        this.spawnTimer = Date.now() + 2000 + Math.random() * 5000;
    }

    update() {
        if (!this.active) {
            if (Date.now() > this.spawnTimer) this.active = true;
            return;
        }

        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotSpeed;

        // Reset if it flies way off screen
        if (this.x < -100 || this.x > this.canvasWidth + 100) {
            this.reset();
        }
    }

    draw(ctx) {
        if (!this.active) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.strokeStyle = "#00ff41";
        ctx.lineWidth = 1.5;
        
        // Jagged Vector Rock Shape
        ctx.beginPath();
        ctx.moveTo(this.size, 0);
        ctx.lineTo(this.size * 0.7, this.size * 0.7);
        ctx.lineTo(0, this.size);
        ctx.lineTo(-this.size * 0.8, this.size * 0.5);
        ctx.lineTo(-this.size, -this.size * 0.2);
        ctx.lineTo(-this.size * 0.4, -this.size);
        ctx.lineTo(this.size * 0.5, -this.size * 0.8);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}

