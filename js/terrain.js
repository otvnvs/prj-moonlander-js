export class Terrain {
    constructor(width, height) {
        this.points = [];
        this.generate(width, height);
    }

    generate(width, height) {
        this.points = [];
        const segments = 15;
        const segmentWidth = width / segments;
        const padIndex = Math.floor(Math.random() * (segments - 2)) + 1;

        for (let i = 0; i <= segments; i++) {
            let x = i * segmentWidth;
            let y = height - (Math.random() * 80 + 20);
            
            // Create a flat landing pad
            if (i === padIndex || i === padIndex + 1) {
                y = this.points[padIndex - 1].y;
            }
            
            this.points.push({ x, y, isPad: (i === padIndex || i === padIndex + 1) });
        }
        this.padX = [this.points[padIndex].x, this.points[padIndex + 1].x];
        this.padY = this.points[padIndex].y;
    }
// Inside Terrain class in js/terrain.js
draw(ctx) {
    // 1. Draw standard jagged terrain
    ctx.strokeStyle = "#00ff41";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
        ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.stroke();

    // 2. Draw FLASHING landing pad
    const blinkFrequency = 300; // Blink every 300ms
    if (Math.floor(Date.now() / blinkFrequency) % 2 === 0) {
        ctx.lineWidth = 4; // Thicker for emphasis
        ctx.beginPath();
        ctx.moveTo(this.padX[0], this.padY + 2);
        ctx.lineTo(this.padX[1], this.padY + 2);
        ctx.stroke();
        
        // Optional "Beacons" at pad edges
        ctx.fillRect(this.padX[0] - 2, this.padY - 5, 4, 4);
        ctx.fillRect(this.padX[1] - 2, this.padY - 5, 4, 4);
    }
}


}

